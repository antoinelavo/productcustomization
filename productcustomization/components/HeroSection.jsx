// @/components/HeroSection.jsx
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const slides = [
    {
      id: 1,
      image: "/images/hero-banner-1.png", // First promotional image
      alt: "커스텀 티셔츠 프로모션",
      title: "100% 커스텀 주문제작 티셔츠!",
      subtitle: "예쁜 옷을 만들어보세요.",
      buttonText: "자세히 보기",
      bgColor: "from-yellow-400 to-orange-500"
    }
    // {
    //   id: 2,
    //   image: "/images/hero-banner-2.png", // Second promotional image  
    //   alt: "강아지 커스텀 티셔츠 프로모션 2",
    //   title: "댕잡았다 🐶 😍 🖤", 
    //   subtitle: "S-2XL | 9 Color",
    //   description: "강아지 커스텀 티셔츠",
    //   buttonText: "지금 주문하기",
    //   bgColor: "from-yellow-500 to-amber-600",
    //   hashtags: "#강아지굿즈 #커스텀티셔츠 #멍냥잇다굿즈티셔츠"
    // }
  ];

  // Auto slide every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section className="relative h-64 md:h-80 overflow-hidden">
      {/* Slides Container */}
      <div className="relative w-full h-full">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-500 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              <img 
                src={slide.image}
                alt={slide.alt}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback to gradient background if image fails to load
                  e.target.style.display = 'none';
                  e.target.parentElement.classList.add(`bg-gradient-to-r`, ...slide.bgColor.split(' '));
                }}
              />
              {/* Fallback gradient background */}
              <div className={`absolute inset-0 bg-gradient-to-r ${slide.bgColor} opacity-0`}></div>
            </div>

            {/* Content Overlay */}
            <div className="relative z-10 h-full flex items-center">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  
                  {/* Text Content */}
                  <div className="text-black">
                    <div className="mb-4">
                      <p className="text-lg md:text-xl font-light opacity-90">
                        {slide.title}
                      </p>
                      <h1 className="text-3xl md:text-5xl font-bold mb-2">
                        {slide.subtitle}
                      </h1>
                      <h2 className="text-2xl md:text-3xl font-medium">
                        {slide.description}
                      </h2>
                    </div>

                    {slide.hashtags && (
                      <p className="text-sm md:text-base opacity-75 mb-6">
                        {slide.hashtags}
                      </p>
                    )}

                    <button className="bg-white text-gray-900 font-bold py-3 px-8 rounded-full hover:bg-yellow-100 transition-all duration-200 transform hover:scale-105 shadow-lg">
                      {slide.buttonText}
                    </button>
                  </div>

                  {/* Visual Space for Products */}
                  <div className="hidden lg:block">
                    {/* This space is reserved for the product images that are part of the banner */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-2 rounded-full transition-all duration-200"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-2 rounded-full transition-all duration-200"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-200 ${
              index === currentSlide 
                ? 'bg-white scale-110' 
                : 'bg-white/50 hover:bg-white/75'
            }`}
          />
        ))}
      </div>
    </section>
  );
}