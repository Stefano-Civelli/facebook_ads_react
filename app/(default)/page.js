"use client";

import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import { useEffect, useState, useRef } from "react";
import { Chart } from "chart.js/auto";
import dynamic from "next/dynamic";
import BarChart from "@/components/charts/BarChart";
import { Bar } from "react-chartjs-2";

export default function Home() {
  const [data, setData] = useState({
    data: [],
    description: "",
    title: "",
    x_label: "",
    y_label: "",
  });

  const barChartOptions = {
    titleText: "Spend by Party",
    xText: "Spend (Millions $)",
    yText: "Parties",
  };

  const options = {
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
          text: data.y_label,
        },
        ticks: {
          color: "black",
        },
      },
    },
  };

  const fetchData = async () => {
    const response = await fetch("http://127.0.0.1:5000/api/party-spend");
    const json = await response.json();
    setData(json);
    console.log(json);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="container grid grid-cols-1 md:grid-cols-4 gap-5">
      <div className="md:col-span-1">
        <Sidebar />
      </div>
      <div className="md:col-span-3 space-y-4">
        <h1 className="text-center">Plots</h1>
        <BarChart data={data} options={barChartOptions} />
        <BarChart data={data} options={barChartOptions} />
        <BarChart data={data} options={barChartOptions} />
        <Bar
          data={{
            labels: data.data.map((x) => x.label),
            datasets: [
              {
                label: data.xLabel,
                data: data.data.map((x) => x.value / 1e6),
                backgroundColor: "lightblue",
              },
            ],
          }}
          options={options}
        />
      </div>
    </div>
  );
}
