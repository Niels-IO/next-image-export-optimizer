# Next-Image-Export-Optimizer

![PRs Welcome](https://img.shields.io/badge/PRs-welcome-green.svg)
[![npm](https://img.shields.io/npm/v/next-image-export-optimizer)](https://www.npmjs.com/package/next-image-export-optimizer)

> **Warning**
> Version 1.0.0 is a breaking change. It follows the changes introduced in Next 13.0.0 which replaces the `next/image` component with `next/future/image`. If you are using Next 12 or below, please use version _0.17.1_.

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

This library makes a few assumptions:

- All images that should be optimized are stored inside the public folder like public/images (except for the statically imported images and remote images)

## Installation

```
npm install next-image-export-optimizer
# Or
yarn add next-image-export-optimizer
pnpm install next-image-export-optimizer
```

Configure the library in your **Next.js** configuration file:

```javascript
// next.config.js
module.exports = {
  images: {
    loader: "custom",
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  },
  transpilePackages: ["next-image-export-optimizer"],
  env: {
    nextImageExportOptimizer_imageFolderPath: "public/images",
    nextImageExportOptimizer_exportFolderPath: "out",
    nextImageExportOptimizer_quality: 75,
    nextImageExportOptimizer_storePicturesInWEBP: true,
    nextImageExportOptimizer_exportFolderName: "nextImageExportOptimizer",

    // If you do not want to use blurry placeholder images, then you can set
    // nextImageExportOptimizer_generateAndUseBlurImages to false and pass
    // `placeholder="empty"` to all <ExportedImage> components.
    //
    // If nextImageExportOptimizer_generateAndUseBlurImages is false and you
    // forget to set `placeholder="empty"`, you'll see 404 errors for the missing
    // placeholder images in the console.
    nextImageExportOptimizer_generateAndUseBlurImages: true,
  },
};
```

1. Add the above configuration to your **next.config.js**
2. Change the default values in your **next.config.js** where appropriate. For example, specify the folder where all the images are stored. Defaults to **public/images**
3. Change the export command in `package.json`

   ```diff
   {
   -  "export": "next build && next export",
   +  "export": "next build && next export && next-image-export-optimizer"
   }
   ```

   If your Next.js project is not at the root directory where you are running the commands, for example if you are using a monorepo, you can specify the location of the next.config.js as an argument to the script:

   ```json
   "export": "next build && next export && next-image-export-optimizer --nextConfigPath path/to/my/next.config.js"
   ```

   If you want to specify the path to the output folder, you can either do so by setting the `nextImageExportOptimizer_exportFolderPath` environment variable in your **next.config.js** file or by passing the `--exportFolderPath` argument to the script:

   ```json
    "export": "next build && next export && next-image-export-optimizer --exportFolderPath path/to/my/export/folder"
   ```

4. Change the **\<Image />** component to the **\<ExportedImage />** component of this library.

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

   <ExportedImage
     src={testPictureStatic}
     alt="Static Image"
     layout="responsive"
   />;

   // With dynamic import
   import ExportedImage from "next-image-export-optimizer";

   <ExportedImage
     src="images/VERY_LARGE_IMAGE.jpg"
     alt="Large Image"
     width={500}
     height={500}
   />;
   ```

   The static import method is recommended as it informs the client about the original image size. For images sizes larger than the original with, the next largest image size in the deviceSizes array (specified in the next.config.js) will be used for the generation of the srcset attribute.

   For the dynamic import method, this library will create duplicates of the original image for each image size in the deviceSizes array that is larger than the original image size.

5. In the development mode, either the original image will be served as a fallback when the optimized images are not yet generated or the optimized image once the image transformation was executed for the specific image. The optimized images are created at build time only. In the exported, static React app, the responsive images are available as srcset and dynamically loaded by the browser.

6. This library also supports remote images. You have to specify the src as a string starting with either http or https in the ExportedImage component.

   ```javascript
   import ExportedImage from "next-image-export-optimizer";

   <ExportedImage
     src="https://example.com/remote-image.jpg"
     alt="Remote Image"
     fill
     style={{ objectFit: "cover" }}
     priority
   />;
   ```

   In order for the image optimization at build time to work correctly, you have to specify all remote image urls in a file called **remoteOptimizedImages.js** in the root directory of your project (where the next.config.js is stored as well). The file should export an array of strings containing the urls of the remote images. Returning a promise of such array is also supported.

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
   ```

   At build time, the images will be downloaded each time (as they might have changed) and optimized if an image is not yet in the cache or the image has changes.

7. You can output the original, unoptimized images using the `unoptimized` prop.
   Example:

   ```javascript
   import ExportedImage from "next-image-export-optimizer";

   <ExportedImage
     src={testPictureStatic}
     alt="Orginal, unoptimized image"
     unoptimized={true}
   />;
   ```

8. Overriding presets in **next.config.js**:

   **Placeholder images:**
   If you do not want the automatic generation of tiny, blurry placeholder images, set the `nextImageExportOptimizer_generateAndUseBlurImages` environment variable to `false` and set the `placeholder` prop from the **\<ExportedImage />** component to `empty`.

   **Usage of the WEBP format:**
   If you do not want to use the WEBP format, set the `nextImageExportOptimizer_storePicturesInWEBP` environment variable to `false`.

   **Rename the export folder name:**
   If you want to rename the export folder name, set the `nextImageExportOptimizer_exportFolderPath` environment variable to the desired folder name. The default is `nextImageExportOptimizer`.

9. You can still use the legacy image component `next/legacy/image`:

   ```javascript
   import ExportedImage from "next-image-export-optimizer/legacy/ExportedImage";

   import testPictureStatic from "PATH_TO_IMAGE/test_static.jpg";

   <ExportedImage src={testPictureStatic} alt="Static Image" layout="fixed" />;
   ```

10. Animated images
    You can use .gif and animated .webp images. Next-image-export-optimizer will automatically optimize the animated images and generate the srcset for the different resolutions.

    If you set the variable nextImageExportOptimizer_storePicturesInWEBP to true, the animated images will be converted to .webp format which can reduce the file size significantly.
    Note that animated png images are not supported by this package.

## Live example

You can see a live example of the use of this library at [reactapp.dev/next-image-export-optimizer](https://reactapp.dev/next-image-export-optimizer)

## How it works

The **\<ExportedImage />** component of this library wraps around the **\<Image />** component of Next.js. Using the custom loader feature, it generates a [srcset](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images) for different resolutions of the original image. The browser can then load the correct size based on the current viewport size.

In the development mode, the **\<ExportedImage />** component falls back to the original image.

All images in the specified folder, as well as all statically imported images will be optimized and reduced versions will be created based on the requested widths.

The image transformation operation is optimized as it uses hashes to determine whether an image has already been optimized or not.
