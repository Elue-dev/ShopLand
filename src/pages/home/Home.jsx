import React from "react";
import { useEffect } from "react";
import Product from "../../components/product/Product";
import Slider from "../../components/slider/Slider";
import styles from "./home.module.scss";

export default function Home() {
  const url = window.location.href;

  const scrollToProducts = () => {
    if (url.includes("#products")) {
      window.scrollTo({
        top: 770,
        behavior: "smooth",
      });
    }
    return;
  };

  useEffect(() => {
    scrollToProducts()
  }, [])

  return (
    <div className={styles.home}>
      <Slider />
      <Product />
    </div>
  );
}
