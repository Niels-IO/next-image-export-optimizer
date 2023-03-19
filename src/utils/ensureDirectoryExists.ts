export {};
const fs = require("fs");
const path = require("path");

function ensureDirectoryExists(filePath: string) {
  const dirName = path.dirname(filePath);
  if (fs.existsSync(dirName)) {
    return true;
  }
  ensureDirectoryExists(dirName);
  fs.mkdirSync(dirName);
}
module.exports = ensureDirectoryExists;
