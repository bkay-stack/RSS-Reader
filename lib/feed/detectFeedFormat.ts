// Picks the format from the root tag. Searching the whole file for text like
// "purl.org/rss/1.0" misfired: most RSS 2.0 feeds use it in a namespace.
export function detectFeedFormat(
  xml: string,
): "rss" | "atom" | "rdf" | "unknown" {
  // Skip the <?xml?> line, comments and <!DOCTYPE>, then read the first tag's name.
  const root = xml.match(
    /^(?:\s|<\?[\s\S]*?\?>|<!--[\s\S]*?-->|<!DOCTYPE[^>]*>)*<([\w:.-]+)/i,
  )?.[1];

  if (root === "rss") return "rss";
  if (root === "feed") return "atom";
  if (root === "rdf:RDF") return "rdf";
  return "unknown";
}
