module.exports = {
  images: {
    loader: "custom",
    nextImageExportOptimizer: {
      imageFolderPath: "public/images",
      exportFolderPath: "build",
      imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
      deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
      quality: 75,
    },
  },
  env: {
    storePicturesInWEBP: true,
  },
};
