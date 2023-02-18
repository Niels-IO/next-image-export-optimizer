import Head from "next/head";
import ExportedImage from "../../src/ExportedImage";

import styles from "../styles/Home.module.css";
import animatedImage from "../public/animated.png";

export default function Home() {
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
        <h2>Format: .gif</h2>

        <div
          style={{
            position: "relative",
            width: "50%",
            height: "500px",
            marginBottom: "3rem",
          }}
        >
          <ExportedImage
            src="/images/402107790_STATIC_NOISE_GIF.gif"
            id="test_image_gif"
            alt={"test_image_gif"}
            fill
            style={{ objectFit: "cover" }}
          />
        </div>
        <h2>Format: .webp</h2>

        <div
          style={{
            position: "relative",
            width: "50%",
            height: "500px",
            marginBottom: "3rem",
          }}
        >
          <ExportedImage
            src="/images/402107790_STATIC_NOISE_WEBP.webp"
            id="test_image_webp"
            alt={"test_image_webp"}
            fill
            style={{ objectFit: "cover" }}
          />
        </div>
        <h2>Format: .png</h2>

        <div
          style={{
            position: "relative",
            width: "50%",
            height: "500px",
            marginBottom: "3rem",
          }}
        >
          <ExportedImage
            src={animatedImage}
            id="test_image_png"
            alt={"test_image_png"}
            fill
          />
        </div>
      </main>
    </div>
  );
}
