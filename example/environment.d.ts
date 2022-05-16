declare global {
  namespace NodeJS {
    interface ProcessEnv {
      storePicturesInWEBP: boolean;
      generateAndUseBlurImages: boolean;
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};
