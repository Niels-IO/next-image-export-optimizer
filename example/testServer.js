const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const port = 8080;

// get the environment variable flag for the test
const testBasePath = process.env.BASEPATH === "true";
const basePath = testBasePath ? "/subsite" : "";

const outPath = path.join(__dirname, "out");

// Next.js exports an app router route as both "appdir.html" and an "appdir/"
// directory holding the RSC payload. express.static stats the directory first
// and redirects to it rather than falling back to the "extensions" option
// below, so point extensionless requests at the HTML file explicitly.
app.use(basePath, (req, res, next) => {
  const [pathname, query] = req.url.split("?");
  if (!path.extname(pathname)) {
    const htmlPath = path.join(outPath, `${pathname}.html`);
    if (
      htmlPath.startsWith(outPath + path.sep) &&
      fs.existsSync(htmlPath) &&
      fs.statSync(htmlPath).isFile()
    ) {
      req.url =
        query === undefined ? `${pathname}.html` : `${pathname}.html?${query}`;
    }
  }
  next();
});

app.use(
  basePath,
  express.static(outPath, {
    extensions: ["html", "htm"],
  })
);

app.listen(port, () => {
  if (testBasePath)
    console.log(`Server running at http://localhost:${port}/subsite`);
  else console.log(`Server running at http://localhost:${port}`);
});
