#!/usr/bin/env node

const fs = require("fs");
const sharp = require("sharp");
const { createHash } = require("crypto");
const path = require("path");
const cliProgress = require("cli-progress");

function getHash(items) {
  const hash = createHash("sha256");
  for (let item of items) {
    if (typeof item === "number") hash.update(String(item));
    else {
      hash.update(item);
    }
  }
  // See https://en.wikipedia.org/wiki/Base64#Filenames
  return hash.digest("base64").replace(/\//g, "-");
}

const getAllFiles = function (basePath, dirPath, arrayOfFiles) {
  let files = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];
  files.forEach(function (file) {
    if (
      fs.statSync(dirPath + "/" + file).isDirectory() &&
      file !== "nextImageExportOptimizer"
    ) {
      arrayOfFiles = getAllFiles(basePath, dirPath + "/" + file, arrayOfFiles);
    } else {
      const dirPathWithoutBasePath = dirPath
        .replace(basePath, "") // remove the basePath for later path composition
        .replace(/^(\/)/, ""); // remove the first trailing slash if there is one at the first position
      arrayOfFiles.push({ dirPathWithoutBasePath, file });
    }
  });

  return arrayOfFiles;
};

function ensureDirectoryExists(filePath) {
  const dirName = path.dirname(filePath);
  if (fs.existsSync(dirName)) {
    return true;
  }
  ensureDirectoryExists(dirName);
  fs.mkdirSync(dirName);
}

const nextImageExportOptimizer = async function () {
  console.log(
    "---- next-image-export-optimizer: Begin with optimization... ---- "
  );

  // Give the user a warning, if the public directory of Next.js is not found as the user
  // may have run the command in a wrong directory
  if (!fs.existsSync("public")) {
    console.warn(
      "\x1b[41m",
      "Could not find a public folder in this directory. Make sure you run the command in the main directory of your project.",
      "\x1b[0m"
    );
  }

  // Default values
  let imageFolderPath = "public/images";
  let exportFolderPath = "out";
  let deviceSizes = [640, 750, 828, 1080, 1200, 1920, 2048, 3840];
  let imageSizes = [16, 32, 48, 64, 96, 128, 256, 384];
  let quality = 75;
  let storePicturesInWEBP = true;
  let blurSize = [];

  // Read in the configuration parameters
  try {
    // Path to Next.js config in the current directory
    const nextConfigPath = path.join(process.cwd(), "next.config.js");
    const importedConfig = require(nextConfigPath);
    const nextjsConfig =
      typeof importedConfig === "function"
        ? importedConfig([() => {}], {}) // Try to obtain config created with next-compose-plugins
        : importedConfig;

    // Check if nextjsConfig is an object or is undefined
    if (typeof nextjsConfig !== "object" || nextjsConfig === null) {
      throw new Error("next.config.js is not an object");
    }

    if (nextjsConfig.images?.nextImageExportOptimizer?.imageFolderPath) {
      imageFolderPath =
        nextjsConfig.images?.nextImageExportOptimizer.imageFolderPath;
    }
    if (nextjsConfig.images?.nextImageExportOptimizer?.exportFolderPath) {
      exportFolderPath =
        nextjsConfig.images?.nextImageExportOptimizer.exportFolderPath;
    }
    if (nextjsConfig.images?.deviceSizes) {
      deviceSizes = nextjsConfig.images?.deviceSizes;
    }
    if (nextjsConfig.images?.imageSizes) {
      imageSizes = nextjsConfig.images?.imageSizes;
    }
    if (nextjsConfig.images?.nextImageExportOptimizer?.quality) {
      quality = nextjsConfig.images?.nextImageExportOptimizer.quality;
    }
    if (nextjsConfig.env?.storePicturesInWEBP !== undefined) {
      storePicturesInWEBP = nextjsConfig.env?.storePicturesInWEBP;
    }
    if (nextjsConfig.env?.generateAndUseBlurImages !== undefined) {
      blurSize = [10];
    }
  } catch (e) {
    // Configuration file not found
    console.log("Could not find a next.config.js file. Use of default values");
  }

  // Create the folder for the optimized images if it does not exists
  const folderNameForOptImages = `${imageFolderPath}/nextImageExportOptimizer`;
  try {
    if (!fs.existsSync(folderNameForOptImages)) {
      fs.mkdirSync(folderNameForOptImages);
      console.log(`Create image output folder: ${folderNameForOptImages}`);
    }
  } catch (err) {
    console.error(err);
  }

  // Create or read the JSON containing the hashes of the images in the image directory
  let imageHashes = {};
  const hashFilePath = `${imageFolderPath}/next-image-export-optimizer-hashes.json`;
  try {
    let rawData = fs.readFileSync(hashFilePath);
    imageHashes = JSON.parse(rawData);
  } catch (e) {
    // No image hashes yet
  }

  const allFilesInImageFolderAndSubdirectories = getAllFiles(
    imageFolderPath,
    imageFolderPath
  );
  const allImagesInImageFolder = allFilesInImageFolderAndSubdirectories.filter(
    (fileObject) => {
      let extension = fileObject.file.split(".").pop().toUpperCase();
      // Only include file with image extensions
      return ["JPG", "JPEG", "WEBP", "PNG", "AVIF"].includes(extension);
    }
  );
  console.log(
    `Found ${allImagesInImageFolder.length} supported images in ${imageFolderPath} and subdirectories.`
  );

  const widths = [...blurSize, ...imageSizes, ...deviceSizes];

  const progressBar = new cliProgress.SingleBar(
    {
      stopOnComplete: true,
      format: (options, params, payload) => {
        const bar = options.barCompleteString.substring(
          0,
          Math.round(params.progress * options.barsize)
        );
        const percentage = Math.floor(params.progress * 100) + "";
        const progressString = `${bar} ${percentage}% | ETA: ${params.eta}s | ${params.value}/${params.total} | Total size: ${payload.sizeOfGeneratedImages} MB`;

        const stopTime = params.stopTime || Date.now();

        // calculate elapsed time
        const elapsedTime = Math.round(stopTime - params.startTime);
        function msToTime(ms) {
          let seconds = (ms / 1000).toFixed(1);
          let minutes = (ms / (1000 * 60)).toFixed(1);
          let hours = (ms / (1000 * 60 * 60)).toFixed(1);
          let days = (ms / (1000 * 60 * 60 * 24)).toFixed(1);
          if (seconds < 60) return seconds + " seconds";
          else if (minutes < 60) return minutes + " minutes";
          else if (hours < 24) return hours + " hours";
          else return days + " days";
        }

        if (params.value >= params.total) {
          return (
            progressString +
            `\nFinished optimization in: ${msToTime(elapsedTime)}`
          );
        } else {
          return progressString;
        }
      },
    },
    cliProgress.Presets.shades_classic
  );
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
  const allGeneratedImages = [];

  // Loop through all images
  for (let index = 0; index < allImagesInImageFolder.length; index++) {
    const file = allImagesInImageFolder[index].file;
    let fileDirectory = allImagesInImageFolder[index].dirPathWithoutBasePath;

    let extension = file.split(".").pop().toUpperCase();
    const imageBuffer = fs.readFileSync(
      path.join(imageFolderPath, fileDirectory, file)
    );
    const imageHash = getHash([
      imageBuffer,
      ...widths,
      quality,
      fileDirectory,
      file,
    ]);
    // Store image hash in temporary object
    imageHashes[file] = imageHash;

    // Loop through all widths
    for (let indexWidth = 0; indexWidth < widths.length; indexWidth++) {
      const width = widths[indexWidth];

      const filename = path.parse(file).name;
      if (storePicturesInWEBP) {
        extension = "WEBP";
      }
      const optimizedFileNameAndPath = path.join(
        imageFolderPath,
        fileDirectory,
        "nextImageExportOptimizer",
        `${filename}-opt-${width}.${extension.toUpperCase()}`
      );

      // Check if file is already in hash and specific size and quality is present in the
      // opt file directory
      if (file in imageHashes && fs.existsSync(optimizedFileNameAndPath)) {
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
      // Begin sharp transformation logic
      const transformer = sharp(imageBuffer);

      await transformer.rotate();

      const { width: metaWidth } = await transformer.metadata();

      if (metaWidth && metaWidth > width) {
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
    }
  }
  let data = JSON.stringify(imageHashes, null, 4);
  fs.writeFileSync(hashFilePath, data);

  // Copy the optimized images to the build folder

  console.log("Copy optimized images to build folder...");
  for (let index = 0; index < allGeneratedImages.length; index++) {
    const filePath = allGeneratedImages[index];

    const fileInBuildFolder = path.join(
      exportFolderPath,
      filePath.split("public").pop()
    );

    // Create the folder for the optimized images in the build directory if it does not exists
    ensureDirectoryExists(fileInBuildFolder);
    fs.copyFileSync(filePath, fileInBuildFolder);
  }
  console.log("---- next-image-export-optimizer: Done ---- ");
};

if (require.main === module) {
  nextImageExportOptimizer();
}
module.exports = nextImageExportOptimizer;
