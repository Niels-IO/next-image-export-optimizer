/* eslint-disable no-undef */
const assert = require("assert");
const fs = require("fs");
const execSync = require("child_process").execSync;
const sharp = require("sharp");

const deleteFolder = (folderName) => {
  if (fs.existsSync(folderName)) {
    fs.rmSync(folderName, {
      recursive: true,
      force: false,
    });
  }
  assert(!fs.existsSync(folderName));
};

const filterForImages = (file) => {
  let extension = file.split(".").pop().toUpperCase();
  // Stop if the file is not an image
  return ["JPG", "JPEG", "WEBP", "PNG", "AVIF"].includes(extension);
};

const legacyConfig = `module.exports = {
  images: {
    loader: "custom",
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    nextImageExportOptimizer: {
      imageFolderPath: "public/images",
      exportFolderPath: "out",
      quality: 75,
    }
  },
  env: {
    storePicturesInWEBP: true,
    generateAndUseBlurImages: true,
  },
};
`;
const newConfig = `module.exports = {
  images: {
    loader: "custom",
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  },
  env: {
    nextImageExportOptimizer_imageFolderPath: "public/images",
    nextImageExportOptimizer_exportFolderPath: "out",
    nextImageExportOptimizer_quality: 75,
    nextImageExportOptimizer_storePicturesInWEBP: true,
    nextImageExportOptimizer_generateAndUseBlurImages: true,
  },
};
`;
const newConfigJpeg = `module.exports = {
  images: {
    loader: "custom",
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  },
  env: {
    nextImageExportOptimizer_imageFolderPath: "public/images",
    nextImageExportOptimizer_exportFolderPath: "out",
    nextImageExportOptimizer_quality: 75,
    nextImageExportOptimizer_storePicturesInWEBP: false,
    nextImageExportOptimizer_generateAndUseBlurImages: true,
  },
};
`;

async function testConfig(config) {
  deleteFolder("example/public/images/nextImageExportOptimizer");
  deleteFolder("example/public/images/subfolder/nextImageExportOptimizer");
  deleteFolder(
    "example/public/images/subfolder/subfolder2/nextImageExportOptimizer"
  );
  // write config file for the to be tested configuration variables to the folder
  fs.writeFileSync("example/next.config.js", config);

  deleteFolder("example/out/images/nextImageExportOptimizer");
  deleteFolder("example/out/images/subfolder/nextImageExportOptimizer");
  deleteFolder(
    "example/out/images/subfolder/subfolder2/nextImageExportOptimizer"
  );

  await execSync("cd example/ && node ../src/optimizeImages.js");

  const allFilesInImageFolder = fs.readdirSync(
    "example/public/images/nextImageExportOptimizer"
  );
  const allImagesInImageFolder = allFilesInImageFolder.filter(filterForImages);

  const allFilesInImageSubFolder = fs.readdirSync(
    "example/public/images/subfolder/nextImageExportOptimizer"
  );
  const allImagesInImageSubFolder =
    allFilesInImageSubFolder.filter(filterForImages);

  const allFilesInImageBuildFolder = fs.readdirSync(
    "example/out/images/nextImageExportOptimizer"
  );

  const allFilesInImageBuildSubFolder = fs.readdirSync(
    "example/out/images/subfolder/nextImageExportOptimizer"
  );
  if (config === newConfig || config === legacyConfig) {
    expect(allImagesInImageFolder).toMatchInlineSnapshot(`
[
  "chris-zhang-Jq8-3Bmh1pQ-unsplash-opt-10.WEBP",
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
  "chris-zhang-Jq8-3Bmh1pQ-unsplash_static.921260e0-opt-10.WEBP",
  "chris-zhang-Jq8-3Bmh1pQ-unsplash_static.921260e0-opt-1080.WEBP",
  "chris-zhang-Jq8-3Bmh1pQ-unsplash_static.921260e0-opt-1200.WEBP",
  "chris-zhang-Jq8-3Bmh1pQ-unsplash_static.921260e0-opt-128.WEBP",
  "chris-zhang-Jq8-3Bmh1pQ-unsplash_static.921260e0-opt-16.WEBP",
  "chris-zhang-Jq8-3Bmh1pQ-unsplash_static.921260e0-opt-1920.WEBP",
  "chris-zhang-Jq8-3Bmh1pQ-unsplash_static.921260e0-opt-2048.WEBP",
  "chris-zhang-Jq8-3Bmh1pQ-unsplash_static.921260e0-opt-256.WEBP",
  "chris-zhang-Jq8-3Bmh1pQ-unsplash_static.921260e0-opt-32.WEBP",
  "chris-zhang-Jq8-3Bmh1pQ-unsplash_static.921260e0-opt-384.WEBP",
  "chris-zhang-Jq8-3Bmh1pQ-unsplash_static.921260e0-opt-3840.WEBP",
  "chris-zhang-Jq8-3Bmh1pQ-unsplash_static.921260e0-opt-48.WEBP",
  "chris-zhang-Jq8-3Bmh1pQ-unsplash_static.921260e0-opt-64.WEBP",
  "chris-zhang-Jq8-3Bmh1pQ-unsplash_static.921260e0-opt-640.WEBP",
  "chris-zhang-Jq8-3Bmh1pQ-unsplash_static.921260e0-opt-750.WEBP",
  "chris-zhang-Jq8-3Bmh1pQ-unsplash_static.921260e0-opt-828.WEBP",
  "chris-zhang-Jq8-3Bmh1pQ-unsplash_static.921260e0-opt-96.WEBP",
]
`);
    expect(allImagesInImageSubFolder).toMatchInlineSnapshot(`
[
  "ollie-barker-jones-K52HVSPVvKI-unsplash-opt-10.WEBP",
  "ollie-barker-jones-K52HVSPVvKI-unsplash-opt-1080.WEBP",
  "ollie-barker-jones-K52HVSPVvKI-unsplash-opt-1200.WEBP",
  "ollie-barker-jones-K52HVSPVvKI-unsplash-opt-128.WEBP",
  "ollie-barker-jones-K52HVSPVvKI-unsplash-opt-16.WEBP",
  "ollie-barker-jones-K52HVSPVvKI-unsplash-opt-1920.WEBP",
  "ollie-barker-jones-K52HVSPVvKI-unsplash-opt-2048.WEBP",
  "ollie-barker-jones-K52HVSPVvKI-unsplash-opt-256.WEBP",
  "ollie-barker-jones-K52HVSPVvKI-unsplash-opt-32.WEBP",
  "ollie-barker-jones-K52HVSPVvKI-unsplash-opt-384.WEBP",
  "ollie-barker-jones-K52HVSPVvKI-unsplash-opt-3840.WEBP",
  "ollie-barker-jones-K52HVSPVvKI-unsplash-opt-48.WEBP",
  "ollie-barker-jones-K52HVSPVvKI-unsplash-opt-64.WEBP",
  "ollie-barker-jones-K52HVSPVvKI-unsplash-opt-640.WEBP",
  "ollie-barker-jones-K52HVSPVvKI-unsplash-opt-750.WEBP",
  "ollie-barker-jones-K52HVSPVvKI-unsplash-opt-828.WEBP",
  "ollie-barker-jones-K52HVSPVvKI-unsplash-opt-96.WEBP",
]
`);
    expect(allFilesInImageBuildFolder).toMatchInlineSnapshot(`
[
  "chris-zhang-Jq8-3Bmh1pQ-unsplash-opt-10.WEBP",
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
  "chris-zhang-Jq8-3Bmh1pQ-unsplash_static.921260e0-opt-10.WEBP",
  "chris-zhang-Jq8-3Bmh1pQ-unsplash_static.921260e0-opt-1080.WEBP",
  "chris-zhang-Jq8-3Bmh1pQ-unsplash_static.921260e0-opt-1200.WEBP",
  "chris-zhang-Jq8-3Bmh1pQ-unsplash_static.921260e0-opt-128.WEBP",
  "chris-zhang-Jq8-3Bmh1pQ-unsplash_static.921260e0-opt-16.WEBP",
  "chris-zhang-Jq8-3Bmh1pQ-unsplash_static.921260e0-opt-1920.WEBP",
  "chris-zhang-Jq8-3Bmh1pQ-unsplash_static.921260e0-opt-2048.WEBP",
  "chris-zhang-Jq8-3Bmh1pQ-unsplash_static.921260e0-opt-256.WEBP",
  "chris-zhang-Jq8-3Bmh1pQ-unsplash_static.921260e0-opt-32.WEBP",
  "chris-zhang-Jq8-3Bmh1pQ-unsplash_static.921260e0-opt-384.WEBP",
  "chris-zhang-Jq8-3Bmh1pQ-unsplash_static.921260e0-opt-3840.WEBP",
  "chris-zhang-Jq8-3Bmh1pQ-unsplash_static.921260e0-opt-48.WEBP",
  "chris-zhang-Jq8-3Bmh1pQ-unsplash_static.921260e0-opt-64.WEBP",
  "chris-zhang-Jq8-3Bmh1pQ-unsplash_static.921260e0-opt-640.WEBP",
  "chris-zhang-Jq8-3Bmh1pQ-unsplash_static.921260e0-opt-750.WEBP",
  "chris-zhang-Jq8-3Bmh1pQ-unsplash_static.921260e0-opt-828.WEBP",
  "chris-zhang-Jq8-3Bmh1pQ-unsplash_static.921260e0-opt-96.WEBP",
]
`);
    expect(allFilesInImageBuildSubFolder).toMatchInlineSnapshot(`
[
  "ollie-barker-jones-K52HVSPVvKI-unsplash-opt-10.WEBP",
  "ollie-barker-jones-K52HVSPVvKI-unsplash-opt-1080.WEBP",
  "ollie-barker-jones-K52HVSPVvKI-unsplash-opt-1200.WEBP",
  "ollie-barker-jones-K52HVSPVvKI-unsplash-opt-128.WEBP",
  "ollie-barker-jones-K52HVSPVvKI-unsplash-opt-16.WEBP",
  "ollie-barker-jones-K52HVSPVvKI-unsplash-opt-1920.WEBP",
  "ollie-barker-jones-K52HVSPVvKI-unsplash-opt-2048.WEBP",
  "ollie-barker-jones-K52HVSPVvKI-unsplash-opt-256.WEBP",
  "ollie-barker-jones-K52HVSPVvKI-unsplash-opt-32.WEBP",
  "ollie-barker-jones-K52HVSPVvKI-unsplash-opt-384.WEBP",
  "ollie-barker-jones-K52HVSPVvKI-unsplash-opt-3840.WEBP",
  "ollie-barker-jones-K52HVSPVvKI-unsplash-opt-48.WEBP",
  "ollie-barker-jones-K52HVSPVvKI-unsplash-opt-64.WEBP",
  "ollie-barker-jones-K52HVSPVvKI-unsplash-opt-640.WEBP",
  "ollie-barker-jones-K52HVSPVvKI-unsplash-opt-750.WEBP",
  "ollie-barker-jones-K52HVSPVvKI-unsplash-opt-828.WEBP",
  "ollie-barker-jones-K52HVSPVvKI-unsplash-opt-96.WEBP",
]
`);
  } else {
    expect(allImagesInImageFolder).toMatchInlineSnapshot(`
[
  "chris-zhang-Jq8-3Bmh1pQ-unsplash-opt-10.JPG",
  "chris-zhang-Jq8-3Bmh1pQ-unsplash-opt-1080.JPG",
  "chris-zhang-Jq8-3Bmh1pQ-unsplash-opt-1200.JPG",
  "chris-zhang-Jq8-3Bmh1pQ-unsplash-opt-128.JPG",
  "chris-zhang-Jq8-3Bmh1pQ-unsplash-opt-16.JPG",
  "chris-zhang-Jq8-3Bmh1pQ-unsplash-opt-1920.JPG",
  "chris-zhang-Jq8-3Bmh1pQ-unsplash-opt-2048.JPG",
  "chris-zhang-Jq8-3Bmh1pQ-unsplash-opt-256.JPG",
  "chris-zhang-Jq8-3Bmh1pQ-unsplash-opt-32.JPG",
  "chris-zhang-Jq8-3Bmh1pQ-unsplash-opt-384.JPG",
  "chris-zhang-Jq8-3Bmh1pQ-unsplash-opt-3840.JPG",
  "chris-zhang-Jq8-3Bmh1pQ-unsplash-opt-48.JPG",
  "chris-zhang-Jq8-3Bmh1pQ-unsplash-opt-64.JPG",
  "chris-zhang-Jq8-3Bmh1pQ-unsplash-opt-640.JPG",
  "chris-zhang-Jq8-3Bmh1pQ-unsplash-opt-750.JPG",
  "chris-zhang-Jq8-3Bmh1pQ-unsplash-opt-828.JPG",
  "chris-zhang-Jq8-3Bmh1pQ-unsplash-opt-96.JPG",
  "chris-zhang-Jq8-3Bmh1pQ-unsplash_static.921260e0-opt-10.JPG",
  "chris-zhang-Jq8-3Bmh1pQ-unsplash_static.921260e0-opt-1080.JPG",
  "chris-zhang-Jq8-3Bmh1pQ-unsplash_static.921260e0-opt-1200.JPG",
  "chris-zhang-Jq8-3Bmh1pQ-unsplash_static.921260e0-opt-128.JPG",
  "chris-zhang-Jq8-3Bmh1pQ-unsplash_static.921260e0-opt-16.JPG",
  "chris-zhang-Jq8-3Bmh1pQ-unsplash_static.921260e0-opt-1920.JPG",
  "chris-zhang-Jq8-3Bmh1pQ-unsplash_static.921260e0-opt-2048.JPG",
  "chris-zhang-Jq8-3Bmh1pQ-unsplash_static.921260e0-opt-256.JPG",
  "chris-zhang-Jq8-3Bmh1pQ-unsplash_static.921260e0-opt-32.JPG",
  "chris-zhang-Jq8-3Bmh1pQ-unsplash_static.921260e0-opt-384.JPG",
  "chris-zhang-Jq8-3Bmh1pQ-unsplash_static.921260e0-opt-3840.JPG",
  "chris-zhang-Jq8-3Bmh1pQ-unsplash_static.921260e0-opt-48.JPG",
  "chris-zhang-Jq8-3Bmh1pQ-unsplash_static.921260e0-opt-64.JPG",
  "chris-zhang-Jq8-3Bmh1pQ-unsplash_static.921260e0-opt-640.JPG",
  "chris-zhang-Jq8-3Bmh1pQ-unsplash_static.921260e0-opt-750.JPG",
  "chris-zhang-Jq8-3Bmh1pQ-unsplash_static.921260e0-opt-828.JPG",
  "chris-zhang-Jq8-3Bmh1pQ-unsplash_static.921260e0-opt-96.JPG",
]
`);
    expect(allImagesInImageSubFolder).toMatchInlineSnapshot(`
[
  "ollie-barker-jones-K52HVSPVvKI-unsplash-opt-10.JPG",
  "ollie-barker-jones-K52HVSPVvKI-unsplash-opt-1080.JPG",
  "ollie-barker-jones-K52HVSPVvKI-unsplash-opt-1200.JPG",
  "ollie-barker-jones-K52HVSPVvKI-unsplash-opt-128.JPG",
  "ollie-barker-jones-K52HVSPVvKI-unsplash-opt-16.JPG",
  "ollie-barker-jones-K52HVSPVvKI-unsplash-opt-1920.JPG",
  "ollie-barker-jones-K52HVSPVvKI-unsplash-opt-2048.JPG",
  "ollie-barker-jones-K52HVSPVvKI-unsplash-opt-256.JPG",
  "ollie-barker-jones-K52HVSPVvKI-unsplash-opt-32.JPG",
  "ollie-barker-jones-K52HVSPVvKI-unsplash-opt-384.JPG",
  "ollie-barker-jones-K52HVSPVvKI-unsplash-opt-3840.JPG",
  "ollie-barker-jones-K52HVSPVvKI-unsplash-opt-48.JPG",
  "ollie-barker-jones-K52HVSPVvKI-unsplash-opt-64.JPG",
  "ollie-barker-jones-K52HVSPVvKI-unsplash-opt-640.JPG",
  "ollie-barker-jones-K52HVSPVvKI-unsplash-opt-750.JPG",
  "ollie-barker-jones-K52HVSPVvKI-unsplash-opt-828.JPG",
  "ollie-barker-jones-K52HVSPVvKI-unsplash-opt-96.JPG",
]
`);
    expect(allFilesInImageBuildFolder).toMatchInlineSnapshot(`
[
  "chris-zhang-Jq8-3Bmh1pQ-unsplash-opt-10.JPG",
  "chris-zhang-Jq8-3Bmh1pQ-unsplash-opt-1080.JPG",
  "chris-zhang-Jq8-3Bmh1pQ-unsplash-opt-1200.JPG",
  "chris-zhang-Jq8-3Bmh1pQ-unsplash-opt-128.JPG",
  "chris-zhang-Jq8-3Bmh1pQ-unsplash-opt-16.JPG",
  "chris-zhang-Jq8-3Bmh1pQ-unsplash-opt-1920.JPG",
  "chris-zhang-Jq8-3Bmh1pQ-unsplash-opt-2048.JPG",
  "chris-zhang-Jq8-3Bmh1pQ-unsplash-opt-256.JPG",
  "chris-zhang-Jq8-3Bmh1pQ-unsplash-opt-32.JPG",
  "chris-zhang-Jq8-3Bmh1pQ-unsplash-opt-384.JPG",
  "chris-zhang-Jq8-3Bmh1pQ-unsplash-opt-3840.JPG",
  "chris-zhang-Jq8-3Bmh1pQ-unsplash-opt-48.JPG",
  "chris-zhang-Jq8-3Bmh1pQ-unsplash-opt-64.JPG",
  "chris-zhang-Jq8-3Bmh1pQ-unsplash-opt-640.JPG",
  "chris-zhang-Jq8-3Bmh1pQ-unsplash-opt-750.JPG",
  "chris-zhang-Jq8-3Bmh1pQ-unsplash-opt-828.JPG",
  "chris-zhang-Jq8-3Bmh1pQ-unsplash-opt-96.JPG",
  "chris-zhang-Jq8-3Bmh1pQ-unsplash_static.921260e0-opt-10.JPG",
  "chris-zhang-Jq8-3Bmh1pQ-unsplash_static.921260e0-opt-1080.JPG",
  "chris-zhang-Jq8-3Bmh1pQ-unsplash_static.921260e0-opt-1200.JPG",
  "chris-zhang-Jq8-3Bmh1pQ-unsplash_static.921260e0-opt-128.JPG",
  "chris-zhang-Jq8-3Bmh1pQ-unsplash_static.921260e0-opt-16.JPG",
  "chris-zhang-Jq8-3Bmh1pQ-unsplash_static.921260e0-opt-1920.JPG",
  "chris-zhang-Jq8-3Bmh1pQ-unsplash_static.921260e0-opt-2048.JPG",
  "chris-zhang-Jq8-3Bmh1pQ-unsplash_static.921260e0-opt-256.JPG",
  "chris-zhang-Jq8-3Bmh1pQ-unsplash_static.921260e0-opt-32.JPG",
  "chris-zhang-Jq8-3Bmh1pQ-unsplash_static.921260e0-opt-384.JPG",
  "chris-zhang-Jq8-3Bmh1pQ-unsplash_static.921260e0-opt-3840.JPG",
  "chris-zhang-Jq8-3Bmh1pQ-unsplash_static.921260e0-opt-48.JPG",
  "chris-zhang-Jq8-3Bmh1pQ-unsplash_static.921260e0-opt-64.JPG",
  "chris-zhang-Jq8-3Bmh1pQ-unsplash_static.921260e0-opt-640.JPG",
  "chris-zhang-Jq8-3Bmh1pQ-unsplash_static.921260e0-opt-750.JPG",
  "chris-zhang-Jq8-3Bmh1pQ-unsplash_static.921260e0-opt-828.JPG",
  "chris-zhang-Jq8-3Bmh1pQ-unsplash_static.921260e0-opt-96.JPG",
]
`);
    expect(allFilesInImageBuildSubFolder).toMatchInlineSnapshot(`
[
  "ollie-barker-jones-K52HVSPVvKI-unsplash-opt-10.JPG",
  "ollie-barker-jones-K52HVSPVvKI-unsplash-opt-1080.JPG",
  "ollie-barker-jones-K52HVSPVvKI-unsplash-opt-1200.JPG",
  "ollie-barker-jones-K52HVSPVvKI-unsplash-opt-128.JPG",
  "ollie-barker-jones-K52HVSPVvKI-unsplash-opt-16.JPG",
  "ollie-barker-jones-K52HVSPVvKI-unsplash-opt-1920.JPG",
  "ollie-barker-jones-K52HVSPVvKI-unsplash-opt-2048.JPG",
  "ollie-barker-jones-K52HVSPVvKI-unsplash-opt-256.JPG",
  "ollie-barker-jones-K52HVSPVvKI-unsplash-opt-32.JPG",
  "ollie-barker-jones-K52HVSPVvKI-unsplash-opt-384.JPG",
  "ollie-barker-jones-K52HVSPVvKI-unsplash-opt-3840.JPG",
  "ollie-barker-jones-K52HVSPVvKI-unsplash-opt-48.JPG",
  "ollie-barker-jones-K52HVSPVvKI-unsplash-opt-64.JPG",
  "ollie-barker-jones-K52HVSPVvKI-unsplash-opt-640.JPG",
  "ollie-barker-jones-K52HVSPVvKI-unsplash-opt-750.JPG",
  "ollie-barker-jones-K52HVSPVvKI-unsplash-opt-828.JPG",
  "ollie-barker-jones-K52HVSPVvKI-unsplash-opt-96.JPG",
]
`);
  }

  const imageFolders = [
    {
      basePath: "example/public/images/nextImageExportOptimizer",
      imageFileArray: allImagesInImageFolder,
    },
    {
      basePath: "example/public/images/subfolder/nextImageExportOptimizer",
      imageFileArray: allFilesInImageBuildSubFolder,
    },
  ];
  for (let index = 0; index < imageFolders.length; index++) {
    const imageFolderBasePath = imageFolders[index].basePath;
    const imageFileArray = imageFolders[index].imageFileArray;

    const imageFileStats = [];
    for (let index = 0; index < imageFileArray.length; index++) {
      const imageFile = imageFileArray[index];
      const image = await sharp(`${imageFolderBasePath}/${imageFile}`);
      const metadata = await image.metadata();
      const statsToBeChecked = [
        metadata.format,
        metadata.width,
        metadata.height,
      ];
      imageFileStats.push(statsToBeChecked);
    }
    if (config === newConfig || config === legacyConfig) {
      if (index == 0 || index == 2) {
        expect(imageFileStats).toMatchInlineSnapshot(`
[
  [
    "webp",
    10,
    7,
  ],
  [
    "webp",
    1080,
    720,
  ],
  [
    "webp",
    1200,
    800,
  ],
  [
    "webp",
    128,
    85,
  ],
  [
    "webp",
    16,
    11,
  ],
  [
    "webp",
    1920,
    1280,
  ],
  [
    "webp",
    2048,
    1365,
  ],
  [
    "webp",
    256,
    171,
  ],
  [
    "webp",
    32,
    21,
  ],
  [
    "webp",
    384,
    256,
  ],
  [
    "webp",
    3840,
    2560,
  ],
  [
    "webp",
    48,
    32,
  ],
  [
    "webp",
    64,
    43,
  ],
  [
    "webp",
    640,
    427,
  ],
  [
    "webp",
    750,
    500,
  ],
  [
    "webp",
    828,
    552,
  ],
  [
    "webp",
    96,
    64,
  ],
  [
    "webp",
    10,
    7,
  ],
  [
    "webp",
    1080,
    720,
  ],
  [
    "webp",
    1200,
    800,
  ],
  [
    "webp",
    128,
    85,
  ],
  [
    "webp",
    16,
    11,
  ],
  [
    "webp",
    1920,
    1280,
  ],
  [
    "webp",
    2048,
    1365,
  ],
  [
    "webp",
    256,
    171,
  ],
  [
    "webp",
    32,
    21,
  ],
  [
    "webp",
    384,
    256,
  ],
  [
    "webp",
    3840,
    2560,
  ],
  [
    "webp",
    48,
    32,
  ],
  [
    "webp",
    64,
    43,
  ],
  [
    "webp",
    640,
    427,
  ],
  [
    "webp",
    750,
    500,
  ],
  [
    "webp",
    828,
    552,
  ],
  [
    "webp",
    96,
    64,
  ],
]
`);
      } else if (index === 1) {
        expect(imageFileStats).toMatchInlineSnapshot(`
[
  [
    "webp",
    10,
    15,
  ],
  [
    "webp",
    1080,
    1620,
  ],
  [
    "webp",
    1200,
    1800,
  ],
  [
    "webp",
    128,
    192,
  ],
  [
    "webp",
    16,
    24,
  ],
  [
    "webp",
    1920,
    2880,
  ],
  [
    "webp",
    2048,
    3072,
  ],
  [
    "webp",
    256,
    384,
  ],
  [
    "webp",
    32,
    48,
  ],
  [
    "webp",
    384,
    576,
  ],
  [
    "webp",
    3840,
    5760,
  ],
  [
    "webp",
    48,
    72,
  ],
  [
    "webp",
    64,
    96,
  ],
  [
    "webp",
    640,
    960,
  ],
  [
    "webp",
    750,
    1125,
  ],
  [
    "webp",
    828,
    1242,
  ],
  [
    "webp",
    96,
    144,
  ],
]
`);
      }
    }
    if (config === newConfigJpeg) {
      if (index == 0 || index == 2) {
        expect(imageFileStats).toMatchInlineSnapshot(`
[
  [
    "jpeg",
    10,
    7,
  ],
  [
    "jpeg",
    1080,
    720,
  ],
  [
    "jpeg",
    1200,
    800,
  ],
  [
    "jpeg",
    128,
    85,
  ],
  [
    "jpeg",
    16,
    11,
  ],
  [
    "jpeg",
    1920,
    1280,
  ],
  [
    "jpeg",
    2048,
    1365,
  ],
  [
    "jpeg",
    256,
    171,
  ],
  [
    "jpeg",
    32,
    21,
  ],
  [
    "jpeg",
    384,
    256,
  ],
  [
    "jpeg",
    3840,
    2560,
  ],
  [
    "jpeg",
    48,
    32,
  ],
  [
    "jpeg",
    64,
    43,
  ],
  [
    "jpeg",
    640,
    427,
  ],
  [
    "jpeg",
    750,
    500,
  ],
  [
    "jpeg",
    828,
    552,
  ],
  [
    "jpeg",
    96,
    64,
  ],
  [
    "jpeg",
    10,
    7,
  ],
  [
    "jpeg",
    1080,
    720,
  ],
  [
    "jpeg",
    1200,
    800,
  ],
  [
    "jpeg",
    128,
    85,
  ],
  [
    "jpeg",
    16,
    11,
  ],
  [
    "jpeg",
    1920,
    1280,
  ],
  [
    "jpeg",
    2048,
    1365,
  ],
  [
    "jpeg",
    256,
    171,
  ],
  [
    "jpeg",
    32,
    21,
  ],
  [
    "jpeg",
    384,
    256,
  ],
  [
    "jpeg",
    3840,
    2560,
  ],
  [
    "jpeg",
    48,
    32,
  ],
  [
    "jpeg",
    64,
    43,
  ],
  [
    "jpeg",
    640,
    427,
  ],
  [
    "jpeg",
    750,
    500,
  ],
  [
    "jpeg",
    828,
    552,
  ],
  [
    "jpeg",
    96,
    64,
  ],
]
`);
      } else if (index === 1) {
        expect(imageFileStats).toMatchInlineSnapshot(`
[
  [
    "jpeg",
    10,
    15,
  ],
  [
    "jpeg",
    1080,
    1620,
  ],
  [
    "jpeg",
    1200,
    1800,
  ],
  [
    "jpeg",
    128,
    192,
  ],
  [
    "jpeg",
    16,
    24,
  ],
  [
    "jpeg",
    1920,
    2880,
  ],
  [
    "jpeg",
    2048,
    3072,
  ],
  [
    "jpeg",
    256,
    384,
  ],
  [
    "jpeg",
    32,
    48,
  ],
  [
    "jpeg",
    384,
    576,
  ],
  [
    "jpeg",
    3840,
    5760,
  ],
  [
    "jpeg",
    48,
    72,
  ],
  [
    "jpeg",
    64,
    96,
  ],
  [
    "jpeg",
    640,
    960,
  ],
  [
    "jpeg",
    750,
    1125,
  ],
  [
    "jpeg",
    828,
    1242,
  ],
  [
    "jpeg",
    96,
    144,
  ],
]
`);
      }
    }
  }
}

jest.setTimeout(90000);
test("legacyConfig", async () => {
  await testConfig(legacyConfig);
});
test("newConfigJpeg", async () => {
  await testConfig(newConfigJpeg);
});
test("newConfig", async () => {
  await testConfig(newConfig);
});
