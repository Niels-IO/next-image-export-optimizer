import Head from "next/head";
import ExportedImage from "next-image-export-optimizer";
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

        <ExportedImage
          src="images/chris-zhang-Jq8-3Bmh1pQ-unsplash.jpg"
          layout="fixed"
          width={500}
          height={300}
        />
        <ExportedImage
          src="vercel.svg"
          layout="fixed"
          width={500}
          height={300}
        />
      </main>
    </div>
  );
}
