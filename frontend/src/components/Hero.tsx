import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

const banners = [
  "/banner1.png",
  "/banner2.png",
  "/banner3.png"
];

export default function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [previousIndex, setPreviousIndex] = useState(-1);

  const changeSlide = (newIndex: number) => {
    setPreviousIndex(currentIndex);
    setCurrentIndex(newIndex);
  };

  // Auto slide every 5s
  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 5000);
    return () => clearInterval(timer);
  }, [currentIndex]);

  const handlePrev = () => {
    changeSlide(currentIndex === 0 ? banners.length - 1 : currentIndex - 1);
  };

  const handleNext = () => {
    changeSlide(currentIndex === banners.length - 1 ? 0 : currentIndex + 1);
  };

  return (
    <div className="relative w-full h-[280px] sm:h-[450px] md:h-[618px] overflow-hidden group bg-black">
      {/* Slides */}
      {banners.map((src, idx) => {
        const isActive = idx === currentIndex;
        const isPrev = idx === previousIndex;

        let zClass = "z-0";
        let opacityClass = "opacity-0";
        if (isActive) {
          zClass = "z-10";
          opacityClass = "opacity-100";
        } else if (isPrev) {
          zClass = "z-5";
          opacityClass = "opacity-0";
        }

        return (
          <div
            key={src}
            className={`absolute inset-0 transition-opacity duration-[1200ms] ease-in-out transform-gpu ${zClass} ${opacityClass}`}
          >
            <Image
              src={src}
              alt={`Hero Banner ${idx + 1}`}
              fill
              priority={idx === 0}
              className="object-cover transition-transform duration-[5000ms] ease-out transform-gpu"
              style={{
                transform: isActive ? "scale(1)" : "scale(1.05)"
              }}
              unoptimized
            />
            {/* Overlay Gradients */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary-950/40 via-primary-900/20 to-primary-800/10 z-10"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(9,48,12,0.02),rgba(9,48,12,0.25))] z-10"></div>
          </div>
        );
      })}

      {/* Navigation Arrows */}
      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 bg-black/15 hover:bg-black/30 active:bg-black/50 text-white rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-300 opacity-0 group-hover:opacity-100 shadow-md transform -translate-x-2 group-hover:translate-x-0"
        aria-label="Slide trước"
      >
        <ChevronLeft className="w-6 h-6 md:w-8 md:h-8 text-white" />
      </button>
      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 bg-black/15 hover:bg-black/30 active:bg-black/50 text-white rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-300 opacity-0 group-hover:opacity-100 shadow-md transform translate-x-2 group-hover:translate-x-0"
        aria-label="Slide sau"
      >
        <ChevronRight className="w-6 h-6 md:w-8 md:h-8 text-white" />
      </button>

      {/* Slide Indicators (Dots) */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2 flex-wrap items-center justify-center">
        {banners.map((_, idx) => (
          <button
            key={idx}
            onClick={() => changeSlide(idx)}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              idx === currentIndex
                ? "bg-primary-500 w-6"
                : "bg-white/60 hover:bg-white w-2.5"
            }`}
            aria-label={`Đi tới slide ${idx + 1}`}
          />
        ))}
      </div>

      {/* Decorative Bottom Transition */}
      <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-white/30 to-transparent z-20"></div>
    </div>
  );
} 