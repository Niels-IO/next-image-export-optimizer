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
  deleteFolder("example/public/nextImageExportOptimizer");
  deleteFolder("example/public/images/subfolder/nextImageExportOptimizer");
  deleteFolder(
    "example/public/images/subfolder/subfolder2/nextImageExportOptimizer"
  );
  // write config file for the to be tested configuration variables to the folder
  fs.writeFileSync("example/next.config.js", config);

  deleteFolder("example/out/images/nextImageExportOptimizer");
  deleteFolder("example/out/nextImageExportOptimizer");
  deleteFolder("example/out/images/subfolder/nextImageExportOptimizer");
  deleteFolder(
    "example/out/images/subfolder/subfolder2/nextImageExportOptimizer"
  );

  execSync("cd example/ && npm run export && node ../src/optimizeImages.js");

  const allFilesInImageFolder = fs.readdirSync(
    "example/public/images/nextImageExportOptimizer"
  );
  const allImagesInImageFolder = allFilesInImageFolder.filter(filterForImages);
  const allFilesInStaticImageFolder = fs.readdirSync(
    "example/public/nextImageExportOptimizer"
  );
  const allImagesInStaticImageFolder =
    allFilesInStaticImageFolder.filter(filterForImages);

  const allFilesInImageSubFolder = fs.readdirSync(
    "example/public/images/subfolder/nextImageExportOptimizer"
  );
  const allImagesInImageSubFolder =
    allFilesInImageSubFolder.filter(filterForImages);

  const allFilesInImageBuildFolder = fs.readdirSync(
    "example/out/images/nextImageExportOptimizer"
  );
  const allFilesInStaticImageBuildFolder = fs.readdirSync(
    "example/out/nextImageExportOptimizer"
  );

  const allFilesInImageBuildSubFolder = fs.readdirSync(
    "example/out/images/subfolder/nextImageExportOptimizer"
  );
  if (config === newConfig || config === legacyConfig) {
    expect(allImagesInImageFolder).toMatchSnapshot();
    expect(allImagesInStaticImageFolder).toMatchSnapshot();

    expect(allImagesInImageSubFolder).toMatchSnapshot();
    expect(allFilesInImageBuildFolder).toMatchSnapshot();
    expect(allFilesInStaticImageFolder).toMatchSnapshot();
    expect(allFilesInImageBuildSubFolder).toMatchSnapshot();
  } else {
    expect(allImagesInImageFolder).toMatchSnapshot();
    expect(allImagesInStaticImageFolder).toMatchSnapshot();
    expect(allImagesInImageSubFolder).toMatchSnapshot();
    expect(allFilesInImageBuildFolder).toMatchSnapshot();
    expect(allFilesInStaticImageBuildFolder).toMatchSnapshot();
    expect(allFilesInImageBuildSubFolder).toMatchSnapshot();
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
    {
      basePath: "example/public/nextImageExportOptimizer",
      imageFileArray: allImagesInStaticImageFolder,
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
        expect(imageFileStats).toMatchSnapshot();
      } else if (index === 1) {
        expect(imageFileStats).toMatchSnapshot();
      }
    }
    if (config === newConfigJpeg) {
      if (index == 0 || index == 2) {
        expect(imageFileStats).toMatchSnapshot();
      } else if (index === 1) {
        expect(imageFileStats).toMatchSnapshot();
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
