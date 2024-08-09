"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import useSWR from "swr";
import { useDateContext } from "../../context/DateContext";
import { chartColors } from "@/lib/config.js";
import { formatDate, formatNumber } from "@/lib/util.js";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

// const salesData = [
//   {
//     name: "Jan",
//     revenue: 4000,
//     profit: 2400,
//   },
//   {
//     name: "Feb",
//     revenue: 3000,
//     profit: 1398,
//   },
//   {
//     name: "Mar",
//     revenue: 9800,
//     profit: 2000,
//   },
//   {
//     name: "Apr",
//     revenue: 3908,
//     profit: 2780,
//   },
//   {
//     name: "May",
//     revenue: 4800,
//     profit: 1890,
//   },
//   {
//     name: "Jun",
//     revenue: 3800,
//     profit: 2390,
//   },
// ];

const LineChartComponent = () => {
  const { startDate, endDate } = useDateContext();
  const { data, error, isLoading } = useSWR(
    `http://127.0.0.1:5000/api/time-series?startDate=${startDate}&endDate=${endDate}`,
    fetcher
  );

  if (error) return <div>failed to load</div>;
  if (isLoading)
    return (
      <div className="h-[300px] flex items-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );

  console.log(data);

  return (
    <ResponsiveContainer
      width="100%"
      height="100%"
      className="flex flex-col items-center justify-center"
    >
      <h3 className="text-lg font-semibold text-white mt-5">{data.title}</h3>
      <LineChart
        data={data.data}
        margin={{
          right: 30,
          left: 0,
          top: 5,
          bottom: 15,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" tickFormatter={formatDate} />
        <YAxis tickFormatter={(x) => `${x / 1000000}M`} />

        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Line
          type="monotone"
          dataKey="df1_mean_spend"
          stroke={chartColors.chart_color_1}
        />
        <Line
          type="monotone"
          dataKey="df1_mean_impressions"
          stroke={chartColors.chart_color_3}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default LineChartComponent;

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-4 bg-slate-900 flex flex-col gap-4 rounded-md">
        <p className="text-medium text-lg">{formatDate(label)}</p>
        <p className="text-sm" style={{ color: payload[0].stroke }}>
          Spend:
          <span className="ml-2">${formatNumber(payload[0].value)}</span>
        </p>
        <p className="text-sm" style={{ color: payload[1].stroke }}>
          Impressions:
          <span className="ml-2">{formatNumber(payload[1].value)}</span>
        </p>
      </div>
    );
  }
};
