import { type NextRequest } from "next/server";
import { updateSession } from "./lib/supabase/proxy";

export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

// NOTE: `config` is parsed statically at compile time, so `source` must be an
// inline string literal — pulling it out into a shared const fails to build.
export const config = {
  matcher: [
    {
      /*
       * Match all request paths except static files, metadata files and API
       * routes — and skip prefetches. The sidebar renders ~20 <Link>s, each of
       * which Next prefetches when it enters the viewport; without `missing`,
       * every one of those triggers a session check before the user has
       * actually navigated anywhere.
       */
      source:
        "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
