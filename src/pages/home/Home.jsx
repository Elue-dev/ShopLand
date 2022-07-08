import React from "react";
import Product from "../../components/product/Product";
import Slider from "../../components/slider/Slider";
import styles from "./home.module.scss";

export default function Home() {
  return (
    <div className={styles.home}>
      <Slider />
      <Product />
    </div>
  );
}
