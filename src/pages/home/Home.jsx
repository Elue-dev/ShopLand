import { useEffect, useState } from "react";
import Product from "../../components/product/Product";
import Slider from "../../components/slider/Slider";
import { SiGooglemessages } from "react-icons/si";
import styles from "./home.module.scss";
import ChatBot from "./ChatBot";

export default function Home() {
  const [show, setShow] = useState(false);

  const handleBotVisibility = () => {
    setShow(!show);
  };

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
      <Product />
      
    </div>
  );
}
