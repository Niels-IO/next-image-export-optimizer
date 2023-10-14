import React from "react";
import ExportedImage from "../../src/ExportedImage";
import ExportedImageLegacy from "../../src/legacy/ExportedImage";
import testPictureStatic from "../../public/chris-zhang-Jq8-3Bmh1pQ-unsplash_static.jpg";

function Page() {
  // get the basePath set in next.config.js
  const basePath = process.env.__NEXT_ROUTER_BASEPATH || "";
  return (
    <div>
      <h1>Nested page test</h1>

      <h2>Optimized example with fixed size (static import) - Legacy</h2>

      <div
        style={{
          position: "relative",
          marginBottom: "3rem",
          width: "100%",
        }}
      >
        <ExportedImageLegacy
          src={testPictureStatic}
          alt="test_image_static_fixed"
          id="test_image_static_fixed"
          width={300}
          height={100}
          objectFit="cover"
          basePath={basePath}
        />
      </div>
      <h2>Optimized example with fixed size (static import)</h2>

      <div
        style={{
          position: "relative",
          marginBottom: "3rem",
          width: "100%",
        }}
      >
        <ExportedImage
          src={testPictureStatic}
          alt="test_image_static_fixed"
          id="test_image_static_fixed_future"
          width={300}
          height={100}
          style={{ objectFit: "cover" }}
          basePath={basePath}
        />
      </div>
    </div>
  );
}

export default Page;
