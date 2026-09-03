import js from "@eslint/js";

export default [
  {
    ignores: [
      "dist/**",
      "example/**",
      "node_modules/**",
      "coverage/**",
      ".eslintrc.js",
    ],
  },
  js.configs.recommended,
  {
    files: ["**/*.{js,cjs}"],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "commonjs",
      globals: {
        module: "readonly",
        require: "readonly",
        __dirname: "readonly",
        process: "readonly",
        console: "readonly",
      },
    },
  },
];
