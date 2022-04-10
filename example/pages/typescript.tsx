import Head from "next/head";
import ExportedImage from "../localTestComponent/ExportedImage";
import React from "react";

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
          <ExportedImage
            src="images/chris-zhang-Jq8-3Bmh1pQ-unsplash.jpg"
            layout="fill"
            id="test_image"
            objectFit="cover"
            priority={true}
            alt={"test_image"}
          />
        </div>
        <ExportedImage
          src="vercel.svg"
          layout="fixed"
          width={300}
          height={100}
          alt="VercelLogo"
        />
      </main>
    </div>
  );
}
