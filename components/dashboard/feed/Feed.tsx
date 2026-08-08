import FeedHeader from "./FeedHeader";
import NewItemsBanner from "./NewItemsBanner";
import FeedList from "./FeedList";
import type { ArticleItem } from "./FeedItem";

const fakeItems: ArticleItem[] = [
  {
    id: "1",
    title: "Practical Guide To Designing For Colorblind Users",
    excerpt:
      "Color blindness affects roughly 8% of men and 0.5% of women worldwide. Here's how to design interfaces that work for everyone.",
    url: "https://smashingmagazine.com/example-1",
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    source: {
      name: "Smashing Magazine",
      siteUrl: "https://smashingmagazine.com",
    },
    category: "Design",
    isRead: false,
    isSaved: false,
  },
  {
    id: "2",
    title: "How We Reduced P99 Latency by 60% with Edge-First Caching",
    excerpt:
      "Our engineering team spent the last quarter rethinking how we cache at the edge. The result: dramatically lower tail latency.",
    url: "https://blog.cloudflare.com/example-2",
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    source: { name: "Cloudflare Blog", siteUrl: "https://blog.cloudflare.com" },
    category: "Backend & DevOps",
    isRead: false,
    isSaved: false,
  },
  {
    id: "3",
    title: "The Surprising Truth About CSS Container Queries",
    excerpt:
      "Container queries have been available for a while, but most developers are still using them like media queries.",
    url: "https://joshwcomeau.com/example-3",
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    source: { name: "Josh W. Comeau", siteUrl: "https://joshwcomeau.com" },
    category: "Frontend",
    isRead: true,
    isSaved: false,
  },
  {
    id: "1",
    title: "Practical Guide To Designing For Colorblind Users",
    excerpt:
      "Color blindness affects roughly 8% of men and 0.5% of women worldwide. Here's how to design interfaces that work for everyone.",
    url: "https://smashingmagazine.com/example-1",
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    source: {
      name: "Smashing Magazine",
      siteUrl: "https://smashingmagazine.com",
    },
    category: "Design",
    isRead: false,
    isSaved: false,
  },
  {
    id: "2",
    title: "How We Reduced P99 Latency by 60% with Edge-First Caching",
    excerpt:
      "Our engineering team spent the last quarter rethinking how we cache at the edge. The result: dramatically lower tail latency.",
    url: "https://blog.cloudflare.com/example-2",
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    source: { name: "Cloudflare Blog", siteUrl: "https://blog.cloudflare.com" },
    category: "Backend & DevOps",
    isRead: false,
    isSaved: false,
  },
  {
    id: "3",
    title: "The Surprising Truth About CSS Container Queries",
    excerpt:
      "Container queries have been available for a while, but most developers are still using them like media queries.",
    url: "https://joshwcomeau.com/example-3",
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    source: { name: "Josh W. Comeau", siteUrl: "https://joshwcomeau.com" },
    category: "Frontend",
    isRead: true,
    isSaved: false,
  },
];

export default function Feed() {
  return (
    <section className="flex flex-1 flex-col mx-auto w-full">
      <FeedHeader />
      <NewItemsBanner count={0} onRefresh={() => {}} />
      <FeedList items={fakeItems} />
    </section>
  );
}
