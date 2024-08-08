"use client";

import React, { useState } from "react";

const DateSliderComp = () => {
  const [startValue, setStartValue] = useState(0);
  const [endValue, setEndValue] = useState(100);

  const handleStartChange = (e) => {
    const value = Number(e.target.value);
    setStartValue(Math.min(value, endValue));
  };

  const handleEndChange = (e) => {
    const value = Number(e.target.value);
    setEndValue(Math.max(value, startValue));
  };

  return (
    <div>
      <div className="flex justify-center items-center">
        <input
          type="range"
          min="0"
          max="100"
          value={startValue}
          onChange={handleStartChange}
          className="slider"
          id="startRange"
        />
        <input
          type="range"
          min="0"
          max="100"
          value={endValue}
          onChange={handleEndChange}
          className="slider"
          id="endRange"
        />
      </div>
      <div className="flex justify-between">
        <p>Start Date: {startValue}</p>
        <p>End Date: {endValue}</p>
      </div>
    </div>
  );
};

export default DateSliderComp;
