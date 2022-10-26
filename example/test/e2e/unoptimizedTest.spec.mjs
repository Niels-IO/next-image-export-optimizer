import { test, expect } from "@playwright/test";
import getImageById from "./getImageById.js";

test.describe(`Test unoptimized image prop`, () => {
  test.use({
    viewport: { width: 1200, height: 1200 * 3 },
    deviceScaleFactor: 1,
  });
  test("should check the image size", async ({ page }) => {
    await page.goto("/", {
      waitUntil: "networkidle",
    });

    await page.click("text=Next-Image-Export-Optimizer");

    const img = await page.locator("#test_image_unoptimized");
    await img.click();

    const image = await getImageById(page, "test_image_unoptimized");

    expect(image.currentSrc).toBe(
      "http://localhost:8080/images/chris-zhang-Jq8-3Bmh1pQ-unsplash.jpg"
    );
    const img_legacy = await page.locator("#test_image_unoptimized_legacy");
    await img_legacy.click();

    const image_legacy = await getImageById(
      page,
      "test_image_unoptimized_legacy"
    );

    expect(image_legacy.currentSrc).toBe(
      "http://localhost:8080/images/chris-zhang-Jq8-3Bmh1pQ-unsplash.jpg"
    );
  });
});
