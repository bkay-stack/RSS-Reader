type NewItemsBannerProps = {
  count: number;
  onRefresh: () => void;
};

export default function NewItemsBanner({
  count,
  onRefresh,
}: NewItemsBannerProps) {
  if (count <= 0) return null;

  return (
    <button
      onClick={onRefresh}
      className="flex items-center justify-center gap-2 w-full py-4 text-sm text-accent bg-accent-subtle hover:bg-accent-subtle/80 rounded cursor-pointer">
      {count} new item{count !== 1 ? "s" : ""} since your last visit
    </button>
  );
}
