// Checks the user is signed in, on the server. Sends them to "/" if not.
// Use in protected layouts — the proxy check alone can be skipped.

import { redirect } from "next/navigation";
import { createClient } from "./server";

export async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/");

  return user;
}
