#!/usr/bin/env node

import { ImageObject } from "./utils/ImageObject";

const defineProgressBar = require("./utils/defineProgressBar");
const ensureDirectoryExists = require("./utils/ensureDirectoryExists");
const getAllFilesAsObject = require("./utils/getAllFilesAsObject");
const getHash = require("./utils/getHash");
import { getRemoteImageURLs } from "./utils/getRemoteImageURLs";
import { downloadImagesInBatches } from "./utils/downloadImagesInBatches";

const fs = require("fs");
const sharp = require("sharp");
const path = require("path");

const loadConfig = require("next/dist/server/config").default;

// Check if the --name and --age arguments are present
const nextConfigPathIndex = process.argv.indexOf("--nextConfigPath");
const exportFolderPathIndex = process.argv.indexOf("--exportFolderPath");

// Check if there is only one argument without a name present -> this is the case if the user does not provide the path to the next.config.js file
if (process.argv.length === 3) {
  // Colorize the output to red
  // Colorize the output to red
  console.error("\x1b[31m");
  console.error(
    "next-image-export-optimizer: Breaking change: Please provide the path to the next.config.js file as an argument with the name --nextConfigPath."
  );
  // Reset the color
  console.error("\x1b[0m");
  process.exit(1);
}

// Set the nextConfigPath and exportFolderPath variables to the corresponding arguments, or to undefined if the arguments are not present
let nextConfigPath =
  nextConfigPathIndex !== -1
    ? process.argv[nextConfigPathIndex + 1]
    : undefined;
let exportFolderPathCommandLine =
  exportFolderPathIndex !== -1
    ? process.argv[exportFolderPathIndex + 1]
    : undefined;

if (nextConfigPath) {
  nextConfigPath = path.isAbsolute(nextConfigPath)
    ? nextConfigPath
    : path.join(process.cwd(), nextConfigPath);
} else {
  nextConfigPath = path.join(process.cwd(), "next.config.js");
}
const nextConfigFolder = path.dirname(nextConfigPath);

const folderNameForRemoteImages = `remoteImagesForOptimization`;
const folderPathForRemoteImages = path.join(
  nextConfigFolder,
  folderNameForRemoteImages
);

if (exportFolderPathCommandLine) {
  exportFolderPathCommandLine = path.isAbsolute(exportFolderPathCommandLine)
    ? exportFolderPathCommandLine
    : path.join(process.cwd(), exportFolderPathCommandLine);
}

const nextImageExportOptimizer = async function () {
  console.log(
    "---- next-image-export-optimizer: Begin with optimization... ---- "
  );

  // Default values
  let imageFolderPath = "public/images";
  let staticImageFolderPath = ".next/static/media";
  let exportFolderPath = "out";
  let deviceSizes = [640, 750, 828, 1080, 1200, 1920, 2048, 3840];
  let imageSizes = [16, 32, 48, 64, 96, 128, 256, 384];
  let quality = 75;
  let storePicturesInWEBP = true;
  let blurSize: number[] = [];
  let remoteImageCacheTTL = 0;
  let exportFolderName = "nextImageExportOptimizer";
  const { remoteImageFilenames, remoteImageURLs } = await getRemoteImageURLs(
    nextConfigFolder,
    folderPathForRemoteImages
  );
  try {
    // Read in the configuration parameters
    const nextjsConfig = await loadConfig("phase-export", nextConfigFolder);

    // Check if nextjsConfig is an object or is undefined
    if (typeof nextjsConfig !== "object" || nextjsConfig === null) {
      throw new Error("next.config.js is not an object");
    }
    const legacyPath = nextjsConfig.images?.nextImageExportOptimizer;
    const newPath = nextjsConfig.env;

    if (legacyPath?.imageFolderPath !== undefined) {
      imageFolderPath = legacyPath.imageFolderPath;
    } else if (
      newPath?.nextImageExportOptimizer_imageFolderPath !== undefined
    ) {
      imageFolderPath = newPath.nextImageExportOptimizer_imageFolderPath;
      // if the imageFolderPath starts with a slash, remove it
      if (imageFolderPath.startsWith("/")) {
        imageFolderPath = imageFolderPath.slice(1);
      }
    }
    if (legacyPath?.exportFolderPath !== undefined) {
      exportFolderPath = legacyPath.exportFolderPath;
    } else if (
      newPath?.nextImageExportOptimizer_exportFolderPath !== undefined
    ) {
      exportFolderPath = newPath.nextImageExportOptimizer_exportFolderPath;
    }
    if (nextjsConfig.images?.deviceSizes !== undefined) {
      deviceSizes = nextjsConfig.images.deviceSizes;
    }
    if (nextjsConfig.images?.imageSizes !== undefined) {
      imageSizes = nextjsConfig.images.imageSizes;
    }

    if (legacyPath?.quality !== undefined) {
      quality = Number(legacyPath.quality);
    } else if (newPath?.nextImageExportOptimizer_quality !== undefined) {
      quality = Number(newPath.nextImageExportOptimizer_quality);
    }
    if (nextjsConfig.env?.storePicturesInWEBP !== undefined) {
      storePicturesInWEBP =
        nextjsConfig.env.storePicturesInWEBP.toLowerCase() == "true";
    } else if (
      newPath?.nextImageExportOptimizer_storePicturesInWEBP !== undefined
    ) {
      storePicturesInWEBP =
        newPath.nextImageExportOptimizer_storePicturesInWEBP.toLowerCase() ==
        "true";
    }
    if (nextjsConfig.env?.generateAndUseBlurImages?.toLowerCase() == "true") {
      blurSize = [10];
    } else if (
      newPath?.nextImageExportOptimizer_generateAndUseBlurImages == "true"
    ) {
      blurSize = [10];
    }
    if (newPath.nextImageExportOptimizer_exportFolderName !== undefined) {
      exportFolderName = newPath.nextImageExportOptimizer_exportFolderName;
    }
    if (newPath.nextImageExportOptimizer_remoteImageCacheTTL !== undefined) {
      remoteImageCacheTTL = Number(
        newPath.nextImageExportOptimizer_remoteImageCacheTTL
      );
    }

    // Give the user a warning if the transpilePackages: ["next-image-export-optimizer"], is not set in the next.config.js
    if (
      nextjsConfig.transpilePackages === undefined || // transpilePackages is not set
      (nextjsConfig.transpilePackages !== undefined &&
        !nextjsConfig.transpilePackages.includes("next-image-export-optimizer")) // transpilePackages is set but does not include next-image-export-optimizer
    ) {
      console.warn(
        "\x1b[41m",
        `Changed in 1.2.0: You have not set transpilePackages: ["next-image-export-optimizer"] in your next.config.js. This may cause problems with next-image-export-optimizer. Please add this line to your next.config.js.`,
        "\x1b[0m"
      );
    }
  } catch (e) {
    // Configuration file not found
    console.log("Could not find a next.config.js file. Use of default values");
  }

  // if the user has specified a path for the export folder via the command line, use this path
  exportFolderPath = exportFolderPathCommandLine || exportFolderPath;

  // Give the user a warning, if the public directory of Next.js is not found as the user
  // may have run the command in a wrong directory
  if (!fs.existsSync(path.join(nextConfigFolder, "public"))) {
    console.warn(
      "\x1b[41m",
      `Could not find a public folder in this directory. Make sure you run the command in the main directory of your project.`,
      "\x1b[0m"
    );
  }

  // Create the folder for the remote images if it does not exists
  if (remoteImageURLs.length > 0) {
    try {
      if (!fs.existsSync(folderNameForRemoteImages)) {
        fs.mkdirSync(folderNameForRemoteImages);
        console.log(
          `Create remote image output folder: ${folderNameForRemoteImages}`
        );
      }
    } catch (err) {
      console.error(err);
    }
  }

  // Download the remote images specified in the remoteOptimizedImages.js file
  if (remoteImageURLs.length > 0)
    console.log(
      `Found ${remoteImageURLs.length} remote image${
        remoteImageURLs.length > 1 ? "s" : ""
      }...`
    );
  await downloadImagesInBatches(
    remoteImageURLs,
    remoteImageFilenames,
    folderPathForRemoteImages,
    Math.min(remoteImageURLs.length, 20),
    remoteImageCacheTTL
  );

  // Create or read the JSON containing the hashes of the images in the image directory
  let imageHashes: {
    [key: string]: string;
  } = {};
  const hashFilePath = `${imageFolderPath}/next-image-export-optimizer-hashes.json`;
  try {
    let rawData = fs.readFileSync(hashFilePath);
    imageHashes = JSON.parse(rawData);
  } catch (e) {
    // No image hashes yet
  }

  // check if the image folder is a subdirectory of the public folder
  // if not, the images in the image folder can only be static images and are taken from the static image folder (staticImageFolderPath)
  // so we do not add them to the images that need to be optimized

  const isImageFolderSubdirectoryOfPublicFolder =
    imageFolderPath.includes("public");

  const allFilesInImageFolderAndSubdirectories =
    isImageFolderSubdirectoryOfPublicFolder
      ? getAllFilesAsObject(imageFolderPath, imageFolderPath, exportFolderName)
      : [];
  const allFilesInStaticImageFolder = getAllFilesAsObject(
    staticImageFolderPath,
    staticImageFolderPath,
    exportFolderName
  );
  // append the static image folder to the image array
  allFilesInImageFolderAndSubdirectories.push(...allFilesInStaticImageFolder);

  // append the remote images to the image array
  if (remoteImageURLs.length > 0) {
    // get all files in the remote image folder again, as we added extensions to the filenames
    // if they were not present in the URLs in remoteOptimizedImages.js

    const allFilesInRemoteImageFolder = fs.readdirSync(
      folderNameForRemoteImages
    );

    const remoteImageFiles = allFilesInRemoteImageFolder.map(
      (filename: string) => {
        const filenameFull = path.join(folderPathForRemoteImages, filename);

        return {
          basePath: folderPathForRemoteImages,
          file: filename,
          dirPathWithoutBasePath: "",
          fullPath: filenameFull,
        };
      }
    );

    // append the remote images to the image array
    allFilesInImageFolderAndSubdirectories.push(...remoteImageFiles);
  }

  const allImagesInImageFolder = allFilesInImageFolderAndSubdirectories.filter(
    (fileObject: ImageObject) => {
      if (fileObject === undefined) return false;
      if (fileObject.file === undefined) return false;
      // check if the file has a supported extension
      const filenameSplit = fileObject.file.split(".");
      if (filenameSplit.length === 1) return false;
      const extension = filenameSplit.pop()!.toUpperCase();
      // Only include file with image extensions
      return ["JPG", "JPEG", "WEBP", "PNG", "AVIF", "GIF"].includes(extension);
    }
  );
  console.log(
    `Found ${
      allImagesInImageFolder.length - remoteImageURLs.length
    } supported images in ${imageFolderPath}, static folder and subdirectories and ${
      remoteImageURLs.length
    } remote image${remoteImageURLs.length > 1 ? "s" : ""}.`
  );

  let widths = [...blurSize, ...imageSizes, ...deviceSizes];

  // sort the widths in ascending order to make sure the logic works for limiting the number of images
  widths.sort((a, b) => a - b);

  // remove duplicate widths from the array
  widths = widths.filter((item, index) => widths.indexOf(item) === index);


  const progressBar = defineProgressBar();
  if (allImagesInImageFolder.length > 0) {
    console.log(`Using sizes: ${widths.toString()}`);
    console.log(
      `Start optimization of ${allImagesInImageFolder.length} images with ${
        widths.length
      } sizes resulting in ${
        allImagesInImageFolder.length * widths.length
      } optimized images...`
    );
    progressBar.start(allImagesInImageFolder.length * widths.length, 0, {
      sizeOfGeneratedImages: 0,
    });
  }
  let sizeOfGeneratedImages = 0;
  const allGeneratedImages: string[] = [];

  const updatedImageHashes: {
    [key: string]: string;
  } = {};

  // Loop through all images
  for (let index = 0; index < allImagesInImageFolder.length; index++) {
    // try catch to catch errors in the loop and let the user know which image caused the error
    try {
      const file = allImagesInImageFolder[index].file;
      let fileDirectory = allImagesInImageFolder[index].dirPathWithoutBasePath;
      let basePath = allImagesInImageFolder[index].basePath;

      let extension = file.split(".").pop()!.toUpperCase();
      const imageBuffer = fs.readFileSync(
        path.join(basePath, fileDirectory, file)
      );
      const imageHash = getHash([
        imageBuffer,
        ...widths,
        quality,
        fileDirectory,
        file,
      ]);
      const keyForImageHashes = `${fileDirectory}/${file}`;

      let hashContentChanged = false;
      if (imageHashes[keyForImageHashes] !== imageHash) {
        hashContentChanged = true;
      }
      // Store image hash in temporary object
      updatedImageHashes[keyForImageHashes] = imageHash;

      let optimizedOriginalWidthImagePath;
      let optimizedOriginalWidthImageSizeInMegabytes;

      // Loop through all widths
      for (let indexWidth = 0; indexWidth < widths.length; indexWidth++) {
        const width = widths[indexWidth];

        const filename = path.parse(file).name;
        if (storePicturesInWEBP) {
          extension = "WEBP";
        }

        const isStaticImage = basePath === staticImageFolderPath;
        // for a static image, we copy the image to public/nextImageExportOptimizer or public/${exportFolderName}
        // and not the staticImageFolderPath
        // as the static image folder is deleted before each build
        const basePathToStoreOptimizedImages =
          isStaticImage ||
          basePath === path.join(nextConfigFolder, folderNameForRemoteImages)
            ? "public"
            : basePath;
        const optimizedFileNameAndPath = path.join(
          basePathToStoreOptimizedImages,
          fileDirectory,
          exportFolderName,
          `${filename}-opt-${width}.${extension.toUpperCase()}`
        );

        // Check if file is already in hash and specific size and quality is present in the
        // opt file directory
        if (
          !hashContentChanged &&
          keyForImageHashes in imageHashes &&
          fs.existsSync(optimizedFileNameAndPath)
        ) {
          const stats = fs.statSync(optimizedFileNameAndPath);
          const fileSizeInBytes = stats.size;
          const fileSizeInMegabytes = fileSizeInBytes / (1024 * 1024);
          sizeOfGeneratedImages += fileSizeInMegabytes;
          progressBar.increment({
            sizeOfGeneratedImages: sizeOfGeneratedImages.toFixed(1),
          });
          allGeneratedImages.push(optimizedFileNameAndPath);

          continue;
        }

        const transformer = sharp(imageBuffer, {
          animated: true,
          limitInputPixels: false, // disable pixel limit
        });

        transformer.rotate();

        const { width: metaWidth } = await transformer.metadata();

        // For a static image, we can skip the image optimization and the copying
        // of the image for images with a width greater than the original image width
        // we will stop the loop at the first image with a width greater than the original image width
        let nextLargestSize = -1;
        for (let i = 0; i < widths.length; i++) {
          if (
            Number(widths[i]) >= metaWidth &&
            (nextLargestSize === -1 || Number(widths[i]) < nextLargestSize)
          ) {
            nextLargestSize = Number(widths[i]);
          }
        }

        if (
          isStaticImage &&
          nextLargestSize !== -1 &&
          width > nextLargestSize
        ) {
          progressBar.increment({
            sizeOfGeneratedImages: sizeOfGeneratedImages.toFixed(1),
          });
          continue;
        }

        // If the original image's width is X, the optimized images are
        // identical for all widths >= X. Once we have generated the first of
        // these identical images, we can simply copy that file instead of redoing
        // the optimization.
        if (
          optimizedOriginalWidthImagePath &&
          optimizedOriginalWidthImageSizeInMegabytes
        ) {
          fs.copyFileSync(
            optimizedOriginalWidthImagePath,
            optimizedFileNameAndPath
          );

          sizeOfGeneratedImages += optimizedOriginalWidthImageSizeInMegabytes;
          progressBar.increment({
            sizeOfGeneratedImages: sizeOfGeneratedImages.toFixed(1),
          });
          allGeneratedImages.push(optimizedFileNameAndPath);

          continue;
        }

        const resize = metaWidth && metaWidth > width;
        if (resize) {
          transformer.resize(width);
        }

        if (extension === "AVIF") {
          if (transformer.avif) {
            const avifQuality = quality - 15;
            transformer.avif({
              quality: Math.max(avifQuality, 0),
              chromaSubsampling: "4:2:0", // same as webp
            });
          } else {
            transformer.webp({ quality });
          }
        } else if (extension === "WEBP" || storePicturesInWEBP) {
          transformer.webp({ quality });
        } else if (extension === "PNG") {
          transformer.png({ quality });
        } else if (extension === "JPEG" || extension === "JPG") {
          transformer.jpeg({ quality });
        } else if (extension === "GIF") {
          transformer.gif({ quality });
        }

        // Write the optimized image to the file system
        ensureDirectoryExists(optimizedFileNameAndPath);
        const info = await transformer.toFile(optimizedFileNameAndPath);
        const fileSizeInBytes = info.size;
        const fileSizeInMegabytes = fileSizeInBytes / (1024 * 1024);
        sizeOfGeneratedImages += fileSizeInMegabytes;
        progressBar.increment({
          sizeOfGeneratedImages: sizeOfGeneratedImages.toFixed(1),
        });
        allGeneratedImages.push(optimizedFileNameAndPath);

        if (!resize) {
          optimizedOriginalWidthImagePath = optimizedFileNameAndPath;
          optimizedOriginalWidthImageSizeInMegabytes = fileSizeInMegabytes;
        }
      }
    } catch (error) {
      console.log(
        `
      Error while optimizing image ${allImagesInImageFolder[index].file}
      ${error}
      `
      );
      // throw the error so that the process stops
      throw error;
    }
  }
  let data = JSON.stringify(updatedImageHashes, null, 4);
  ensureDirectoryExists(hashFilePath);
  fs.writeFileSync(hashFilePath, data);

  // Copy the optimized images to the build folder

  console.log("Copy optimized images to build folder...");
  for (let index = 0; index < allGeneratedImages.length; index++) {
    const filePath = allGeneratedImages[index];
    const fileInBuildFolder = path.join(
      exportFolderPath,
      (() => {
        const parts = filePath.split("public");
        if (parts.length > 1) {
          return parts.slice(1).join("public");
        } else {
          // Handle case where 'public' is not found
          return filePath;
        }
      })()
    );

    // Create the folder for the optimized images in the build directory if it does not exists
    ensureDirectoryExists(fileInBuildFolder);
    fs.copyFileSync(filePath, fileInBuildFolder);
  }

  function findSubfolders(
    rootPath: string,
    folderName: string,
    results: string[] = []
  ) {
    const items = fs.readdirSync(rootPath);
    for (const item of items) {
      const itemPath = path.join(rootPath, item);
      const stat = fs.statSync(itemPath);
      if (stat.isDirectory()) {
        if (item === folderName) {
          results.push(itemPath);
        }
        findSubfolders(itemPath, folderName, results);
      }
    }
    return results;
  }

  const optimizedImagesFolders = findSubfolders(
    imageFolderPath,
    exportFolderName
  );
  optimizedImagesFolders.push(`public/${exportFolderName}`);

  function findImageFiles(
    folderPath: string,
    extensions: string[],
    results: string[] = []
  ) {
    // check if the folder exists
    if (!fs.existsSync(folderPath)) {
      return results;
    }
    const items = fs.readdirSync(folderPath);
    for (const item of items) {
      const itemPath = path.join(folderPath, item);
      const stat = fs.statSync(itemPath);
      if (stat.isDirectory()) {
        findImageFiles(itemPath, extensions, results);
      } else {
        const ext = path.extname(item).toUpperCase();
        if (extensions.includes(ext)) {
          results.push(itemPath);
        }
      }
    }
    return results;
  }

  const imageExtensions = [".PNG", ".GIF", ".JPG", ".JPEG", ".AVIF", ".WEBP"];

  const imagePaths: string[] = [];
  for (const subfolderPath of optimizedImagesFolders) {
    const paths = findImageFiles(subfolderPath, imageExtensions);
    imagePaths.push(...paths);
  }

  // find the optimized images that are no longer used in the project
  const unusedImages: string[] = [];
  for (const imagePath of imagePaths) {
    const isUsed = allGeneratedImages.includes(imagePath);
    if (!isUsed) {
      unusedImages.push(imagePath);
    }
  }
  // delete the unused images
  for (const imagePath of unusedImages) {
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
  }
  if (unusedImages.length > 0)
    console.log(
      `Deleted ${unusedImages.length} unused image${
        unusedImages.length > 1 ? "s" : ""
      } from the optimized images folders.`
    );

  console.log("---- next-image-export-optimizer: Done ---- ");
};

if (require.main === module) {
  nextImageExportOptimizer();
}
module.exports = nextImageExportOptimizer;

