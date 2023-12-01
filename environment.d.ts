declare global {
  namespace NodeJS {
    interface ProcessEnv {
      storePicturesInWEBP: string | undefined;
      generateAndUseBlurImages: string | undefined;
      nextImageExportOptimizer_storePicturesInWEBP: string | undefined;
      nextImageExportOptimizer_generateAndUseBlurImages: string | undefined;
      nextImageExportOptimizer_exportFolderName: string | undefined;
      nextImageExportOptimizer_quality: string | undefined;
      nextImageExportOptimizer_remoteImageCacheTTL: string | undefined;
      __NEXT_IMAGE_OPTS: { deviceSizes: string[]; imageSizes: string[] };
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};
