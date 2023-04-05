export {};

const path = require("path");
const fs = require("fs");

const urlToFilename = require("./urlToFilename");

module.exports = async function getRemoteImageURLs(
  nextConfigFolder: string,
  folderPathForRemoteImages: string
) {
  let remoteImageURLs = [];
  const remoteImagesFilePath = path.join(
    nextConfigFolder,
    "remoteOptimizedImages.js"
  );
  if (fs.existsSync(remoteImagesFilePath)) {
    remoteImageURLs = await Promise.resolve(require(remoteImagesFilePath));
  }
  // Create the filenames for the remote images
  const remoteImageFilenames = remoteImageURLs.map((url: string) => {
    const extension = url.split(".").pop();
    // If the extension is not supported, then we log an error
    if (
      !extension ||
      !["JPG", "JPEG", "WEBP", "PNG", "GIF", "AVIF"].includes(
        extension.toUpperCase()
      )
    ) {
      console.error(
        `The image ${url} has an unsupported extension. Please use JPG, JPEG, WEBP, PNG, GIF or AVIF.`
      );
      return;
    }
    const encodedURL = urlToFilename(url);

    const filename = path.join(
      folderPathForRemoteImages,
      `${encodedURL}.${extension}`
    );

    return {
      basePath: folderPathForRemoteImages,
      file: `${encodedURL}.${extension}`,
      dirPathWithoutBasePath: "",
      fullPath: filename,
    };
  });
  return { remoteImageFilenames, remoteImageURLs };
};
