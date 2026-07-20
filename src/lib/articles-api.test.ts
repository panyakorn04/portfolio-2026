import { describe, expect, mock, test } from "bun:test";

mock.module("server-only", () => ({}));

const { parseArticleDetail, parseListItem } = require("./articles-api");

describe("parseListItem", () => {
  test("parses a valid article list item", () => {
    const result = parseListItem({
      slug: "hello-world",
      category: "tech",
      title: "Hello World",
      summary: "A summary",
      lead: "A lead",
      publishedAt: "2026-01-01",
      readingTime: "5 min",
    });

    expect(result).toEqual({
      slug: "hello-world",
      category: "tech",
      title: "Hello World",
      summary: "A summary",
      lead: "A lead",
      publishedAt: "2026-01-01",
      readingTime: "5 min",
    });
  });

  test("rejects null", () => {
    expect(parseListItem(null)).toBeNull();
  });

  test("rejects non-object values", () => {
    expect(parseListItem("string")).toBeNull();
    expect(parseListItem(42)).toBeNull();
    expect(parseListItem([])).toBeNull();
  });

  test("rejects items with missing required fields", () => {
    expect(parseListItem({ slug: "only-slug" })).toBeNull();
  });

  test("trims whitespace from string fields", () => {
    const result = parseListItem({
      slug: "  hello-world  ",
      category: "  tech  ",
      title: "  Hello  ",
      summary: "  summary  ",
      lead: "  lead  ",
      publishedAt: "2026-01-01",
      readingTime: "  5 min  ",
    });

    expect(result?.slug).toBe("hello-world");
    expect(result?.category).toBe("tech");
    expect(result?.title).toBe("Hello");
    expect(result?.readingTime).toBe("5 min");
  });
});

describe("parseArticleDetail", () => {
  test("parses a valid article detail with content", () => {
    const result = parseArticleDetail({
      slug: "test-article",
      category: "dev",
      title: "Test",
      summary: "A test article",
      lead: "Lead text",
      publishedAt: "2026-06-01",
      readingTime: "3 min",
      content: "# Hello\n\nThis is content.",
    });

    expect(result).not.toBeNull();
    expect(result?.content).toBe("# Hello\n\nThis is content.");
  });

  test("defaults content to empty string when missing", () => {
    const result = parseArticleDetail({
      slug: "test",
      category: "dev",
      title: "Test",
      summary: "A test",
      lead: "Lead",
      publishedAt: "2026-06-01",
      readingTime: "3 min",
    });

    expect(result?.content).toBe("");
  });

  test("returns null when parseListItem fails", () => {
    expect(parseArticleDetail(null)).toBeNull();
  });
});
