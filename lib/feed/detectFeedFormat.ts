// Tells RSS, Atom and RDF apart by the first tag.
export function detectFeedFormat(
  xml: string,
): "rss" | "atom" | "rdf" | "unknown" {
  // Skip <?xml?>, comments and <!DOCTYPE>, then grab the tag name.
  const root = xml.match(
    /^(?:\s|<\?[\s\S]*?\?>|<!--[\s\S]*?-->|<!DOCTYPE[^>]*>)*<([\w:.-]+)/i,
  )?.[1];

  if (root === "rss") return "rss";
  if (root === "feed") return "atom";
  if (root === "rdf:RDF") return "rdf";
  return "unknown";
}
