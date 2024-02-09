"use client";

import Image, { ImageProps, StaticImageData } from "next/image";
import React, { forwardRef, useMemo, useState } from "react";

const splitFilePath = ({ filePath }: { filePath: string }) => {
  const filenameWithExtension =
    filePath.split("\\").pop()?.split("/").pop() || "";
  const filePathWithoutFilename = filePath.split(filenameWithExtension).shift();
  const fileExtension = filePath.split(".").pop()?.split('_')[0];
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

const generateImageURL = (
  src: string,
  width: number,
  basePath: string | undefined,
  isRemoteImage: boolean = false
) => {
  const { filename, path, extension } = splitFilePath({ filePath: src });
  const useWebp =
    process.env.nextImageExportOptimizer_storePicturesInWEBP != undefined
      ? process.env.nextImageExportOptimizer_storePicturesInWEBP == "true"
      : true;

  if (
    !["JPG", "JPEG", "WEBP", "PNG", "AVIF", "GIF"].includes(
      extension.toUpperCase()
    )
  ) {
    // The images has an unsupported extension
    // We will return the src
    return src;
  }
  // If the images are stored as WEBP by the package, then we should change
  // the extension to WEBP to load them correctly
  let processedExtension = extension;

  if (
    useWebp &&
    ["JPG", "JPEG", "PNG", "GIF"].includes(extension.toUpperCase())
  ) {
    processedExtension = "WEBP";
  }

  let correctedPath = path;
  const lastChar = correctedPath?.substr(-1); // Selects the last character
  if (lastChar != "/") {
    // If the last character is not a slash
    correctedPath = correctedPath + "/"; // Append a slash to it.
  }

  const isStaticImage = src.includes("_next/static/media");

  if (basePath) {
    if (
      basePath.endsWith("/") &&
      correctedPath &&
      correctedPath.startsWith("/")
    ) {
      correctedPath = basePath + correctedPath.slice(1);
    } else if (
      !basePath.endsWith("/") &&
      correctedPath &&
      !correctedPath.startsWith("/")
    ) {
      correctedPath = basePath + "/" + correctedPath;
    } else {
      correctedPath = basePath + correctedPath;
    }
  }

  const exportFolderName =
    process.env.nextImageExportOptimizer_exportFolderName ||
    "nextImageExportOptimizer";
  const basePathPrefixForStaticImages = basePath ? basePath + "/" : "";

  let generatedImageURL = `${
    isStaticImage ? basePathPrefixForStaticImages : correctedPath
  }${exportFolderName}/${filename}-opt-${width}.${processedExtension.toUpperCase()}`;

  // if the generatedImageURL is not starting with a slash, then we add one as long as it is not a remote image
  if (!isRemoteImage && generatedImageURL.charAt(0) !== "/") {
    generatedImageURL = "/" + generatedImageURL;
  }
  return generatedImageURL;
};

function urlToFilename(url: string) {
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
}

const imageURLForRemoteImage = ({
  src,
  width,
  basePath,
}: {
  src: string;
  width: number;
  basePath: string | undefined;
}) => {
  const encodedSrc = urlToFilename(src);

  return generateImageURL(encodedSrc, width, basePath, true);
};

const optimizedLoader = ({
  src,
  width,
  basePath,
}: {
  src: string | StaticImageData;
  width: number;
  basePath: string | undefined;
}) => {
  const isStaticImage = typeof src === "object";
  const _src = isStaticImage ? src.src : src;
  const originalImageWidth = (isStaticImage && src.width) || undefined;

  // if it is a static image, we can use the width of the original image to generate a reduced srcset that returns
  // the same image url for widths that are larger than the original image
  if (isStaticImage && originalImageWidth && width > originalImageWidth) {
    const deviceSizes = process.env.__NEXT_IMAGE_OPTS?.deviceSizes || [
      640, 750, 828, 1080, 1200, 1920, 2048, 3840,
    ];
    const imageSizes = process.env.__NEXT_IMAGE_OPTS?.imageSizes || [
      16, 32, 48, 64, 96, 128, 256, 384,
    ];
    const allSizes = [...deviceSizes, ...imageSizes];

    // only use the width if it is smaller or equal to the next size in the allSizes array
    let nextLargestSize = null;
    for (let i = 0; i < allSizes.length; i++) {
      if (
        Number(allSizes[i]) >= originalImageWidth &&
        (nextLargestSize === null || Number(allSizes[i]) < nextLargestSize)
      ) {
        nextLargestSize = Number(allSizes[i]);
      }
    }

    if (nextLargestSize !== null) {
      return generateImageURL(_src, nextLargestSize, basePath);
    }
  }

  // Check if the image is a remote image (starts with http or https)
  if (_src.startsWith("http")) {
    return imageURLForRemoteImage({ src: _src, width, basePath });
  }

  return generateImageURL(_src, width, basePath);
};

const fallbackLoader = ({ src }: { src: string | StaticImageData }) => {
  let _src = typeof src === "object" ? src.src : src;

  const isRemoteImage = _src.startsWith("http");

  // if the _src does not start with a slash, then we add one as long as it is not a remote image
  if (!isRemoteImage && _src.charAt(0) !== "/") {
    _src = "/" + _src;
  }
  return _src;
};

export interface ExportedImageProps
  extends Omit<ImageProps, "src" | "loader" | "quality"> {
  src: string | StaticImageData;
  basePath?: string;
}

const ExportedImage = forwardRef<HTMLImageElement | null, ExportedImageProps>(
  (
    {
      src,
      priority = false,
      loading,
      className,
      width,
      height,
      onLoad,
      unoptimized,
      placeholder = "blur",
      basePath = "",
      alt = "",
      blurDataURL,
      style,
      onError,
      ...rest
    },
    ref
  ) => {
    const [imageError, setImageError] = useState(false);
    const automaticallyCalculatedBlurDataURL = useMemo(() => {
      if (blurDataURL) {
        // use the user provided blurDataURL if present
        return blurDataURL;
      }
      // check if the src is specified as a local file -> then it is an object
      const isStaticImage = typeof src === "object";
      let _src = isStaticImage ? src.src : src;

      if (unoptimized === true) {
        // return the src image when unoptimized
        return _src;
      }
      // Check if the image is a remote image (starts with http or https)
      if (_src.startsWith("http")) {
        return imageURLForRemoteImage({ src: _src, width: 10, basePath });
      }

      // otherwise use the generated image of 10px width as a blurDataURL
      return generateImageURL(_src, 10, basePath);
    }, [blurDataURL, src, unoptimized, basePath]);

    // check if the src is a SVG image -> then we should not use the blurDataURL and use unoptimized
    const isSVG =
      typeof src === "object" ? src.src.endsWith(".svg") : src.endsWith(".svg");

    const [blurComplete, setBlurComplete] = useState(false);

    // Currently, we have to handle the blurDataURL ourselves as the new Image component
    // is expecting a base64 encoded string, but the generated blurDataURL is a normal URL
    const blurStyle =
      placeholder === "blur" &&
      !isSVG &&
      automaticallyCalculatedBlurDataURL &&
      automaticallyCalculatedBlurDataURL.startsWith("/") &&
      !blurComplete
        ? {
            backgroundSize: style?.objectFit || "cover",
            backgroundPosition: style?.objectPosition || "50% 50%",
            backgroundRepeat: "no-repeat",
            backgroundImage: `url("${automaticallyCalculatedBlurDataURL}")`,
          }
        : undefined;
    const isStaticImage = typeof src === "object";

    let _src = isStaticImage ? src.src : src;
    if (basePath && !isStaticImage && _src.startsWith("/")) {
      _src = basePath + _src;
    }
    if (basePath && !isStaticImage && !_src.startsWith("/")) {
      _src = basePath + "/" + _src;
    }

    return (
      <Image
        ref={ref}
        alt={alt}
        {...rest}
        {...(width && { width })}
        {...(height && { height })}
        {...(loading && { loading })}
        {...(className && { className })}
        {...(onLoad && { onLoad })}
        // if the blurStyle is not "empty", then we take care of the blur behavior ourselves
        // if the blur is complete, we also set the placeholder to empty as it otherwise shows
        // the background image on transparent images
        {...(placeholder && {
          placeholder: blurStyle || blurComplete ? "empty" : placeholder,
        })}
        {...(unoptimized && { unoptimized })}
        {...(priority && { priority })}
        {...(isSVG && { unoptimized: true })}
        style={{ ...style, ...blurStyle }}
        loader={
          imageError || unoptimized === true
            ? fallbackLoader
            : (e) => optimizedLoader({ src, width: e.width, basePath })
        }
        blurDataURL={automaticallyCalculatedBlurDataURL}
        onError={(error) => {
          setImageError(true);
          setBlurComplete(true);
          // execute the onError function if provided
          onError && onError(error);
        }}
        onLoad={(e) => {
          // for some configurations, the onError handler is not called on an error occurrence
          // so we need to check if the image is loaded correctly
          const target = e.target as HTMLImageElement;
          if (target.naturalWidth === 0) {
            // Broken image, fall back to unoptimized (meaning the original image src)
            setImageError(true);
          }
          setBlurComplete(true);

          // execute the onLoad callback if present
          onLoad && onLoad(e);
        }}
        src={isStaticImage ? src : _src}
      />
    );
  }
);
ExportedImage.displayName = "ExportedImage";
export default ExportedImage;
