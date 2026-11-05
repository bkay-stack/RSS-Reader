import type { ArticleItem } from "./FeedItem";
import FeedItem from "./FeedItem";
import type { FeedView } from "./feedView";

type FeedListProps = {
  items: ArticleItem[];
  view: FeedView;
};

const layoutClasses: Record<FeedView, string> = {
  list: "flex flex-col",
  compact: "flex flex-col",
  card: "grid grid-cols-1 gap-3 p-3 sm:grid-cols-2 sm:gap-4 sm:p-6 xl:grid-cols-3",
};

export default function FeedList({ items, view }: FeedListProps) {
  return (
    <div className={layoutClasses[view]}>
      {items.map((item) => (
        <FeedItem key={item.id} item={item} view={view} />
      ))}
    </div>
  );
}
