import dynamic from "next/dynamic";

import Image from "next/image";
import React, { useState, useMemo } from "react";
import { ImageProps } from "next/image";

type SplitFilePathProps = {
  filePath: string;
};

const splitFilePath = ({ filePath }: SplitFilePathProps) => {
  const filenameWithExtension =
    filePath.split("\\").pop()?.split("/").pop() || "";
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
    extension: fileExtension || "",
  };
};

const generateImageURL = (src: string, width: number) => {
  const { filename, path, extension } = splitFilePath({ filePath: src });

  if (
    !["JPG", "JPEG", "WEBP", "PNG", "AVIF"].includes(extension.toUpperCase())
  ) {
    // The images has an unsupported extension
    // We will return the src
    return src;
  }
  // If the images are stored as WEBP by the package, then we should change
  // the extension to WEBP to load them correctly
  let processedExtension = extension;

  if (
    process.env.storePicturesInWEBP === true &&
    ["JPG", "JPEG", "PNG"].includes(extension.toUpperCase())
  ) {
    processedExtension = "WEBP";
  }
  let correctedPath = path;
  const lastChar = correctedPath?.substr(-1); // Selects the last character
  if (lastChar != "/") {
    // If the last character is not a slash
    correctedPath = correctedPath + "/"; // Append a slash to it.
  }

  return `${correctedPath}nextImageExportOptimizer/${filename}-opt-${width}.${processedExtension.toUpperCase()}`;
};

const optimizedLoader = ({ src, width }: { src: string; width: number }) => {
  return generateImageURL(src, width);
};
const fallbackLoader = ({ src }: { src: string }) => {
  return src;
};

export interface ExportedImageProps
  extends Omit<ImageProps, "src" | "loader" | "onError" | "unoptimized"> {
  src: string;
}

function ExportedImage({
  src,
  priority = false,
  loading,
  lazyRoot = null,
  lazyBoundary = "200px",
  className,
  quality,
  width,
  height,
  objectFit,
  objectPosition,
  onLoadingComplete,
  placeholder = process.env.generateAndUseBlurImages === true
    ? "blur"
    : "empty",
  blurDataURL,
  ...rest
}: ExportedImageProps) {
  const [imageError, setImageError] = useState(false);
  const automaticallyCalculatedBlurDataURL = useMemo(() => {
    if (blurDataURL) {
      // use the user provided blurDataURL if present
      return blurDataURL;
    }
    // otherwise use the generated image of 10px width as a blurDataURL
    return generateImageURL(src, 10);
  }, [blurDataURL, src]);

  return (
    <Image
      {...rest}
      {...(width && { width })}
      {...(height && { height })}
      {...(priority && { priority })}
      {...(loading && { loading })}
      {...(lazyRoot && { lazyRoot })}
      {...(lazyBoundary && { lazyBoundary })}
      {...(className && { className })}
      {...(quality && { quality })}
      {...(objectFit && { objectFit })}
      {...(objectPosition && { objectPosition })}
      {...(onLoadingComplete && { onLoadingComplete })}
      {...(placeholder && { placeholder })}
      loader={imageError ? fallbackLoader : optimizedLoader}
      blurDataURL={automaticallyCalculatedBlurDataURL}
      src={src}
      onError={() => {
        setImageError(true);
      }}
    />
  );
}
// Dynamic loading with SSR off is necessary as there is a race condition otherwise,
// when the image loaded and errored before the JS error handler is attached
export default dynamic(() => Promise.resolve(ExportedImage), {
  ssr: false,
});
