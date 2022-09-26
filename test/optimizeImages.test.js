/* eslint-disable no-undef */
const assert = require("assert");
const fs = require("fs");
const execSync = require("child_process").execSync;

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
  const allFilesInImageSubFolder = fs.readdirSync(
    "example/public/images/subfolder/nextImageExportOptimizer"
  );
  const allImagesInImageSubFolder =
    allFilesInImageSubFolder.filter(filterForImages);
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

  const allFilesInImageBuildFolder = fs.readdirSync(
    "example/out/images/nextImageExportOptimizer"
  );
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
  const allFilesInImageBuildSubFolder = fs.readdirSync(
    "example/out/images/subfolder/nextImageExportOptimizer"
  );
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
      const stats = fs.statSync(`${imageFolderBasePath}/${imageFile}`);
      const fileSizeInBytes = stats.size;
      imageFileStats.push(fileSizeInBytes);
    }
    if (index == 0 || index == 2) {
      expect(imageFileStats).toMatchInlineSnapshot(`
[
  102,
  40250,
  45584,
  2346,
  138,
  84746,
  93116,
  5944,
  328,
  10326,
  219028,
  584,
  868,
  19852,
  25344,
  28734,
  1510,
  102,
  40250,
  45584,
  2346,
  138,
  84746,
  93116,
  5944,
  328,
  10326,
  219028,
  584,
  868,
  19852,
  25344,
  28734,
  1510,
]
`);
    } else if (index === 1) {
      expect(imageFileStats).toMatchInlineSnapshot(`
[
  148,
  107796,
  122246,
  6466,
  284,
  243172,
  270284,
  15916,
  804,
  26670,
  865700,
  1526,
  2438,
  51958,
  63890,
  75022,
  4442,
]
`);
    }
  }
}

test("Configs", async () => {
  await testConfig(legacyConfig);
  await testConfig(newConfig);
});
