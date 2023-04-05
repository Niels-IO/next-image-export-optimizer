import { ImageObject } from "./ImageObject";
const fs = require("fs");
const https = require("https");

async function downloadImage(url: string, filename: string, folder: string) {
  return new Promise<void>((resolve, reject) => {
    https.get(url, function (response: any) {
      if (response.statusCode !== 200) {
        console.error(
          `Error: Unable to download ${url} (status code: ${response.statusCode}).`
        );
        reject(new Error(`Status code: ${response.statusCode}`));
        return;
      }

      fs.access(folder, fs.constants.W_OK, function (err: any) {
        if (err) {
          console.error(
            `Error: Unable to write to ${folder} (${err.message}).`
          );
          reject(err);
          return;
        }

        response
          .pipe(fs.createWriteStream(filename))
          .on("error", function (err: any) {
            console.error(
              `Error: Unable to save ${filename} (${err.message}).`
            );
            reject(err);
          })
          .on("close", resolve);
      });
    });
  });
}

module.exports = async function downloadImagesInBatches(
  imagesURLs: string[],
  imageFileNames: ImageObject[],
  folder: string,
  batchSize: number
) {
  const batches = Math.ceil(imagesURLs.length / batchSize); // determine the number of batches
  for (let i = 0; i < batches; i++) {
    const start = i * batchSize; // calculate the start index of the batch
    const end = Math.min(imagesURLs.length, start + batchSize); // calculate the end index of the batch
    const batchURLs = imagesURLs.slice(start, end); // slice the URLs for the current batch
    const batchFileNames = imageFileNames.slice(start, end); // slice the file names for the current batch
    if (batchFileNames[i].fullPath === undefined) {
      // log an error if the fullPath is not defined
      console.error(
        `Error: Unable to download ${batchURLs[i]} (fullPath is undefined).`
      );
      return;
    }

    const promises = batchURLs.map((url, index) =>
      downloadImage(url, batchFileNames[index].fullPath as string, folder)
    ); // create an array of promises for downloading images in the batch

    try {
      await Promise.all(promises); // download images in parallel for the current batch
    } catch (err: any) {
      console.error(
        `Error: Unable to download remote images (${err.message}).`
      );
    }
  }
};
