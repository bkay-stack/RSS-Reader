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

    return await response.text();
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      throw new Error(`Feed fetch timed out after 10s: ${feedUrl}`);
    }
    throw err;
  } finally {
    clearTimeout(timeout);
  }
}
