import Head from "next/head";
import ExportedImageLegacy from "../../src/legacy/ExportedImage";
import ExportedImage from "../../src/ExportedImage";

import smallImage from "../public/images/chris-zhang-Jq8-3Bmh1pQ-unsplash_small.jpg";

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

      <main className={styles.main}>
        <h1 className={styles.title}>Next-Image-Export-Optimizer</h1>
        <h2>Optimized example - Legacy</h2>
        <div
          style={{
            position: "relative",
            width: "50%",
            height: "200px",
            marginBottom: "3rem",
          }}
        >
          <ExportedImageLegacy
            src="images/chris-zhang-Jq8-3Bmh1pQ-unsplash_small.jpg"
            layout="fill"
            id="test_image"
            objectFit="cover"
            priority
            alt="test_image"
            basePath={basePath}
          />
        </div>
        <h2>Optimized example</h2>

        <div
          style={{
            position: "relative",
            marginBottom: "3rem",
            width: "100%",
          }}
        >
          <ExportedImage
            src={smallImage}
            alt="test_image"
            id="test_image_future"
            sizes="100vw"
            style={{ width: "100%", height: "auto" }}
            basePath={basePath}
            // priority
          />
        </div>
      </main>
    </div>
  );
}
