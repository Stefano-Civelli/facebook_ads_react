import { useEffect, useRef } from "react";
import { Chart } from "chart.js";

const BarChart = ({ data, options }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (data.data.length > 0 && chartRef.current) {
      if (chartInstance.current) {
        chartInstance.current.destroy(); // Destroy existing chart instance if it exists
      }

      const ctx = chartRef.current.getContext("2d"); // Get 2D context from the canvas
      chartInstance.current = new Chart(ctx, {
        type: "bar",
        data: {
          labels: data.data.map((x) => x.label),
          datasets: [
            {
              label: data.xLabel,
              data: data.data.map((x) => x.value / 1e6),
              backgroundColor: "lightblue",
            },
          ],
        },
        options: {
          indexAxis: "y",
          plugins: {
            title: {
              display: true,
              text: data.title,
            },
            legend: {
              display: false,
            },
          },
          scales: {
            x: {
              title: {
                display: true,
                text: data.x_label,
              },
              ticks: {
                callback: function (value) {
                  return "$" + value.toFixed(0) + "M";
                },
                color: "black",
              },
              grid: {
                color: "lightgray",
              },
            },
            y: {
              title: {
                display: true,
                text: data,
              },
              ticks: {
                color: "black",
              },
            },
          },
        },
      });
    }
  }, [data, options]);

  return (
    <canvas
      className="bg-neutral-50"
      ref={chartRef}
      style={{ width: "10vw" }}
    ></canvas>
  );
};

export default BarChart;
