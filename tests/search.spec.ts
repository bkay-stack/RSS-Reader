import { test, expect } from "@playwright/test";

const SEARCH_WORD = "react";
const NO_MATCH_WORD = "zzzxqjw";

test("search shows matching articles", async ({ page }) => {
  await page.goto("/dashboard");

  await page.getByRole("searchbox").fill(SEARCH_WORD);

  await expect(page).toHaveURL(
    new RegExp(`/dashboard/search\\?q=${SEARCH_WORD}`),
  );

  // Cards appear, and the first one really mentions the word
  await expect(page.getByRole("article").first()).toBeVisible();
  await expect(page.getByRole("article").first()).toContainText(/react/i);

  // The empty message must NOT be showing
  await expect(page.getByText(/No results for/)).toHaveCount(0);
});

test("search with no matches shows no results", async ({ page }) => {
  await page.goto(`/dashboard/search?q=${NO_MATCH_WORD}`);

  await expect(page.getByText(/No results for/)).toBeVisible();
  await expect(page.getByRole("article")).toHaveCount(0);
});
