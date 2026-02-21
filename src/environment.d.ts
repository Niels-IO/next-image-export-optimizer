declare global {
  namespace NodeJS {
    interface ProcessEnv {
      storePicturesInWEBP: string | undefined;
      nextImageExportOptimizer_storePicturesInWEBP: string | undefined;
      nextImageExportOptimizer_outputFolderPath: string | undefined;
      nextImageExportOptimizer_cdnUrl: string | undefined;
      nextImageExportOptimizer_quality: string | undefined;
      __NEXT_IMAGE_OPTS: { deviceSizes: string[]; imageSizes: string[] };
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};
