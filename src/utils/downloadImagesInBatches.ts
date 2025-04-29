import { ImageObject } from "./ImageObject";
import path from "path";
import fs from "fs";

// Helper function to delay execution (e.g., between retries)
function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Function with retry logic
async function downloadImage(
  url: string,
  filename: string,
  folder: string,
  retries: number = 3,
  retryDelay: number = 1000
) {
  return new Promise<void>(async (resolve, reject) => {
    async function retryDownload(attempt: number) {
      try {
        const response = await fetch(url);

        if (!response.ok) {
          console.error(
            `Error: Unable to download ${url} (status code: ${response.status}). Attempt ${attempt} of ${retries}.`
          );
          if (attempt < retries) {
            console.log(`Retrying in ${retryDelay}ms...`);
            await delay(retryDelay);
            return retryDownload(attempt + 1);
          } else {
            reject(new Error(`Status code: ${response.status}`));
            return;
          }
        }

        const contentType = response.headers.get("content-type");
        if (!contentType) {
          console.error(`Error: No content-type header for ${url}`);
          if (attempt < retries) {
            console.log(`Retrying in ${retryDelay}ms...`);
            await delay(retryDelay);
            return retryDownload(attempt + 1);
          } else {
            reject(new Error("No content-type header"));
            return;
          }
        }

        if (
          !contentType.startsWith("image/") &&
          !contentType.startsWith("application/octet-stream")
        ) {
          console.error(
            `Error: Unable to download ${url} (invalid content type: ${contentType}).`
          );
          if (attempt < retries) {
            console.log(`Retrying in ${retryDelay}ms...`);
            await delay(retryDelay);
            return retryDownload(attempt + 1);
          } else {
            reject(new Error(`Invalid content type: ${contentType}`));
            return;
          }
        }

        let imageFormat = contentType.split("/").pop();
        if (!imageFormat) {
          reject(new Error("Unable to determine image format"));
          return;
        }
        // Further split on semicolon (;) if exists
        if (imageFormat.includes(";")) {
          imageFormat = imageFormat.split(";")[0];
        }
        // Further split on plus (+) if exists, e.g., image/svg+xml
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

        await fs.promises.access(folder, fs.constants.W_OK);

        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        await fs.promises.writeFile(formattedFilename, buffer);

        const stats = await fs.promises.stat(formattedFilename);

        if (stats.size === 0) {
          console.error(
            `Error: Unable to save ${formattedFilename} (empty file).`
          );
          reject(new Error("Empty file"));
          return;
        }
        // Cache the image locally by storing a file with the same name as the image, but with a .lastUpdated extension and the timestamp
        storeLastUpdated({
          basePath: folder,
          file: formattedFilename,
          dirPathWithoutBasePath: "",
          fullPath: formattedFilename,
        });

        resolve();
      } catch (err) {
        console.error(
          `Error: Unable to download ${url}. Attempt ${attempt} of ${retries}.`,
          err
        );
        if (attempt < retries) {
          console.log(`Retrying in ${retryDelay}ms...`);
          await delay(retryDelay);
          return retryDownload(attempt + 1);
        } else {
          reject(err);
        }
      }
    }

    // Start the retry logic with the first attempt
    retryDownload(1);
  });
}

export async function downloadImagesInBatches(
  imagesURLs: string[],
  imageFileNames: ImageObject[],
  folder: string,
  batchSize: number,
  remoteImageCacheTTL: number
) {
  let downloadedImages = 0;
  let cachedImages = 0;
  const batches = Math.ceil(imagesURLs.length / batchSize);

  for (let i = 0; i < batches; i++) {
    const start = i * batchSize;
    const end = Math.min(imagesURLs.length, start + batchSize);
    const batchURLs = imagesURLs.slice(start, end);
    const batchFileNames = imageFileNames.slice(start, end);

    for (let j = 0; j < batchFileNames.length; j++) {
      if (batchFileNames[j].fullPath === undefined) {
        console.error(
          `Error: Unable to download ${batchURLs[i]} (fullPath is undefined).`
        );
        return;
      }
    }

    const promises = batchURLs.map((url, index) => {
      const file = batchFileNames[index];
      if (file.fullPath === undefined) {
        console.error(
          `Error: Unable to download ${url} (fullPath is undefined).`
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
          skipDownload = true;
          cachedImages++;
        }
      }

      if (skipDownload) {
        return Promise.resolve();
      }
      downloadedImages++;
      return downloadImage(url, file.fullPath as string, folder);
    });

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
