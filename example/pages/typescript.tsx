import Head from "next/head";
import ExportedImageFuture_Local from "../localTestComponent/ExportedImageFuture";
import ExportedImage_Local from "../localTestComponent/ExportedImage";
import ExportedImage from "next-image-export-optimizer";
import ExportedImageFuture from "next-image-export-optimizer/future/ExportedImage";

import React from "react";
import Image from "next/image";
import testPictureStatic from "../public/chris-zhang-Jq8-3Bmh1pQ-unsplash_static.jpg";

export default function Home() {
  return (
    <div>
      <Head>
        <title>Next-Image-Export-Optimizer</title>
        <meta
          name="description"
          content="Example of next-image-export-optimizer"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>Next-Image-Export-Optimizer</h1>
        <div
          style={{
            position: "relative",
            width: "50%",
            height: "200px",
            marginBottom: "3rem",
          }}
        >
          <ExportedImageFuture
            src="images/chris-zhang-Jq8-3Bmh1pQ-unsplash.jpg"
            id="test_image_future"
            fill
            priority={true}
            alt={"test_image"}
            useWebp={process.env.nextImageExportOptimizer_storePicturesInWEBP}
          />
        </div>
        <div
          style={{
            position: "relative",
            width: "50%",
            height: "200px",
            marginBottom: "3rem",
          }}
        >
          <ExportedImageFuture_Local
            src="images/chris-zhang-Jq8-3Bmh1pQ-unsplash.jpg"
            id="test_image_future_local"
            fill
            priority={true}
            alt={"test_image"}
            useWebp={process.env.nextImageExportOptimizer_storePicturesInWEBP}
          />
        </div>

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
        <div
          style={{
            position: "relative",
            marginBottom: "3rem",
            width: "100%",
          }}
        >
          <ExportedImage_Local
            src={testPictureStatic}
            alt="test_image_static"
            id="test_image_static_local"
            layout="responsive"
            useWebp={process.env.nextImageExportOptimizer_storePicturesInWEBP}
          />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <ExportedImage
            src="vercel.svg"
            width={400}
            height={400}
            layout="fixed"
            alt="VercelLogo"
          />
          <Image
            src={`vercel.svg`}
            loader={({ src }) => {
              return src;
            }}
            width={400}
            height={400}
            layout="fixed"
            alt="random"
          />
        </div>
      </main>
    </div>
  );
}
