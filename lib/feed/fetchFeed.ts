// Decodes the feed in its own encoding (from <?xml encoding> or the header).
function decodeFeed(bytes: ArrayBuffer, contentType: string | null): string {
  const start = new TextDecoder("latin1").decode(bytes.slice(0, 200));
  const charset =
    start.match(/<\?xml[^>]*encoding=["']([\w.:-]+)["']/i)?.[1] ??
    contentType?.match(/charset=["']?([\w.:-]+)/i)?.[1] ??
    "utf-8";

  try {
    return new TextDecoder(charset).decode(bytes);
  } catch {
    // Unknown encoding → UTF-8.
    return new TextDecoder().decode(bytes);
  }
}

export async function fetchFeedXML(feedUrl: string): Promise<string> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);

  try {
    const response = await fetch(feedUrl, {
      signal: controller.signal,
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch ${feedUrl}: ${response.status}`);
    }

    return decodeFeed(
      await response.arrayBuffer(),
      response.headers.get("content-type"),
    );
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      throw new Error(`Feed fetch timed out after 10s: ${feedUrl}`);
    }
    throw err;
  } finally {
    clearTimeout(timeout);
  }
}
