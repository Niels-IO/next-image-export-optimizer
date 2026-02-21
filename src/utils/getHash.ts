import { createHash, BinaryLike } from "crypto";

export default function getHash(items: (string | BinaryLike)[]) {
  const hash = createHash("sha256");
  for (const item of items) {
    hash.update(item);
  }
  // See https://en.wikipedia.org/wiki/Base64#Filenames
  return hash.digest("base64").replace(/\//g, "-");
}
