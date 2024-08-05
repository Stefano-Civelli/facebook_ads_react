import { useEffect, useRef } from "react";
import { Chart } from "chart.js";

const ChartComponent = ({ type, data, options }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    const ctx = chartRef.current.getContext("2d");
    new Chart(ctx, {
      type: type,
      data: data,
      options: options,
    });
  }, [type, data, options]);

  return <canvas ref={chartRef}></canvas>;
};

export default ChartComponent;
