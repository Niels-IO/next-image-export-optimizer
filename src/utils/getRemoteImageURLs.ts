import path from "path";
import fs from "fs";

const urlToFilename = require("./urlToFilename");

export async function getRemoteImageURLs(
  nextConfigFolder: string,
  folderPathForRemoteImages: string
) {
  let remoteImageURLs: string[] = [];
  const remoteImagesFilePath = path.join(
    nextConfigFolder,
    "remoteOptimizedImages.js"
  );
  if (fs.existsSync(remoteImagesFilePath)) {
    const remoteOptimizedImages = await require(remoteImagesFilePath);

    remoteImageURLs = remoteOptimizedImages;
  }
  // Create the filenames for the remote images
  const remoteImageFilenames = remoteImageURLs.map((url: string) => {
    const encodedURL = urlToFilename(url);

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
