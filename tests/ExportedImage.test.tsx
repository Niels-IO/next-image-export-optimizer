import { describe, test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ExportedImage from "../src/ExportedImage";
import mock from "./support/mock";

describe("ExportedImage", () => {
  describe("development mode", () => {
    test("renders img with Next.js image optimization endpoint", () => {
      mock(process.env, "NODE_ENV", "development");

      render(<ExportedImage src="/images/test.jpg" alt="Test image" />);

      const img = screen.getByRole("img", { name: "Test image" });
      expect(img.getAttribute("src")).toContain("/_next/image?url=");
      expect(img.getAttribute("src")).toContain(encodeURIComponent("/images/test.jpg"));
    });

    test("generates srcset with default sizes", () => {
      mock(process.env, "NODE_ENV", "development");

      render(<ExportedImage src="/images/test.jpg" alt="Test image" />);

      const img = screen.getByRole("img");
      const srcset = img.getAttribute("srcset");
      expect(srcset).toContain("640w");
      expect(srcset).toContain("1920w");
    });
  });

  describe("production mode", () => {
    test("renders img with optimized image paths", () => {
      mock(process.env, "NODE_ENV", "production");
      mock(process.env, "nextImageExportOptimizer_storePicturesInWEBP", "true", { ignoreExistence: true });
      mock(process.env, "nextImageExportOptimizer_imageFolderPath", "public/images", { ignoreExistence: true });

      render(<ExportedImage src="/images/test.jpg" alt="Test image" />);

      const img = screen.getByRole("img");
      expect(img.getAttribute("src")).toContain("-opt-");
      expect(img.getAttribute("src")).toContain(".webp");
    });

    test("uses original extension when storePicturesInWEBP is false", () => {
      mock(process.env, "NODE_ENV", "production");
      mock(process.env, "nextImageExportOptimizer_storePicturesInWEBP", "false", { ignoreExistence: true });
      mock(process.env, "nextImageExportOptimizer_imageFolderPath", "public/images", { ignoreExistence: true });

      render(<ExportedImage src="/images/test.jpg" alt="Test image" />);

      const img = screen.getByRole("img");
      expect(img.getAttribute("src")).toContain(".jpg");
      expect(img.getAttribute("src")).not.toContain(".webp");
    });

    test("prefixes with cdnUrl when set", () => {
      mock(process.env, "NODE_ENV", "production");
      mock(process.env, "nextImageExportOptimizer_storePicturesInWEBP", "true", { ignoreExistence: true });
      mock(process.env, "nextImageExportOptimizer_imageFolderPath", "public/images", { ignoreExistence: true });
      mock(process.env, "nextImageExportOptimizer_cdnUrl", "https://cdn.example.com", { ignoreExistence: true });

      render(<ExportedImage src="/images/test.jpg" alt="Test image" />);

      const img = screen.getByRole("img");
      expect(img.getAttribute("src")).toMatch(/^https:\/\/cdn\.example\.com\//);
    });
  });

  describe("img attributes", () => {
    test("sets width and height", () => {
      mock(process.env, "NODE_ENV", "development");

      render(<ExportedImage src="/images/test.jpg" alt="Test" width={800} height={600} />);

      const img = screen.getByRole("img");
      expect(img.getAttribute("width")).toBe("800");
      expect(img.getAttribute("height")).toBe("600");
    });

    test("sets loading=lazy by default", () => {
      mock(process.env, "NODE_ENV", "development");

      render(<ExportedImage src="/images/test.jpg" alt="Test" />);

      const img = screen.getByRole("img");
      expect(img.getAttribute("loading")).toBe("lazy");
    });

    test("sets loading=eager when priority is true", () => {
      mock(process.env, "NODE_ENV", "development");

      render(<ExportedImage src="/images/test.jpg" alt="Test" priority />);

      const img = screen.getByRole("img");
      expect(img.getAttribute("loading")).toBe("eager");
    });

    test("sets decoding=async", () => {
      mock(process.env, "NODE_ENV", "development");

      render(<ExportedImage src="/images/test.jpg" alt="Test" />);

      const img = screen.getByRole("img");
      expect(img.getAttribute("decoding")).toBe("async");
    });

    test("applies className", () => {
      mock(process.env, "NODE_ENV", "development");

      render(<ExportedImage src="/images/test.jpg" alt="Test" className="my-image" />);

      const img = screen.getByRole("img");
      expect(img.className).toBe("my-image");
    });

    test("passes sizes attribute", () => {
      mock(process.env, "NODE_ENV", "development");

      render(<ExportedImage src="/images/test.jpg" alt="Test" sizes="(max-width: 768px) 100vw, 50vw" />);

      const img = screen.getByRole("img");
      expect(img.getAttribute("sizes")).toBe("(max-width: 768px) 100vw, 50vw");
    });
  });

  describe("fill prop", () => {
    test("applies fill styles", () => {
      mock(process.env, "NODE_ENV", "development");

      render(<ExportedImage src="/images/test.jpg" alt="Test" fill />);

      const img = screen.getByRole("img");
      expect(img.style.position).toBe("absolute");
      expect(img.style.width).toBe("100%");
      expect(img.style.height).toBe("100%");
    });

    test("omits width/height when fill is true", () => {
      mock(process.env, "NODE_ENV", "development");

      render(<ExportedImage src="/images/test.jpg" alt="Test" fill width={800} height={600} />);

      const img = screen.getByRole("img");
      expect(img.getAttribute("width")).toBeNull();
      expect(img.getAttribute("height")).toBeNull();
    });
  });

  describe("static image import", () => {
    test("handles static image object", () => {
      mock(process.env, "NODE_ENV", "production");
      mock(process.env, "nextImageExportOptimizer_storePicturesInWEBP", "true", { ignoreExistence: true });

      const staticImage = {
        src: "/_next/static/media/test.abc123.jpg",
        width: 1920,
        height: 1080,
      };

      render(<ExportedImage src={staticImage} alt="Test" />);

      const img = screen.getByRole("img");
      expect(img.getAttribute("src")).toContain("-opt-");
    });
  });
});
