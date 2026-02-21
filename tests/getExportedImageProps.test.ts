import { describe, test, expect } from "vitest";
import { getExportedImageProps } from "../src/ExportedImage";
import mock from "./support/mock";

describe("getExportedImageProps", () => {
  describe("development mode", () => {
    test("returns Next.js image optimization endpoint for string src", () => {
      mock(process.env, "NODE_ENV", "development");

      const result = getExportedImageProps({ src: "/images/test.jpg" });

      expect(result.props.src).toContain("/_next/image?url=");
      expect(result.props.src).toContain(encodeURIComponent("/images/test.jpg"));
      expect(result.props.srcSet).toContain("/_next/image?url=");
      expect(result.props.sizes).toBe("100vw");
    });

    test("adds leading slash to src if missing", () => {
      mock(process.env, "NODE_ENV", "development");

      const result = getExportedImageProps({ src: "images/test.jpg" });

      expect(result.props.src).toContain(encodeURIComponent("/images/test.jpg"));
    });

    test("includes width and height when provided", () => {
      mock(process.env, "NODE_ENV", "development");

      const result = getExportedImageProps({
        src: "/images/test.jpg",
        width: 800,
        height: 600,
      });

      expect(result.props.width).toBe(800);
      expect(result.props.height).toBe(600);
    });

    test("uses custom sizes when provided", () => {
      mock(process.env, "NODE_ENV", "development");

      const result = getExportedImageProps({
        src: "/images/test.jpg",
        sizes: "(max-width: 768px) 100vw, 50vw",
      });

      expect(result.props.sizes).toBe("(max-width: 768px) 100vw, 50vw");
    });

    test("extracts dimensions from static image", () => {
      mock(process.env, "NODE_ENV", "development");

      const result = getExportedImageProps({
        src: {
          src: "/_next/static/media/test.abc123.jpg",
          width: 1920,
          height: 1080,
        },
      });

      expect(result.props.width).toBe(1920);
      expect(result.props.height).toBe(1080);
    });

    test("generates srcSet with all default sizes", () => {
      mock(process.env, "NODE_ENV", "development");

      const result = getExportedImageProps({ src: "/images/test.jpg" });

      const defaultSizes = [16, 32, 48, 64, 96, 128, 256, 384, 640, 750, 828, 1080, 1200, 1920, 2048, 3840];

      for (const size of defaultSizes) {
        expect(result.props.srcSet).toContain(`w=${size}`);
        expect(result.props.srcSet).toContain(`${size}w`);
      }
    });
  });

  describe("production mode", () => {
    test("returns optimized image URL for string src", () => {
      mock(process.env, "NODE_ENV", "production");
      mock(process.env, "nextImageExportOptimizer_storePicturesInWEBP", "true", { ignoreExistence: true });
      mock(process.env, "nextImageExportOptimizer_outputFolderPath", "public/output", { ignoreExistence: true });
      mock(process.env, "nextImageExportOptimizer_imageFolderPath", "public/images", { ignoreExistence: true });

      const result = getExportedImageProps({ src: "/images/test.jpg" });

      expect(result.props.src).toContain("-opt-");
      expect(result.props.src).toContain("webp");
      expect(result.props.srcSet).toContain("-opt-");
    });

    test("generates optimized srcSet with all sizes", () => {
      mock(process.env, "NODE_ENV", "production");
      mock(process.env, "nextImageExportOptimizer_storePicturesInWEBP", "true", { ignoreExistence: true });
      mock(process.env, "nextImageExportOptimizer_outputFolderPath", "public/output", { ignoreExistence: true });
      mock(process.env, "nextImageExportOptimizer_imageFolderPath", "public/images", { ignoreExistence: true });

      const result = getExportedImageProps({ src: "/images/test.jpg" });

      const defaultSizes = [16, 32, 48, 64, 96, 128, 256, 384, 640, 750, 828, 1080, 1200, 1920, 2048, 3840];

      for (const size of defaultSizes) {
        expect(result.props.srcSet).toContain(`-opt-${size}.webp ${size}w`);
      }
    });

    test("limits srcSet sizes for static images based on original width", () => {
      mock(process.env, "NODE_ENV", "production");
      mock(process.env, "nextImageExportOptimizer_storePicturesInWEBP", "true", { ignoreExistence: true });
      mock(process.env, "nextImageExportOptimizer_outputFolderPath", "public/output", { ignoreExistence: true });

      const result = getExportedImageProps({
        src: {
          src: "/_next/static/media/test.abc123.jpg",
          width: 500,
          height: 300,
        },
      });

      expect(result.props.srcSet).not.toContain("-opt-750.");
      expect(result.props.srcSet).not.toContain("-opt-1080.");
      expect(result.props.srcSet).toContain("-opt-256.");
      expect(result.props.srcSet).toContain("-opt-384.");
    });

    test("handles remote images (http URLs)", () => {
      mock(process.env, "NODE_ENV", "production");
      mock(process.env, "nextImageExportOptimizer_storePicturesInWEBP", "true", { ignoreExistence: true });
      mock(process.env, "nextImageExportOptimizer_outputFolderPath", "public/output", { ignoreExistence: true });

      const result = getExportedImageProps({ src: "https://example.com/image.jpg" });

      expect(result.props.src).toContain("-opt-");
      expect(result.props.src).toContain("/remoteImages/");
    });

    test("uses basePath when provided", () => {
      mock(process.env, "NODE_ENV", "production");
      mock(process.env, "nextImageExportOptimizer_storePicturesInWEBP", "true", { ignoreExistence: true });
      mock(process.env, "nextImageExportOptimizer_outputFolderPath", "public/output", { ignoreExistence: true });
      mock(process.env, "nextImageExportOptimizer_imageFolderPath", "public/images", { ignoreExistence: true });

      const result = getExportedImageProps({
        src: "/images/test.jpg",
        basePath: "/subsite",
      });

      expect(result.props.src).toContain("/subsite/");
      expect(result.props.srcSet).toContain("/subsite/");
    });

    test("preserves original extension when storePicturesInWEBP is false", () => {
      mock(process.env, "NODE_ENV", "production");
      mock(process.env, "nextImageExportOptimizer_storePicturesInWEBP", "false", { ignoreExistence: true });
      mock(process.env, "nextImageExportOptimizer_outputFolderPath", "public/output", { ignoreExistence: true });
      mock(process.env, "nextImageExportOptimizer_imageFolderPath", "public/images", { ignoreExistence: true });

      const result = getExportedImageProps({ src: "/images/test.jpg" });

      expect(result.props.src).toContain(".jpg");
      expect(result.props.src).not.toContain(".webp");
    });

    test("prefixes URLs with cdnUrl when set", () => {
      mock(process.env, "NODE_ENV", "production");
      mock(process.env, "nextImageExportOptimizer_storePicturesInWEBP", "true", { ignoreExistence: true });
      mock(process.env, "nextImageExportOptimizer_outputFolderPath", "public/output", { ignoreExistence: true });
      mock(process.env, "nextImageExportOptimizer_imageFolderPath", "public/images", { ignoreExistence: true });
      mock(process.env, "nextImageExportOptimizer_cdnUrl", "https://cdn.example.com", { ignoreExistence: true });

      const result = getExportedImageProps({ src: "/images/test.jpg" });

      expect(result.props.src).toMatch(/^https:\/\/cdn\.example\.com\//);
      expect(result.props.srcSet).toContain("https://cdn.example.com/");
    });
  });

  describe("unoptimized mode", () => {
    test("uses Next.js image endpoint when unoptimized is true in production", () => {
      mock(process.env, "NODE_ENV", "production");

      const result = getExportedImageProps({
        src: "/images/test.jpg",
        unoptimized: true,
      });

      expect(result.props.src).toContain("/_next/image?url=");
      expect(result.props.srcSet).toContain("/_next/image?url=");
    });
  });

  describe("return structure", () => {
    test("returns correct shape", () => {
      mock(process.env, "NODE_ENV", "development");

      const result = getExportedImageProps({
        src: "/images/test.jpg",
        width: 800,
        height: 600,
        sizes: "50vw",
      });

      expect(result).toHaveProperty("props");
      expect(result.props).toHaveProperty("src");
      expect(result.props).toHaveProperty("srcSet");
      expect(result.props).toHaveProperty("sizes");
      expect(result.props.width).toBe(800);
      expect(result.props.height).toBe(600);
    });

    test("omits width/height when not provided", () => {
      mock(process.env, "NODE_ENV", "development");

      const result = getExportedImageProps({ src: "/images/test.jpg" });

      expect(result.props.width).toBeUndefined();
      expect(result.props.height).toBeUndefined();
    });

    test("defaults sizes to 100vw", () => {
      mock(process.env, "NODE_ENV", "development");

      const result = getExportedImageProps({ src: "/images/test.jpg" });

      expect(result.props.sizes).toBe("100vw");
    });
  });
});
