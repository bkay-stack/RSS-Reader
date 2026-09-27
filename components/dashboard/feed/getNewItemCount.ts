import { createClient } from "@/lib/supabase/server";

// How many articles reached the user's feeds since their last visit.
export async function getNewItemCount(
  supabase: Awaited<ReturnType<typeof createClient>>,
): Promise<number> {
  const { data, error } = await supabase.rpc("new_items_count");
  if (error) {
    console.error("new items count failed:", error);
    return 0;
  }

  return (data as number | null) ?? 0;
}
