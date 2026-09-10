import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Paths reachable without a session. Everything else redirects home.
const PUBLIC_PATHS = [
  "/auth/sign-in",
  "/auth/sign-up",
  "/auth/reset-password",
  "/auth/callback",
  "/auth/confirm",
];

// Supabase stores the session as `sb-<project-ref>-auth-token`, chunked into
// `.0`/`.1` suffixes when it's large. We only check that one exists — parsing it
// is Supabase's job, not ours.
function hasAuthCookie(request: NextRequest): boolean {
  return request.cookies
    .getAll()
    .some((c) => c.name.startsWith("sb-") && c.name.includes("-auth-token"));
}

function isPublicPath(pathname: string): boolean {
  return pathname === "/" || PUBLIC_PATHS.some((p) => pathname.startsWith(p));
}

// The session check is a network round trip to Supabase. If it hangs, the whole
// app hangs behind it, so give it a hard ceiling. On timeout we let the request
// through rather than bouncing the user to the home page — Proxy is an
// optimistic check, and the real authorization still happens server-side in the
// page itself plus RLS. A slow auth server shouldn't look like a logout.
const SESSION_CHECK_TIMEOUT_MS = 3000;

export async function updateSession(request: NextRequest) {
  // No cookie means definitely signed out — decide locally and skip the network
  // call entirely. This is most traffic on a cold visit.
  if (!hasAuthCookie(request)) {
    if (!isPublicPath(request.nextUrl.pathname)) {
      const url = request.nextUrl.clone();
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Check if the user is signed in — and refresh the token if it has expired,
  // which is why this call still has to happen on non-prefetch requests.
  const timeout = new Promise<"timeout">((resolve) =>
    setTimeout(() => resolve("timeout"), SESSION_CHECK_TIMEOUT_MS),
  );
  const result = await Promise.race([supabase.auth.getClaims(), timeout]);

  if (result === "timeout") {
    console.warn("session check timed out — passing request through");
    return supabaseResponse;
  }

  const user = result.data?.claims;

  if (!user && !isPublicPath(request.nextUrl.pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
