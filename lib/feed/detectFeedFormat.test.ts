import { describe, it, expect } from "vitest";
import { detectFeedFormat } from "./detectFeedFormat";

describe("detectFeedFormat", () => {
  it("spots an RSS feed", () => {
    expect(detectFeedFormat('<rss version="2.0"></rss>')).toBe("rss");
  });

  it("spots an Atom feed", () => {
    expect(detectFeedFormat("<feed></feed>")).toBe("atom");
  });

  it("spots an RDF feed", () => {
    expect(detectFeedFormat("<rdf:RDF></rdf:RDF>")).toBe("rdf");
  });

  it("skips the <?xml?> line and comments at the top", () => {
    const xml = '<?xml version="1.0"?>\n<!-- hello -->\n<rss></rss>';
    expect(detectFeedFormat(xml)).toBe("rss");
  });

  it("says unknown for a web page", () => {
    expect(detectFeedFormat("<html></html>")).toBe("unknown");
  });
});
