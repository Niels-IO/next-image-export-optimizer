import { describe, test, expect, beforeAll, afterAll } from "vitest";
import fs from "fs";
import path from "path";
import sharp from "sharp";
import { optimizeImages, OptimizeImagesConfig } from "../src/optimizeImages";
import { ImageObject } from "../src/utils/ImageObject";

const TEST_DIR = path.join("/tmp", `optimize-images-test-${Date.now()}`);
const INPUT_DIR = path.join(TEST_DIR, "public/images");
const OUTPUT_DIR = path.join(TEST_DIR, "public/export");
const EXPORT_DIR = path.join(TEST_DIR, "out");

async function createTestImage(filepath: string, width: number, height: number) {
  fs.mkdirSync(path.dirname(filepath), { recursive: true });
  await sharp({
    create: { width, height, channels: 3, background: { r: 255, g: 0, b: 0 } },
  }).jpeg().toFile(filepath);
}

function getConfig(overrides: Partial<OptimizeImagesConfig> = {}): OptimizeImagesConfig {
  return {
    imageFolderPath: INPUT_DIR,
    staticImageFolderPath: path.join(TEST_DIR, ".next/static/media"),
    exportFolderPath: EXPORT_DIR,
    deviceSizes: [640, 1080, 1920],
    imageSizes: [16, 32, 64],
    quality: 75,
    storePicturesInWEBP: true,
    exportFolderName: OUTPUT_DIR,
    remoteImagesFolderName: "remoteImages",
    basePath: TEST_DIR,
    ...overrides,
  };
}

describe("optimizeImages", () => {
  beforeAll(async () => {
    fs.mkdirSync(INPUT_DIR, { recursive: true });
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    fs.mkdirSync(EXPORT_DIR, { recursive: true });
  });

  afterAll(() => {
    fs.rmSync(TEST_DIR, { recursive: true });
  });

  test("generates optimized images at configured sizes", async () => {
    await createTestImage(path.join(INPUT_DIR, "test.jpg"), 2000, 1500);

    const images: ImageObject[] = [
      { basePath: INPUT_DIR, dirPathWithoutBasePath: "", file: "test.jpg" },
    ];

    const result = await optimizeImages(images, getConfig());

    const sizes = [16, 32, 64, 640, 1080, 1920];
    for (const size of sizes) {
      const optimizedPath = path.join(OUTPUT_DIR, `test-opt-${size}.webp`);
      expect(fs.existsSync(optimizedPath), `Missing test-opt-${size}.webp`).toBe(true);
    }

    expect(result.generatedImages.length).toBe(sizes.length);
  });

  test("converts images to WebP format", async () => {
    await createTestImage(path.join(INPUT_DIR, "webp-test.jpg"), 1000, 800);

    const images: ImageObject[] = [
      { basePath: INPUT_DIR, dirPathWithoutBasePath: "", file: "webp-test.jpg" },
    ];

    await optimizeImages(images, getConfig());

    const optimizedPath = path.join(OUTPUT_DIR, "webp-test-opt-640.webp");
    const metadata = await sharp(optimizedPath).metadata();
    expect(metadata.format).toBe("webp");
  });

  test("preserves original format when storePicturesInWEBP is false", async () => {
    await createTestImage(path.join(INPUT_DIR, "preserve-test.jpg"), 1000, 800);

    const images: ImageObject[] = [
      { basePath: INPUT_DIR, dirPathWithoutBasePath: "", file: "preserve-test.jpg" },
    ];

    await optimizeImages(images, getConfig({ storePicturesInWEBP: false }));

    const optimizedPath = path.join(OUTPUT_DIR, "preserve-test-opt-640.jpg");
    expect(fs.existsSync(optimizedPath)).toBe(true);
    const metadata = await sharp(optimizedPath).metadata();
    expect(metadata.format).toBe("jpeg");
  });

  test("resizes images correctly", async () => {
    await createTestImage(path.join(INPUT_DIR, "resize-test.jpg"), 2000, 1500);

    const images: ImageObject[] = [
      { basePath: INPUT_DIR, dirPathWithoutBasePath: "", file: "resize-test.jpg" },
    ];

    await optimizeImages(images, getConfig());

    const optimizedPath = path.join(OUTPUT_DIR, "resize-test-opt-640.webp");
    const metadata = await sharp(optimizedPath).metadata();
    expect(metadata.width).toBe(640);
  });

  test("does not upscale smaller images", async () => {
    await createTestImage(path.join(INPUT_DIR, "small-test.jpg"), 500, 400);

    const images: ImageObject[] = [
      { basePath: INPUT_DIR, dirPathWithoutBasePath: "", file: "small-test.jpg" },
    ];

    await optimizeImages(images, getConfig());

    const optimizedPath = path.join(OUTPUT_DIR, "small-test-opt-1920.webp");
    const metadata = await sharp(optimizedPath).metadata();
    expect(metadata.width).toBe(500); // unchanged, not upscaled
  });

  test("copies optimized images to export folder", async () => {
    await createTestImage(path.join(INPUT_DIR, "copy-test.jpg"), 1000, 800);

    const images: ImageObject[] = [
      { basePath: INPUT_DIR, dirPathWithoutBasePath: "", file: "copy-test.jpg" },
    ];

    await optimizeImages(images, getConfig());

    const exportedPath = path.join(EXPORT_DIR, "export/copy-test-opt-640.webp");
    expect(fs.existsSync(exportedPath)).toBe(true);
  });

  test("preserves subdirectory structure", async () => {
    const subdir = "articles/hero";
    fs.mkdirSync(path.join(INPUT_DIR, subdir), { recursive: true });
    await createTestImage(path.join(INPUT_DIR, subdir, "subdir-test.jpg"), 1000, 800);

    const images: ImageObject[] = [
      { basePath: INPUT_DIR, dirPathWithoutBasePath: subdir, file: "subdir-test.jpg" },
    ];

    await optimizeImages(images, getConfig());

    const optimizedPath = path.join(OUTPUT_DIR, subdir, "subdir-test-opt-640.webp");
    expect(fs.existsSync(optimizedPath)).toBe(true);
  });

  test("uses -opt-{width} naming pattern", async () => {
    await createTestImage(path.join(INPUT_DIR, "naming-test.jpg"), 1000, 800);

    const images: ImageObject[] = [
      { basePath: INPUT_DIR, dirPathWithoutBasePath: "", file: "naming-test.jpg" },
    ];

    const result = await optimizeImages(images, getConfig());

    const sizes = [16, 32, 64, 640, 1080, 1920];
    for (const size of sizes) {
      expect(result.generatedImages.some(p => p.endsWith(`naming-test-opt-${size}.webp`))).toBe(true);
    }
  });

  test("returns total size in MB", async () => {
    await createTestImage(path.join(INPUT_DIR, "size-test.jpg"), 1000, 800);

    const images: ImageObject[] = [
      { basePath: INPUT_DIR, dirPathWithoutBasePath: "", file: "size-test.jpg" },
    ];

    const result = await optimizeImages(images, getConfig());

    expect(result.sizeInMB).toBeGreaterThan(0);
  });

  test("filters non-image files", async () => {
    fs.writeFileSync(path.join(INPUT_DIR, "not-an-image.txt"), "hello");

    const images: ImageObject[] = [
      { basePath: INPUT_DIR, dirPathWithoutBasePath: "", file: "not-an-image.txt" },
    ];

    const result = await optimizeImages(images, getConfig());

    expect(result.generatedImages.length).toBe(0);
  });
});
