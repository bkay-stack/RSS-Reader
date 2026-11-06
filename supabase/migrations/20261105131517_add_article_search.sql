alter table feed_items add column fts tsvector
  generated always as (
    setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(excerpt, '')), 'B')
  ) stored;

create index feed_items_fts_idx on feed_items using gin (fts);

create or replace function search_articles(q text, p_limit int default 20, p_offset int default 0)
returns table (
  id uuid,
  feed_id uuid,
  title text,
  excerpt text,
  url text,
  published_at timestamptz,
  rank real
)
language sql stable
as $$
  select id, feed_id, title, excerpt, url, published_at,
         ts_rank(fts, websearch_to_tsquery('english', q)) as rank
  from feed_items
  where fts @@ websearch_to_tsquery('english', q)
  order by rank desc, published_at desc
  limit p_limit offset p_offset;
$$;