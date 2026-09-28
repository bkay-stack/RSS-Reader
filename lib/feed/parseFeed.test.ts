import { describe, it, expect } from "vitest";
import { parseRSSFeed } from "./parseFeed";

const source = {
  name: "Test Blog",
  siteUrl: "https://blog.com",
  category: "Tech",
};

// A tiny fake RSS feed with one article
const xml = `<?xml version="1.0"?>
<rss version="2.0">
  <channel>
    <item>
      <guid>post-1</guid>
      <title>Hello &amp; welcome</title>
      <description><![CDATA[<p>First <b>post</b></p>]]></description>
      <link>/hello</link>
      <pubDate>Mon, 28 Sep 2026 10:00:00 GMT</pubDate>
    </item>
  </channel>
</rss>`;

describe("parseRSSFeed", () => {
  it("turns an RSS item into an article", () => {
    const [article] = parseRSSFeed(xml, source);

    expect(article.id).toBe("post-1");
    expect(article.title).toBe("Hello & welcome");
    expect(article.excerpt).toBe("First post");
    expect(article.url).toBe("https://blog.com/hello");
    expect(article.publishedAt).toBe("2026-09-28T10:00:00.000Z");
  });

  it("removes dangerous HTML from the summary", () => {
    const evil = xml.replace(
      "<p>First <b>post</b></p>",
      '<img src=x onerror="alert(1)">Safe text',
    );
    const [article] = parseRSSFeed(evil, source);

    expect(article.excerpt).toBe("Safe text");
  });
});
