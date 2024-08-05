"use client";

import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
//import Plot from "react-plotly.js";
import { useEffect, useState, useRef } from "react";
import { Chart } from "chart.js/auto";
import dynamic from "next/dynamic";
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

export default function Home() {
  const [data, setData] = useState({ parties: [], spend: [] });
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  const barChartData = {
    /* Your bar chart data */
  };
  const barChartOptions = {
    /* Your bar chart options */
  };

  const lineChartData = {
    /* Your line chart data */
  };
  const lineChartOptions = {
    /* Your line chart options */
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("http://127.0.0.1:5000/api/party-spend");
      const json = await response.json();
      setData(json);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (data.parties.length > 0 && chartRef.current) {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const ctx = chartRef.current.getContext("2d");
      chartInstance.current = new Chart(ctx, {
        type: "bar",
        data: {
          labels: data.parties,
          datasets: [
            {
              label: "Spend (Millions $)",
              data: data.spend.map((s) => s / 1e6),
              backgroundColor: "lightblue",
            },
          ],
        },
        options: {
          indexAxis: "y",
          plugins: {
            title: {
              display: true,
              text: "Spend by Party",
            },
            legend: {
              display: false,
            },
          },
          scales: {
            x: {
              title: {
                display: true,
                text: "Spend (Millions $)",
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
                text: "Parties",
              },
              ticks: {
                color: "black",
              },
            },
          },
        },
      });
    }
  }, [data]);

  return (
    <div>
      <Head>
        <title>Main Page</title>
      </Head>
      <div
        style={{
          position: "relative",
          height: "60vh",
          width: "80vw",
          maxWidth: "1000px",
          margin: "0 auto",
          border: "1px solid red",
        }}
      >
        <canvas className="bg-white" ref={chartRef}></canvas>
      </div>
    </div>
  );
}
