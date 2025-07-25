"use client";
import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function TestimonialsCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [screenWidth, setScreenWidth] = useState(0);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleResize = () => setScreenWidth(window.innerWidth);
      handleResize(); // set initial value
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);


  const testimonials = [
    {
      id: 1,
      text: "Architectura transformed our vision into a reality. The team's professionalism and creativity were exceptional",
      author: "Sarah W",
      company: "Managing Director, Swift",
      avatar: "SW",
    },
    {
      id: 2,
      text: "Their design for our corporate headquarters was a game-changer. It perfectly captures our brand's essence.",
      author: "John T, Ajala.",
      company: "Managing Director, Swift",
      avatar: "JA",
    },
    {
      id: 3,
      text: "Their design for our corporate headquarters was a game-changer. It perfectly captures our brand's essence.",
      author: "John T, Ajala.",
      company: "Managing Director, Swift",
      avatar: "JA",
    },
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  // Auto-play functionality
  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gray-50 py-16 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
            What Our
            <br />
            Customers Say
          </h2>
        </div>

        {/* Testimonials Grid - Always show 3 cards */}
        <div className="relative overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {testimonials.map((testimonial, index) => (
              <div key={testimonial.id} className="w-full flex-shrink-0">
                {/* Responsive grid: 1 card on mobile, 3 cards on md+ */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-6">
                  {/* Mobile: show only one card, Desktop: show three */}
                  {(screenWidth < 768 ? [0] : [0, 1, 2]).map((cardIndex) => (
                    <div
                      key={cardIndex}
                      className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100"
                    >
                      {/* Large Quote Icon */}
                      <div className="mb-6">
                        <svg
                          className="w-12 h-12 text-gray-200"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z" />
                        </svg>
                      </div>
                      <p className="text-gray-800 leading-relaxed mb-8 font-medium">
                        {testimonial.text}
                      </p>
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center mr-3">
                          <span className="text-white font-medium text-sm">
                            {testimonial.avatar}
                          </span>
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 text-sm">
                            {testimonial.author}
                          </div>
                          <div className="text-xs text-gray-500">
                            {testimonial.company}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 px-6">
            {/* Pagination Dots */}
            <div className="flex space-x-3">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                    index === currentSlide
                      ? "bg-gray-900"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

            {/* Arrow Navigation */}
            <div className="flex space-x-3">
              <button
                onClick={prevSlide}
                className="w-12 h-12 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 shadow-sm"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <button
                onClick={nextSlide}
                className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors duration-300 shadow-sm"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
