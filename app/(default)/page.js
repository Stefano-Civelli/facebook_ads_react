"use client"; // not good che sia un client component

import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import { useEffect, useState, useRef } from "react";
import { Chart } from "chart.js/auto";
import dynamic from "next/dynamic";
import BarChart from "@/components/charts/BarChart";
import { Bar } from "react-chartjs-2";
import BarChartComponent from "@/components/charts/BarChartComp";
import LineChartComponent from "@/components/charts/LineChart";

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
          color: "white",
        },
        grid: {
          color: "white",
        },
      },
      y: {
        title: {
          display: true,
          text: data.y_label,
        },
        ticks: {
          color: "white",
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
      <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        <GridItem title={data.title}>
          <BarChart data={data} options={barChartOptions} />
        </GridItem>
        <GridItem title={data.title}>
          <BarChart data={data} options={barChartOptions} />
        </GridItem>
        <GridItem title={data.title}>
          <BarChart data={data} options={barChartOptions} />
        </GridItem>
        <GridItem title={data.title}>
          <Bar
            data={{
              labels: data.data.map((x) => x.label),
              datasets: [
                {
                  label: data.xLabel,
                  data: data.data.map((x) => x.value / 1e6),
                  backgroundColor: "pink",
                },
              ],
            }}
            options={options}
          />
        </GridItem>
        <GridItem title={data.title}>
          <BarChartComponent />
        </GridItem>
        <GridItem title={data.title}>
          <LineChartComponent />
        </GridItem>
      </div>
    </div>
  );
}

function GridItem({ title, children }) {
  return (
    <div className="flex flex-col items-center justify-center p-4 border border-slate-900 bg-slate-900/50 rounded-xl h-[300px] shadow-slate-200 my-3">
      <h3 className="text-lg font-semibold text-white mt-5">{title}</h3>
      {children}
    </div>
  );
}
