import { formatRelativeTime } from "@/lib/formatRelativeTime";
import { getSourceColor } from "@/lib/getSourceColor";
import { getCategoryColor } from "@/lib/getCategoryColor";
// import Link from "next/link";

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
};

export default function FeedItem({ item }: FeedItemProps) {
  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-start gap-2 sm:gap-3 w-full py-3 sm:py-4 px-3 sm:px-6 border-b border-border hover:bg-surface-secondary transition-colors">
      {/* Zone 1: unread dot */}
      <div className="pt-2">
        {!item.isRead && (
          <span className="block w-2 h-2 rounded-full bg-accent" />
        )}
      </div>

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
        <h3 className="font-semibold text-sm sm:text-base text-text-primary truncate">
          {item.title}
        </h3>
        <p className="text-sm text-text-secondary line-clamp-1 sm:line-clamp-2">
          {item.excerpt}
        </p>
        <span
          className={`inline-block w-fit text-xs font-medium px-2 py-1 rounded ${getCategoryColor(item.category)}`}>
          {item.category}
        </span>
      </div>
    </a>
  );
}
