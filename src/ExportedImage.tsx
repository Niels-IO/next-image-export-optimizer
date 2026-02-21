import { StaticImageData } from "next/image";
import React, { forwardRef } from "react";

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
  basePath: string | undefined,
  isRemoteImage: boolean = false
) => {
  const { filename, path: srcPath, extension } = splitFilePath({ filePath: src });
  const useWebp =
    process.env.nextImageExportOptimizer_storePicturesInWEBP != undefined
      ? process.env.nextImageExportOptimizer_storePicturesInWEBP == "true"
      : true;

  if (
    !["jpg", "jpeg", "webp", "png", "avif", "gif"].includes(
      extension.toLowerCase()
    )
  ) {
    return src;
  }

  let processedExtension = extension;

  if (
    useWebp &&
    ["jpg", "jpeg", "png", "gif"].includes(extension.toLowerCase())
  ) {
    processedExtension = "webp";
  }

  const isStaticImage = src.includes("_next/static/media");

  const exportFolderName =
    process.env.nextImageExportOptimizer_outputFolderPath ||
    "public/output";
  const exportFolderUrlPrefix =
    "/" + exportFolderName.replace(/^public\/?/, "");

  const imageFolderPath =
    process.env.nextImageExportOptimizer_imageFolderPath || "public/images";
  const imageFolderUrlPrefix = "/" + imageFolderPath.replace(/^public\/?/, "");

  const remoteImagesFolderName =
    process.env.nextImageExportOptimizer_remoteImagesFolderName || "remoteImages";

  let relativePath: string;

  if (isStaticImage) {
    relativePath = "/_next/static/media/";
  } else if (isRemoteImage) {
    relativePath = `/${remoteImagesFolderName}/`;
  } else {
    let correctedPath = srcPath || "";
    if (!correctedPath.endsWith("/")) {
      correctedPath = correctedPath + "/";
    }
    if (correctedPath.startsWith(imageFolderUrlPrefix)) {
      relativePath = correctedPath.slice(imageFolderUrlPrefix.length);
      if (!relativePath.startsWith("/")) {
        relativePath = "/" + relativePath;
      }
    } else {
      relativePath = correctedPath.startsWith("/")
        ? correctedPath
        : "/" + correctedPath;
    }
  }

  const basePathPrefix = basePath || "";
  const cdnUrl = process.env.NODE_ENV === "production"
    ? (process.env.nextImageExportOptimizer_cdnUrl || "")
    : "";
  let generatedImageURL = `${cdnUrl}${basePathPrefix}${exportFolderUrlPrefix}${relativePath}${filename}-opt-${width}.${processedExtension.toLowerCase()}`;

  generatedImageURL = generatedImageURL.replace(/([^:])\/+/g, "$1/");

  return generatedImageURL;
};

// Credits to https://github.com/bryc/code/blob/master/jshash/experimental/cyrb53.js
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

function urlToFilename(url: string) {
  try {
    const parsedUrl = new URL(url);
    const extension = parsedUrl.pathname.split(".").pop();
    if (extension) {
      return hashAlgorithm(url).toString().concat(".", extension);
    }
  } catch (error) {
    console.error("Error parsing URL", url, error);
  }
  return hashAlgorithm(url).toString();
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

export interface ExportedImageProps
  extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, "src" | "srcSet"> {
  src: string | StaticImageData;
  basePath?: string;
  unoptimized?: boolean;
  priority?: boolean;
  fill?: boolean;
}

export interface GetExportedImagePropsOptions {
  src: string | StaticImageData;
  width?: number | string;
  height?: number | string;
  sizes?: string;
  basePath?: string;
  unoptimized?: boolean;
}

export interface ExportedImagePropsResult {
  props: {
    src: string;
    srcSet: string;
    sizes: string;
    width?: number | string;
    height?: number | string;
  };
}

/**
 * Get image props for use with a standard <img> element or other components.
 * Similar to Next.js's getImageProps but for exported/optimized images.
 */
export function getExportedImageProps(
  options: GetExportedImagePropsOptions
): ExportedImagePropsResult {
  const { src, width, height, sizes, basePath = "", unoptimized = false } = options;

  const isStaticImage = typeof src === "object";
  const _src = isStaticImage ? src.src : src;
  const originalImageWidth = isStaticImage ? src.width : undefined;
  const originalImageHeight = isStaticImage ? src.height : undefined;

  const computedWidth = width || originalImageWidth;
  const computedHeight = height || originalImageHeight;

  const isProduction = process.env.NODE_ENV === "production";

  const deviceSizes = (
    process.env.__NEXT_IMAGE_OPTS?.deviceSizes || [
      640, 750, 828, 1080, 1200, 1920, 2048, 3840,
    ]
  ).map(Number);
  const imageSizes = (
    process.env.__NEXT_IMAGE_OPTS?.imageSizes || [
      16, 32, 48, 64, 96, 128, 256, 384,
    ]
  ).map(Number);

  let allSizes: number[] = [...imageSizes, ...deviceSizes];
  allSizes = allSizes.filter((v, i, a) => a.indexOf(v) === i);
  allSizes.sort((a, b) => a - b);

  if (!isProduction || unoptimized) {
    let imageSrc = _src;
    if (!_src.startsWith("/") && !_src.startsWith("http")) {
      imageSrc = "/" + _src;
    }

    const quality = process.env.nextImageExportOptimizer_quality || "75";
    const encodedSrc = encodeURIComponent(imageSrc);
    const srcSet = allSizes
      .map((size) => `/_next/image?url=${encodedSrc}&w=${size}&q=${quality} ${size}w`)
      .join(", ");

    const defaultSize = allSizes[allSizes.length - 1] || 3840;
    const defaultSrc = `/_next/image?url=${encodedSrc}&w=${defaultSize}&q=${quality}`;

    return {
      props: {
        src: defaultSrc,
        srcSet,
        sizes: sizes || "100vw",
        ...(computedWidth && { width: computedWidth }),
        ...(computedHeight && { height: computedHeight }),
      },
    };
  }

  let effectiveSizes = allSizes;
  if (isStaticImage && originalImageWidth) {
    let nextLargestSize = originalImageWidth;
    for (const size of allSizes) {
      if (size >= originalImageWidth) {
        nextLargestSize = size;
        break;
      }
    }
    effectiveSizes = allSizes.filter((s) => s <= nextLargestSize);
  }

  // Static imports are objects (StaticImageData), remote images are URL strings
  // When assetPrefix is set, static imports may have CDN-prefixed URLs in _src,
  // but they're still static imports, not remote images
  const isRemoteImage = !isStaticImage && _src.startsWith("http");
  const srcSetEntries = effectiveSizes.map((size) => {
    let url: string;
    if (isRemoteImage) {
      url = imageURLForRemoteImage({ src: _src, width: size, basePath });
    } else {
      url = generateImageURL(_src, size, basePath);
    }
    return `${url} ${size}w`;
  });

  const srcSet = srcSetEntries.join(", ");

  const defaultSize = effectiveSizes[effectiveSizes.length - 1] || 1080;
  const defaultSrc = isRemoteImage
    ? imageURLForRemoteImage({ src: _src, width: defaultSize, basePath })
    : generateImageURL(_src, defaultSize, basePath);

  return {
    props: {
      src: defaultSrc,
      srcSet,
      sizes: sizes || "100vw",
      ...(computedWidth && { width: computedWidth }),
      ...(computedHeight && { height: computedHeight }),
    },
  };
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
      sizes,
      unoptimized,
      basePath = "",
      alt = "",
      style,
      fill,
      ...rest
    },
    ref
  ) => {
    const isSVG =
      typeof src === "object" ? src.src.endsWith(".svg") : src.endsWith(".svg");

    const { props: imageProps } = getExportedImageProps({
      src,
      width: fill ? undefined : width,
      height: fill ? undefined : height,
      sizes,
      basePath,
      unoptimized: unoptimized || isSVG,
    });

    const fillStyle: React.CSSProperties | undefined = fill
      ? {
          position: "absolute",
          height: "100%",
          width: "100%",
          left: 0,
          top: 0,
          right: 0,
          bottom: 0,
          color: "transparent",
        }
      : undefined;

    return (
      <img
        ref={ref}
        alt={alt}
        src={imageProps.src}
        srcSet={imageProps.srcSet}
        sizes={imageProps.sizes}
        width={fill ? undefined : imageProps.width}
        height={fill ? undefined : imageProps.height}
        loading={priority ? "eager" : (loading || "lazy")}
        decoding="async"
        className={className}
        style={{ ...fillStyle, ...style }}
        {...rest}
      />
    );
  }
);
ExportedImage.displayName = "ExportedImage";
export default ExportedImage;
