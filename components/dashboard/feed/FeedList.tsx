import type { ArticleItem } from "./FeedItem";
import FeedItem from "./FeedItem";

type FeedListProps = {
  items: ArticleItem[];
};

export default function FeedList({ items }: FeedListProps) {
  return (
    <div className="flex flex-col ">
      {items.map((item) => (
        <FeedItem key={item.id} item={item} />
      ))}
    </div>
  );
}
