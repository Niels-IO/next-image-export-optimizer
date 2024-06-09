module.exports = function urlToFilename(url: string) {
  try {
    const parsedUrl = new URL(url);
    const extension = parsedUrl.pathname.split(".").pop();
    if (extension) {
      return hashAlgorithm(url).toString().concat(".", extension);
    }
    return hashAlgorithm(url).toString();
  } catch (error) {
    console.error("Error parsing URL", url, error);
  }
};

// Credits to https://github.com/bryc/code/blob/master/jshash/experimental/cyrb53.js
// This is a hash function that is used to generate a hash from the image URL
const hashAlgorithm = (str: string, seed = 0) => {
  let h1 = 0xdeadbeef ^ seed,
    h2 = 0x41c6ce57 ^ seed;
  for (let i = 0, ch; i < str.length; i++) {
    ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
  h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
  h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);

  return 4294967296 * (2097151 & h2) + (h1 >>> 0);
};
