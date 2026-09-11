import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { safeNextPath } from "@/lib/validation/safeNextPath";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  // Only same-site paths — blocks "?next=@evil.com" style open redirects.
  const next = safeNextPath(searchParams.get("next"), "/onboarding/step-1");

  if (code) {
    const supabase = await createClient();

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }

    // Log the reason only — never the one-time `code`, which is a login secret.
    console.error("email confirmation failed:", error.message);
  }

  return NextResponse.redirect(
    `${origin}/auth/sign-in?error=confirmation_failed`,
  );
}
