import React from "react";
import ExportedImage from "../../localTestComponent/ExportedImage";
import ExportedImageFuture from "../../localTestComponent/ExportedImageFuture";
import testPictureStatic from "../../public/chris-zhang-Jq8-3Bmh1pQ-unsplash_static.jpg";

function Page() {
  return (
    <div>
      <h1>Nested page test</h1>

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
          id="test_image_static_fixed"
          width={300}
          height={100}
          useWebp={process.env.nextImageExportOptimizer_storePicturesInWEBP}
          objectFit="cover"
        />
      </div>
      <h2>Optimized example with fixed size future (static import)</h2>

      <div
        style={{
          position: "relative",
          marginBottom: "3rem",
          width: "100%",
        }}
      >
        <ExportedImageFuture
          src={testPictureStatic}
          alt="test_image_static_fixed"
          id="test_image_static_fixed_future"
          width={300}
          height={100}
          useWebp={process.env.nextImageExportOptimizer_storePicturesInWEBP}
          style={{ objectFit: "cover" }}
        />
      </div>
    </div>
  );
}

export default Page;
