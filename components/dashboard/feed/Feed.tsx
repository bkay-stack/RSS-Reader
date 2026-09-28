import { createClient } from "@/lib/supabase/server";
import FeedHeader from "./FeedHeader";
import NewItemsBanner from "./NewItemsBanner";
import FeedList from "./FeedList";
import { getFeedItems } from "./getFeedItems";
import { getUnreadCounts } from "./getUnreadCounts";
import { getNewItemCount } from "./getNewItemCount";

export default async function Feed() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null; // or redirect, depending on your auth flow

  // When this list was built; the pill counts articles that arrive after it.
  const loadedAt = new Date().toISOString();

  // Load the list and the counts at the same time.
  const [items, unread, newCount] = await Promise.all([
    getFeedItems(supabase, user.id),
    getUnreadCounts(supabase),
    getNewItemCount(supabase),
  ]);

  return (
    <section className="flex flex-1 flex-col mx-auto w-full">
      <FeedHeader unreadCount={unread.total} />
      <NewItemsBanner count={newCount} loadedAt={loadedAt} />
      <FeedList items={items} />
    </section>
  );
}
