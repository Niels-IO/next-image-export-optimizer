import React, { useMemo, useState } from "react";
import Image, { ImageProps, StaticImageData } from "next/future/image";

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
  className,
  width,
  height,
  useWebp = true,
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
    // otherwise use the generated image of 10px width as a blurDataURL
    return generateImageURL(_src, 10, useWebp);
  }, [blurDataURL, src, unoptimized]);

  const [blurComplete, setBlurComplete] = useState(false);

  // Currently, we have to handle the blurDataURL ourselves as the new Image component
  // is expecting a base64 encoded string, but the generated blurDataURL is a normal URL
  const blurStyle =
    placeholder === "blur" &&
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
      {...(typeof src === "object" && src.width && { width: src.width })}
      {...(typeof src === "object" && src.height && { height: src.height })}
      {...(width && { width })}
      {...(height && { height })}
      {...(loading && { loading })}
      {...(className && { className })}
      {...(onLoadingComplete && { onLoadingComplete })}
      // if the blurStyle is not "empty", then we take care of the blur behavior ourselves
      {...(placeholder && { placeholder: blurStyle ? "empty" : placeholder })}
      {...(unoptimized && { unoptimized })}
      {...(priority && { priority })}
      {...(imageError && { unoptimized: true })}
      style={{ ...style, ...blurStyle }}
      loader={
        imageError || unoptimized === true
          ? fallbackLoader
          : (e) => optimizedLoader({ src, width: e.width, useWebp })
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
      src={typeof src === "object" ? src.src : src}
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
          {...(typeof src === "object" && src.width && { width: src.width })}
          {...(typeof src === "object" && src.height && { height: src.height })}
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
              : (e) => optimizedLoader({ src, width: e.width, useWebp })
          }
          src={typeof src === "object" ? src.src : src}
        />
      </noscript>
      {ImageElement}
      <svg
        style={{
          border: 0,
          clip: "rect(0 0 0 0)",
          height: "1px",
          margin: "-1px",
          overflow: "hidden",
          padding: 0,
          position: "absolute",
          width: "1px",
          display: "none",
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
