import React from "react";
import ExportedImage from "../../localTestComponent/ExportedImage";
import testPictureStatic from "../../public/chris-zhang-Jq8-3Bmh1pQ-unsplash_static.jpg";

function Slug() {
  return (
    <div>
      <h1>Nested slug page test</h1>
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
