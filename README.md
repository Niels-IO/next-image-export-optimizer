# Next-Image-Export-Optimizer

[![npm](https://img.shields.io/npm/v/next-image-export-optimizer)](https://www.npmjs.com/package/next-image-export-optimizer)

Use [Next.js advanced **\<Image/>** component](https://nextjs.org/docs/basic-features/image-optimization) with the static export functionality. Optimizes all static images in an additional step after the Next.js static export.

- Reduces the image size and page load times drastically through responsive images
- Fast image transformation using [sharp.js](https://www.npmjs.com/package/sharp) (also used by the Next.js server in production)
- Conversion of JPEG and PNG files to the modern WEBP format by default
- Serve the exported React bundle only via a CDN. No server required
- Automatic generation of tiny, blurry placeholder images
- Minimal configuration necessary
- Supports TypeScript
- Supports remote images which will be downloaded and optimized
- Supports animated images (accepted formats: GIF and WEBP)
- Note that only one global value can be used for the image quality setting. The default value is 75.

## Placement of the images:

**For images using a path string:** (e.g. src="/profile.png")

Place the images in a folder inside the public folder like _public/images_

**For images using a static import:** (e.g. src={profileImage})

You can place the images anywhere in your project. The images will be optimized and copied to the export folder.

**For remote images:** (e.g. src="https://example.com/image.jpg")

Please refer to the section on remote images.

## Installation

```
npm install next-image-export-optimizer

# Or
yarn add next-image-export-optimizer
pnpm install next-image-export-optimizer
```

## Configuration

## Basic configuration

Add the following to your `next.config.js`. You can also use `next.config.ts` for TypeScript projects.:

```javascript
// next.config.js
module.exports = {
  output: "export",
  images: {
    loader: "custom",
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  },
  transpilePackages: ["next-image-export-optimizer"],
  env: {
    nextImageExportOptimizer_imageFolderPath: "public/images",
    nextImageExportOptimizer_exportFolderPath: "out",
    nextImageExportOptimizer_quality: "75",
    nextImageExportOptimizer_storePicturesInWEBP: "true",
    nextImageExportOptimizer_exportFolderName: "nextImageExportOptimizer",
    nextImageExportOptimizer_generateAndUseBlurImages: "true",
    nextImageExportOptimizer_remoteImageCacheTTL: "0",
  },
};
```

Update the build command in `package.json`

```diff
{
-  "build": "next build",
+  "build": "next build && next-image-export-optimizer"
}
```

Replace the **\<Image />** component with the **\<ExportedImage />** component:

Example:

```javascript
// Old
import Image from "next/image";

<Image
  src="images/VERY_LARGE_IMAGE.jpg"
  alt="Large Image"
  width={500}
  height={500}
/>;

// Replace with either of the following:

// With static import (Recommended)
import ExportedImage from "next-image-export-optimizer";
import testPictureStatic from "PATH_TO_IMAGE/test_static.jpg";

<ExportedImage src={testPictureStatic} alt="Static Image" />;

// With dynamic import
import ExportedImage from "next-image-export-optimizer";

<ExportedImage
  src="images/VERY_LARGE_IMAGE.jpg"
  alt="Large Image"
  width={500}
  height={500}
/>;
```

## Advanced configuration

### Remote images

For remote images, you have to specify the src as a string starting with either http or https in the ExportedImage component.

```javascript
import ExportedImage from "next-image-export-optimizer";

<ExportedImage src="https://example.com/remote-image.jpg" alt="Remote Image" />;
```

In order for the image optimization at build time to work correctly, you have to specify all remote image urls in a file called **remoteOptimizedImages.js** in the root directory of your project (where the `next.config.js` is stored as well). The file should export an array of strings containing the urls of the remote images. Returning a promise of such array is also supported.

Example:

```javascript
// remoteOptimizedImages.js
module.exports = [
  "https://example.com/image1.jpg",
  "https://example.com/image2.jpg",
  "https://example.com/image3.jpg",
  // ...
];
```

```javascript
// Or with a promise
module.exports = new Promise((resolve) =>
  resolve([
    "https://example.com/image1.jpg",
    "https://example.com/image2.jpg",
    "https://example.com/image3.jpg",
    // ...
  ])
);

// Or with an async API call
module.exports = fetch("https://example.com/api/images").catch((error) => {
  console.error(error);
  return []; // return an empty array in case of error
});
```

At build time, the images will be either downloaded or read from the cache. The image urls will be replaced with the optimized image urls in the Exported Image component.

You can specify the time to live of the cache in seconds by setting the `nextImageExportOptimizer_remoteImageCacheTTL` environment variable in your `next.config.js` file. The default value is 0 seconds (as the image might have changed).

Set it to:

- 60 for 1 minute
- 3600 for 1 hour
- 86400 for 1 day
- 604800 for 1 week
- 2592000 for 1 month
- 31536000 for 1 year

If you want to hide the remote image urls from the user, you can use the [overrideSrc](https://nextjs.org/docs/pages/api-reference/components/image#overridesrc) prop of the ExportedImage component. This will replace the src attribute of the image tag with the value of the overrideSrc prop.

Beware that the Image component cannot fall back to the original image URL if the optimized images are not yet generated when you use the overrideSrc prop. This will result in a broken image link.

You can customize the filename for remote optimized images by adding the following to your `next.config.js`:

```javascript
module.exports = {
  env: {
    // ... other env variables
    nextImageExportOptimizer_remoteImagesFilename: "remoteOptimizedImages.cjs",
  },
  // ... other config options
};
```

### Custom next.config.js path

If your Next.js project is not at the root directory where you are running the commands, for example when you are using a monorepo, you can specify the location of the `next.config.js` as an argument to the script:

```json
"export": "next build && next-image-export-optimizer --nextConfigPath path/to/my/next.config.js"
```

### Custom export folder path

Specify the output folder path either via environment variable:

```javascript
// next.config.js
{ "env": {
"nextImageExportOptimizer_exportFolderPath": "path/to/my/export/folder"
}}
```

Or by passing the argument to the script:

```json
 "export": "next build && next-image-export-optimizer --exportFolderPath path/to/my/export/folder"
```

### Base path

If you want to deploy your app to a subfolder of your domain, you can set the basePath in the `next.config.js` file:

```javascript
module.exports = {
  basePath: "/subfolder",
};
```

The ExportedImage component has a basePath prop which you can use to pass the basePath to the component.

```javascript
import ExportedImage from "next-image-export-optimizer";
import testPictureStatic from "PATH_TO_IMAGE/test_static.jpg";

<ExportedImage
  src={testPictureStatic}
  alt="Static Image"
  basePath="/subfolder"
/>;
```

### Placeholder images

If you do not want the automatic generation of tiny, blurry placeholder images, set the `nextImageExportOptimizer_generateAndUseBlurImages` environment variable to `false` and set the `placeholder` prop from the **\<ExportedImage />** component to `empty`.

### Custom export folder name

If you want to rename the export folder name, set the `nextImageExportOptimizer_exportFolderPath` environment variable to the desired folder name. The default is `nextImageExportOptimizer`.

### Image format

By default, the images are stored in the WEBP format.

If you do not want to use the WEBP format, set the `nextImageExportOptimizer_storePicturesInWEBP` environment variable to `false`.

## Good to know

- The **\<ExportedImage />** component is a wrapper around the **\<Image />** component of Next.js. It uses the custom loader feature to generate a [srcset](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images) for different resolutions of the original image. The browser can then load the correct size based on the current viewport size.

- The image transformation operation is optimized as it uses hashes to determine whether an image has already been optimized or not. This way, the images are only optimized once and not every time the build command is run.

- The **\<ExportedImage />** component falls back to the original image if the optimized images are not yet generated in the development mode. In the exported, static React app, the responsive images are available as srcset and dynamically loaded by the browser.

- The static import method is recommended as it informs the client about the original image size. When widths larger than the original image width are requested, the next largest image size in the deviceSizes array (specified in the `next.config.js`) will be used for the generation of the srcset attribute.
  When you specify the images as a path string, this library will create duplicates of the original image for each image size in the deviceSizes array that is larger than the original image size.

- You can output the original, unoptimized images using the `unoptimized` prop.
  Example:

  ```javascript
  import ExportedImage from "next-image-export-optimizer";

  <ExportedImage
    src={testPictureStatic}
    alt="Original, unoptimized image"
    unoptimized={true}
  />;
  ```

- You can still use the legacy image component `next/legacy/image`:

  ```javascript
  import ExportedImage from "next-image-export-optimizer/legacy/ExportedImage";

  import testPictureStatic from "PATH_TO_IMAGE/test_static.jpg";

  <ExportedImage src={testPictureStatic} alt="Static Image" layout="fixed" />;
  ```

- Animated images:
  You can use .gif and animated .webp images. Next-image-export-optimizer will automatically optimize the animated images and generate the srcset for the different resolutions.

  If you set the variable nextImageExportOptimizer_storePicturesInWEBP to true, the animated images will be converted to .webp format which can reduce the file size significantly.
  Note that animated png images are not supported by this package.

## Live example

You can see a live example of the use of this library at [reactapp.dev/next-image-export-optimizer](https://reactapp.dev/next-image-export-optimizer)

> **Warning**
> Version 1.0.0 is a breaking change. It follows the changes introduced in Next 13.0.0 which replaces the `next/image` component with `next/future/image`. If you are using Next 12 or below, please use version _0.17.1_.
