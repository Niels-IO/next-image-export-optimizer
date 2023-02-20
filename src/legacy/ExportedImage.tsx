import React, { useMemo, useState } from "react";
import Image, { ImageProps, StaticImageData } from "next/legacy/image";

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

const generateImageURL = (
  src: string,
  width: number,
  isRemoteImage: boolean = false
) => {
  const { filename, path, extension } = splitFilePath({ filePath: src });
  const useWebp =
    process.env.nextImageExportOptimizer_storePicturesInWEBP != undefined
      ? process.env.nextImageExportOptimizer_storePicturesInWEBP
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

  const exportFolderName =
    process.env.nextImageExportOptimizer_exportFolderName ||
    "nextImageExportOptimizer";

  let generatedImageURL = `${
    isStaticImage ? "" : correctedPath
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
  filename = filename.replace(/[\x00-\x1F\x7F]/g, "");

  // Trim any leading or trailing spaces
  filename = filename.trim();

  return filename;
}

const imageURLForRemoteImage = ({
  src,
  width,
}: {
  src: string;
  width: number;
}) => {
  const extension = src.split(".").pop();
  // If the extension is not supported, then we log an error and return the src
  if (
    !extension ||
    !["JPG", "JPEG", "WEBP", "PNG", "GIF", "AVIF"].includes(
      extension.toUpperCase()
    )
  ) {
    console.error(
      `The image ${src} has an unsupported extension. Please use JPG, JPEG, WEBP, PNG, GIF or AVIF.`
    );
    return src;
  }
  const encodedSrc = urlToFilename(src);

  return generateImageURL(`${encodedSrc}.${extension}`, width, true);
};

const optimizedLoader = ({
  src,
  width,
}: {
  src: string | StaticImageData;
  width: number;
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
      return generateImageURL(_src, nextLargestSize);
    }
  }

  // Check if the image is a remote image (starts with http or https)
  if (_src.startsWith("http")) {
    return imageURLForRemoteImage({ src: _src, width });
  }

  return generateImageURL(_src, width);
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
    // Check if the image is a remote image (starts with http or https)
    if (_src.startsWith("http")) {
      return imageURLForRemoteImage({ src: _src, width: 10 });
    }

    // otherwise use the generated image of 10px width as a blurDataURL
    return generateImageURL(_src, 10);
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
          : (e) => optimizedLoader({ src, width: e.width })
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
