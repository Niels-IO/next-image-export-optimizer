module.exports = function urlToFilename(url: string) {
  // Remove the protocol from the URL
  let filename = url.replace(/^(https?|ftp):\/\//, "");

  // Replace special characters with underscores
  filename = filename.replace(/[/\\:*?"<>|#%]/g, "_");

  // Remove control characters
  // eslint-disable-next-line no-control-regex
  filename = filename.replace(/[\x00-\x1F\x7F]/g, "");

  // Trim any leading or trailing spaces
  filename = filename.trim();

  return filename;
};
