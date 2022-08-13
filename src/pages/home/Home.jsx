import { useEffect } from "react";
import Product from "../../components/product/Product";
import Slider from "../../components/slider/Slider";
import styles from "./home.module.scss";
import Range from "../../components/range/Range";

export default function Home() {
  const url = window.location.href;

  useEffect(() => {
    const scrollToProducts = () => {
      if (url.includes("#products")) {
        window.scrollTo({
          top: 770,
          behavior: "smooth",
        });
      }
      return;
    };
    scrollToProducts();
  }, [url]);

  return (
    <div className={styles.home}>
      <Slider />
      <Range />
      <Product />
    </div>
  );
}
