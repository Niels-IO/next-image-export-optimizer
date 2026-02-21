import { describe, test, expect } from "vitest";
import path from "path";
import fs from "fs";

// These utils use module.exports (CommonJS)
import urlToFilename from "../src/utils/urlToFilename";
import getHash from "../src/utils/getHash";
import getAllFilesAsObject from "../src/utils/getAllFilesAsObject";

describe("urlToFilename", () => {
  test("converts URL to hashed filename with extension", () => {
    const result = urlToFilename("https://example.com/image.jpg");

    expect(result).toMatch(/^\d+\.jpg$/);
  });

  test("preserves different extensions", () => {
    expect(urlToFilename("https://example.com/image.png")).toMatch(/\.png$/);
    expect(urlToFilename("https://example.com/image.webp")).toMatch(/\.webp$/);
    expect(urlToFilename("https://example.com/image.gif")).toMatch(/\.gif$/);
  });

  test("generates consistent hash for same URL", () => {
    const url = "https://example.com/test-image.jpg";
    const result1 = urlToFilename(url);
    const result2 = urlToFilename(url);

    expect(result1).toBe(result2);
  });

  test("generates different hashes for different URLs", () => {
    const result1 = urlToFilename("https://example.com/image1.jpg");
    const result2 = urlToFilename("https://example.com/image2.jpg");

    expect(result1).not.toBe(result2);
  });

  test("handles URLs with query parameters", () => {
    const result = urlToFilename("https://example.com/image.jpg?width=100&quality=80");

    expect(result).toMatch(/^\d+\.jpg$/);
  });

  test("handles URLs with paths", () => {
    const result = urlToFilename("https://example.com/path/to/image.jpg");

    expect(result).toMatch(/^\d+\.jpg$/);
  });
});

describe("getHash", () => {
  test("generates hash from array of strings", () => {
    const result = getHash(["item1", "item2", "item3"]);

    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
  });

  test("generates consistent hash for same input", () => {
    const items = ["test", "123", "abc"];
    const result1 = getHash(items);
    const result2 = getHash(items);

    expect(result1).toBe(result2);
  });

  test("generates different hash for different input", () => {
    const result1 = getHash(["a", "b", "c"]);
    const result2 = getHash(["x", "y", "z"]);

    expect(result1).not.toBe(result2);
  });

  test("handles numbers in array", () => {
    const result = getHash(["test", "100", "200"]);

    expect(typeof result).toBe("string");
  });

  test("replaces slashes in base64 output", () => {
    const result = getHash(["test-string-for-hash"]);

    expect(result).not.toContain("/");
  });
});

describe("getAllFilesAsObject", () => {
  test("returns empty array for non-existent directory", () => {
    const result = getAllFilesAsObject(
      "/non/existent/path",
      "/non/existent/path",
      "output"
    );

    expect(result).toEqual([]);
  });

  test("returns array of image objects", () => {
    const tempDir = path.join("/tmp", `test-${Date.now()}-1`);
    fs.mkdirSync(tempDir, { recursive: true });
    fs.writeFileSync(path.join(tempDir, "test.jpg"), "");

    try {
      const result = getAllFilesAsObject(tempDir, tempDir, "output");

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(1);
      expect(result[0]).toHaveProperty("basePath");
      expect(result[0]).toHaveProperty("file");
      expect(result[0].file).toBe("test.jpg");
    } finally {
      fs.rmSync(tempDir, { recursive: true });
    }
  });

  test("recursively finds files in subdirectories", () => {
    const tempDir = path.join("/tmp", `test-${Date.now()}-2`);
    const subDir = path.join(tempDir, "subdir");
    fs.mkdirSync(subDir, { recursive: true });
    fs.writeFileSync(path.join(tempDir, "root.jpg"), "");
    fs.writeFileSync(path.join(subDir, "nested.jpg"), "");

    try {
      const result = getAllFilesAsObject(tempDir, tempDir, "output");

      expect(result.length).toBe(2);
      const files = result.map((r: { file: string }) => r.file);
      expect(files).toContain("root.jpg");
      expect(files).toContain("nested.jpg");
    } finally {
      fs.rmSync(tempDir, { recursive: true });
    }
  });

  test("excludes nextImageExportOptimizer folder", () => {
    const tempDir = path.join("/tmp", `test-${Date.now()}-3`);
    const excludedDir = path.join(tempDir, "nextImageExportOptimizer");
    fs.mkdirSync(excludedDir, { recursive: true });
    fs.writeFileSync(path.join(tempDir, "keep.jpg"), "");
    fs.writeFileSync(path.join(excludedDir, "exclude.jpg"), "");

    try {
      const result = getAllFilesAsObject(tempDir, tempDir, "output");

      expect(result.length).toBe(1);
      expect(result[0].file).toBe("keep.jpg");
    } finally {
      fs.rmSync(tempDir, { recursive: true });
    }
  });

  test("includes dirPathWithoutBasePath for subdirectories", () => {
    const tempDir = path.join("/tmp", `test-${Date.now()}-4`);
    const subDir = path.join(tempDir, "articles", "hero");
    fs.mkdirSync(subDir, { recursive: true });
    fs.writeFileSync(path.join(subDir, "image.jpg"), "");

    try {
      const result = getAllFilesAsObject(tempDir, tempDir, "output");

      expect(result.length).toBe(1);
      expect(result[0].dirPathWithoutBasePath).toContain("articles");
      expect(result[0].dirPathWithoutBasePath).toContain("hero");
    } finally {
      fs.rmSync(tempDir, { recursive: true });
    }
  });
});
