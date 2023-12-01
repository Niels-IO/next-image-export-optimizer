import { test, expect } from "@playwright/test";
import getImageById from "./getImageById.js";

// get the environment variable flag for the test
const testBasePath = process.env.BASEPATH === "true";
const basePath = testBasePath ? "/subsite" : "";
const imagesWebP = process.env.IMAGESWEBP === "true" ?? true;

const widths = [16, 32, 48, 64, 96, 128, 256, 384];
const correctSrc = {
  16: [
    `http://localhost:8080${basePath}/images/nextImageExportOptimizer/chris-zhang-Jq8-3Bmh1pQ-unsplash-opt-16.${
      imagesWebP ? "WEBP" : "JPG"
    }`,
    `http://localhost:8080${basePath}/images/nextImageExportOptimizer/chris-zhang-Jq8-3Bmh1pQ-unsplash-opt-32.${
      imagesWebP ? "WEBP" : "JPG"
    }`,
  ],
  32: [
    `http://localhost:8080${basePath}/images/nextImageExportOptimizer/chris-zhang-Jq8-3Bmh1pQ-unsplash-opt-32.${
      imagesWebP ? "WEBP" : "JPG"
    }`,
    `http://localhost:8080${basePath}/images/nextImageExportOptimizer/chris-zhang-Jq8-3Bmh1pQ-unsplash-opt-64.${
      imagesWebP ? "WEBP" : "JPG"
    }`,
  ],
  48: [
    `http://localhost:8080${basePath}/images/nextImageExportOptimizer/chris-zhang-Jq8-3Bmh1pQ-unsplash-opt-48.${
      imagesWebP ? "WEBP" : "JPG"
    }`,
    `http://localhost:8080${basePath}/images/nextImageExportOptimizer/chris-zhang-Jq8-3Bmh1pQ-unsplash-opt-96.${
      imagesWebP ? "WEBP" : "JPG"
    }`,
  ],
  64: [
    `http://localhost:8080${basePath}/images/nextImageExportOptimizer/chris-zhang-Jq8-3Bmh1pQ-unsplash-opt-64.${
      imagesWebP ? "WEBP" : "JPG"
    }`,
    `http://localhost:8080${basePath}/images/nextImageExportOptimizer/chris-zhang-Jq8-3Bmh1pQ-unsplash-opt-128.${
      imagesWebP ? "WEBP" : "JPG"
    }`,
  ],
  96: [
    `http://localhost:8080${basePath}/images/nextImageExportOptimizer/chris-zhang-Jq8-3Bmh1pQ-unsplash-opt-96.${
      imagesWebP ? "WEBP" : "JPG"
    }`,
    `http://localhost:8080${basePath}/images/nextImageExportOptimizer/chris-zhang-Jq8-3Bmh1pQ-unsplash-opt-256.${
      imagesWebP ? "WEBP" : "JPG"
    }`,
  ],
  128: [
    `http://localhost:8080${basePath}/images/nextImageExportOptimizer/chris-zhang-Jq8-3Bmh1pQ-unsplash-opt-128.${
      imagesWebP ? "WEBP" : "JPG"
    }`,
    `http://localhost:8080${basePath}/images/nextImageExportOptimizer/chris-zhang-Jq8-3Bmh1pQ-unsplash-opt-256.${
      imagesWebP ? "WEBP" : "JPG"
    }`,
  ],
  256: [
    `http://localhost:8080${basePath}/images/nextImageExportOptimizer/chris-zhang-Jq8-3Bmh1pQ-unsplash-opt-256.${
      imagesWebP ? "WEBP" : "JPG"
    }`,
    `http://localhost:8080${basePath}/images/nextImageExportOptimizer/chris-zhang-Jq8-3Bmh1pQ-unsplash-opt-512.${
      imagesWebP ? "WEBP" : "JPG"
    }`,
  ],
  384: [
    `http://localhost:8080${basePath}/images/nextImageExportOptimizer/chris-zhang-Jq8-3Bmh1pQ-unsplash-opt-384.${
      imagesWebP ? "WEBP" : "JPG"
    }`,
    `http://localhost:8080${basePath}/images/nextImageExportOptimizer/chris-zhang-Jq8-3Bmh1pQ-unsplash-opt-768.${
      imagesWebP ? "WEBP" : "JPG"
    }`,
  ],
};

for (let index = 0; index < widths.length; index++) {
  const width = widths[index];

  test.describe(`Test fixed width: ${width}`, () => {
    test.use({
      viewport: { width: 1024, height: 1024 },
      deviceScaleFactor: 1,
    });
    test("should check the image size", async ({ page }) => {
      await page.goto(`${basePath}/fixedImage`, {
        waitUntil: "networkidle",
      });

      await page.click("text=Next-Image-Export-Optimizer");

      const img = await page.locator(`#test_image_${width}`);
      await img.click();
      const testWidth = width;

      const image = await getImageById(page, `test_image_${testWidth}`);

      expect(
        correctSrc[width.toString()].includes(image.currentSrc)
      ).toBeTruthy();
      const image_future = await getImageById(
        page,
        `test_image_${testWidth}_future`
      );

      expect(
        correctSrc[width.toString()].includes(image_future.currentSrc)
      ).toBeTruthy();

      // check the number of images on the page
      const images = await page.$$("img");
      expect(images.length).toBe(24);
    });
  });
}
