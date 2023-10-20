const { devices } = require("@playwright/test");
const fs = require("fs");

const newConfigBasePath = `module.exports = {
  images: {
    loader: "custom",
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    deviceSizes: [640, 750, 777, 828, 1080, 1200, 1920, 2048, 3840],
  },
  basePath: "/subsite",
  output: "export",
  transpilePackages: ["next-image-export-optimizer"],
  env: {
    nextImageExportOptimizer_imageFolderPath: "public/images",
    nextImageExportOptimizer_exportFolderPath: "out",
    nextImageExportOptimizer_exportFolderName: "nextImageExportOptimizer",
    nextImageExportOptimizer_quality: "75",
    nextImageExportOptimizer_storePicturesInWEBP: "true",
    nextImageExportOptimizer_generateAndUseBlurImages: "true",
  },
};
`;
// write config file for the to be tested configuration variables to the folder
fs.writeFileSync("example/next.config.js", newConfigBasePath);
const config = {
  use: {
    baseURL: "http://localhost:8080/",
  },
  testDir: "example/test/e2e",
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
  ],
  webServer: {
    command: "cd example && npm run export && BASEPATH=true node testServer.js",
    port: 8080,
    timeout: 120 * 1000,
    reuseExistingServer: false,
    stdout: "pipe",
  },
};
module.exports = config;
