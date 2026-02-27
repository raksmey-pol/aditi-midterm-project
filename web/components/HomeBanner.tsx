import React, { useState } from "react";
import { Title } from "@/components/ui/text";
import Link from "next/link";
import Image from "next/image";
import { useSlides } from "../hooks/useSlides";

const HomeBanner = () => {

  const { slides, loading, error } = useSlides();
  const [current, setCurrent] = useState(0);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!slides.length) return <div>No slide data available</div>;

  const slide = slides[current];

  const prevSlide = () => setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  const nextSlide = () => setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));

  return (
    <div className="py-16 md:py-0 bg-shop_light_pink rounded-lg px-10 lg:px-24 flex items-center justify-between relative">
      {/* Left arrow */}
      {slides.length > 1 && (
        <button
          onClick={prevSlide}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow hover:bg-shop_light_green z-10"
          aria-label="Previous slide"
        >
          &#8592;
        </button>
      )}
      <div className="space-y-5">
        <Title>
          {slide.title}
        </Title>
        <Link
          href={slide.link || "/shop"}
          className="bg-shop_dark_green/90 text-white/90 px-5 py-2 rounded-md text-sm font-semibold hover:text-white hover:bg-shop_dark_green hoverEffect"
        >
          Buy Now
        </Link>
        {slide.description && (
          <div className="text-sm text-gray-600 mt-2">{slide.description}</div>
        )}
      </div>
      <div>
        <Image
          src={slide.imageUrl}
          alt={slide.title}
          className="w-96"
          width={384}
          height={200}
        />
      </div>
      {/* Right arrow */}
      {slides.length > 1 && (
        <button
          onClick={nextSlide}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow hover:bg-shop_light_green z-10"
          aria-label="Next slide"
        >
          &#8594;
        </button>
      )}
      {/* Pagination dots */}
      {slides.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`w-3 h-3 rounded-full ${idx === current ? "bg-shop_dark_green" : "bg-gray-300"}`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default HomeBanner;