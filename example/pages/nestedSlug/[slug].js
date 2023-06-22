import React from "react";
import ExportedImage from "../../../src/ExportedImage";
import ExportedImageLegacy from "../../../src/legacy/ExportedImage";
import testPictureStatic from "../../public/chris-zhang-Jq8-3Bmh1pQ-unsplash_static.jpg";

function Slug() {
  // get the basePath set in next.config.js
  const basePath = process.env.__NEXT_ROUTER_BASEPATH || "";
  return (
    <div>
      <h1>Nested slug page test</h1>
      <h2>Optimized example (static import) - Legacy</h2>

      <div
        style={{
          position: "relative",
          marginBottom: "3rem",
          width: "100%",
        }}
      >
        <ExportedImageLegacy
          src={testPictureStatic}
          alt="test_image_static"
          id="test_image_static"
          layout="responsive"
          basePath={basePath}
        />
      </div>
      <h2>Optimized example (fill)</h2>
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
          id="test_image_future_fill"
          alt={"test_image"}
          fill
          style={{ objectFit: "cover" }}
          basePath={basePath}
        />
      </div>
      <h2>Optimized example (fill & static import)</h2>
      <div
        style={{
          position: "relative",
          width: "50%",
          height: "200px",
          marginBottom: "3rem",
        }}
      >
        <ExportedImage
          src={testPictureStatic}
          id="test_image_future_static_fill"
          alt={"test_image"}
          fill
          style={{ objectFit: "cover" }}
          basePath={basePath}
        />
      </div>
    </div>
  );
}

export async function getStaticPaths() {
  return {
    paths: [{ params: { slug: "page" } }],
    fallback: false, // can also be true or 'blocking'
  };
}

// `getStaticPaths` requires using `getStaticProps`
export async function getStaticProps() {
  return {
    // Passed to the page component as props
    props: { post: {} },
  };
}

export default Slug;
