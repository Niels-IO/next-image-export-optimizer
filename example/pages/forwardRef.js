import Head from "next/head";
import ExportedImage from "../../src/ExportedImage";

import styles from "../styles/Home.module.css";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  // example of using a ref to get the image dimensions to test the forwardRef functionality
  const imageRef = useRef(null);
  const [imageDimensions, setImageDimensions] = useState({
    width: 0,
    height: 0,
  });
  useEffect(() => {
    if (imageRef.current) {
      setImageDimensions({
        width: imageRef.current.clientWidth,
        height: imageRef.current.clientHeight,
      });
    }
  }, [imageRef]);
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
            id="test_image_forwardRef"
            alt={"test_image"}
            fill
            ref={imageRef}
            style={{ objectFit: "cover" }}
            basePath={basePath}
          />
        </div>
        <div
          style={{
            position: "fixed",
            bottom: "100px",
            width: "50%",
            height: "200px",
            marginBottom: "3rem",
          }}
        >
          <p>Width:</p>
          <span id="ImageWidth">{imageDimensions.width}</span>
          <p>Height:</p>
          <span id="ImageHeight">{imageDimensions.height}</span>
        </div>
      </main>
    </div>
  );
}
