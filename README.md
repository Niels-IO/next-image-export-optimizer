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

- All images that should be optimized are stored inside the public folder like public/images
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
    nextImageExportOptimizer: {
      imageFolderPath: "public/images",
      exportFolderPath: "out",
      quality: 75,
    },
  },
  env: {
    storePicturesInWEBP: true,
    generateAndUseBlurImages: true,
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
   />;
   ```

5. In the development mode, the original image will be served as the optimized images are created at build time only. In the exported, static React app, the responsive images are available as srcset and dynamically loaded by the browser

## Live example

You can see a live example of the use of this library at [reactapp.dev/next-image-export-optimizer](https://reactapp.dev/next-image-export-optimizer)

## How it works

The **\<ExportedImage />** component of this library wraps around the **\<Image />** component of Next.js. Using the custom loader feature, it generates a [srcset](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images) for different resolutions of the original image. The browser can then load the correct size based on the current viewport size.

In the development mode, the **\<ExportedImage />** component falls back to the original image.

To get the optimized images you alter the Next.js export command from

```
next build && next export
```

to

```
next build && next export && next-image-export-optimizer
```

All images in the specified folder will be optimized and reduced versions will be created based on the requested widths.

The image transformation operation is optimized as it uses hashes to determine whether an image has already been optimized or not.
