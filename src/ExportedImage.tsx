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
  className,
  width,
  height,
  onLoadingComplete,
  unoptimized,
  placeholder = "blur",
  blurDataURL,
  style,
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
          backgroundImage: `url(${automaticallyCalculatedBlurDataURL})`,
          filter: "url(#sharpBlur)",
        }
      : undefined;

  const ImageElement = (
    <Image
      {...rest}
      {...(width && { width })}
      {...(height && { height })}
      {...(loading && { loading })}
      {...(className && { className })}
      {...(onLoadingComplete && { onLoadingComplete })}
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
          : (e) => optimizedLoader({ src, width: e.width })
      }
      blurDataURL={automaticallyCalculatedBlurDataURL}
      onError={(error) => {
        setImageError(true);
        setBlurComplete(true);
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
        setBlurComplete(true);

        // execute the onLoadingComplete callback if present
        onLoadingComplete && onLoadingComplete(result);
      }}
      src={src}
    />
  );

  // When we present a placeholder, we add a svg filter to the image and remove it after either
  // the image is loaded or an error occurred
  return blurStyle ? (
    <>
      {/* In case javascript is disabled, we show a fallback without blurry placeholder */}
      <noscript>
        <Image
          {...rest}
          {...(width && { width })}
          {...(height && { height })}
          {...(loading && { loading })}
          {...(className && { className })}
          placeholder="empty"
          {...(unoptimized && { unoptimized })}
          {...(priority && { priority })}
          style={style}
          loader={
            imageError || unoptimized === true
              ? fallbackLoader
              : (e) => optimizedLoader({ src, width: e.width })
          }
          src={src}
        />
      </noscript>
      {ImageElement}
      <svg
        style={{
          border: 0,
          clip: "rect(0 0 0 0)",
          height: 0,
          margin: "-1px",
          overflow: "hidden",
          padding: 0,
          position: "absolute",
          width: "1px",
        }}
      >
        <filter id="sharpBlur">
          <feGaussianBlur
            stdDeviation="20"
            colorInterpolationFilters="sRGB"
          ></feGaussianBlur>
          <feColorMatrix
            type="matrix"
            colorInterpolationFilters="sRGB"
            values="1 0 0 0 0, 0 1 0 0 0, 0 0 1 0 0, 0 0 0 9 0"
          ></feColorMatrix>

          <feComposite in2="SourceGraphic" operator="in"></feComposite>
        </filter>
      </svg>
    </>
  ) : (
    ImageElement
  );
}

export default ExportedImage;
