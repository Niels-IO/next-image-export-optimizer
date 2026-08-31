/** @type {import('jest').Config} */
module.exports = {
  // Jest 30 picks up .mjs files by default, which would collect the Playwright
  // specs in example/test/e2e. Those are driven by Playwright, not Jest.
  testPathIgnorePatterns: ["/node_modules/", "<rootDir>/example/"],
};
