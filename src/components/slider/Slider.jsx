import { useState } from "react";
import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai";
import { sliderData } from "./slideData";
import "./slider.scss";
import { useEffect } from "react";
import { Link } from "react-router-dom";

export default function Slider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slideLength = sliderData.length;

  const nextSlide = () => {
    setCurrentSlide(currentSlide === slideLength - 1 ? 0 : currentSlide + 1);
  };
  const prevSlide = () => {
    setCurrentSlide(currentSlide === 0 ? slideLength - 1 : currentSlide - 1);
  };

  const autoScroll = true;
  let slideInterval;
  let intervalTime = 4000;

  useEffect(() => {
    setCurrentSlide(0);
  }, []);

  useEffect(() => {
    if (autoScroll) {
      const auto = () => {
        slideInterval = setInterval(nextSlide, intervalTime);
      };
      auto();
    }
    return () => clearInterval(slideInterval);
  }, [currentSlide, slideInterval, autoScroll]);

  return (
    <div className="slider">
      <AiOutlineArrowLeft onClick={prevSlide} className="arrow prev" />
      <AiOutlineArrowRight onClick={nextSlide} className="arrow next" />
      {sliderData.map((slide, index) => (
        <div
          key={index}
          className={index === currentSlide ? "slide current" : "slide"}
        >
          {index === currentSlide && (
            <>
              <img src={slide.image} alt={slide.heading} />
              <div className="content">
                <h2>{slide.desc}</h2>
                <hr />
                <h3>ALL PRODUCTS AFFORDABLE</h3>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
