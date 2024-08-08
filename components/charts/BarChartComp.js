"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import useSWR from "swr";

// async function getData() {
//   const res = await fetch("http://127.0.0.1:5000/api/party-spend", {
//     cache: "force-cache", //it's the default
//   });
//   if (!res.ok) {
//     throw new Error("Failed to fetch data");
//   }
//   return res.json();
// }

const fetcher = (...args) => fetch(...args).then((res) => res.json());

const BarChartComponent = () => {
  const { data, error, isLoading } = useSWR(
    "http://127.0.0.1:5000/api/party-spend",
    fetcher
  );

  if (error) return <div>failed to load</div>;
  if (isLoading)
    return (
      <div className="h-[300px] flex items-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );

  return (
    <ResponsiveContainer
      width="100%"
      height="100%"
      className="flex flex-col items-center justify-center"
    >
      <h3 className="text-lg font-semibold text-white mt-5">{data.title}</h3>
      <BarChart
        data={data.data}
        layout="vertical"
        margin={{
          right: 30,
          left: 50,
          top: 5,
          bottom: 15,
        }}
      >
        <CartesianGrid strokeDasharray="3" />
        <XAxis
          type="number"
          tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
        />
        <YAxis dataKey="label" type="category" />
        <Tooltip
          content={<CustomTooltip />}
          cursor={{ fill: "rgba(240, 255, 255, 0.129)" }}
        />
        <Legend />
        <Bar dataKey="value" fill="#2563eb" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BarChartComponent;

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-4 bg-slate-900 flex flex-col gap-4 rounded-md">
        <p className="text-medium text-lg">{label}</p>
        <p className="text-sm text-blue-400">
          spend:
          <span className="ml-2">
            ${`${(payload[0].value / 1000000).toFixed(1)}M`}
          </span>
        </p>
      </div>
    );
  }
};
