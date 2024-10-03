"use client";

import React, { useState } from "react";
import { cn } from "@/lib/util";
import InfoIcon from "./InfoIconComponent";

const GridItem = ({
  className,
  children,
  infoContent,
  blurText = "No additional information available.",
}) => {
  const [isBlurred, setIsBlurred] = useState(false);

  const handleClick = () => {
    setIsBlurred(!isBlurred);
  };

  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center p-4 border border-slate-800 bg-slate-900/50 rounded-xl h-[350px] my-4",
        "transition-all duration-300 ease-in-out",
        "hover:scale-[1.01]",
        className
      )}
      onClick={handleClick}
    >
      {infoContent && (
        <div className="absolute top-2 right-2">
          <InfoIcon content={infoContent} />
        </div>
      )}
      {children}
      <div
        className={cn(
          "absolute inset-0 flex items-center justify-center rounded-xl overflow-y-auto",
          "transition-all duration-300 ease-in-out",
          isBlurred
            ? "backdrop-blur-md bg-[#020617b3] opacity-100 visible"
            : "backdrop-blur-none bg-transparent opacity-0 invisible"
        )}
      >
        <div
          className="text-white text-left px-4 py-2 max-w-full"
          dangerouslySetInnerHTML={{ __html: blurText }}
        />
      </div>
    </div>
  );
};

export default GridItem;
