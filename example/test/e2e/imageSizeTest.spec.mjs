import { test, expect } from "@playwright/test";
import getImageById from "./getImageById.js";

const widths = [640, 750, 777, 828, 1080, 1200, 1920, 2048, 3840];
const correctSrc = {
  640: "http://localhost:8080/images/nextImageExportOptimizer/chris-zhang-Jq8-3Bmh1pQ-unsplash-opt-640.WEBP",
  750: "http://localhost:8080/images/nextImageExportOptimizer/chris-zhang-Jq8-3Bmh1pQ-unsplash-opt-750.WEBP",
  777: "http://localhost:8080/images/nextImageExportOptimizer/chris-zhang-Jq8-3Bmh1pQ-unsplash-opt-777.WEBP",
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
  777: "http://localhost:8080/images/subfolder/nextImageExportOptimizer/ollie-barker-jones-K52HVSPVvKI-unsplash-opt-777.WEBP",
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
  777: "http://localhost:8080/nextImageExportOptimizer/chris-zhang-Jq8-3Bmh1pQ-unsplash_static.921260e0-opt-777.WEBP",
  828: "http://localhost:8080/nextImageExportOptimizer/chris-zhang-Jq8-3Bmh1pQ-unsplash_static.921260e0-opt-828.WEBP",
  1080: "http://localhost:8080/nextImageExportOptimizer/chris-zhang-Jq8-3Bmh1pQ-unsplash_static.921260e0-opt-1080.WEBP",
  1200: "http://localhost:8080/nextImageExportOptimizer/chris-zhang-Jq8-3Bmh1pQ-unsplash_static.921260e0-opt-1200.WEBP",
  1920: "http://localhost:8080/nextImageExportOptimizer/chris-zhang-Jq8-3Bmh1pQ-unsplash_static.921260e0-opt-1920.WEBP",
  2048: "http://localhost:8080/nextImageExportOptimizer/chris-zhang-Jq8-3Bmh1pQ-unsplash_static.921260e0-opt-2048.WEBP",
  3840: "http://localhost:8080/nextImageExportOptimizer/chris-zhang-Jq8-3Bmh1pQ-unsplash_static.921260e0-opt-3840.WEBP",
};
const correctSrcSmallImage = {
  640: "http://localhost:8080/nextImageExportOptimizer/chris-zhang-Jq8-3Bmh1pQ-unsplash_small.0fa13b23-opt-640.WEBP",
  750: "http://localhost:8080/nextImageExportOptimizer/chris-zhang-Jq8-3Bmh1pQ-unsplash_small.0fa13b23-opt-750.WEBP",
  777: "http://localhost:8080/nextImageExportOptimizer/chris-zhang-Jq8-3Bmh1pQ-unsplash_small.0fa13b23-opt-777.WEBP",
  828: "http://localhost:8080/nextImageExportOptimizer/chris-zhang-Jq8-3Bmh1pQ-unsplash_small.0fa13b23-opt-828.WEBP",
  1080: "http://localhost:8080/nextImageExportOptimizer/chris-zhang-Jq8-3Bmh1pQ-unsplash_small.0fa13b23-opt-1080.WEBP",
  1200: "http://localhost:8080/nextImageExportOptimizer/chris-zhang-Jq8-3Bmh1pQ-unsplash_small.0fa13b23-opt-1080.WEBP",
  1920: "http://localhost:8080/nextImageExportOptimizer/chris-zhang-Jq8-3Bmh1pQ-unsplash_small.0fa13b23-opt-1080.WEBP",
  2048: "http://localhost:8080/nextImageExportOptimizer/chris-zhang-Jq8-3Bmh1pQ-unsplash_small.0fa13b23-opt-1080.WEBP",
  3840: "http://localhost:8080/nextImageExportOptimizer/chris-zhang-Jq8-3Bmh1pQ-unsplash_small.0fa13b23-opt-1080.WEBP",
};
const correctSrcTransparentImage = {
  640: "http://localhost:8080/images/nextImageExportOptimizer/transparentImage-opt-640.WEBP",
  750: "http://localhost:8080/images/nextImageExportOptimizer/transparentImage-opt-750.WEBP",
  777: "http://localhost:8080/images/nextImageExportOptimizer/transparentImage-opt-777.WEBP",
  828: "http://localhost:8080/images/nextImageExportOptimizer/transparentImage-opt-828.WEBP",
  1080: "http://localhost:8080/images/nextImageExportOptimizer/transparentImage-opt-1080.WEBP",
  1200: "http://localhost:8080/images/nextImageExportOptimizer/transparentImage-opt-1200.WEBP",
  1920: "http://localhost:8080/images/nextImageExportOptimizer/transparentImage-opt-1920.WEBP",
  2048: "http://localhost:8080/images/nextImageExportOptimizer/transparentImage-opt-2048.WEBP",
  3840: "http://localhost:8080/images/nextImageExportOptimizer/transparentImage-opt-3840.WEBP",
};
const correctSrcRemoteImage = {
  640: "http://localhost:8080/nextImageExportOptimizer/0998337b913c48d47498b513e5f51b5119940311ad25e51275a0d31cc5244a97-opt-640.WEBP",
  750: "http://localhost:8080/nextImageExportOptimizer/0998337b913c48d47498b513e5f51b5119940311ad25e51275a0d31cc5244a97-opt-750.WEBP",
  777: "http://localhost:8080/nextImageExportOptimizer/0998337b913c48d47498b513e5f51b5119940311ad25e51275a0d31cc5244a97-opt-777.WEBP",
  828: "http://localhost:8080/nextImageExportOptimizer/0998337b913c48d47498b513e5f51b5119940311ad25e51275a0d31cc5244a97-opt-828.WEBP",
  1080: "http://localhost:8080/nextImageExportOptimizer/0998337b913c48d47498b513e5f51b5119940311ad25e51275a0d31cc5244a97-opt-1080.WEBP",
  1200: "http://localhost:8080/nextImageExportOptimizer/0998337b913c48d47498b513e5f51b5119940311ad25e51275a0d31cc5244a97-opt-1200.WEBP",
  1920: "http://localhost:8080/nextImageExportOptimizer/0998337b913c48d47498b513e5f51b5119940311ad25e51275a0d31cc5244a97-opt-1920.WEBP",
  2048: "http://localhost:8080/nextImageExportOptimizer/0998337b913c48d47498b513e5f51b5119940311ad25e51275a0d31cc5244a97-opt-2048.WEBP",
  3840: "http://localhost:8080/nextImageExportOptimizer/0998337b913c48d47498b513e5f51b5119940311ad25e51275a0d31cc5244a97-opt-3840.WEBP",
};

const correctSrcAnimatedPNGImage = {
  640: "http://localhost:8080/nextImageExportOptimizer/animated.c00e0188-opt-128.WEBP",
  750: "http://localhost:8080/nextImageExportOptimizer/animated.c00e0188-opt-128.WEBP",
  777: "http://localhost:8080/nextImageExportOptimizer/animated.c00e0188-opt-128.WEBP",
  828: "http://localhost:8080/nextImageExportOptimizer/animated.c00e0188-opt-128.WEBP",
  1080: "http://localhost:8080/nextImageExportOptimizer/animated.c00e0188-opt-128.WEBP",
  1200: "http://localhost:8080/nextImageExportOptimizer/animated.c00e0188-opt-128.WEBP",
  1920: "http://localhost:8080/nextImageExportOptimizer/animated.c00e0188-opt-128.WEBP",
  2048: "http://localhost:8080/nextImageExportOptimizer/animated.c00e0188-opt-128.WEBP",
  3840: "http://localhost:8080/nextImageExportOptimizer/animated.c00e0188-opt-128.WEBP",
};
const correctSrcAnimatedWEBPImage = {
  640: "http://localhost:8080/images/nextImageExportOptimizer/402107790_STATIC_NOISE_WEBP-opt-640.WEBP",
  750: "http://localhost:8080/images/nextImageExportOptimizer/402107790_STATIC_NOISE_WEBP-opt-750.WEBP",
  777: "http://localhost:8080/images/nextImageExportOptimizer/402107790_STATIC_NOISE_WEBP-opt-777.WEBP",
  828: "http://localhost:8080/images/nextImageExportOptimizer/402107790_STATIC_NOISE_WEBP-opt-828.WEBP",
  1080: "http://localhost:8080/images/nextImageExportOptimizer/402107790_STATIC_NOISE_WEBP-opt-1080.WEBP",
  1200: "http://localhost:8080/images/nextImageExportOptimizer/402107790_STATIC_NOISE_WEBP-opt-1200.WEBP",
  1920: "http://localhost:8080/images/nextImageExportOptimizer/402107790_STATIC_NOISE_WEBP-opt-1920.WEBP",
  2048: "http://localhost:8080/images/nextImageExportOptimizer/402107790_STATIC_NOISE_WEBP-opt-2048.WEBP",
  3840: "http://localhost:8080/images/nextImageExportOptimizer/402107790_STATIC_NOISE_WEBP-opt-3840.WEBP",
};
const correctSrcAnimatedGIFImage = {
  640: "http://localhost:8080/images/nextImageExportOptimizer/402107790_STATIC_NOISE_GIF-opt-640.WEBP",
  750: "http://localhost:8080/images/nextImageExportOptimizer/402107790_STATIC_NOISE_GIF-opt-750.WEBP",
  777: "http://localhost:8080/images/nextImageExportOptimizer/402107790_STATIC_NOISE_GIF-opt-777.WEBP",
  828: "http://localhost:8080/images/nextImageExportOptimizer/402107790_STATIC_NOISE_GIF-opt-828.WEBP",
  1080: "http://localhost:8080/images/nextImageExportOptimizer/402107790_STATIC_NOISE_GIF-opt-1080.WEBP",
  1200: "http://localhost:8080/images/nextImageExportOptimizer/402107790_STATIC_NOISE_GIF-opt-1200.WEBP",
  1920: "http://localhost:8080/images/nextImageExportOptimizer/402107790_STATIC_NOISE_GIF-opt-1920.WEBP",
  2048: "http://localhost:8080/images/nextImageExportOptimizer/402107790_STATIC_NOISE_GIF-opt-2048.WEBP",
  3840: "http://localhost:8080/images/nextImageExportOptimizer/402107790_STATIC_NOISE_GIF-opt-3840.WEBP",
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

      const image = await getImageById(page, "test_image");
      expect(image.currentSrc).toBe(correctSrc[width.toString()]);

      const image_future = await getImageById(page, `test_image_future_fill`);
      expect(image_future.currentSrc).toBe(correctSrc[width.toString()]);
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

      const image = await getImageById(page, "test_image_static");
      expect(image.currentSrc).toBe(correctSrcStaticImage[width.toString()]);

      const image_future = await getImageById(page, `test_image_static_future`);
      expect(image_future.currentSrc).toBe(
        correctSrcStaticImage[width.toString()]
      );
      const image_future_fill = await getImageById(
        page,
        `test_image_future_static_fill`
      );
      expect(image_future_fill.currentSrc).toBe(
        correctSrcStaticImage[width.toString()]
      );
    });
    test("should check the image size for the statically imported image in the nested route", async ({
      page,
    }) => {
      await page.goto("/nested/page", {
        waitUntil: "networkidle",
      });

      const img = await page.locator("#test_image_static");
      await img.click();

      const image = await getImageById(page, "test_image_static");
      expect(image.currentSrc).toBe(correctSrcStaticImage[width.toString()]);

      const image_future = await getImageById(page, "test_image_static_future");
      expect(image_future.currentSrc).toBe(
        correctSrcStaticImage[width.toString()]
      );
    });
    test("should check the image size for the statically imported image with fixed size in the nested route", async ({
      page,
    }) => {
      await page.goto("/nested/page_fixed", {
        waitUntil: "networkidle",
      });

      const img = await page.locator("#test_image_static_fixed");
      await img.click();

      const image = await getImageById(page, "test_image_static_fixed");
      expect(image.currentSrc).toBe(
        "http://localhost:8080/nextImageExportOptimizer/chris-zhang-Jq8-3Bmh1pQ-unsplash_static.921260e0-opt-384.WEBP"
      );

      const image_future = await getImageById(
        page,
        "test_image_static_fixed_future"
      );
      expect(image_future.currentSrc).toBe(
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

      const image = await getImageById(page, "test_image");
      expect(image.currentSrc).toBe(correctSrc[width.toString()]);

      const image_future = await getImageById(page, "test_image_future");
      expect(image_future.currentSrc).toBe(correctSrc[width.toString()]);
    });

    test("should check the image size for the statically imported image in the nested slug route", async ({
      page,
    }) => {
      await page.goto("/nestedSlug/page", {
        waitUntil: "networkidle",
      });

      const img = await page.locator("#test_image_static");
      await img.click();

      const image = await getImageById(page, "test_image_static");
      expect(image.currentSrc).toBe(correctSrcStaticImage[width.toString()]);

      const image_future = await getImageById(page, `test_image_future_fill`);
      expect(image_future.currentSrc).toBe(correctSrc[width.toString()]);

      const image_future_fill = await getImageById(
        page,
        `test_image_future_static_fill`
      );
      expect(image_future_fill.currentSrc).toBe(
        correctSrcStaticImage[width.toString()]
      );
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

      const image = await getImageById(page, "test_image_subfolder");
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

      const image = await getImageById(page, "test_image");
      expect(image.currentSrc).toBe(correctSrc[width.toString()]);
    });
    test("should check the image size for the transparent test page", async ({
      page,
    }) => {
      await page.goto("/transparent", {
        waitUntil: "networkidle",
      });

      const img = await page.locator("#test_image_transparent");
      await img.click();

      const image = await getImageById(page, "test_image_transparent");
      expect(image.currentSrc).toBe(
        correctSrcTransparentImage[width.toString()]
      );
      await expect(img).toHaveCSS("position", "absolute");
      await expect(img).not.toHaveCSS(
        "background-image",
        `url("/images/nextImageExportOptimizer/transparentImage-opt-10.WEBP")`
      );
      await expect(img).not.toHaveCSS("background-repeat", "no-repeat");
    });
    test("should check the image size for the small Image test page", async ({
      page,
    }) => {
      await page.goto("/smallImage", {
        waitUntil: "networkidle",
      });

      await page.click("text=Next-Image-Export-Optimizer");

      const img = await page.locator("#test_image_future");
      await img.click();

      const image = await getImageById(page, "test_image_future");
      expect(image.currentSrc).toBe(correctSrcSmallImage[width.toString()]);
    });
    test("should check the image size for the remote test page", async ({
      page,
    }) => {
      await page.goto("/remote", {
        waitUntil: "networkidle",
      });

      const img = await page.locator("#test_image");
      await img.click();

      const image = await getImageById(page, "test_image");
      expect(image.currentSrc).toBe(correctSrcRemoteImage[width.toString()]);
      await expect(img).toHaveCSS("position", "absolute");
      await expect(img).not.toHaveCSS(
        "background-image",
        `url("/images/nextImageExportOptimizer/transparentImage-opt-10.WEBP")`
      );
      await expect(img).not.toHaveCSS("background-repeat", "no-repeat");
    });
    test("should check the image size for the animated test page", async ({
      page,
    }) => {
      await page.goto("/gifs", {
        waitUntil: "networkidle",
      });

      const img = await page.locator("#test_image_png");
      await img.click();

      const image = await getImageById(page, "test_image_png");
      expect(image.currentSrc).toBe(
        correctSrcAnimatedPNGImage[width.toString()]
      );
      const img_gif = await page.locator("#test_image_gif");
      await img_gif.click();

      const image_gif = await getImageById(page, "test_image_gif");
      expect(image_gif.currentSrc).toBe(
        correctSrcAnimatedGIFImage[width.toString()]
      );

      const img_webp = await page.locator("#test_image_webp");
      await img_webp.click();

      const image_webp = await getImageById(page, "test_image_webp");
      expect(image_webp.currentSrc).toBe(
        correctSrcAnimatedWEBPImage[width.toString()]
      );
    });
  });
}
