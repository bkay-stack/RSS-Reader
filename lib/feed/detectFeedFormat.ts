export function detectFeedFormat(
  xml: string,
): "rss" | "atom" | "rdf" | "unknown" {
  const trimmed = xml.trim();
  if (trimmed.includes("<rdf:RDF") || trimmed.includes("purl.org/rss/1.0"))
    return "rdf";
  if (trimmed.includes("<rss")) return "rss";
  if (trimmed.includes("<feed") && trimmed.includes("w3.org/2005/Atom"))
    return "atom";
  return "unknown";
}
