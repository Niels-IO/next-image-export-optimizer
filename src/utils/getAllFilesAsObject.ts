import { ImageObject } from "./ImageObject";
const fs = require("fs");
module.exports = function getAllFilesAsObject(
  basePath: string,
  dirPath: string,
  exportFolderName: string,
  arrayOfFiles: ImageObject[] = []
) {
  // check if the path is existing
  if (fs.existsSync(dirPath)) {
    let files = fs.readdirSync(dirPath);

    files.forEach(function (file: string) {
      if (
        fs.statSync(dirPath + "/" + file).isDirectory() &&
        file !== exportFolderName &&
        file !== "nextImageExportOptimizer" // default export folder name
      ) {
        arrayOfFiles = getAllFilesAsObject(
          basePath,
          dirPath + "/" + file,
          exportFolderName,
          arrayOfFiles
        );
      } else {
        const dirPathWithoutBasePath = dirPath
          .replace(basePath, "") // remove the basePath for later path composition
          .replace(/^(\/)/, ""); // remove the first trailing slash if there is one at the first position
        arrayOfFiles.push({ basePath, dirPathWithoutBasePath, file });
      }
    });
  }

  return arrayOfFiles;
};
