-- categories
-- unchanged: categories still belong to one user

create table categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  unique (user_id, name)
);


-- feeds
-- CHANGED: no user_id, no category_id. This table is now shared infrastructure —
-- one row per unique feed_url, fetched once, read by everyone who subscribes to it.

create table feeds (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  feed_url text not null unique,
  site_url text,
  favicon_url text,
  format text,
  health_status text not null default 'active',
  last_fetched_at timestamptz,
  last_error text,
  etag text,
  last_modified text,
  retry_count integer not null default 0,
  next_retry_at timestamptz,
  created_at timestamptz not null default now()
);


-- user_feeds
-- NEW: the join table. This is where "who subscribes to what, filed under which
-- category" lives. One row per (user, feed) pair — this is where the per-user
-- uniqueness you want now belongs.

create table user_feeds (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  feed_id uuid not null references feeds(id) on delete cascade,
  category_id uuid references categories(id) on delete set null,
  custom_title text,
  created_at timestamptz not null default now(),
  unique (user_id, feed_id)
);


-- feed_items
-- CHANGED: no category_id, no is_read/is_saved/read_at/saved_at. Items belong to
-- the feed, not to a user — read/saved state moves to user_item_state below.

create table feed_items (
  id uuid primary key default gen_random_uuid(),
  feed_id uuid not null references feeds(id) on delete cascade,
  guid text not null,
  title text not null,
  excerpt text,
  content_html text,
  author text,
  url text,
  published_at timestamptz,
  fetched_at timestamptz not null default now(),
  search_vector tsvector generated always as (
    to_tsvector('english', coalesce(title, '') || ' ' || coalesce(excerpt, ''))
  ) stored,
  unique (feed_id, guid)
);


-- user_item_state
-- NEW: per-user, per-item read/saved state, decoupled from the shared items table.
-- Composite primary key (user_id, item_id) does double duty as the uniqueness
-- constraint — no separate id column needed for a pure join/state table like this.

create table user_item_state (
  user_id uuid not null references auth.users(id) on delete cascade,
  item_id uuid not null references feed_items(id) on delete cascade,
  is_read boolean not null default false,
  read_at timestamptz,
  is_saved boolean not null default false,
  saved_at timestamptz,
  primary key (user_id, item_id)
);


-- user_preferences
-- unchanged

create table user_preferences (
  user_id uuid primary key references auth.users(id) on delete cascade,
  layout text not null default 'list',
  refresh_interval_minutes integer,
  theme text not null default 'system',
  updated_at timestamptz not null default now()
);
-- note: category ordering lives on categories.sort_order, not duplicated here


-- indexes

-- feed_items: date sorting per feed (used regardless of who's viewing)
create index idx_feed_items_published on feed_items (feed_id, published_at desc);
create index idx_feed_items_search on feed_items using gin (search_vector);

-- user_feeds: "give me all of this user's feeds in category X" and
-- "does this user already subscribe to this feed"
create index idx_user_feeds_user_category on user_feeds (user_id, category_id);
create index idx_user_feeds_feed on user_feeds (feed_id);

-- user_item_state: "give me this user's unread/saved items" — these replace the
-- old idx_feed_items_unread / idx_feed_items_saved, which no longer make sense
-- on a shared feed_items table (read state isn't a property of the item anymore)
create index idx_user_item_state_unread on user_item_state (user_id) where is_read = false;
create index idx_user_item_state_saved on user_item_state (user_id) where is_saved = true;

-- feeds: retry scheduling for the background fetch job
create index idx_feeds_next_retry on feeds (next_retry_at) where health_status = 'error';


-- RLS

alter table categories enable row level security;
alter table feeds enable row level security;
alter table user_feeds enable row level security;
alter table feed_items enable row level security;
alter table user_item_state enable row level security;
alter table user_preferences enable row level security;

-- categories: still fully owned per-user, unchanged
create policy "Users can view own categories" on categories
  for select using (auth.uid() = user_id);
create policy "Users can insert own categories" on categories
  for insert with check (auth.uid() = user_id);
create policy "Users can update own categories" on categories
  for update using (auth.uid() = user_id);
create policy "Users can delete own categories" on categories
  for delete using (auth.uid() = user_id);

-- feeds: shared, read-only data as far as regular users are concerned.
-- Any signed-in user can SEE any feed (it's not private — it's just "TechCrunch
-- exists"). Only your server-side fetch job (using the service role, which
-- bypasses RLS entirely) inserts/updates feed rows, so there are no
-- insert/update/delete policies for regular users here at all.
create policy "Authenticated users can view feeds" on feeds
  for select using (auth.role() = 'authenticated');

-- user_feeds: this is where per-user ownership actually lives now
create policy "Users can view own subscriptions" on user_feeds
  for select using (auth.uid() = user_id);
create policy "Users can insert own subscriptions" on user_feeds
  for insert with check (auth.uid() = user_id);
create policy "Users can update own subscriptions" on user_feeds
  for update using (auth.uid() = user_id);
create policy "Users can delete own subscriptions" on user_feeds
  for delete using (auth.uid() = user_id);

-- feed_items: shared content, readable by any authenticated user whose
-- subscriptions include the parent feed (keeps unauthenticated/guest scraping
-- out, but doesn't restrict by user_id since items aren't user-owned)
create policy "Users can view items from subscribed feeds" on feed_items
  for select using (
    exists (
      select 1 from user_feeds
      where user_feeds.feed_id = feed_items.feed_id
      and user_feeds.user_id = auth.uid()
    )
  );

-- user_item_state: fully per-user
create policy "Users can view own item state" on user_item_state
  for select using (auth.uid() = user_id);
create policy "Users can insert own item state" on user_item_state
  for insert with check (auth.uid() = user_id);
create policy "Users can update own item state" on user_item_state
  for update using (auth.uid() = user_id);
create policy "Users can delete own item state" on user_item_state
  for delete using (auth.uid() = user_id);

-- user_preferences: unchanged
create policy "Users can view own preferences" on user_preferences
  for select using (auth.uid() = user_id);
create policy "Users can insert own preferences" on user_preferences
  for insert with check (auth.uid() = user_id);
create policy "Users can update own preferences" on user_preferences
  for update using (auth.uid() = user_id);