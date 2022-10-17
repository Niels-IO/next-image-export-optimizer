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
          useWebp={process.env.nextImageExportOptimizer_storePicturesInWEBP}
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
          id="test_image_static_fixed"
          width={300}
          height={100}
          useWebp={process.env.nextImageExportOptimizer_storePicturesInWEBP}
          objectFit="cover"
        />
      </div>
      <h2>Optimized example</h2>
      <div
        style={{
          position: "relative",
          width: "50%",
          height: "200px",
          marginBottom: "3rem",
        }}
      >
        <ExportedImage
          src="images/chris-zhang-Jq8-3Bmh1pQ-unsplash.jpg"
          layout="fill"
          id="test_image"
          objectFit="cover"
          useWebp={process.env.nextImageExportOptimizer_storePicturesInWEBP}
          alt={"test_image"}
        />
      </div>
    </div>
  );
}

export default Page;
