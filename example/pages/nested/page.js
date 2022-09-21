import React from "react";
import ExportedImage from "../../localTestComponent/ExportedImage";
import testPictureStatic from "../../public/chris-zhang-Jq8-3Bmh1pQ-unsplash_static.jpg";

function Page() {
  return (
    <div>
      <h1>Nested page test</h1>
      <h2>Optimized example (static import)</h2>

      <div
        style={{
          position: "relative",
          marginBottom: "3rem",
          width: "100%",
        }}
      >
        <ExportedImage
          src={testPictureStatic}
          alt="test_image_static"
          id="test_image_static"
          layout="responsive"
        />
      </div>
    </div>
  );
}

export default Page;
