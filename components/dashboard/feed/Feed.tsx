import { createClient } from "@/lib/supabase/server";
import FeedHeader from "./FeedHeader";
import NewItemsBanner from "./NewItemsBanner";
import FeedList from "./FeedList";
import { getFeedItems } from "./getFeedItems";
import type { ArticleItem } from "./FeedItem";

export default async function Feed() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null; // or redirect, depending on your auth flow

  const items = await getFeedItems(supabase, user.id);

  return (
    <section className="flex flex-1 flex-col mx-auto w-full">
      <FeedHeader />
      <NewItemsBanner count={0} onRefresh={() => {}} />
      <FeedList items={items} />
    </section>
  );
}
