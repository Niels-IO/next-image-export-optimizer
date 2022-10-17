import Head from "next/head";
import ExportedImage from "../localTestComponent/ExportedImage";
import ExportedImageFuture from "../localTestComponent/ExportedImageFuture";
import smallImage from "../public/images/chris-zhang-Jq8-3Bmh1pQ-unsplash_small.jpg";

import styles from "../styles/Home.module.css";

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
        <h2>Optimized example</h2>
        <div
          style={{
            position: "relative",
            width: "50%",
            height: "200px",
            marginBottom: "3rem",
          }}
        >
          <ExportedImage
            src="images/chris-zhang-Jq8-3Bmh1pQ-unsplash_small.jpg"
            layout="fill"
            id="test_image"
            objectFit="cover"
            priority={true}
            useWebp={process.env.nextImageExportOptimizer_storePicturesInWEBP}
            alt={"test_image"}
          />
        </div>
        <h2>Optimized example future</h2>

        <div
          style={{
            marginBottom: "3rem",
          }}
        >
          <ExportedImageFuture
            src={smallImage}
            id="test_image_future"
            useWebp={process.env.nextImageExportOptimizer_storePicturesInWEBP}
            alt={"test_image"}
          />
        </div>
      </main>
    </div>
  );
}
