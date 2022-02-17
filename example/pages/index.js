import Head from "next/head";
import ExportedImage from "next-image-export-optimizer";
import styles from "../styles/Home.module.css";
import Image from "next/image";

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
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "200px",
            marginBottom: "3rem",
          }}
        >
          <ExportedImage
            src="images/chris-zhang-Jq8-3Bmh1pQ-unsplash.jpg"
            layout="fill"
            objectFit="cover"
            priority={true}
          />
        </div>
        <ExportedImage
          src="vercel.svg"
          layout="fixed"
          width={300}
          height={100}
          alt="VercelLogo"
        />
        <Image
          alt="VercelLogo"
          src="/vercel.svg"
          layout="fixed"
          width={300}
          height={100}
        />
      </main>
    </div>
  );
}
