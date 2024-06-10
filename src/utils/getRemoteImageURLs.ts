import path from "path";
import fs from "fs";

const urlToFilename = require("./urlToFilename");

export type RemoteImage = {
  url: string;
  headers: HeadersInit;
};

export async function getRemoteImageURLs(
  nextConfigFolder: string,
  folderPathForRemoteImages: string
) {
  let remoteImageURLs: RemoteImage[] = [];
  const remoteImagesFilePath = path.join(
    nextConfigFolder,
    "remoteOptimizedImages.js"
  );
  if (fs.existsSync(remoteImagesFilePath)) {
    const remoteOptimizedImages = await require(remoteImagesFilePath);

    remoteImageURLs = remoteOptimizedImages;

    // go through the remote images and check if the entry is an object or a string
    // if it's a string, convert it to an object

    remoteImageURLs = remoteImageURLs.map((entry: any) => {
      if (typeof entry === "string") {
        return {
          url: entry,
        };
      }
      return entry;
    });
  }
  // Create the filenames for the remote images
  const remoteImageFilenames = remoteImageURLs.map((urlObj: RemoteImage) => {
    const encodedURL = urlToFilename(urlObj.url);

    const filename = path.join(folderPathForRemoteImages, encodedURL);

    return {
      basePath: folderPathForRemoteImages,
      file: encodedURL,
      dirPathWithoutBasePath: "",
      fullPath: filename,
    };
  });

  return { remoteImageFilenames, remoteImageURLs };
}
