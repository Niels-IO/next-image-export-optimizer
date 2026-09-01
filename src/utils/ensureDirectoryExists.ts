export {};
const fs = require("fs");
const path = require("path");

function ensureDirectoryExists(filePath: string) {
  const dirName = path.dirname(filePath);
  fs.mkdirSync(dirName, { recursive: true });
  return true;
}
module.exports = ensureDirectoryExists;
