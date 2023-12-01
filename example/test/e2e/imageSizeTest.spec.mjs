import { test, expect } from "@playwright/test";
import getImageById from "./getImageById.js";

// get the environment variable flag for the test
const testBasePath = process.env.BASEPATH === "true";
const imagesWebP = process.env.IMAGESWEBP === "true" ?? true;
const basePath = testBasePath ? "/subsite" : "";

const widths = [640, 750, 777, 828, 1080, 1200, 1920, 2048, 3840];
const correctSrc = {
  640: `http://localhost:8080${basePath}/images/nextImageExportOptimizer/chris-zhang-Jq8-3Bmh1pQ-unsplash-opt-640.${
    imagesWebP ? "WEBP" : "JPG"
  }`,
  750: `http://localhost:8080${basePath}/images/nextImageExportOptimizer/chris-zhang-Jq8-3Bmh1pQ-unsplash-opt-750.${
    imagesWebP ? "WEBP" : "JPG"
  }`,
  777: `http://localhost:8080${basePath}/images/nextImageExportOptimizer/chris-zhang-Jq8-3Bmh1pQ-unsplash-opt-777.${
    imagesWebP ? "WEBP" : "JPG"
  }`,
  828: `http://localhost:8080${basePath}/images/nextImageExportOptimizer/chris-zhang-Jq8-3Bmh1pQ-unsplash-opt-828.${
    imagesWebP ? "WEBP" : "JPG"
  }`,
  1080: `http://localhost:8080${basePath}/images/nextImageExportOptimizer/chris-zhang-Jq8-3Bmh1pQ-unsplash-opt-1080.${
    imagesWebP ? "WEBP" : "JPG"
  }`,
  1200: `http://localhost:8080${basePath}/images/nextImageExportOptimizer/chris-zhang-Jq8-3Bmh1pQ-unsplash-opt-1200.${
    imagesWebP ? "WEBP" : "JPG"
  }`,
  1920: `http://localhost:8080${basePath}/images/nextImageExportOptimizer/chris-zhang-Jq8-3Bmh1pQ-unsplash-opt-1920.${
    imagesWebP ? "WEBP" : "JPG"
  }`,
  2048: `http://localhost:8080${basePath}/images/nextImageExportOptimizer/chris-zhang-Jq8-3Bmh1pQ-unsplash-opt-2048.${
    imagesWebP ? "WEBP" : "JPG"
  }`,
  3840: `http://localhost:8080${basePath}/images/nextImageExportOptimizer/chris-zhang-Jq8-3Bmh1pQ-unsplash-opt-3840.${
    imagesWebP ? "WEBP" : "JPG"
  }`,
};

const correctSrcSubfolder = {
  640: `http://localhost:8080${basePath}/images/subfolder/nextImageExportOptimizer/ollie-barker-jones-K52HVSPVvKI-unsplash-opt-640.${
    imagesWebP ? "WEBP" : "JPG"
  }`,
  750: `http://localhost:8080${basePath}/images/subfolder/nextImageExportOptimizer/ollie-barker-jones-K52HVSPVvKI-unsplash-opt-750.${
    imagesWebP ? "WEBP" : "JPG"
  }`,
  777: `http://localhost:8080${basePath}/images/subfolder/nextImageExportOptimizer/ollie-barker-jones-K52HVSPVvKI-unsplash-opt-777.${
    imagesWebP ? "WEBP" : "JPG"
  }`,
  828: `http://localhost:8080${basePath}/images/subfolder/nextImageExportOptimizer/ollie-barker-jones-K52HVSPVvKI-unsplash-opt-828.${
    imagesWebP ? "WEBP" : "JPG"
  }`,
  1080: `http://localhost:8080${basePath}/images/subfolder/nextImageExportOptimizer/ollie-barker-jones-K52HVSPVvKI-unsplash-opt-1080.${
    imagesWebP ? "WEBP" : "JPG"
  }`,
  1200: `http://localhost:8080${basePath}/images/subfolder/nextImageExportOptimizer/ollie-barker-jones-K52HVSPVvKI-unsplash-opt-1200.${
    imagesWebP ? "WEBP" : "JPG"
  }`,
  1920: `http://localhost:8080${basePath}/images/subfolder/nextImageExportOptimizer/ollie-barker-jones-K52HVSPVvKI-unsplash-opt-1920.${
    imagesWebP ? "WEBP" : "JPG"
  }`,
  2048: `http://localhost:8080${basePath}/images/subfolder/nextImageExportOptimizer/ollie-barker-jones-K52HVSPVvKI-unsplash-opt-2048.${
    imagesWebP ? "WEBP" : "JPG"
  }`,
  3840: `http://localhost:8080${basePath}/images/subfolder/nextImageExportOptimizer/ollie-barker-jones-K52HVSPVvKI-unsplash-opt-3840.${
    imagesWebP ? "WEBP" : "JPG"
  }`,
};

const correctSrcStaticImage = {
  640: `http://localhost:8080${basePath}/nextImageExportOptimizer/chris-zhang-Jq8-3Bmh1pQ-unsplash_static.921260e0-opt-640.${
    imagesWebP ? "WEBP" : "JPG"
  }`,
  750: `http://localhost:8080${basePath}/nextImageExportOptimizer/chris-zhang-Jq8-3Bmh1pQ-unsplash_static.921260e0-opt-750.${
    imagesWebP ? "WEBP" : "JPG"
  }`,
  777: `http://localhost:8080${basePath}/nextImageExportOptimizer/chris-zhang-Jq8-3Bmh1pQ-unsplash_static.921260e0-opt-777.${
    imagesWebP ? "WEBP" : "JPG"
  }`,
  828: `http://localhost:8080${basePath}/nextImageExportOptimizer/chris-zhang-Jq8-3Bmh1pQ-unsplash_static.921260e0-opt-828.${
    imagesWebP ? "WEBP" : "JPG"
  }`,
  1080: `http://localhost:8080${basePath}/nextImageExportOptimizer/chris-zhang-Jq8-3Bmh1pQ-unsplash_static.921260e0-opt-1080.${
    imagesWebP ? "WEBP" : "JPG"
  }`,
  1200: `http://localhost:8080${basePath}/nextImageExportOptimizer/chris-zhang-Jq8-3Bmh1pQ-unsplash_static.921260e0-opt-1200.${
    imagesWebP ? "WEBP" : "JPG"
  }`,
  1920: `http://localhost:8080${basePath}/nextImageExportOptimizer/chris-zhang-Jq8-3Bmh1pQ-unsplash_static.921260e0-opt-1920.${
    imagesWebP ? "WEBP" : "JPG"
  }`,
  2048: `http://localhost:8080${basePath}/nextImageExportOptimizer/chris-zhang-Jq8-3Bmh1pQ-unsplash_static.921260e0-opt-2048.${
    imagesWebP ? "WEBP" : "JPG"
  }`,
  3840: `http://localhost:8080${basePath}/nextImageExportOptimizer/chris-zhang-Jq8-3Bmh1pQ-unsplash_static.921260e0-opt-3840.${
    imagesWebP ? "WEBP" : "JPG"
  }`,
};

const correctSrcSmallImage = {
  640: `http://localhost:8080${basePath}/nextImageExportOptimizer/chris-zhang-Jq8-3Bmh1pQ-unsplash_small.0fa13b23-opt-640.${
    imagesWebP ? "WEBP" : "JPG"
  }`,
  750: `http://localhost:8080${basePath}/nextImageExportOptimizer/chris-zhang-Jq8-3Bmh1pQ-unsplash_small.0fa13b23-opt-750.${
    imagesWebP ? "WEBP" : "JPG"
  }`,
  777: `http://localhost:8080${basePath}/nextImageExportOptimizer/chris-zhang-Jq8-3Bmh1pQ-unsplash_small.0fa13b23-opt-777.${
    imagesWebP ? "WEBP" : "JPG"
  }`,
  828: `http://localhost:8080${basePath}/nextImageExportOptimizer/chris-zhang-Jq8-3Bmh1pQ-unsplash_small.0fa13b23-opt-828.${
    imagesWebP ? "WEBP" : "JPG"
  }`,
  1080: `http://localhost:8080${basePath}/nextImageExportOptimizer/chris-zhang-Jq8-3Bmh1pQ-unsplash_small.0fa13b23-opt-1080.${
    imagesWebP ? "WEBP" : "JPG"
  }`,
  1200: `http://localhost:8080${basePath}/nextImageExportOptimizer/chris-zhang-Jq8-3Bmh1pQ-unsplash_small.0fa13b23-opt-1080.${
    imagesWebP ? "WEBP" : "JPG"
  }`,
  1920: `http://localhost:8080${basePath}/nextImageExportOptimizer/chris-zhang-Jq8-3Bmh1pQ-unsplash_small.0fa13b23-opt-1080.${
    imagesWebP ? "WEBP" : "JPG"
  }`,
  2048: `http://localhost:8080${basePath}/nextImageExportOptimizer/chris-zhang-Jq8-3Bmh1pQ-unsplash_small.0fa13b23-opt-1080.${
    imagesWebP ? "WEBP" : "JPG"
  }`,
  3840: `http://localhost:8080${basePath}/nextImageExportOptimizer/chris-zhang-Jq8-3Bmh1pQ-unsplash_small.0fa13b23-opt-1080.${
    imagesWebP ? "WEBP" : "JPG"
  }`,
};

const correctSrcTransparentImage = {
  640: `http://localhost:8080${basePath}/images/nextImageExportOptimizer/transparentImage-opt-640.${
    imagesWebP ? "WEBP" : "PNG"
  }`,
  750: `http://localhost:8080${basePath}/images/nextImageExportOptimizer/transparentImage-opt-750.${
    imagesWebP ? "WEBP" : "PNG"
  }`,
  777: `http://localhost:8080${basePath}/images/nextImageExportOptimizer/transparentImage-opt-777.${
    imagesWebP ? "WEBP" : "PNG"
  }`,
  828: `http://localhost:8080${basePath}/images/nextImageExportOptimizer/transparentImage-opt-828.${
    imagesWebP ? "WEBP" : "PNG"
  }`,
  1080: `http://localhost:8080${basePath}/images/nextImageExportOptimizer/transparentImage-opt-1080.${
    imagesWebP ? "WEBP" : "PNG"
  }`,
  1200: `http://localhost:8080${basePath}/images/nextImageExportOptimizer/transparentImage-opt-1200.${
    imagesWebP ? "WEBP" : "PNG"
  }`,
  1920: `http://localhost:8080${basePath}/images/nextImageExportOptimizer/transparentImage-opt-1920.${
    imagesWebP ? "WEBP" : "PNG"
  }`,
  2048: `http://localhost:8080${basePath}/images/nextImageExportOptimizer/transparentImage-opt-2048.${
    imagesWebP ? "WEBP" : "PNG"
  }`,
  3840: `http://localhost:8080${basePath}/images/nextImageExportOptimizer/transparentImage-opt-3840.${
    imagesWebP ? "WEBP" : "PNG"
  }`,
};

const correctSrcRemoteImage = {
  640: `http://localhost:8080${basePath}/nextImageExportOptimizer/reactapp.dev_images_nextImageExportOptimizer_christopher-gower-m_HRfLhgABo-unsplash-opt-2048-opt-640.WEBP`,
  750: `http://localhost:8080${basePath}/nextImageExportOptimizer/reactapp.dev_images_nextImageExportOptimizer_christopher-gower-m_HRfLhgABo-unsplash-opt-2048-opt-750.WEBP`,
  777: `http://localhost:8080${basePath}/nextImageExportOptimizer/reactapp.dev_images_nextImageExportOptimizer_christopher-gower-m_HRfLhgABo-unsplash-opt-2048-opt-777.WEBP`,
  828: `http://localhost:8080${basePath}/nextImageExportOptimizer/reactapp.dev_images_nextImageExportOptimizer_christopher-gower-m_HRfLhgABo-unsplash-opt-2048-opt-828.WEBP`,
  1080: `http://localhost:8080${basePath}/nextImageExportOptimizer/reactapp.dev_images_nextImageExportOptimizer_christopher-gower-m_HRfLhgABo-unsplash-opt-2048-opt-1080.WEBP`,
  1200: `http://localhost:8080${basePath}/nextImageExportOptimizer/reactapp.dev_images_nextImageExportOptimizer_christopher-gower-m_HRfLhgABo-unsplash-opt-2048-opt-1200.WEBP`,
  1920: `http://localhost:8080${basePath}/nextImageExportOptimizer/reactapp.dev_images_nextImageExportOptimizer_christopher-gower-m_HRfLhgABo-unsplash-opt-2048-opt-1920.WEBP`,
  2048: `http://localhost:8080${basePath}/nextImageExportOptimizer/reactapp.dev_images_nextImageExportOptimizer_christopher-gower-m_HRfLhgABo-unsplash-opt-2048-opt-2048.WEBP`,
  3840: `http://localhost:8080${basePath}/nextImageExportOptimizer/reactapp.dev_images_nextImageExportOptimizer_christopher-gower-m_HRfLhgABo-unsplash-opt-2048-opt-3840.WEBP`,
};

const correctSrcAnimatedPNGImage = {
  640: `http://localhost:8080${basePath}/nextImageExportOptimizer/animated.c00e0188-opt-128.${
    imagesWebP ? "WEBP" : "PNG"
  }`,
  750: `http://localhost:8080${basePath}/nextImageExportOptimizer/animated.c00e0188-opt-128.${
    imagesWebP ? "WEBP" : "PNG"
  }`,
  777: `http://localhost:8080${basePath}/nextImageExportOptimizer/animated.c00e0188-opt-128.${
    imagesWebP ? "WEBP" : "PNG"
  }`,
  828: `http://localhost:8080${basePath}/nextImageExportOptimizer/animated.c00e0188-opt-128.${
    imagesWebP ? "WEBP" : "PNG"
  }`,
  1080: `http://localhost:8080${basePath}/nextImageExportOptimizer/animated.c00e0188-opt-128.${
    imagesWebP ? "WEBP" : "PNG"
  }`,
  1200: `http://localhost:8080${basePath}/nextImageExportOptimizer/animated.c00e0188-opt-128.${
    imagesWebP ? "WEBP" : "PNG"
  }`,
  1920: `http://localhost:8080${basePath}/nextImageExportOptimizer/animated.c00e0188-opt-128.${
    imagesWebP ? "WEBP" : "PNG"
  }`,
  2048: `http://localhost:8080${basePath}/nextImageExportOptimizer/animated.c00e0188-opt-128.${
    imagesWebP ? "WEBP" : "PNG"
  }`,
  3840: `http://localhost:8080${basePath}/nextImageExportOptimizer/animated.c00e0188-opt-128.${
    imagesWebP ? "WEBP" : "PNG"
  }`,
};

const correctSrcAnimatedWEBPImage = {
  640: `http://localhost:8080${basePath}/images/nextImageExportOptimizer/402107790_STATIC_NOISE_WEBP-opt-640.WEBP`,
  750: `http://localhost:8080${basePath}/images/nextImageExportOptimizer/402107790_STATIC_NOISE_WEBP-opt-750.WEBP`,
  777: `http://localhost:8080${basePath}/images/nextImageExportOptimizer/402107790_STATIC_NOISE_WEBP-opt-777.WEBP`,
  828: `http://localhost:8080${basePath}/images/nextImageExportOptimizer/402107790_STATIC_NOISE_WEBP-opt-828.WEBP`,
  1080: `http://localhost:8080${basePath}/images/nextImageExportOptimizer/402107790_STATIC_NOISE_WEBP-opt-1080.WEBP`,
  1200: `http://localhost:8080${basePath}/images/nextImageExportOptimizer/402107790_STATIC_NOISE_WEBP-opt-1200.WEBP`,
  1920: `http://localhost:8080${basePath}/images/nextImageExportOptimizer/402107790_STATIC_NOISE_WEBP-opt-1920.WEBP`,
  2048: `http://localhost:8080${basePath}/images/nextImageExportOptimizer/402107790_STATIC_NOISE_WEBP-opt-2048.WEBP`,
  3840: `http://localhost:8080${basePath}/images/nextImageExportOptimizer/402107790_STATIC_NOISE_WEBP-opt-3840.WEBP`,
};

const correctSrcAnimatedGIFImage = {
  640: `http://localhost:8080${basePath}/images/nextImageExportOptimizer/402107790_STATIC_NOISE_GIF-opt-640.${
    imagesWebP ? "WEBP" : "GIF"
  }`,
  750: `http://localhost:8080${basePath}/images/nextImageExportOptimizer/402107790_STATIC_NOISE_GIF-opt-750.${
    imagesWebP ? "WEBP" : "GIF"
  }`,
  777: `http://localhost:8080${basePath}/images/nextImageExportOptimizer/402107790_STATIC_NOISE_GIF-opt-777.${
    imagesWebP ? "WEBP" : "GIF"
  }`,
  828: `http://localhost:8080${basePath}/images/nextImageExportOptimizer/402107790_STATIC_NOISE_GIF-opt-828.${
    imagesWebP ? "WEBP" : "GIF"
  }`,
  1080: `http://localhost:8080${basePath}/images/nextImageExportOptimizer/402107790_STATIC_NOISE_GIF-opt-1080.${
    imagesWebP ? "WEBP" : "GIF"
  }`,
  1200: `http://localhost:8080${basePath}/images/nextImageExportOptimizer/402107790_STATIC_NOISE_GIF-opt-1200.${
    imagesWebP ? "WEBP" : "GIF"
  }`,
  1920: `http://localhost:8080${basePath}/images/nextImageExportOptimizer/402107790_STATIC_NOISE_GIF-opt-1920.${
    imagesWebP ? "WEBP" : "GIF"
  }`,
  2048: `http://localhost:8080${basePath}/images/nextImageExportOptimizer/402107790_STATIC_NOISE_GIF-opt-2048.${
    imagesWebP ? "WEBP" : "GIF"
  }`,
  3840: `http://localhost:8080${basePath}/images/nextImageExportOptimizer/402107790_STATIC_NOISE_GIF-opt-3840.${
    imagesWebP ? "WEBP" : "GIF"
  }`,
};
function generateSrcset(widths, correctSrc) {
  const baseURL = "http://localhost:8080";
  return widths
    .map((width) => `${correctSrc[width].replace(baseURL, "")} ${width}w`)
    .join(", ");
}

for (let index = 0; index < widths.length; index++) {
  const width = widths[index];

  test.describe(`Test width: ${width}`, () => {
    test.use({
      viewport: { width: width, height: width * 3 },
      deviceScaleFactor: 1,
    });

    test("should check the image size", async ({ page }) => {
      await page.goto(`${basePath}/`, {
        waitUntil: "networkidle",
      });

      await page.click("text=Next-Image-Export-Optimizer");

      const img = await page.locator("#test_image");
      await img.click();

      await img.evaluate(
        (node) =>
          new Promise((resolve) => {
            const imgElement = node;
            if (imgElement.complete) {
              resolve();
            } else {
              imgElement.addEventListener("load", () => {
                resolve();
              });
            }
          })
      );

      const image = await getImageById(page, "test_image");
      expect(image.currentSrc).toBe(correctSrc[width.toString()]);
      expect(image.naturalWidth).toBe(width);

      const img_future = await page.locator("#test_image_future_fill");
      // check that the additional classNames are added
      expect(img_future).toHaveClass("additionalClassName");

      const image_future = await getImageById(page, "test_image_future_fill");
      expect(image_future.currentSrc).toBe(correctSrc[width.toString()]);
      expect(image_future.naturalWidth).toBe(width);

      const srcset = generateSrcset(widths, correctSrc);
      expect(image.srcset).toBe(srcset);
      expect(image_future.srcset).toBe(srcset);

      // check the number of images on the page
      const images = await page.$$("img");
      expect(images.length).toBe(10);
    });
    test("should check the image size for the appdir", async ({ page }) => {
      await page.goto(`${basePath}/appdir`, {
        waitUntil: "networkidle",
      });

      await page.click("text=Next-Image-Export-Optimizer");

      const img = await page.locator("#test_image");
      await img.click();

      await img.evaluate(
        (node) =>
          new Promise((resolve) => {
            const imgElement = node;
            if (imgElement.complete) {
              resolve();
            } else {
              imgElement.addEventListener("load", () => {
                resolve();
              });
            }
          })
      );

      const image = await getImageById(page, "test_image");
      expect(image.currentSrc).toBe(correctSrc[width.toString()]);
      expect(image.naturalWidth).toBe(width);

      const image_future = await getImageById(page, "test_image_future_fill");
      expect(image_future.currentSrc).toBe(correctSrc[width.toString()]);
      expect(image_future.naturalWidth).toBe(width);

      const srcset = generateSrcset(widths, correctSrc);
      expect(image.srcset).toBe(srcset);
      expect(image_future.srcset).toBe(srcset);

      // check the number of images on the page
      const images = await page.$$("img");
      expect(images.length).toBe(10);
    });
    test("should check the image size for the statically imported image", async ({
      page,
    }) => {
      await page.goto(`${basePath}/`, {
        waitUntil: "networkidle",
      });

      await page.click("text=Next-Image-Export-Optimizer");

      const img = await page.locator("#test_image_static");
      await img.click();

      await img.evaluate(
        (node) =>
          new Promise((resolve) => {
            const imgElement = node;
            if (imgElement.complete) {
              resolve();
            } else {
              imgElement.addEventListener("load", () => {
                resolve();
              });
            }
          })
      );

      const image = await getImageById(page, "test_image_static");
      expect(image.currentSrc).toBe(correctSrcStaticImage[width.toString()]);
      expect(image.naturalWidth).toBe(width);

      const image_future = await getImageById(page, "test_image_static_future");
      expect(image_future.currentSrc).toBe(
        correctSrcStaticImage[width.toString()]
      );
      expect(image_future.naturalWidth).toBe(width);
      const image_future_fill = await getImageById(
        page,
        "test_image_future_static_fill"
      );
      expect(image_future_fill.currentSrc).toBe(
        correctSrcStaticImage[width.toString()]
      );
      const srcset = generateSrcset(widths, correctSrcStaticImage);
      expect(image.srcset).toBe(srcset);
      expect(image_future.srcset).toBe(srcset);
      expect(image_future_fill.srcset).toBe(srcset);

      expect(image_future_fill.naturalWidth).toBe(width);
    });
    test("should check the image size for the statically imported image for the appDir", async ({
      page,
    }) => {
      await page.goto(`${basePath}/appdir`, {
        waitUntil: "networkidle",
      });

      await page.click("text=Next-Image-Export-Optimizer");

      const img = await page.locator("#test_image_static");
      await img.click();

      await img.evaluate(
        (node) =>
          new Promise((resolve) => {
            const imgElement = node;
            if (imgElement.complete) {
              resolve();
            } else {
              imgElement.addEventListener("load", () => {
                resolve();
              });
            }
          })
      );

      const image = await getImageById(page, "test_image_static");
      expect(image.currentSrc).toBe(correctSrcStaticImage[width.toString()]);
      expect(image.naturalWidth).toBe(width);

      const image_future = await getImageById(page, "test_image_static_future");
      expect(image_future.currentSrc).toBe(
        correctSrcStaticImage[width.toString()]
      );
      expect(image_future.naturalWidth).toBe(width);
      const image_future_fill = await getImageById(
        page,
        "test_image_future_static_fill"
      );
      expect(image_future_fill.currentSrc).toBe(
        correctSrcStaticImage[width.toString()]
      );
      const srcset = generateSrcset(widths, correctSrcStaticImage);
      expect(image.srcset).toBe(srcset);
      expect(image_future.srcset).toBe(srcset);
      expect(image_future_fill.srcset).toBe(srcset);

      expect(image_future_fill.naturalWidth).toBe(width);
    });
    test("should check the image size for the statically imported image in the nested route", async ({
      page,
    }) => {
      await page.goto(`${basePath}/nested/page`, {
        waitUntil: "networkidle",
      });

      const img = await page.locator("#test_image_static");
      await img.click();

      const image = await getImageById(page, "test_image_static");
      expect(image.currentSrc).toBe(correctSrcStaticImage[width.toString()]);
      expect(image.naturalWidth).toBe(width);

      const image_future = await getImageById(page, "test_image_static_future");
      expect(image_future.currentSrc).toBe(
        correctSrcStaticImage[width.toString()]
      );
      expect(image_future.naturalWidth).toBe(width);

      const srcset = generateSrcset(widths, correctSrcStaticImage);
      expect(image.srcset).toBe(srcset);
      expect(image_future.srcset).toBe(srcset);

      // check the number of images on the page
      const images = await page.$$("img");
      expect(images.length).toBe(6);
    });
    test("should check the image size for the statically imported image with fixed size in the nested route", async ({
      page,
    }) => {
      await page.goto(`${basePath}/nested/page_fixed`, {
        waitUntil: "networkidle",
      });

      const img = await page.locator("#test_image_static_fixed");
      await img.click();

      const image = await getImageById(page, "test_image_static_fixed");
      expect(image.currentSrc).toBe(
        `http://localhost:8080${basePath}/nextImageExportOptimizer/chris-zhang-Jq8-3Bmh1pQ-unsplash_static.921260e0-opt-384.${
          imagesWebP ? "WEBP" : "JPG"
        }`
      );
      expect(image.naturalWidth).toBe(384);

      const image_future = await getImageById(
        page,
        "test_image_static_fixed_future"
      );
      expect(image_future.currentSrc).toBe(
        `http://localhost:8080${basePath}/nextImageExportOptimizer/chris-zhang-Jq8-3Bmh1pQ-unsplash_static.921260e0-opt-384.${
          imagesWebP ? "WEBP" : "JPG"
        }`
      );
      expect(image_future.naturalWidth).toBe(384);
    });

    test("should check the image size for the normally imported image in the nested route", async ({
      page,
    }) => {
      await page.goto(`${basePath}/nested/page`, {
        waitUntil: "networkidle",
      });

      const img = await page.locator("#test_image");
      await img.click();

      const image = await getImageById(page, "test_image");
      expect(image.currentSrc).toBe(correctSrc[width.toString()]);
      expect(image.naturalWidth).toBe(width);

      const image_future = await getImageById(page, "test_image_future");
      expect(image_future.currentSrc).toBe(correctSrc[width.toString()]);
      expect(image_future.naturalWidth).toBe(width);

      const srcset = generateSrcset(widths, correctSrc);
      expect(image.srcset).toBe(srcset);
      expect(image_future.srcset).toBe(srcset);
    });

    test("should check the image size for the statically imported image in the nested slug route", async ({
      page,
    }) => {
      await page.goto(`${basePath}/nestedSlug/page`, {
        waitUntil: "networkidle",
      });

      const img = await page.locator("#test_image_static");
      await img.click();

      const image = await getImageById(page, "test_image_static");
      expect(image.currentSrc).toBe(correctSrcStaticImage[width.toString()]);
      expect(image.naturalWidth).toBe(width);

      const image_future = await getImageById(page, "test_image_future_fill");
      expect(image_future.currentSrc).toBe(correctSrc[width.toString()]);
      expect(image_future.naturalWidth).toBe(width);

      const image_future_fill = await getImageById(
        page,
        "test_image_future_static_fill"
      );
      expect(image_future_fill.currentSrc).toBe(
        correctSrcStaticImage[width.toString()]
      );
      expect(image_future_fill.naturalWidth).toBe(width);

      // check the number of images on the page
      const images = await page.$$("img");
      expect(images.length).toBe(3);

      const srcset = generateSrcset(widths, correctSrcStaticImage);
      expect(image.srcset).toBe(srcset);
      expect(image_future_fill.srcset).toBe(srcset);
    });

    test("should check the image size for images in subfolder", async ({
      page,
    }) => {
      await page.goto(`${basePath}/subfolder`, {
        waitUntil: "networkidle",
      });

      await page.click("text=Subfolder test");

      const img = await page.locator("#test_image_subfolder");
      await img.click();

      const image = await getImageById(page, "test_image_subfolder");
      expect(image.currentSrc).toBe(correctSrcSubfolder[width.toString()]);
      expect(image.naturalWidth).toBe(width);

      // check the number of images on the page
      const images = await page.$$("img");
      expect(images.length).toBe(2);

      const srcset = generateSrcset(widths, correctSrcSubfolder);
      expect(image.srcset).toBe(srcset);
    });
    test("should check the image size for the typescript test page", async ({
      page,
    }) => {
      await page.goto(`${basePath}/typescript`, {
        waitUntil: "networkidle",
      });

      await page.click("text=Next-Image-Export-Optimizer");

      const img = await page.locator("#test_image");
      await img.click();

      const image = await getImageById(page, "test_image");
      expect(image.currentSrc).toBe(correctSrc[width.toString()]);

      const srcset = generateSrcset(widths, correctSrc);
      expect(image.srcset).toBe(srcset);
    });
    test("should check the image size for the transparent test page", async ({
      page,
    }) => {
      await page.goto(`${basePath}/transparent`, {
        waitUntil: "networkidle",
      });

      const img = await page.locator("#test_image_transparent");
      await img.click();

      const image = await getImageById(page, "test_image_transparent");
      expect(image.currentSrc).toBe(
        correctSrcTransparentImage[width.toString()]
      );
      expect(image.naturalWidth).toBe(width > 2048 ? 2190 : width);
      await expect(img).toHaveCSS("position", "absolute");
      await expect(img).not.toHaveCSS(
        "background-image",
        `url("/images/nextImageExportOptimizer/transparentImage-opt-10${
          imagesWebP ? "WEBP" : "GIF"
        }")`
      );
      await expect(img).not.toHaveCSS("background-repeat", "no-repeat");

      // check the number of images on the page
      const images = await page.$$("img");
      expect(images.length).toBe(1);

      const srcset = generateSrcset(widths, correctSrcTransparentImage);
      expect(image.srcset).toBe(srcset);
    });
    test("should check the image size for the forwardRef test page", async ({
      page,
    }) => {
      await page.goto(`${basePath}/forwardRef`, {
        waitUntil: "networkidle",
      });

      const img = await page.locator("#test_image_forwardRef");
      await img.click();

      const image = await getImageById(page, "test_image_forwardRef");
      expect(image.currentSrc).toBe(
        correctSrcTransparentImage[width.toString()]
      );
      expect(image.naturalWidth).toBe(width > 2048 ? 2190 : width);
      await expect(img).toHaveCSS("position", "absolute");
      await expect(img).not.toHaveCSS(
        "background-image",
        `url("/images/nextImageExportOptimizer/transparentImage-opt-10${
          imagesWebP ? "WEBP" : "GIF"
        }")`
      );
      await expect(img).not.toHaveCSS("background-repeat", "no-repeat");

      await page.getByText(width.toString()).click();
      // check the number of images on the page
      const images = await page.$$("img");
      expect(images.length).toBe(1);
    });
    test("should check the image size for the small Image test page", async ({
      page,
    }) => {
      await page.goto(`${basePath}/smallImage`, {
        waitUntil: "networkidle",
      });

      await page.click("text=Next-Image-Export-Optimizer");

      const img = await page.locator("#test_image_future");
      await img.click();

      const image = await getImageById(page, "test_image_future");
      expect(image.currentSrc).toBe(correctSrcSmallImage[width.toString()]);
      const srcset = generateSrcset(widths, correctSrcSmallImage);
      expect(image.srcset).toBe(srcset);
    });
    test("should check the image size for the remote test page", async ({
      page,
    }) => {
      await page.goto(`${basePath}/remote`, {
        waitUntil: "networkidle",
      });

      const img = await page.locator("#test_image");
      await img.click();

      const image = await getImageById(page, "test_image");
      expect(image.currentSrc).toBe(correctSrcRemoteImage[width.toString()]);
      expect(image.naturalWidth).toBe(width >= 2048 ? 2048 : width);
      await expect(img).toHaveCSS("position", "absolute");
      await expect(img).not.toHaveCSS(
        "background-image",
        `url("/images/nextImageExportOptimizer/transparentImage-opt-10.WEBP")`
      );
      await expect(img).not.toHaveCSS("background-repeat", "no-repeat");

      // check the number of images on the page
      const images = await page.$$("img");
      expect(images.length).toBe(1);
      const srcset = generateSrcset(widths, correctSrcRemoteImage);
      expect(image.srcset).toBe(srcset);
    });
    test("should check the image size for the animated test page", async ({
      page,
    }) => {
      await page.goto(`${basePath}/gifs`, {
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
      // cap the width at 400px
      expect(image_gif.naturalWidth).toBe(width > 400 ? 400 : width);

      const img_webp = await page.locator("#test_image_webp");
      await img_webp.click();

      const image_webp = await getImageById(page, "test_image_webp");
      expect(image_webp.currentSrc).toBe(
        correctSrcAnimatedWEBPImage[width.toString()]
      );
      expect(image_webp.naturalWidth).toBe(width > 400 ? 400 : width);
    });
  });
}
