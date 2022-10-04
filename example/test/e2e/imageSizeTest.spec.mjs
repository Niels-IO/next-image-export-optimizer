import { test, expect } from "@playwright/test";

const widths = [640, 750, 828, 1080, 1200, 1920, 2048, 3840];
const correctSrc = {
  640: "http://localhost:8080/images/nextImageExportOptimizer/chris-zhang-Jq8-3Bmh1pQ-unsplash-opt-640.WEBP",
  750: "http://localhost:8080/images/nextImageExportOptimizer/chris-zhang-Jq8-3Bmh1pQ-unsplash-opt-750.WEBP",
  828: "http://localhost:8080/images/nextImageExportOptimizer/chris-zhang-Jq8-3Bmh1pQ-unsplash-opt-828.WEBP",
  1080: "http://localhost:8080/images/nextImageExportOptimizer/chris-zhang-Jq8-3Bmh1pQ-unsplash-opt-1080.WEBP",
  1200: "http://localhost:8080/images/nextImageExportOptimizer/chris-zhang-Jq8-3Bmh1pQ-unsplash-opt-1200.WEBP",
  1920: "http://localhost:8080/images/nextImageExportOptimizer/chris-zhang-Jq8-3Bmh1pQ-unsplash-opt-1920.WEBP",
  2048: "http://localhost:8080/images/nextImageExportOptimizer/chris-zhang-Jq8-3Bmh1pQ-unsplash-opt-2048.WEBP",
  3840: "http://localhost:8080/images/nextImageExportOptimizer/chris-zhang-Jq8-3Bmh1pQ-unsplash-opt-3840.WEBP",
};
const correctSrcSubfolder = {
  640: "http://localhost:8080/images/subfolder/nextImageExportOptimizer/ollie-barker-jones-K52HVSPVvKI-unsplash-opt-640.WEBP",
  750: "http://localhost:8080/images/subfolder/nextImageExportOptimizer/ollie-barker-jones-K52HVSPVvKI-unsplash-opt-750.WEBP",
  828: "http://localhost:8080/images/subfolder/nextImageExportOptimizer/ollie-barker-jones-K52HVSPVvKI-unsplash-opt-828.WEBP",
  1080: "http://localhost:8080/images/subfolder/nextImageExportOptimizer/ollie-barker-jones-K52HVSPVvKI-unsplash-opt-1080.WEBP",
  1200: "http://localhost:8080/images/subfolder/nextImageExportOptimizer/ollie-barker-jones-K52HVSPVvKI-unsplash-opt-1200.WEBP",
  1920: "http://localhost:8080/images/subfolder/nextImageExportOptimizer/ollie-barker-jones-K52HVSPVvKI-unsplash-opt-1920.WEBP",
  2048: "http://localhost:8080/images/subfolder/nextImageExportOptimizer/ollie-barker-jones-K52HVSPVvKI-unsplash-opt-2048.WEBP",
  3840: "http://localhost:8080/images/subfolder/nextImageExportOptimizer/ollie-barker-jones-K52HVSPVvKI-unsplash-opt-3840.WEBP",
};
const correctSrcStaticImage = {
  640: "http://localhost:8080/nextImageExportOptimizer/chris-zhang-Jq8-3Bmh1pQ-unsplash_static.921260e0-opt-640.WEBP",
  750: "http://localhost:8080/nextImageExportOptimizer/chris-zhang-Jq8-3Bmh1pQ-unsplash_static.921260e0-opt-750.WEBP",
  828: "http://localhost:8080/nextImageExportOptimizer/chris-zhang-Jq8-3Bmh1pQ-unsplash_static.921260e0-opt-828.WEBP",
  1080: "http://localhost:8080/nextImageExportOptimizer/chris-zhang-Jq8-3Bmh1pQ-unsplash_static.921260e0-opt-1080.WEBP",
  1200: "http://localhost:8080/nextImageExportOptimizer/chris-zhang-Jq8-3Bmh1pQ-unsplash_static.921260e0-opt-1200.WEBP",
  1920: "http://localhost:8080/nextImageExportOptimizer/chris-zhang-Jq8-3Bmh1pQ-unsplash_static.921260e0-opt-1920.WEBP",
  2048: "http://localhost:8080/nextImageExportOptimizer/chris-zhang-Jq8-3Bmh1pQ-unsplash_static.921260e0-opt-2048.WEBP",
  3840: "http://localhost:8080/nextImageExportOptimizer/chris-zhang-Jq8-3Bmh1pQ-unsplash_static.921260e0-opt-3840.WEBP",
};

for (let index = 0; index < widths.length; index++) {
  const width = widths[index];

  test.describe(`Test width: ${width}`, () => {
    test.use({
      viewport: { width: width, height: width * 3 },
      deviceScaleFactor: 1,
    });
    test("should check the image size", async ({ page }) => {
      await page.goto("/", {
        waitUntil: "networkidle",
      });

      await page.click("text=Next-Image-Export-Optimizer");

      const img = await page.locator("#test_image");
      await img.click();

      const image = await page.evaluate(() => {
        let img = document.getElementById("test_image");
        return {
          src: img.src,
          currentSrc: img.currentSrc,
          naturalWidth: img.naturalWidth,
          width: img.width,
        };
      });

      expect(image.currentSrc).toBe(correctSrc[width.toString()]);
    });
    test("should check the image size for the statically imported image", async ({
      page,
    }) => {
      await page.goto("/", {
        waitUntil: "networkidle",
      });

      await page.click("text=Next-Image-Export-Optimizer");

      const img = await page.locator("#test_image_static");
      await img.click();

      const image = await page.evaluate(() => {
        let img = document.getElementById("test_image_static");
        return {
          src: img.src,
          currentSrc: img.currentSrc,
          naturalWidth: img.naturalWidth,
          width: img.width,
        };
      });
      expect(image.currentSrc).toBe(correctSrcStaticImage[width.toString()]);
    });
    test("should check the image size for the statically imported image in the nested route", async ({
      page,
    }) => {
      await page.goto("/nested/page", {
        waitUntil: "networkidle",
      });

      const img = await page.locator("#test_image_static");
      await img.click();

      const image = await page.evaluate(() => {
        let img = document.getElementById("test_image_static");
        return {
          src: img.src,
          currentSrc: img.currentSrc,
          naturalWidth: img.naturalWidth,
          width: img.width,
        };
      });

      expect(image.currentSrc).toBe(correctSrcStaticImage[width.toString()]);
    });
    test("should check the image size for the statically imported image with fixed size in the nested route", async ({
      page,
    }) => {
      await page.goto("/nested/page", {
        waitUntil: "networkidle",
      });

      const img = await page.locator("#test_image_static_fixed");
      await img.click();

      const image = await page.evaluate(() => {
        let img = document.getElementById("test_image_static_fixed");
        return {
          src: img.src,
          currentSrc: img.currentSrc,
          naturalWidth: img.naturalWidth,
          width: img.width,
        };
      });

      expect(image.currentSrc).toBe(
        "http://localhost:8080/nextImageExportOptimizer/chris-zhang-Jq8-3Bmh1pQ-unsplash_static.921260e0-opt-384.WEBP"
      );
    });

    test("should check the image size for the normally imported image in the nested route", async ({
      page,
    }) => {
      await page.goto("/nested/page", {
        waitUntil: "networkidle",
      });

      const img = await page.locator("#test_image");
      await img.click();

      const image = await page.evaluate(() => {
        let img = document.getElementById("test_image");
        return {
          src: img.src,
          currentSrc: img.currentSrc,
          naturalWidth: img.naturalWidth,
          width: img.width,
        };
      });

      expect(image.currentSrc).toBe(correctSrc[width.toString()]);
    });

    test("should check the image size for the statically imported image in the nested slug route", async ({
      page,
    }) => {
      await page.goto("/nestedSlug/page", {
        waitUntil: "networkidle",
      });

      const img = await page.locator("#test_image_static");
      await img.click();

      const image = await page.evaluate(() => {
        let img = document.getElementById("test_image_static");
        return {
          src: img.src,
          currentSrc: img.currentSrc,
          naturalWidth: img.naturalWidth,
          width: img.width,
        };
      });

      expect(image.currentSrc).toBe(correctSrcStaticImage[width.toString()]);
    });

    test("should check the image size for images in subfolder", async ({
      page,
    }) => {
      await page.goto("/subfolder", {
        waitUntil: "networkidle",
      });

      await page.click("text=Subfolder test");

      const img = await page.locator("#test_image_subfolder");
      await img.click();

      const image = await page.evaluate(() => {
        let img = document.getElementById("test_image_subfolder");
        return {
          src: img.src,
          currentSrc: img.currentSrc,
          naturalWidth: img.naturalWidth,
          width: img.width,
        };
      });

      expect(image.currentSrc).toBe(correctSrcSubfolder[width.toString()]);
    });
    test("should check the image size for the typescript test page", async ({
      page,
    }) => {
      await page.goto("/typescript", {
        waitUntil: "networkidle",
      });

      await page.click("text=Next-Image-Export-Optimizer");

      const img = await page.locator("#test_image");
      await img.click();

      const image = await page.evaluate(() => {
        let img = document.getElementById("test_image");
        return {
          src: img.src,
          currentSrc: img.currentSrc,
          naturalWidth: img.naturalWidth,
          width: img.width,
        };
      });

      expect(image.currentSrc).toBe(correctSrc[width.toString()]);
    });
  });
}
