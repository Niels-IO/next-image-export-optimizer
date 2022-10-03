import Image from "next/image";
import React, { useMemo, useState } from "react";
import { ImageProps, StaticImageData } from "next/image";
// import dynamic from "next/dynamic";

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
    (process.env.storePicturesInWEBP === true ||
      process.env.nextImageExportOptimizer_storePicturesInWEBP === true) &&
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
  let imageFolderPath =
    process.env.nextImageExportOptimizer_imageFolderPath || "public/images";
  imageFolderPath = imageFolderPath
    .replace("/public/", "")
    .replace("public/", "");
  const correctedPathForStaticImages = `${imageFolderPath}/`;
  const isStaticImage = src.includes("_next/static/media");

  let generatedImageURL = `${
    isStaticImage ? correctedPathForStaticImages : correctedPath
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
}: {
  src: string | StaticImageData;
  width: number;
}) => {
  const isStaticImage = typeof src === "object";
  const _src = isStaticImage ? src.src : src;
  return generateImageURL(_src, width);
};

const fallbackLoader = ({ src }: { src: string | StaticImageData }) => {
  const _src = typeof src === "object" ? src.src : src;
  return _src;
};

export interface ExportedImageProps
  extends Omit<ImageProps, "src" | "loader" | "onError"> {
  src: string | StaticImageData;
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
  unoptimized,
  placeholder = process.env.generateAndUseBlurImages === true ||
  process.env.nextImageExportOptimizer_generateAndUseBlurImages === true
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
    // check if the src is specified as a local file -> then it is an object
    const isStaticImage = typeof src === "object";
    const _src = isStaticImage ? src.src : src;
    if (unoptimized === true) {
      // return the src image when unoptimized
      return _src;
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
      {...(unoptimized && { unoptimized })}
      {...(imageError && { unoptimized: true })}
      {...(process.env.NODE_ENV !== "production" && { placeholder: "empty" })}
      {...(process.env.NODE_ENV !== "production" && { unoptimized: true })}
      loader={
        process.env.NODE_ENV !== "production" ||
        imageError ||
        unoptimized === true
          ? fallbackLoader
          : optimizedLoader
      }
      blurDataURL={automaticallyCalculatedBlurDataURL}
      onError={() => {
        setImageError(true);
      }}
      onLoadingComplete={(result) => {
        // for some configurations, the onError handler is not called on an error occurrence
        // so we need to check if the image is loaded correctly
        if (result.naturalWidth === 0) {
          // Broken image, fall back to unoptimized (meaning the original image src)
          setImageError(true);
        }
      }}
      src={typeof src === "object" ? src.src : src}
    />
  );
}

// // Dynamic loading with SSR off is necessary as the image component runs into
// // hydration errors otherwise
// const DynamicExportedImage = dynamic(() => Promise.resolve(ExportedImage), {
//   ssr: false,
// });

// export default function (props: ExportedImageProps) {
//   const isStaticImage = typeof props.src === "object";
//   const width = (isStaticImage && props.width) || (props.src as any).width;
//   const height = (isStaticImage && props.height) || (props.src as any).height;

//   return isStaticImage ? (
//     <div style={isStaticImage ? { aspectRatio: width / height } : {}}>
//       <DynamicExportedImage {...props} />
//     </div>
//   ) : (
//     <DynamicExportedImage {...props} />
//   );
// }
export default ExportedImage;
