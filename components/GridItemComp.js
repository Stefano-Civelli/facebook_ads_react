import React from "react";
import { cn } from "@/lib/util";

const GridItem = async ({ className, children }) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-4 border border-slate-900 bg-slate-900/50 rounded-xl h-[300px] shadow-slate-200 my-3",
        className
      )}
    >
      {children}
    </div>
  );
};

export default GridItem;

// {React.cloneElement(children, { data: data })}
