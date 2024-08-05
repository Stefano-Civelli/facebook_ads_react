import { useEffect, useRef } from "react";
import { Chart } from "chart.js";

const BarChart = ({ data, options }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    const ctx = chartRef.current.getContext("2d");
    new Chart(ctx, {
      type: "bar",
      data: data,
      options: options,
    });
  }, [data, options]);

  return <canvas ref={chartRef}></canvas>;
};

export default BarChart;
