declare global {
  namespace NodeJS {
    interface ProcessEnv {
      storePicturesInWEBP: boolean;
      generateAndUseBlurImages: boolean;
      nextImageExportOptimizer_storePicturesInWEBP: boolean;
      nextImageExportOptimizer_generateAndUseBlurImages: boolean;
      nextImageExportOptimizer_exportFolderName: string;
      __NEXT_IMAGE_OPTS: { deviceSizes: string[]; imageSizes: string[] };
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};
