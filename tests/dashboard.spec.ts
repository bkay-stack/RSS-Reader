import { test, expect } from "@playwright/test";

test("signed-in user can open the dashboard", async ({ page }) => {
  await page.goto("/dashboard");

  // Not bounced to the sign-in page
  await expect(page).toHaveURL(/\/dashboard/);

  // The dashboard navbar rendered
  await expect(
    page.getByRole("link", { name: "Digest", exact: true }),
  ).toBeVisible();
});
