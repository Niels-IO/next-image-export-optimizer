import ExportedImageLegacy from "../../src/legacy/ExportedImage";
import Head from "next/head";
import React from "react";
import styles from "../styles/Home.module.css";

function Subfolder() {
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
        <h1 className={styles.title}>Subfolder test</h1>
        <div
          style={{
            position: "relative",
            width: "50%",
            height: "500px",
            marginBottom: "3rem",
          }}
        >
          <ExportedImageLegacy
            src="images/subfolder/ollie-barker-jones-K52HVSPVvKI-unsplash.jpg"
            layout="fill"
            id="test_image_subfolder"
            objectFit="cover"
            priority={true}
            alt={"test_image_subfolder"}
          />
        </div>
        <div
          style={{
            position: "relative",
            width: "50%",
            height: "500px",
            marginBottom: "3rem",
          }}
        >
          <ExportedImageLegacy
            src="images/subfolder/subfolder2/ollie-barker-jones-K52HVSPVvKI-unsplash.jpg"
            layout="fill"
            id="test_image_subfolder2"
            objectFit="cover"
            priority={true}
            alt={"test_image_subfolder2"}
          />
        </div>
      </main>
    </div>
  );
}

export default Subfolder;
