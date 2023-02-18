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
  return ["JPG", "JPEG", "WEBP", "PNG", "GIF", "AVIF"].includes(extension);
};
const getFiles = (dirPath) =>
  fs.existsSync(dirPath) ? fs.readdirSync(dirPath) : [];

const legacyConfig = `module.exports = {
  images: {
    loader: "custom",
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    deviceSizes: [640, 750, 777, 828, 1080, 1200, 1920, 2048, 3840],
    nextImageExportOptimizer: {
      imageFolderPath: "public/images",
      exportFolderPath: "out",
      quality: 75,
    }
  },
  transpilePackages: ["next-image-export-optimizer"],
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
    deviceSizes: [640, 750, 777, 828, 1080, 1200, 1920, 2048, 3840],
  },
  transpilePackages: ["next-image-export-optimizer"],
  env: {
    nextImageExportOptimizer_imageFolderPath: "public/images",
    nextImageExportOptimizer_exportFolderPath: "out",
    nextImageExportOptimizer_exportFolderName: "nextImageExportOptimizer",
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
    deviceSizes: [640, 750, 777, 828, 1080, 1200, 1920, 2048, 3840],
  },
  transpilePackages: ["next-image-export-optimizer"],
  env: {
    nextImageExportOptimizer_imageFolderPath: "public/images",
    nextImageExportOptimizer_exportFolderPath: "out",
    nextImageExportOptimizer_quality: 75,
    nextImageExportOptimizer_storePicturesInWEBP: false,
    nextImageExportOptimizer_generateAndUseBlurImages: true,
  },
};
`;
const newConfigExportFolderName = `module.exports = {
  images: {
    loader: "custom",
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    deviceSizes: [640, 750, 777, 828, 1080, 1200, 1920, 2048, 3840],
  },
  transpilePackages: ["next-image-export-optimizer"],
  env: {
    nextImageExportOptimizer_imageFolderPath: "public/images",
    nextImageExportOptimizer_exportFolderPath: "out",
    nextImageExportOptimizer_quality: 75,
    nextImageExportOptimizer_storePicturesInWEBP: false,
    nextImageExportOptimizer_generateAndUseBlurImages: true,
    nextImageExportOptimizer_exportFolderName: "nextImageExportOptimizer2",
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
  deleteFolder("example/public/images/nextImageExportOptimizer2");
  deleteFolder("example/public/nextImageExportOptimizer2");
  deleteFolder("example/public/images/subfolder/nextImageExportOptimizer2");
  deleteFolder(
    "example/public/images/subfolder/subfolder2/nextImageExportOptimizer2"
  );
  // write config file for the to be tested configuration variables to the folder
  fs.writeFileSync("example/next.config.js", config);

  deleteFolder("example/out/images/nextImageExportOptimizer");
  deleteFolder("example/out/nextImageExportOptimizer");
  deleteFolder("example/out/images/subfolder/nextImageExportOptimizer");
  deleteFolder(
    "example/out/images/subfolder/subfolder2/nextImageExportOptimizer"
  );
  deleteFolder("example/out/images/nextImageExportOptimizer2");
  deleteFolder("example/out/nextImageExportOptimizer2");
  deleteFolder("example/out/images/subfolder/nextImageExportOptimizer2");
  deleteFolder(
    "example/out/images/subfolder/subfolder2/nextImageExportOptimizer2"
  );

  execSync("cd example/ && npm run export && node ../src/optimizeImages.js");

  const allFilesInImageFolder = getFiles(
    "example/public/images/nextImageExportOptimizer"
  );
  const allImagesInImageFolder = allFilesInImageFolder.filter(filterForImages);
  const allFilesInStaticImageFolder = getFiles(
    "example/public/nextImageExportOptimizer"
  );
  const allImagesInStaticImageFolder =
    allFilesInStaticImageFolder.filter(filterForImages);

  const allFilesInImageSubFolder = getFiles(
    "example/public/images/subfolder/nextImageExportOptimizer"
  );
  const allImagesInImageSubFolder =
    allFilesInImageSubFolder.filter(filterForImages);

  const allFilesInImageBuildFolder = getFiles(
    "example/out/images/nextImageExportOptimizer"
  );
  const allFilesInStaticImageBuildFolder = getFiles(
    "example/out/nextImageExportOptimizer"
  );

  const allFilesInImageBuildSubFolder = getFiles(
    "example/out/images/subfolder/nextImageExportOptimizer"
  );

  // For custom export folder name
  const allFilesInImageFolderCustomExportFolder = getFiles(
    "example/public/images/nextImageExportOptimizer2"
  );

  const allImagesInImageFolderCustomExportFolder =
    allFilesInImageFolderCustomExportFolder.filter(filterForImages);
  const allFilesInStaticImageFolderCustomExportFolder = getFiles(
    "example/public/nextImageExportOptimizer2"
  );

  const allImagesInStaticImageFolderCustomExportFolder =
    allFilesInStaticImageFolderCustomExportFolder.filter(filterForImages);

  const allFilesInImageSubFolderCustomExportFolder = getFiles(
    "example/public/images/subfolder/nextImageExportOptimizer2"
  );

  const allImagesInImageSubFolderCustomExportFolder =
    allFilesInImageSubFolderCustomExportFolder.filter(filterForImages);

  const allFilesInImageBuildFolderCustomExportFolder = getFiles(
    "example/out/images/nextImageExportOptimizer2"
  );

  const allFilesInStaticImageBuildFolderCustomExportFolder = getFiles(
    "example/out/nextImageExportOptimizer2"
  );

  const allFilesInImageBuildSubFolderCustomExportFolder = getFiles(
    "example/out/images/subfolder/nextImageExportOptimizer2"
  );

  if (config === newConfig || config === legacyConfig) {
    expect(allImagesInImageFolder).toMatchSnapshot();
    expect(allImagesInStaticImageFolder).toMatchSnapshot();

    expect(allImagesInImageSubFolder).toMatchSnapshot();
    expect(allFilesInImageBuildFolder).toMatchSnapshot();
    expect(allFilesInStaticImageFolder).toMatchSnapshot();
    expect(allFilesInImageBuildSubFolder).toMatchSnapshot();
  } else if (config === newConfigExportFolderName) {
    expect(allImagesInImageFolderCustomExportFolder).toMatchSnapshot();
    expect(allImagesInStaticImageFolderCustomExportFolder).toMatchSnapshot();
    expect(allImagesInImageSubFolderCustomExportFolder).toMatchSnapshot();
    expect(allFilesInImageBuildFolderCustomExportFolder).toMatchSnapshot();
    expect(
      allFilesInStaticImageBuildFolderCustomExportFolder
    ).toMatchSnapshot();
    expect(allFilesInImageBuildSubFolderCustomExportFolder).toMatchSnapshot();
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
    {
      basePath: "example/public/images/nextImageExportOptimizer2",
      imageFileArray: allImagesInImageFolderCustomExportFolder,
    },
    {
      basePath: "example/public/images/subfolder/nextImageExportOptimizer2",
      imageFileArray: allFilesInImageBuildSubFolderCustomExportFolder,
    },
    {
      basePath: "example/public/nextImageExportOptimizer2",
      imageFileArray: allImagesInStaticImageFolderCustomExportFolder,
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

jest.setTimeout(180000);
test("legacyConfig", async () => {
  console.log("Running legacyConfig test...");
  await testConfig(legacyConfig);
  console.log("legacyConfig test finished.");
});

test("newConfigJpeg", async () => {
  console.log("Running newConfigJpeg test...");
  await testConfig(newConfigJpeg);
  console.log("newConfigJpeg test finished.");
});

test("newConfigExportFolderName", async () => {
  console.log("Running newConfigExportFolderName test...");
  await testConfig(newConfigExportFolderName);
  console.log("newConfigExportFolderName test finished.");
});

test("newConfig", async () => {
  console.log("Running newConfig test...");
  await testConfig(newConfig);
  console.log("newConfig test finished.");
});
