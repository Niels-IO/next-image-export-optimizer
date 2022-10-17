import React, { useMemo, useState } from "react";
import Image, { ImageProps, StaticImageData } from "next/image";

const splitFilePath = ({ filePath }: { filePath: string }) => {
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

const generateImageURL = (src: string, width: number, useWebp: boolean) => {
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

  if (useWebp && ["JPG", "JPEG", "PNG"].includes(extension.toUpperCase())) {
    processedExtension = "WEBP";
  }

  let correctedPath = path;
  const lastChar = correctedPath?.substr(-1); // Selects the last character
  if (lastChar != "/") {
    // If the last character is not a slash
    correctedPath = correctedPath + "/"; // Append a slash to it.
  }

  const isStaticImage = src.includes("_next/static/media");

  let generatedImageURL = `${
    isStaticImage ? "" : correctedPath
  }nextImageExportOptimizer/${filename}-opt-${width}.${processedExtension.toUpperCase()}`;
  // if the generatedImageURL is not starting with a slash, then we add one
  if (generatedImageURL.charAt(0) !== "/") {
    generatedImageURL = "/" + generatedImageURL;
  }

  return generatedImageURL;
};

const optimizedLoader = ({
  src,
  width,
  useWebp,
}: {
  src: string | StaticImageData;
  width: number;
  useWebp: boolean;
}) => {
  const isStaticImage = typeof src === "object";
  const _src = isStaticImage ? src.src : src;

  return generateImageURL(_src, width, useWebp);
};

const fallbackLoader = ({ src }: { src: string | StaticImageData }) => {
  const _src = typeof src === "object" ? src.src : src;
  return _src;
};

export interface ExportedImageProps
  extends Omit<ImageProps, "src" | "loader" | "quality"> {
  src: string | StaticImageData;
  useWebp?: boolean;
}

function ExportedImage({
  src,
  priority = false,
  loading,
  lazyRoot = null,
  lazyBoundary = "200px",
  className,
  width,
  height,
  objectFit,
  objectPosition,
  useWebp = true,
  onLoadingComplete,
  unoptimized,
  placeholder = "blur",
  blurDataURL,
  onError,
  ...rest
}: ExportedImageProps) {
  const [imageError, setImageError] = useState(false);
  const automaticallyCalculatedBlurDataURL = useMemo(() => {
    if (blurDataURL) {
      // use the user provided blurDataURL if present
      return blurDataURL;
    }
    // check if the src is specified as a local file -> then it is an object
    const isStaticImage = typeof src === "object";
    const _src = isStaticImage ? src.src : src;
    if (unoptimized === true) {
      // return the src image when unoptimized
      return _src;
    }
    // otherwise use the generated image of 10px width as a blurDataURL
    return generateImageURL(_src, 10, useWebp);
  }, [blurDataURL, src, unoptimized]);

  return (
    <Image
      {...rest}
      {...(typeof src === "object" && src.width && { width: src.width })}
      {...(typeof src === "object" && src.height && { height: src.height })}
      {...(width && { width })}
      {...(height && { height })}
      {...(loading && { loading })}
      {...(lazyRoot && { lazyRoot })}
      {...(lazyBoundary && { lazyBoundary })}
      {...(className && { className })}
      {...(objectFit && { objectFit })}
      {...(objectPosition && { objectPosition })}
      {...(onLoadingComplete && { onLoadingComplete })}
      {...(placeholder && { placeholder })}
      {...(unoptimized && { unoptimized })}
      {...(priority && { priority })}
      {...(imageError && { unoptimized: true })}
      loader={
        imageError || unoptimized === true
          ? fallbackLoader
          : (e) => optimizedLoader({ src, width: e.width, useWebp })
      }
      blurDataURL={automaticallyCalculatedBlurDataURL}
      onError={(error) => {
        setImageError(true);
        // execute the onError function if provided
        onError && onError(error);
      }}
      onLoadingComplete={(result) => {
        // for some configurations, the onError handler is not called on an error occurrence
        // so we need to check if the image is loaded correctly
        if (result.naturalWidth === 0) {
          // Broken image, fall back to unoptimized (meaning the original image src)
          setImageError(true);
        }
        // execute the onLoadingComplete callback if present
        onLoadingComplete && onLoadingComplete(result);
      }}
      src={typeof src === "object" ? src.src : src}
    />
  );
}

export default ExportedImage;
