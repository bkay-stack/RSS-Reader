import { formatRelativeTime } from "@/lib/formatRelativeTime";
import { getSourceColor } from "@/lib/getSourceColor";
import { getCategoryColor } from "@/lib/getCategoryColor";
import FeedItemRow from "./FeedItemRow";
import type { FeedView } from "./feedView";

export type ArticleItem = {
  id: string;
  title: string;
  excerpt: string;
  url: string;
  publishedAt: string | null;
  source: {
    name: string;
    siteUrl: string;
  };
  category: string;
  isRead: boolean;
  isSaved: boolean;
};

export type FeedItemProps = {
  item: ArticleItem;
  view: FeedView;
};

export default function FeedItem({ item, view }: FeedItemProps) {
  // Compact is a different structure, so it gets its own branch.
  if (view === "compact") {
    return (
      <FeedItemRow
        itemId={item.id}
        url={item.url}
        isRead={item.isRead}
        view={view}>
        <h3 className="flex-1 min-w-0 truncate text-sm font-medium text-text-primary">
          {item.title}
        </h3>
        <span className="hidden sm:block max-w-40 shrink-0 truncate text-xs text-text-secondary">
          {item.source.name}
        </span>
        {item.publishedAt && (
          <time
            dateTime={item.publishedAt}
            className="shrink-0 text-xs text-text-secondary">
            {formatRelativeTime(item.publishedAt)}
          </time>
        )}
      </FeedItemRow>
    );
  }

  // List and card show the same content, so they share this JSX.
  const isCard = view === "card";

  return (
    <FeedItemRow
      itemId={item.id}
      url={item.url}
      isRead={item.isRead}
      view={view}>
      {/* Zone 2: source icon */}
      <div
        className={`w-5 h-5 sm:w-6 sm:h-6 rounded flex items-center justify-center text-xs font-semibold text-white shrink-0 ${getSourceColor(item.source.name)}`}>
        {item.source.name.charAt(0)}
      </div>

      {/* Zone 3: content column */}
      <div className="flex flex-col gap-1 flex-1 min-w-0">
        <div className="flex items-center gap-2 text-xs text-text-secondary">
          <span className="truncate">{item.source.name}</span>
          {item.publishedAt && (
            <>
              <span>·</span>
              <time dateTime={item.publishedAt ?? undefined}>
                {formatRelativeTime(item.publishedAt)}
              </time>
            </>
          )}
        </div>
        <h3
          className={`font-semibold text-sm sm:text-base text-text-primary ${
            isCard ? "line-clamp-2" : "truncate"
          }`}>
          {item.title}
        </h3>
        <p
          className={`text-sm text-text-secondary ${
            isCard ? "line-clamp-3" : "line-clamp-1 sm:line-clamp-2"
          }`}>
          {item.excerpt}
        </p>
        <span
          className={`inline-block w-fit text-xs font-medium px-2 py-1 rounded ${getCategoryColor(item.category)}`}>
          {item.category}
        </span>
      </div>
    </FeedItemRow>
  );
}
