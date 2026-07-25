//

import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/onboarding/step-1";

  if (code) {
    const supabase = await createClient();

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    console.log("exchangeCodeForSession error:", error);

    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  console.log("code:", code, "error:", "confirmation_failed");

  return NextResponse.redirect(
    `${origin}/auth/sign-in?error=confirmation_failed`,
  );
}
