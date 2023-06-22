import Head from "next/head";
import ExportedImageLegacy from "../../src/legacy/ExportedImage";
import ExportedImage from "../../src/ExportedImage";
// import ExportedImage from "next-image-export-optimizer";

import styles from "../styles/Home.module.css";

export default function Home() {
  // get the basePath set in next.config.js
  const basePath = process.env.__NEXT_ROUTER_BASEPATH || "";
  return (
    <div className={styles.container}>
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
        <h2>Fixed size test page</h2>
        <div
          style={{
            position: "relative",
            marginBottom: "3rem",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {[16, 32, 48, 64, 96, 128, 256, 384].map((size) => (
            <div style={{ display: "flex", margin: "4px" }} key={size}>
              <ExportedImageLegacy
                src="images/chris-zhang-Jq8-3Bmh1pQ-unsplash.jpg"
                layout="fixed"
                width={size}
                height={size}
                id={`test_image_${size}`}
                objectFit="cover"
                priority={true}
                alt={"test_image"}
                basePath={basePath}
              />
              <ExportedImage
                src="images/chris-zhang-Jq8-3Bmh1pQ-unsplash.jpg"
                width={size}
                height={size}
                id={`test_image_${size}_future`}
                style={{ objectFit: "cover" }}
                priority={true}
                alt={"test_image"}
                basePath={basePath}
              />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
