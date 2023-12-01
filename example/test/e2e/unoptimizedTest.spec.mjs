import { test, expect } from "@playwright/test";
import getImageById from "./getImageById.js";

// get the environment variable flag for the test
const testBasePath = process.env.BASEPATH === "true";
const basePath = testBasePath ? "/subsite" : "";

test.describe(`Test unoptimized image prop`, () => {
  test.use({
    viewport: { width: 1200, height: 1200 * 3 },
    deviceScaleFactor: 1,
  });
  test("should check the image size", async ({ page }) => {
    await page.goto(`${basePath}/`, {
      waitUntil: "networkidle",
    });

    await page.click("text=Next-Image-Export-Optimizer");

    const img = await page.locator("#test_image_unoptimized");
    await img.click();

    const image = await getImageById(page, "test_image_unoptimized");

    expect(image.currentSrc).toBe(
      `http://localhost:8080${basePath}/images/chris-zhang-Jq8-3Bmh1pQ-unsplash.jpg`
    );
    const img_legacy = await page.locator("#test_image_unoptimized_legacy");
    await img_legacy.click();

    const image_legacy = await getImageById(
      page,
      "test_image_unoptimized_legacy"
    );

    expect(image_legacy.currentSrc).toBe(
      `http://localhost:8080${basePath}/images/chris-zhang-Jq8-3Bmh1pQ-unsplash.jpg`
    );

    const svg = await page.locator("#test_image_unoptimized_svg");
    await svg.click();

    const svg_image = await getImageById(page, "test_image_unoptimized_svg");

    expect(svg_image.currentSrc).toBe(
      `http://localhost:8080${basePath}/_next/static/media/vercel.1be6ab75.svg`
    );

    const svg_remote = await page.locator("#test_image_unoptimized_svg_remote");
    await svg_remote.click();

    const svg_image_remote = await getImageById(
      page,
      "test_image_unoptimized_svg_remote"
    );
    // TODO: Could be improved by first using a local copy of this remote image
    expect(svg_image_remote.currentSrc).toBe(`https://reactapp.dev/nextjs.svg`);
  });
});
