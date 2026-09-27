-- Read/unread helpers for the dashboard.
-- Both run as the signed-in user (auth.uid()), so the RLS policies still apply.


-- unread_counts: how many unread items each of your feeds has.
-- Add the rows up for the total, or group them by category_id for categories.
-- "Unread" means: no user_item_state row yet, or a row with is_read = false.

create or replace function unread_counts()
returns table (feed_id uuid, category_id uuid, unread int)
language sql
stable
set search_path = public
as $$
  select uf.feed_id, uf.category_id, count(*)::int
  from user_feeds uf
  join feed_items fi on fi.feed_id = uf.feed_id
  left join user_item_state s on s.item_id = fi.id and s.user_id = uf.user_id
  where uf.user_id = auth.uid()
    and coalesce(s.is_read, false) = false
  group by uf.feed_id, uf.category_id;
$$;


-- mark_all_read: marks items read in one step, however many there are.
-- No arguments = everything. Pass a feed id or a category id to limit it.

create or replace function mark_all_read(
  p_feed_id uuid default null,
  p_category_id uuid default null
)
returns void
language sql
set search_path = public
as $$
  insert into user_item_state (user_id, item_id, is_read, read_at)
  select auth.uid(), fi.id, true, now()
  from feed_items fi
  join user_feeds uf on uf.feed_id = fi.feed_id
  where uf.user_id = auth.uid()
    and (p_feed_id is null or fi.feed_id = p_feed_id)
    and (p_category_id is null or uf.category_id = p_category_id)
  -- Row already there? Flip it to read. Rows already read keep their read_at.
  on conflict (user_id, item_id) do update
    set is_read = true, read_at = now()
    where user_item_state.is_read = false;
$$;
