-- The dashboard feed (components/dashboard/feed/getFeedItems.ts) orders by
-- published_at across ALL of a user's subscribed feeds, then takes 50.
--
-- idx_feed_items_published is (feed_id, published_at desc) — great for "latest
-- items in one feed", useless for a global sort, because published_at is the
-- second column. Without a leading published_at index Postgres has to sort every
-- matching row just to return the top 50, which gets steadily worse as items
-- accumulate.

create index idx_feed_items_published_at on feed_items (published_at desc);
