import dynamic from "next/dynamic";

// Dynamic loading with SSR off is necessary as there might be a race condition otherwise,
// when the image loaded and errored before the JS error handler is attached
const Image = dynamic(() => import("next/image"), { ssr: false });
import React, { useState } from "react";

const splitFilePath = ({ filePath }) => {
  const filenameWithExtension = filePath.split("\\").pop().split("/").pop();
  const filePathWithoutFilename = filePath.split(filenameWithExtension).shift();
  const fileExtension = filePath.split(".").pop();
  const filenameWithoutExtension =
    filenameWithExtension.substring(
      0,
      filenameWithExtension.lastIndexOf(".")
    ) || filenameWithExtension;
  return {
    path: filePathWithoutFilename,
    filename: filenameWithoutExtension,
    extension: fileExtension,
  };
};

const optimizedLoader = ({ src, width }) => {
  const { filename, path, extension } = splitFilePath({ filePath: src });

  // If the images are stored as WEBP by the package, then we should change
  // the extension to WEBP to load them correctly
  let processedExtension = extension;
  if (
    process.env.storePicturesInWEBP === true &&
    ["JPG", "JPEG", "PNG"].includes(extension.toUpperCase())
  ) {
    processedExtension = "WEBP";
  }
  return `${path}nextImageExportOptimizer/${filename}-opt-${width}.${processedExtension.toUpperCase()}`;
};
const fallbackLoader = ({ src }) => {
  return src;
};

function ExportedImage({ src, ...rest }) {
  const [imageError, setImageError] = useState(false);

  return (
    // eslint-disable-next-line jsx-a11y/alt-text
    <Image
      {...rest}
      loader={imageError ? fallbackLoader : optimizedLoader}
      src={src}
      onError={() => {
        setImageError(true);
      }}
    />
  );
}
export default ExportedImage;
