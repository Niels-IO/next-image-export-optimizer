#!/usr/bin/env node
const fs = require("fs");

function testFiles(name, path1, path2) {
  var tmpBuf = fs.readFileSync(path1);
  var testBuf = fs.readFileSync(path2);
  const result = Buffer.compare(tmpBuf, testBuf);
  //   console.log(result);
  if (result !== 0) {
    throw new Error(`Files for the ${name} image component are different`);
  }
  return result;
}

testFiles(
  "legacy",
  "./example/localTestComponent/ExportedImage.tsx",
  "./src/ExportedImage.tsx"
);
testFiles(
  "future",
  "./example/localTestComponent/ExportedImageFuture.tsx",
  "./src/future/ExportedImage.tsx"
);
