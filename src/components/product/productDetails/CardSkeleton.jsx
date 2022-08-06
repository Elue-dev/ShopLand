import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import styles from "./productDetails.module.scss";

const CardSkeleton = () => {
  return (
    <SkeletonTheme baseColor="#e7e7e7" highlightColor="#fff">
      <div className={styles.details}>
        <div className={styles.img}>
          <Skeleton className={styles.img} />
        </div>

        <div className={`${styles.content} ${styles.all}`}>
          <Skeleton style={{ height: "3rem", marginBottom: "1.5rem" }} />
          <Skeleton style={{ height: "1.5rem", marginBottom: "1.5rem" }} />
          <Skeleton style={{ height: "10rem", marginBottom: "1.5rem" }} />
          <Skeleton style={{ height: "1.5rem", marginBottom: "1.5rem" }} />
          <Skeleton style={{ height: "1.5rem", marginBottom: "1.5rem" }} />
          <Skeleton style={{ height: "1.5rem", marginBottom: "1.5rem" }} />
          <Skeleton style={{ height: "3rem", marginBottom: "1.5rem" }} />
          <div style={{ display: "flex" }}>
            <Skeleton />
            <Skeleton />
          </div>
          <Skeleton style={{ height: "1.5rem", marginBottom: "1.5rem" }} />
          <Skeleton style={{ height: "1.3rem", marginBottom: "1.5rem" }} />
        </div>
      </div>
    </SkeletonTheme>
  );
};
export default CardSkeleton;
