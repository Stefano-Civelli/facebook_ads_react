import { useEffect, useRef } from "react";
import { Chart } from "chart.js";

const LineChart = ({ data, options }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    const ctx = chartRef.current.getContext("2d");
    new Chart(ctx, {
      type: "line",
      data: data,
      options: options,
    });
  }, [data, options]);

  return <canvas ref={chartRef}></canvas>;
};

export default LineChart;
