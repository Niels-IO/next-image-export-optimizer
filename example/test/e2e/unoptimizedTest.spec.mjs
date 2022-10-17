import { test, expect } from "@playwright/test";

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

    const image = await page.evaluate(() => {
      let img = document.getElementById("test_image_unoptimized");
      return {
        src: img.src,
        currentSrc: img.currentSrc,
        naturalWidth: img.naturalWidth,
        width: img.width,
      };
    });

    expect(image.currentSrc).toBe(
      "http://localhost:8080/images/chris-zhang-Jq8-3Bmh1pQ-unsplash.jpg"
    );
  });
});
