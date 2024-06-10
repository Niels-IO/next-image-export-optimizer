import { ImageObject } from "./ImageObject";
import path from "path";
import fs from "fs";
import { RemoteImage } from "./getRemoteImageURLs";
const http = require("http");
const https = require("https");
const urlModule = require("url"); // Import url module to parse the url

async function downloadImage(
  urlObj: RemoteImage,
  filename: string,
  folder: string
) {
  return new Promise<void>((resolve, reject) => {
    // Choose the right http library:
    const httpLib =
      urlModule.parse(urlObj.url).protocol === "http:" ? http : https;

    const options = {
      headers: urlObj.headers || {},
    };

    const request = httpLib.get(urlObj.url, options, function (response: any) {
      if (response.statusCode !== 200) {
        console.error(
          `Error: Unable to download ${urlObj.url} (status code: ${response.statusCode}).`
        );
        reject(new Error(`Status code: ${response.statusCode}`));
        return;
      }
      // check if the file is a valid image by checking the content type
      if (
        !response.headers["content-type"].startsWith("image/") &&
        !response.headers["content-type"].startsWith("application/octet-stream")
      ) {
        console.error(
          `Error: Unable to download ${urlObj.url} (invalid content type: ${response.headers["content-type"]}).`
        );
        reject(
          new Error(`Invalid content type: ${response.headers["content-type"]}`)
        );
        return;
      }

      // Extract image format from response headers
      const contentType = response.headers["content-type"];
      let imageFormat = contentType.split("/").pop();

      // Further split on semicolon (;) if exists
      if (imageFormat.includes(";")) {
        imageFormat = imageFormat.split(";")[0];
      }

      // Further split on plus (+) if exists, e.g. image/svg+xml
      if (imageFormat.includes("+")) {
        imageFormat = imageFormat.split("+")[0];
      }

      // Check for jpeg and change it to jpg if necessary
      if (imageFormat === "jpeg") {
        imageFormat = "jpg";
      }

      // Check if filename already has an extension that matches the image format
      const regex = new RegExp(`.${imageFormat}$`, "i");
      const hasMatchingExtension = regex.test(filename);

      // Add appropriate extension to filename based on image format
      const formattedFilename = hasMatchingExtension
        ? filename
        : `${filename}.${imageFormat}`;

      fs.access(folder, fs.constants.W_OK, function (err: any) {
        if (err) {
          console.error(
            `Error: Unable to write to ${folder} (${err.message}).`
          );
          reject(err);
          return;
        }
        // on close, check the file size and reject if it's 0 otherwise resolve
        response
          .pipe(fs.createWriteStream(formattedFilename))
          .on("error", function (err: any) {
            console.error(
              `Error: Unable to save ${formattedFilename} (${err.message}).`
            );
            reject(err);
          })
          .on("close", function () {
            fs.stat(formattedFilename, function (err: any, stats: any) {
              if (err) {
                console.error(
                  `Error: Unable to get the size of ${formattedFilename} (${err.message}).`
                );
                reject(err);
                return;
              }

              if (stats.size === 0) {
                console.error(
                  `Error: Unable to save ${formattedFilename} (empty file).`
                );
                reject(new Error("Empty file"));
                return;
              }
              // to cache the image locally, we store a file with the same name as the image, but with a .lastUpdated extension and the timestamp
              storeLastUpdated({
                basePath: folder,
                file: formattedFilename,
                dirPathWithoutBasePath: "",
                fullPath: formattedFilename,
              });

              resolve();
            });
          });
      });
    });
    request.on("error", (err: Error) => {
      console.error(`Error: Unable to download ${urlObj.url}.`, err);
      reject(err);
    });
  });
}

export async function downloadImagesInBatches(
  imagesURLs: RemoteImage[],
  imageFileNames: ImageObject[],
  folder: string,
  batchSize: number,
  remoteImageCacheTTL: number
) {
  let downloadedImages = 0;
  let cachedImages = 0;
  const batches = Math.ceil(imagesURLs.length / batchSize); // determine the number of batches
  for (let i = 0; i < batches; i++) {
    const start = i * batchSize; // calculate the start index of the batch
    const end = Math.min(imagesURLs.length, start + batchSize); // calculate the end index of the batch
    const batchURLs = imagesURLs.slice(start, end); // slice the URLs for the current batch
    const batchFileNames = imageFileNames.slice(start, end); // slice the file names for the current batch
    for (let j = 0; j < batchFileNames.length; j++) {
      if (batchFileNames[j].fullPath === undefined) {
        console.error(
          `Error: Unable to download ${batchURLs[i]} (fullPath is undefined).`
        );
        return;
      }
    }

    const promises = batchURLs.map((urlObj, index) => {
      const file = batchFileNames[index];
      if (file.fullPath === undefined) {
        console.error(
          `Error: Unable to download ${urlObj.url} (fullPath is undefined).`
        );
        return Promise.resolve();
      }

      // check if the image was downloaded before and if it's still valid
      // if it's valid, skip downloading it again
      // if there is no .lastUpdated file, download the image
      // if there is a .lastUpdated file, check if it's older than the image
      // if it's older, download the image

      const lastUpdatedFilename = `${file.file}.lastUpdated`;
      const lastUpdatedPath = path.join(file.basePath, lastUpdatedFilename);

      let skipDownload = false;
      if (fs.existsSync(lastUpdatedPath) && fs.existsSync(file.fullPath)) {
        const lastUpdated = fs.readFileSync(lastUpdatedPath, "utf8");
        const lastUpdatedTimestamp = parseInt(lastUpdated);
        const now = Date.now();
        const timeDifferenceInSeconds = (now - lastUpdatedTimestamp) / 1000;

        if (timeDifferenceInSeconds < remoteImageCacheTTL) {
          // console.log(
          //   `Skipping download of ${file.file} because it was downloaded ${timeDifferenceInSeconds} seconds ago.`
          // );
          skipDownload = true;
          cachedImages++;
        }
      } else {
        // console.log("No .lastUpdated file found");
      }

      if (skipDownload) {
        return Promise.resolve();
      }
      downloadedImages++;
      return downloadImage(urlObj, file.fullPath as string, folder);
    }); // create an array of promises for downloading images in the batch

    try {
      await Promise.all(promises); // download images in parallel for the current batch
      downloadedImages > 0 &&
        console.log(
          `Downloaded ${downloadedImages} remote image${
            downloadedImages > 1 ? "s" : ""
          }.`
        );
      cachedImages > 0 &&
        console.log(
          `Used ${cachedImages} cached remote image${
            cachedImages > 1 ? "s" : ""
          }.`
        );
    } catch (err: any) {
      console.error(
        `Error: Unable to download remote images (${err.message}).`
      );
      throw err;
    }
  }
}

const storeLastUpdated = (file: ImageObject) => {
  // to cache the image locally, we need to know last time it was downloaded
  // so we can check if it's still valid
  // store a file with the same name as the image, but with a .lastUpdated extension and the timestamp
  const lastUpdated = Date.now();

  const lastUpdatedFilename = `${file.file}.lastUpdated`;
  try {
    fs.writeFileSync(lastUpdatedFilename, lastUpdated.toString());
  } catch (error) {
    console.error(
      `Error writing the cache file for ${lastUpdatedFilename}: `,
      error
    );
    throw error;
  }
};
