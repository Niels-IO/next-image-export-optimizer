import Head from "next/head";
import ExportedImage from "../localTestComponent/ExportedImage";
import React from "react";
import Image from "next/image";

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
