import Head from "next/head";
import ExportedImageLegacy from "../src/legacy/ExportedImage";
// import ExportedImageLegacy from "next-image-export-optimizer/legacy/ExportedImage";
// import ExportedImage from "next-image-export-optimizer";
import ExportedImage from "../src/ExportedImage";

import styles from "../styles/Home.module.css";
import testPictureStatic from "../public/chris-zhang-Jq8-3Bmh1pQ-unsplash_static.jpg";

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
            src="images/chris-zhang-Jq8-3Bmh1pQ-unsplash.jpg"
            layout="fill"
            id="test_image"
            objectFit="cover"
            priority
            alt={"test_image"}
            basePath={basePath}
          />
        </div>
        <h2>Optimized example (static import) - Legacy</h2>
        <div
          style={{
            position: "relative",
            marginBottom: "3rem",
            width: "100%",
          }}
        >
          <ExportedImageLegacy
            src={testPictureStatic}
            alt="test_image_static"
            id="test_image_static"
            layout="responsive"
            priority
            basePath={basePath}
          />
        </div>
        <h2>Optimized example</h2>
        <div
          style={{
            marginBottom: "3rem",
          }}
        >
          <ExportedImage
            src="images/chris-zhang-Jq8-3Bmh1pQ-unsplash.jpg"
            id="test_image_future"
            alt={"test_image"}
            width={500}
            height={300}
            basePath={basePath}
          />
        </div>
        <h2>Optimized example (fill)</h2>
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
            id="test_image_future_fill"
            alt={"test_image"}
            fill
            basePath={basePath}
            style={{ objectFit: "cover" }}
          />
        </div>
        <h2>Optimized example (fill & static import)</h2>
        <div
          style={{
            position: "relative",
            width: "50%",
            height: "200px",
            marginBottom: "3rem",
          }}
        >
          <ExportedImage
            src={testPictureStatic}
            id="test_image_future_static_fill"
            alt={"test_image"}
            fill
            basePath={basePath}
            style={{ objectFit: "cover" }}
          />
        </div>
        <h2>Optimized example (static import)</h2>
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
            id="test_image_static_future"
            sizes="100vw"
            style={{ width: "100%", height: "auto" }}
            basePath={basePath}

            // priority
          />
        </div>
        <h2>Unoptimized example - Legacy</h2>
        <div
          style={{
            position: "relative",
            width: "50%",
            height: "200px",
            marginBottom: "3rem",
          }}
        >
          <ExportedImageLegacy
            src="images/chris-zhang-Jq8-3Bmh1pQ-unsplash.jpg"
            layout="fill"
            id="test_image_unoptimized_legacy"
            objectFit="cover"
            priority={true}
            alt={"test_image_unoptimized_legacy"}
            unoptimized={true}
            basePath={basePath}
          />
        </div>
        <h2>Unoptimized example - Legacy static import</h2>
        <div
          style={{
            position: "relative",
            width: "50%",
            height: "200px",
            marginBottom: "3rem",
          }}
        >
          <ExportedImageLegacy
            src={testPictureStatic}
            layout="fill"
            id="test_image_unoptimized_legacy_static"
            objectFit="cover"
            priority={true}
            alt={"test_image_unoptimized_legacy_static"}
            unoptimized={true}
            basePath={basePath}
          />
        </div>
        <h2>Unoptimized example </h2>
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
            id="test_image_unoptimized"
            priority={true}
            alt={"test_image_unoptimized"}
            unoptimized={true}
            fill
            style={{ objectFit: "cover" }}
            basePath={basePath}
          />
        </div>
        <h2>Unoptimized example static import</h2>
        <div
          style={{
            position: "relative",
            width: "50%",
            height: "200px",
            marginBottom: "3rem",
          }}
        >
          <ExportedImage
            src={testPictureStatic}
            id="test_image_unoptimized_static"
            priority={true}
            alt={"test_image_unoptimized_static"}
            unoptimized={true}
            fill
            style={{ objectFit: "cover" }}
            basePath={basePath}
          />
        </div>
        {/* <ExportedImage
          src="vercel.svg"
          layout="fixed"
          width={300}
          height={100}
          alt="VercelLogo"
        /> */}
      </main>
    </div>
  );
}
