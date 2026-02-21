import fs from "fs";
import path from "path";
import { createRequire } from "module";
import sharp from "sharp";
import { ImageObject } from "./utils/ImageObject.js";
import defineProgressBar from "./utils/defineProgressBar.js";
import ensureDirectoryExists from "./utils/ensureDirectoryExists.js";
import getAllFilesAsObject from "./utils/getAllFilesAsObject.js";
import getHash from "./utils/getHash.js";
import { getRemoteImageURLs } from "./utils/getRemoteImageURLs.js";
import { downloadImagesInBatches } from "./utils/downloadImagesInBatches.js";
import urlToFilename from "./utils/urlToFilename.js";

export interface OptimizeImagesConfig {
  imageFolderPath: string;
  staticImageFolderPath: string;
  exportFolderPath: string;
  deviceSizes: number[];
  imageSizes: number[];
  quality: number;
  storePicturesInWEBP: boolean;
  exportFolderName: string;
  remoteImagesFolderName: string;
  basePath: string;
}

export interface OptimizeImagesResult {
  generatedImages: string[];
  sizeInMB: number;
}

export async function optimizeImages(
  images: ImageObject[],
  config: OptimizeImagesConfig
): Promise<OptimizeImagesResult> {
  const {
    staticImageFolderPath,
    exportFolderPath,
    deviceSizes,
    imageSizes,
    quality,
    storePicturesInWEBP,
    exportFolderName,
    remoteImagesFolderName,
    basePath,
  } = config;

  let widths = [...imageSizes, ...deviceSizes];
  widths.sort((a, b) => a - b);
  widths = widths.filter((item, index) => widths.indexOf(item) === index);

  // Filter to only supported image formats
  const allImagesInImageFolder = images.filter((fileObject: ImageObject) => {
    if (fileObject === undefined) return false;
    if (fileObject.file === undefined) return false;
    const filenameSplit = fileObject.file.split(".");
    if (filenameSplit.length === 1) return false;
    const extension = filenameSplit.pop()!.toUpperCase();
    return ["JPG", "JPEG", "WEBP", "PNG", "AVIF", "GIF"].includes(extension);
  });

  // Load existing hashes
  let imageHashes: { [key: string]: string } = {};
  const hashFilePath = path.join(
    exportFolderName,
    "next-image-export-optimizer-hashes.json"
  );
  try {
    const rawData = fs.readFileSync(hashFilePath);
    imageHashes = JSON.parse(rawData.toString());
  } catch (e) {
    // No image hashes yet
  }

  const progressBar = defineProgressBar();
  if (allImagesInImageFolder.length > 0) {
    progressBar.start(allImagesInImageFolder.length * widths.length, 0, {
      sizeOfGeneratedImages: 0,
    });
  }

  let sizeOfGeneratedImages = 0;
  const allGeneratedImages: string[] = [];
  const updatedImageHashes: { [key: string]: string } = {};

  for (let index = 0; index < allImagesInImageFolder.length; index++) {
    const file = allImagesInImageFolder[index].file;
    const fileDirectory = allImagesInImageFolder[index].dirPathWithoutBasePath;
    const imageBasePath = allImagesInImageFolder[index].basePath;

    let extension = file.split(".").pop()!.toLowerCase();
    const imageBuffer = fs.readFileSync(
      path.join(imageBasePath, fileDirectory, file)
    );
    const imageHash = getHash([
      imageBuffer,
      ...widths.map(String),
      String(quality),
      fileDirectory,
      file,
    ]);
    const keyForImageHashes = `${fileDirectory}/${file}`;

    const hashContentChanged = imageHashes[keyForImageHashes] !== imageHash;
    updatedImageHashes[keyForImageHashes] = imageHash;

    let optimizedOriginalWidthImagePath: string | undefined;
    let optimizedOriginalWidthImageSizeInMegabytes: number | undefined;

    for (let indexWidth = 0; indexWidth < widths.length; indexWidth++) {
      const width = widths[indexWidth];
      const filename = path.parse(file).name;

      if (storePicturesInWEBP) {
        extension = "webp";
      }

      const isStaticImage = imageBasePath === staticImageFolderPath;
      const isRemoteImage = imageBasePath.includes("remoteImagesForOptimization");

      let relativeExportPath: string;
      if (isStaticImage) {
        relativeExportPath = path.join("_next/static/media", fileDirectory);
      } else if (isRemoteImage) {
        relativeExportPath = remoteImagesFolderName;
      } else {
        relativeExportPath = fileDirectory;
      }

      const optimizedFileNameAndPath = path.join(
        exportFolderName,
        relativeExportPath,
        `${filename}-opt-${width}.${extension.toLowerCase()}`
      );

      // Check cache
      if (
        !hashContentChanged &&
        keyForImageHashes in imageHashes &&
        fs.existsSync(optimizedFileNameAndPath)
      ) {
        const stats = fs.statSync(optimizedFileNameAndPath);
        const fileSizeInMegabytes = stats.size / (1024 * 1024);
        sizeOfGeneratedImages += fileSizeInMegabytes;
        progressBar.increment({
          sizeOfGeneratedImages: sizeOfGeneratedImages.toFixed(1),
        });
        allGeneratedImages.push(optimizedFileNameAndPath);
        continue;
      }

      const transformer = sharp(imageBuffer, {
        animated: true,
        limitInputPixels: false,
      });

      transformer.rotate();
      const { width: metaWidth } = await transformer.metadata();

      // Find next largest size for static images
      let nextLargestSize = -1;
      for (let i = 0; i < widths.length; i++) {
        if (
          Number(widths[i]) >= (metaWidth || 0) &&
          (nextLargestSize === -1 || Number(widths[i]) < nextLargestSize)
        ) {
          nextLargestSize = Number(widths[i]);
        }
      }

      if (isStaticImage && nextLargestSize !== -1 && width > nextLargestSize) {
        progressBar.increment({
          sizeOfGeneratedImages: sizeOfGeneratedImages.toFixed(1),
        });
        continue;
      }

      // Copy if we already have the original width optimized
      if (
        optimizedOriginalWidthImagePath &&
        optimizedOriginalWidthImageSizeInMegabytes
      ) {
        ensureDirectoryExists(optimizedFileNameAndPath);
        fs.copyFileSync(optimizedOriginalWidthImagePath, optimizedFileNameAndPath);
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

      if (extension === "avif") {
        if (transformer.avif) {
          transformer.avif({
            quality: Math.max(quality - 15, 0),
            chromaSubsampling: "4:2:0",
          });
        } else {
          transformer.webp({ quality });
        }
      } else if (extension === "webp" || storePicturesInWEBP) {
        transformer.webp({ quality });
      } else if (extension === "png") {
        transformer.png({ quality });
      } else if (extension === "jpeg" || extension === "jpg") {
        transformer.jpeg({ quality });
      } else if (extension === "gif") {
        transformer.gif();
      }

      ensureDirectoryExists(optimizedFileNameAndPath);
      const info = await transformer.toFile(optimizedFileNameAndPath);
      const fileSizeInMegabytes = info.size / (1024 * 1024);
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
  }

  // Save hashes
  const data = JSON.stringify(updatedImageHashes, null, 4);
  ensureDirectoryExists(hashFilePath);
  fs.writeFileSync(hashFilePath, data);

  // Copy to export folder
  const publicDir = path.join(basePath, "public");
  for (const filePath of allGeneratedImages) {
    const relativePath = path.relative(publicDir, filePath);
    const fileInBuildFolder = path.join(exportFolderPath, relativePath);
    ensureDirectoryExists(fileInBuildFolder);
    fs.copyFileSync(filePath, fileInBuildFolder);
  }

  progressBar.stop();

  return {
    generatedImages: allGeneratedImages,
    sizeInMB: sizeOfGeneratedImages,
  };
}

// CLI wrapper
export async function cli() {
  const require = createRequire(import.meta.url);
  const loadConfig = require("next/dist/server/config").default;

  const nextConfigPathIndex = process.argv.indexOf("--nextConfigPath");
  const exportFolderPathIndex = process.argv.indexOf("--exportFolderPath");

  if (process.argv.length === 3) {
    console.error("\x1b[31m");
    console.error(
      "next-image-export-optimizer: Breaking change: Please provide the path to the next.config.[js/ts] file as an argument with the name --nextConfigPath."
    );
    console.error("\x1b[0m");
    process.exit(1);
  }

  let nextConfigPath =
    nextConfigPathIndex !== -1 ? process.argv[nextConfigPathIndex + 1] : undefined;
  let exportFolderPathCommandLine =
    exportFolderPathIndex !== -1 ? process.argv[exportFolderPathIndex + 1] : undefined;

  if (nextConfigPath) {
    nextConfigPath = path.isAbsolute(nextConfigPath)
      ? nextConfigPath
      : path.join(process.cwd(), nextConfigPath);
  } else {
    const jsConfigPath = path.join(process.cwd(), "next.config.js");
    const tsConfigPath = path.join(process.cwd(), "next.config.ts");
    const mjsConfigPath = path.join(process.cwd(), "next.config.mjs");

    if (fs.existsSync(jsConfigPath)) {
      nextConfigPath = jsConfigPath;
    } else if (fs.existsSync(tsConfigPath)) {
      nextConfigPath = tsConfigPath;
    } else if (fs.existsSync(mjsConfigPath)) {
      nextConfigPath = mjsConfigPath;
    } else {
      console.error("\x1b[31m");
      console.error(
        "next-image-export-optimizer: Could not find next.config.js, next.config.ts, or next.config.mjs."
      );
      console.error("\x1b[0m");
      process.exit(1);
    }
  }

  const nextConfigFolder = path.dirname(nextConfigPath);
  const folderNameForRemoteImages = "remoteImagesForOptimization";
  const folderPathForRemoteImages = path.join(nextConfigFolder, folderNameForRemoteImages);

  if (exportFolderPathCommandLine) {
    exportFolderPathCommandLine = path.isAbsolute(exportFolderPathCommandLine)
      ? exportFolderPathCommandLine
      : path.join(process.cwd(), exportFolderPathCommandLine);
  }

  console.log("---- next-image-export-optimizer: Begin with optimization... ----");

  // Default config
  let config: OptimizeImagesConfig = {
    imageFolderPath: "public/images",
    staticImageFolderPath: ".next/static/media",
    exportFolderPath: "out",
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    quality: 75,
    storePicturesInWEBP: true,
    exportFolderName: "nextImageExportOptimizer",
    remoteImagesFolderName: "remoteImages",
    basePath: nextConfigFolder,
  };

  let remoteImageFileName = "remoteOptimizedImages.js";
  let remoteImageCacheTTL = 0;

  try {
    const nextjsConfig = await loadConfig("phase-export", nextConfigFolder);

    if (typeof nextjsConfig !== "object" || nextjsConfig === null) {
      throw new Error("next.config.[js/ts] is not an object");
    }

    const env = nextjsConfig.env;

    if (env?.nextImageExportOptimizer_remoteImagesFilename !== undefined) {
      remoteImageFileName = env.nextImageExportOptimizer_remoteImagesFilename;
    }

    if (env?.nextImageExportOptimizer_imageFolderPath !== undefined) {
      config.imageFolderPath = env.nextImageExportOptimizer_imageFolderPath;
      if (config.imageFolderPath.startsWith("/")) {
        config.imageFolderPath = config.imageFolderPath.slice(1);
      }
    }

    if (env?.nextImageExportOptimizer_exportFolderPath !== undefined) {
      config.exportFolderPath = env.nextImageExportOptimizer_exportFolderPath;
    }

    if (nextjsConfig.images?.deviceSizes !== undefined) {
      config.deviceSizes = nextjsConfig.images.deviceSizes;
    }
    if (nextjsConfig.images?.imageSizes !== undefined) {
      config.imageSizes = nextjsConfig.images.imageSizes;
    }

    if (env?.nextImageExportOptimizer_quality !== undefined) {
      config.quality = Number(env.nextImageExportOptimizer_quality);
    }

    if (env?.nextImageExportOptimizer_storePicturesInWEBP !== undefined) {
      config.storePicturesInWEBP =
        env.nextImageExportOptimizer_storePicturesInWEBP.toLowerCase() === "true";
    }

    if (env?.nextImageExportOptimizer_outputFolderPath !== undefined) {
      config.exportFolderName = env.nextImageExportOptimizer_outputFolderPath;
    }
    if (env?.nextImageExportOptimizer_remoteImagesFolderName !== undefined) {
      config.remoteImagesFolderName = env.nextImageExportOptimizer_remoteImagesFolderName;
    }
    if (env?.nextImageExportOptimizer_remoteImageCacheTTL !== undefined) {
      remoteImageCacheTTL = Number(env.nextImageExportOptimizer_remoteImageCacheTTL);
    }

    if (
      nextjsConfig.transpilePackages === undefined ||
      !nextjsConfig.transpilePackages.includes("next-image-export-optimizer")
    ) {
      console.warn(
        "\x1b[41m",
        `Changed in 1.2.0: You have not set transpilePackages: ["next-image-export-optimizer"] in your next.config.[js/ts].`,
        "\x1b[0m"
      );
    }
  } catch (e) {
    console.error("\x1b[31m");
    console.error("next-image-export-optimizer: Could not load next.config.[js/ts].");
    console.error(e);
    console.error("\x1b[0m");
    process.exit(1);
  }

  // Override export folder from command line
  if (exportFolderPathCommandLine) {
    config.exportFolderPath = exportFolderPathCommandLine;
  }

  // Warn if no public folder
  if (!fs.existsSync(path.join(nextConfigFolder, "public"))) {
    console.warn(
      "\x1b[41m",
      `Could not find a public folder in this directory.`,
      "\x1b[0m"
    );
  }

  // Handle remote images
  const { remoteImageFilenames, remoteImageURLs } = await getRemoteImageURLs(
    remoteImageFileName,
    nextConfigFolder,
    folderPathForRemoteImages
  );

  if (remoteImageURLs.length > 0) {
    if (!fs.existsSync(folderNameForRemoteImages)) {
      fs.mkdirSync(folderNameForRemoteImages);
    }
    console.log(`Found ${remoteImageURLs.length} remote image(s)...`);

    // Clean up old remote images
    const allFilesInRemoteImageFolder: string[] = fs.existsSync(folderNameForRemoteImages)
      ? fs.readdirSync(folderNameForRemoteImages)
      : [];
    const encodedRemoteImageURLs = remoteImageURLs.map((url: string) => urlToFilename(url));

    for (const filename of allFilesInRemoteImageFolder) {
      const filenameWithoutSuffix = filename.endsWith(".lastUpdated")
        ? filename.slice(0, -".lastUpdated".length)
        : filename;
      if (
        !encodedRemoteImageURLs.includes(filename) &&
        !encodedRemoteImageURLs.includes(filenameWithoutSuffix)
      ) {
        fs.unlinkSync(path.join(folderNameForRemoteImages, filename));
      }
    }

    await downloadImagesInBatches(
      remoteImageURLs,
      remoteImageFilenames,
      folderPathForRemoteImages,
      Math.min(remoteImageURLs.length, 20),
      remoteImageCacheTTL
    );
  }

  // Collect images
  const isImageFolderSubdirectoryOfPublicFolder = config.imageFolderPath.includes("public");

  if (!isImageFolderSubdirectoryOfPublicFolder) {
    console.warn(
      "\x1b[41mWarning: The image folder is not a subdirectory of the public folder.\x1b[0m"
    );
  }

  const allImages: ImageObject[] = isImageFolderSubdirectoryOfPublicFolder
    ? getAllFilesAsObject(config.imageFolderPath, config.imageFolderPath, config.exportFolderName)
    : [];

  const staticImages = getAllFilesAsObject(
    config.staticImageFolderPath,
    config.staticImageFolderPath,
    config.exportFolderName
  );
  allImages.push(...staticImages);

  if (remoteImageURLs.length > 0) {
    const remoteFiles = fs.readdirSync(folderNameForRemoteImages);
    for (const filename of remoteFiles) {
      if (!filename.endsWith(".lastUpdated")) {
        allImages.push({
          basePath: folderPathForRemoteImages,
          file: filename,
          dirPathWithoutBasePath: "",
        });
      }
    }
  }

  console.log(`Found ${allImages.length} images to optimize.`);

  const result = await optimizeImages(allImages, config);

  // Clean up unused images
  const imageExtensions = [".png", ".gif", ".jpg", ".jpeg", ".avif", ".webp"];
  const existingImages: string[] = [];

  function findImageFiles(folderPath: string) {
    if (!fs.existsSync(folderPath)) return;
    const items = fs.readdirSync(folderPath);
    for (const item of items) {
      const itemPath = path.join(folderPath, item);
      const stat = fs.statSync(itemPath);
      if (stat.isDirectory()) {
        findImageFiles(itemPath);
      } else {
        const ext = path.extname(item).toLowerCase();
        if (imageExtensions.includes(ext)) {
          existingImages.push(itemPath);
        }
      }
    }
  }

  findImageFiles(config.exportFolderName);

  let deletedCount = 0;
  for (const imagePath of existingImages) {
    if (!result.generatedImages.includes(imagePath)) {
      fs.unlinkSync(imagePath);
      deletedCount++;
    }
  }

  if (deletedCount > 0) {
    console.log(`Deleted ${deletedCount} unused image(s).`);
  }

  console.log("---- next-image-export-optimizer: Done ----");
  process.exit(0);
}

export default optimizeImages;
