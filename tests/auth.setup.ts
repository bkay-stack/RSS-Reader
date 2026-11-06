import { test as setup, expect } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const authFile = path.join(process.cwd(), "playwright/.auth/user.json");

setup("authenticate", async ({ page }) => {
  const email = process.env.E2E_EMAIL;
  const password = process.env.E2E_PASSWORD;

  if (!email || !password) {
    throw new Error("E2E_EMAIL or E2E_PASSWORD is missing");
  }

  await page.goto("/auth/sign-in");

  await page.getByLabel("Email address").fill(email);
  //   await page.getByLabel("Password").fill(password);
  await page.getByRole("textbox", { name: "Password" }).fill(password);

  await page.getByRole("button", { name: "Sign in" }).click();

  await expect(page).toHaveURL(/\/dashboard/);

  fs.mkdirSync(path.dirname(authFile), { recursive: true });

  await page.context().storageState({ path: authFile });
});
