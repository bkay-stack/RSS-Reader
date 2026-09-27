-- The dashboard's "N new items since your last visit" banner.

-- When the user last opened the dashboard. Null = not yet, so no banner.
alter table user_preferences
  add column if not exists last_visited_at timestamptz;


-- new_items_count: articles that reached your feeds since your last visit.
-- Uses fetched_at (when the app first stored the article), not published_at,
-- so an older post that was only just fetched still counts as new to you.

create or replace function new_items_count()
returns int
language sql
stable
set search_path = public
as $$
  select count(*)::int
  from feed_items fi
  join user_feeds uf on uf.feed_id = fi.feed_id
  join user_preferences p on p.user_id = uf.user_id
  where uf.user_id = auth.uid()
    and fi.fetched_at > p.last_visited_at;
$$;


-- The count filters on fetched_at, so give it an index.
create index if not exists idx_feed_items_fetched_at on feed_items (fetched_at);
