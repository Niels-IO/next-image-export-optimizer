const express = require("express");
const path = require("path");
const app = express();
const port = 8080;

// get the environment variable flag for the test
const testBasePath = process.env.BASEPATH === "true";
const basePath = testBasePath ? "/subsite" : "";

const outPath = path.join(__dirname, "out");

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
