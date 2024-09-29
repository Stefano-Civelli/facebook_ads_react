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
        "relative flex flex-col items-center justify-center p-4 border border-slate-900 bg-slate-900/50 rounded-xl h-[350px] my-3",
        "transition-shadow duration-300 ease-in-out",
        "hover:shadow-[0px_10px_15px_-3px_rgba(255,255,255,0.1),0px_4px_6px_-2px_rgba(255,255,255,0.05)]",
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
