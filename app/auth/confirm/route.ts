import type { EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { safeNextPath } from "@/lib/validation/safeNextPath";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);

  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  // Only same-site paths: blocks "?next=@evil.com" style open redirects.
  const next = safeNextPath(searchParams.get("next"), "/onboarding/step-1");

  const supabase = await createClient();
  let ok = false;
  let reason = "no code or token_hash in the link";

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    ok = !error;
    if (error) reason = error.message;
  } else if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash: tokenHash,
    });
    ok = !error;
    if (error) reason = error.message;
  }

  if (ok) return NextResponse.redirect(`${origin}${next}`);

  // Log the reason only, never the code or token (they're login secrets).
  console.error("email confirmation failed:", reason);
  return NextResponse.redirect(
    `${origin}/auth/sign-in?error=confirmation_failed`,
  );
}
