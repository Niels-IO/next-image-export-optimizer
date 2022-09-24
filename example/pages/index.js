import Head from "next/head";
import ExportedImage from "../localTestComponent/ExportedImage";
import styles from "../styles/Home.module.css";
import testPictureStatic from "../public/chris-zhang-Jq8-3Bmh1pQ-unsplash_static.jpg";

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
            src="images/chris-zhang-Jq8-3Bmh1pQ-unsplash.jpg"
            layout="fill"
            id="test_image"
            objectFit="cover"
            priority={true}
            placeholder="empty"
            alt={"test_image"}
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
            id="test_image_static"
            layout="responsive"
            priority
          />
        </div>

        <h2>Unoptimized example</h2>
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
            id="test_image_unoptimized"
            objectFit="cover"
            priority={true}
            alt={"test_image_unoptimized"}
            unoptimized={true}
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
