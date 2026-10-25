drop function if exists public.mark_all_read(uuid, uuid);
create or replace function public.mark_all_read(
  p_is_read boolean,
  p_feed_id uuid default null,
  p_category_id uuid default null
)
returns void
language plpgsql
security invoker
set search_path = public
as $$
begin
  if p_is_read is null then
    raise exception 'p_is_read must not be null';
  end if;

  if p_is_read then
    -- Mark read: create rows for never-touched items, update unread ones.
    insert into user_item_state (user_id, item_id, is_read, read_at)
    select auth.uid(), i.id, true, now()
    from feed_items i
    join user_feeds uf
      on uf.feed_id = i.feed_id
     and uf.user_id = auth.uid()
    where (p_feed_id is null or i.feed_id = p_feed_id)
      and (p_category_id is null or uf.category_id = p_category_id)
    on conflict (user_id, item_id)
    do update set is_read = true, read_at = now()
    where user_item_state.is_read = false;
  else
    -- Mark unread: only touch rows that are currently read.
    update user_item_state s
    set is_read = false, read_at = null
    from feed_items i
    join user_feeds uf
      on uf.feed_id = i.feed_id
     and uf.user_id = auth.uid()
    where s.item_id = i.id
      and s.user_id = auth.uid()
      and s.is_read = true
      and (p_feed_id is null or i.feed_id = p_feed_id)
      and (p_category_id is null or uf.category_id = p_category_id);
  end if;
end;
$$;