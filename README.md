# Next-Image-Export-Optimizer

![PRs Welcome](https://img.shields.io/badge/PRs-welcome-green.svg)
[![npm](https://img.shields.io/npm/v/next-image-export-optimizer)](https://www.npmjs.com/package/next-image-export-optimizer)

Use [Next.js advanced **\<Image/>** component](https://nextjs.org/docs/basic-features/image-optimization) with the static export functionality. Optimizes all static images in an additional step after the Next.js static export.

- Reduces the image size and page load times drastically through responsive images
- Fast image transformation using [sharp.js](https://www.npmjs.com/package/sharp) (also used by the Next.js server in production)
- Conversion of JPEG and PNG files to the modern WEBP format by default
- Serve the exported React bundle only via a CDN. No server required
- Automatic generation of tiny, blurry placeholder images
- Minimal configuration necessary
- Supports TypeScript

This library makes a few assumptions:

- All images that should be optimized are stored inside the public folder like public/images (except for the statically imported images)
- Currently only local images are supported for optimization

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
  env: {
    nextImageExportOptimizer_imageFolderPath: "public/images",
    nextImageExportOptimizer_exportFolderPath: "out",
    nextImageExportOptimizer_quality: 75,
    nextImageExportOptimizer_storePicturesInWEBP: true,

    // If you do not want to use blurry placeholder images, then you can set
    // nextImageExportOptimizer_generateAndUseBlurImages to false and pass
    // `placeholder="none"` to all <ExportedImage> components.
    //
    // If nextImageExportOptimizer_generateAndUseBlurImages is false and you
    // forget to set `placeholder="none"`, you'll see 404 errors for the missing
    // placeholder images in the console.
    nextImageExportOptimizer_generateAndUseBlurImages: true,
  },
};
```

1. Add the above configuration to your **next.config.js**
2. Specify the folder where all the images are stored. Defaults to **public/images**
3. Change the export command in `package.json`

```diff
{
-  "export": "next build && next export",
+  "export": "next build && next export && next-image-export-optimizer"
}
```

4. Change the **\<Image />** component to the **\<ExportedImage />** component of this library.

   Example:

   ```javascript
   // Old
   import Image from "next/image";

   <Image
     src="images/VERY_LARGE_IMAGE.jpg"
     alt="Large Image"
     layout="fill"
     objectFit="cover"
   />;

   // New
   import ExportedImage from "next-image-export-optimizer";

   <ExportedImage
     src="images/VERY_LARGE_IMAGE.jpg"
     alt="Large Image"
     layout="fill"
     objectFit="cover"
     useWebp={process.env.nextImageExportOptimizer_storePicturesInWEBP}
   />;

   // Or with static import
   import ExportedImage from "next-image-export-optimizer";
   import testPictureStatic from "PATH_TO_IMAGE/test_static.jpg";

   <ExportedImage
     src={testPictureStatic}
     alt="Static Image"
     layout="responsive"
     useWebp={process.env.nextImageExportOptimizer_storePicturesInWEBP}
   />;
   ```

5. In the development mode, either the original image will be served as a fallback when the optimized images are not yet generated or the optimized image once the image transformation was executed for the specific image. The optimized images are created at build time only. In the exported, static React app, the responsive images are available as srcset and dynamically loaded by the browser.

6. You can output the original, unoptimized images using the `unoptimized` prop.
   Example:

   ```javascript
   <ExportedImage
     src="images/image.jpg"
     alt="Orginal, unoptimized image"
     layout="fill"
     objectFit="cover"
     unoptimized={true}
   />
   ```

7. Overriding presets:

   **Placeholder images:**
   If you do not want the automatic generation of tiny, blurry placeholder images, set the `nextImageExportOptimizer_generateAndUseBlurImages` environment variable to `false` and set the `placeholder` prop from the **\<ExportedImage />** component to `none`.

   **Usage of the WEBP format:**
   If you do not want to use the WEBP format, set the `nextImageExportOptimizer_storePicturesInWEBP` environment variable to `false` and set the `useWebp` prop from the **\<ExportedImage />** component to `false`.

8. Using the next/future/image component is now supported: (More information: https://nextjs.org/docs/api-reference/next/image)

   ```javascript
   import ExportedImage from "next-image-export-optimizer/future/ExportedImage";

   import testPictureStatic from "PATH_TO_IMAGE/test_static.jpg";

   <ExportedImage
     src={testPictureStatic}
     alt="Static Image"
     useWebp={process.env.nextImageExportOptimizer_storePicturesInWEBP}
   />;
   ```

## Live example

You can see a live example of the use of this library at [reactapp.dev/next-image-export-optimizer](https://reactapp.dev/next-image-export-optimizer)

## How it works

The **\<ExportedImage />** component of this library wraps around the **\<Image />** component of Next.js. Using the custom loader feature, it generates a [srcset](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images) for different resolutions of the original image. The browser can then load the correct size based on the current viewport size.

In the development mode, the **\<ExportedImage />** component falls back to the original image.

All images in the specified folder, as well as all statically imported images will be optimized and reduced versions will be created based on the requested widths.

The image transformation operation is optimized as it uses hashes to determine whether an image has already been optimized or not.
