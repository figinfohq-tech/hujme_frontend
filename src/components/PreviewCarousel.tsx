import { ArrowLeft, ArrowRight } from "lucide-react";
import React, { useState, useEffect } from "react";

const PreviewCarousel = ({
  images = [],
  startIndex = 0,
  imageZoomed,
  setImageZoomed,
}) => {
  const data = images.length > 0 ? images : ["/placeholder.svg"];
  const [index, setIndex] = useState(startIndex);

  // jab selectedIndex change ho
  useEffect(() => {
    setIndex(startIndex);
  }, [startIndex]);

  const prevSlide = () => {
    setIndex((prev) => (prev === 0 ? data.length - 1 : prev - 1));
    setImageZoomed(false); // reset zoom
  };

  const nextSlide = () => {
    setIndex((prev) => (prev === data.length - 1 ? 0 : prev + 1));
    setImageZoomed(false); // reset zoom
  };

  const toggleZoom = () => {
    setImageZoomed((prev) => !prev);
  };

  return (
    <div className="relative w-full">
      {/* Image */}
      <div className="flex items-center justify-center h-[75vh] overflow-hidden">
        <img
          src={data[index]}
          alt="preview"
          onClick={toggleZoom}
          className={`max-h-full max-w-full object-contain rounded-xl transition-transform duration-300 ${
            imageZoomed
              ? "scale-150 cursor-zoom-out"
              : "scale-100 cursor-zoom-in"
          }`}
        />
      </div>

      {/* Prev */}
      <button
        onClick={prevSlide}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow"
      >
        <ArrowLeft />
      </button>

      {/* Next */}
      <button
        onClick={nextSlide}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow"
      >
        <ArrowRight />
      </button>
    </div>
  );
};

export default PreviewCarousel;
