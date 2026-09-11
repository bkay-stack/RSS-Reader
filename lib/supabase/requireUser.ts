/**
 * requireUser — server-side login check for protected areas.
 *
 * WHY
 *   The proxy (proxy.ts) is only a fast, optimistic check. It is skipped for
 *   prefetch requests (anyone can send a `purpose: prefetch` header) and lets
 *   requests through if Supabase is slow. So every protected layout must
 *   verify the user itself.
 *
 * WHAT IT DOES
 *   1. Asks Supabase who the user is. `getUser()` checks the session with the
 *      auth server, unlike `getSession()`, which trusts the cookie as-is.
 *   2. No user → redirect to the home page.
 *   3. Otherwise → returns the user.
 *
 * Use it at the top of a server layout or page:
 *   const user = await requireUser();
 */

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
