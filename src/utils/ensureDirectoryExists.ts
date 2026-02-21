import fs from "fs";
import path from "path";

export default function ensureDirectoryExists(filePath: string): boolean {
  const dirName = path.dirname(filePath);
  if (fs.existsSync(dirName)) {
    return true;
  }
  ensureDirectoryExists(dirName);
  fs.mkdirSync(dirName);
  return true;
}
