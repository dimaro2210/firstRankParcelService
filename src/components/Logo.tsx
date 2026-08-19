import React from "react";

interface LogoProps {
  variant?: "default" | "light" | "admin";
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export default function Logo({
  variant = "default",
  size = "md",
  className = "",
}: LogoProps) {
  const isLight = variant === "light";

  // Sizing maps
  const iconSizes = {
    sm: "h-7 sm:h-8",
    md: "h-9 sm:h-11 md:h-12",
    lg: "h-12 sm:h-14 md:h-16",
    xl: "h-16 sm:h-20 md:h-24",
  };

  const titleSizes = {
    sm: "text-[15px] sm:text-[17px]",
    md: "text-[18px] sm:text-[21px] md:text-[23px]",
    lg: "text-[22px] sm:text-[26px] md:text-[30px]",
    xl: "text-[28px] sm:text-[34px] md:text-[40px]",
  };

  return (
    <div className={`flex items-center gap-2 sm:gap-2.5 md:gap-3 group select-none ${className}`}>
      {/* Emblem Icon */}
      <img
        src={`${import.meta.env.BASE_URL}firstrank_icon_clean.png`}
        alt="FIRSTRANK PARCEL"
        className={`${iconSizes[size]} w-auto object-contain shrink-0 transition-transform duration-300 group-hover:scale-105`}
        loading="eager"
      />

      {/* Brand Typography */}
      <div className="flex items-center font-black font-outfit tracking-tight leading-none">
        <span className={isLight ? "text-white" : "text-[#0B2B26]"}>FIRSTRANK</span>
        <span className="text-[#F59A25] ml-1">PARCEL</span>
      </div>
    </div>
  );
}
