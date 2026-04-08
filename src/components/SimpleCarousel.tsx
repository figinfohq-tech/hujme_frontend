import { ArrowLeft, ArrowRight } from "lucide-react";
import React, { useState } from "react";

const SimpleCarousel = ({ images = [], onImageClick }) => {
  const [index, setIndex] = useState(0);

  const data = images.length > 0 ? images : ["/placeholder.svg"];

  const prevSlide = () => {
    setIndex((prev) => (prev === 0 ? data.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setIndex((prev) => (prev === data.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative w-full group">
      {/* Image */}
      <div className="w-full aspect-[16/9] sm:aspect-[4/3] md:aspect-[16/9] lg:h-[300px] flex items-center justify-center overflow-hidden rounded-xl">
        <img
          src={data[index]}
          alt="carousel"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 cursor-pointer"
          onClick={() => onImageClick(index)}
        />
      </div>

      {/* Previous */}
      <button
        onClick={prevSlide}
        className="absolute left-2 sm:left-3 md:left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow"
      >
        <ArrowLeft />
      </button>

      {/* Next */}
      <button
        onClick={nextSlide}
        className="absolute right-2 sm:right-3 md:right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow"
      >
        <ArrowRight />
      </button>
    </div>
  );
};

export default SimpleCarousel;
