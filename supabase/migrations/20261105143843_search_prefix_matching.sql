drop function if exists search_articles(text, int, int);

create function search_articles(q text, p_limit int default 20, p_offset int default 0)
returns table (
  id uuid,
  feed_id uuid,
  title text,
  excerpt text,
  url text,
  published_at timestamptz,
  rank real
)
language plpgsql stable
as $$
declare
  words text[];
  tsq tsquery;
begin
  -- keep only letters and digits, so user input can never break the query syntax
  words := regexp_split_to_array(
    trim(regexp_replace(q, '[^[:alnum:]]+', ' ', 'g')),
    '\s+'
  );

  if words[1] is null or words[1] = '' then
    return;
  end if;

  -- "react hoo"  ->  react & hoo:*   (every word must match, the last one by prefix)
  tsq := to_tsquery('english', array_to_string(words, ' & ') || ':*');

  return query
    select f.id, f.feed_id, f.title, f.excerpt, f.url, f.published_at,
           ts_rank(f.fts, tsq) as rank
    from feed_items f
    where f.fts @@ tsq
    order by rank desc, f.published_at desc
    limit p_limit offset p_offset;
end;
$$;