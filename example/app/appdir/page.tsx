import styles from "../../styles/Home.module.css";
import ExportedImage from "../../../src/ExportedImage";
import ExportedImageLegacy from "../../../src/legacy/ExportedImage";

export default function Home() {
  return (
    <main className={styles.main}>
      <div>
        <p>
          Example app with&nbsp;
          <code className={styles.code}>app/page.tsx</code>
        </p>
      </div>
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
          style={{ objectFit: "cover" }}
        />
      </div>
    </main>
  );
}
