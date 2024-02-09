import path from "path";
import fs from "fs";
const path2 = require("path");
const fs2 = require("fs");
const { promisify } = require('util')
const directoryPath = path2.join(__dirname, '../../../../temp_img');
const readdir = promisify(require('fs').readdir)
const stat = promisify(require('fs').stat)

const urlToFilename = require("./urlToFilename");

async function GetImages(){
	let  newArr: string[]= [];
	let files = await readdir(directoryPath);
	files.forEach(function (file: any) {

		const contents =  fs2.readFileSync(path2.join(directoryPath, file), 'utf-8');
		newArr = newArr.concat(JSON.parse(contents));
    
	})
	return newArr;
	
}
export async function getRemoteImageURLs(
  nextConfigFolder: string,
  folderPathForRemoteImages: string
) {

  let remoteImageURLs = [];
  if(!process.env.EXPORT_MODE) {
  const remoteImagesFilePath = path.join(
    nextConfigFolder,
    "remoteOptimizedImages.js"
  );
  if (fs.existsSync(remoteImagesFilePath)) {
    const remoteOptimizedImages = await require(remoteImagesFilePath);

    remoteImageURLs = remoteOptimizedImages;
  }
}
else {
  remoteImageURLs = await GetImages();
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
