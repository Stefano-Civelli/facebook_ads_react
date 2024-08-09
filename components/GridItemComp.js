import React from "react";

const GridItem = async ({ url, children }) => {
  return (
    <div className="flex flex-col items-center justify-center p-4 border border-slate-900 bg-slate-900/50 rounded-xl h-[400px] shadow-slate-200 my-3">
      {children}
    </div>
  );
};

export default GridItem;

// {React.cloneElement(children, { data: data })}
