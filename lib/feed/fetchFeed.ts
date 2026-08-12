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
  } finally {
    clearTimeout(timeout);
  }
}

// export async function fetchFeedXML(feedUrl: string): Promise<string> {
//   const response = await fetch(feedUrl, {
//     next: { revalidate: 300 },
//   });

//   if (!response.ok) {
//     throw new Error(`Failed to fetch ${feedUrl}: ${response.status}`);
//   }

//   return response.text();
// }
