const assert = require("assert");
const fs = require("fs");
const execSync = require("child_process").execSync;

test("Optimize images", async () => {
  const folderNameForImages = "example/public/images/nextImageExportOptimizer";
  if (fs.existsSync(folderNameForImages)) {
    fs.rmSync(folderNameForImages, {
      recursive: true,
      force: false,
    });
  }
  assert(!fs.existsSync(folderNameForImages));
  const folderNameForImagesInBuildFolder =
    "example/out/images/nextImageExportOptimizer";
  if (fs.existsSync(folderNameForImagesInBuildFolder)) {
    fs.rmSync(folderNameForImagesInBuildFolder, {
      recursive: true,
      force: false,
    });
  }
  assert(!fs.existsSync(folderNameForImagesInBuildFolder));
  await execSync("cd example/ && node ../src/optimizeImages.js");

  const allFilesInImageFolder = fs.readdirSync(
    "example/public/images/nextImageExportOptimizer"
  );
  const allImagesInImageFolder = allFilesInImageFolder.filter((file) => {
    let extension = file.split(".").pop().toUpperCase();
    // Stop if the file is not an image
    return ["JPG", "JPEG", "WEBP", "PNG", "AVIF"].includes(extension);
  });
  expect(allImagesInImageFolder).toMatchInlineSnapshot(`
Array [
  "chris-zhang-Jq8-3Bmh1pQ-unsplash-opt-1080.WEBP",
  "chris-zhang-Jq8-3Bmh1pQ-unsplash-opt-1200.WEBP",
  "chris-zhang-Jq8-3Bmh1pQ-unsplash-opt-128.WEBP",
  "chris-zhang-Jq8-3Bmh1pQ-unsplash-opt-16.WEBP",
  "chris-zhang-Jq8-3Bmh1pQ-unsplash-opt-1920.WEBP",
  "chris-zhang-Jq8-3Bmh1pQ-unsplash-opt-2048.WEBP",
  "chris-zhang-Jq8-3Bmh1pQ-unsplash-opt-256.WEBP",
  "chris-zhang-Jq8-3Bmh1pQ-unsplash-opt-32.WEBP",
  "chris-zhang-Jq8-3Bmh1pQ-unsplash-opt-384.WEBP",
  "chris-zhang-Jq8-3Bmh1pQ-unsplash-opt-3840.WEBP",
  "chris-zhang-Jq8-3Bmh1pQ-unsplash-opt-48.WEBP",
  "chris-zhang-Jq8-3Bmh1pQ-unsplash-opt-64.WEBP",
  "chris-zhang-Jq8-3Bmh1pQ-unsplash-opt-640.WEBP",
  "chris-zhang-Jq8-3Bmh1pQ-unsplash-opt-750.WEBP",
  "chris-zhang-Jq8-3Bmh1pQ-unsplash-opt-828.WEBP",
  "chris-zhang-Jq8-3Bmh1pQ-unsplash-opt-96.WEBP",
]
`);
  const allFilesInImageBuildFolder = fs.readdirSync(
    "example/out/images/nextImageExportOptimizer"
  );
  expect(allFilesInImageBuildFolder).toMatchInlineSnapshot(`
Array [
  "chris-zhang-Jq8-3Bmh1pQ-unsplash-opt-1080.WEBP",
  "chris-zhang-Jq8-3Bmh1pQ-unsplash-opt-1200.WEBP",
  "chris-zhang-Jq8-3Bmh1pQ-unsplash-opt-128.WEBP",
  "chris-zhang-Jq8-3Bmh1pQ-unsplash-opt-16.WEBP",
  "chris-zhang-Jq8-3Bmh1pQ-unsplash-opt-1920.WEBP",
  "chris-zhang-Jq8-3Bmh1pQ-unsplash-opt-2048.WEBP",
  "chris-zhang-Jq8-3Bmh1pQ-unsplash-opt-256.WEBP",
  "chris-zhang-Jq8-3Bmh1pQ-unsplash-opt-32.WEBP",
  "chris-zhang-Jq8-3Bmh1pQ-unsplash-opt-384.WEBP",
  "chris-zhang-Jq8-3Bmh1pQ-unsplash-opt-3840.WEBP",
  "chris-zhang-Jq8-3Bmh1pQ-unsplash-opt-48.WEBP",
  "chris-zhang-Jq8-3Bmh1pQ-unsplash-opt-64.WEBP",
  "chris-zhang-Jq8-3Bmh1pQ-unsplash-opt-640.WEBP",
  "chris-zhang-Jq8-3Bmh1pQ-unsplash-opt-750.WEBP",
  "chris-zhang-Jq8-3Bmh1pQ-unsplash-opt-828.WEBP",
  "chris-zhang-Jq8-3Bmh1pQ-unsplash-opt-96.WEBP",
]
`);
  const imageFileStats = [];
  for (let index = 0; index < allImagesInImageFolder.length; index++) {
    const imageFile = allImagesInImageFolder[index];
    const stats = fs.statSync(
      `example/public/images/nextImageExportOptimizer/${imageFile}`
    );
    const fileSizeInBytes = stats.size;
    imageFileStats.push(fileSizeInBytes);
  }
  expect(imageFileStats).toMatchInlineSnapshot(`
Array [
  40418,
  45568,
  2352,
  136,
  85030,
  93140,
  5906,
  342,
  10304,
  219286,
  578,
  882,
  19842,
  25324,
  28758,
  1514,
]
`);
}, 30000);
