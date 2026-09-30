import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { API_BASE_URL } from "../config/api";

const BannerCourosel = ({ banners }) => {
  if (!banners || banners.length === 0) return null;

  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4500,
    arrows: false,
  };

  return (
    <div className="relative w-full overflow-hidden rounded-2xl">
      <Slider {...settings}>
        {banners.map((banner, index) => (
          <div key={index} className="relative outline-none">
            <div className="relative h-[320px] sm:h-[420px] w-full overflow-hidden">
              <img
                src={`${API_BASE_URL}/banners/${banner?.image}`}
                alt={banner.title || `Banner ${index + 1}`}
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#090C15] via-[#090C15]/40 to-transparent flex flex-col justify-end p-6 sm:p-10 text-left">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 w-fit mb-2">
                  Featured Spotlight
                </span>
                <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-display">
                  {banner.title}
                </h2>
                {banner?.description && (
                  <p className="text-xs sm:text-sm text-slate-300 max-w-xl mt-1 line-clamp-2">
                    {banner.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default BannerCourosel;
