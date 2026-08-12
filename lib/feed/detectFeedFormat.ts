export function detectFeedFormat(xml: string): "rss" | "atom" | "unknown" {
  const trimmed = xml.trim();
  if (trimmed.includes("<rss")) return "rss";
  if (trimmed.includes("<feed") && trimmed.includes("w3.org/2005/Atom"))
    return "atom";
  return "unknown";
}
