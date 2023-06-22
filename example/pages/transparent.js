import Head from "next/head";
import ExportedImage from "../../src/ExportedImage";

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
        <h2>Optimized example</h2>
        <div
          style={{
            position: "absolute",
            height: "100%",
            width: "100%",
          }}
        >
          <ExportedImage
            src="images/transparentImage.png"
            id="test_image_transparent"
            alt={"test_image"}
            fill
            style={{ objectFit: "cover" }}
            basePath={basePath}
          />
        </div>
      </main>
    </div>
  );
}
