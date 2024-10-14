"use client";

import React from "react";
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
import { useDateContext } from "../../context/DateContext";
import { chartColors } from "@/lib/config.js";
import { formatNumber, cleanString } from "@/lib/util";
import CustomLegend from "@/components/CustomLegendComponent";
import { useTheme } from "@/context/ThemeContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

const BarChartComponent = ({ dataType, title, valuePrefix = "" }) => {
  const { startDate, endDate } = useDateContext();
  const { isDarkMode } = useTheme();
  const { data, error, isLoading } = useSWR(
    `${API_URL}/api/party-${dataType}?startDate=${startDate}&endDate=${endDate}`,
    fetcher
  );

  if (error) return <div>failed to load</div>;
  if (isLoading)
    return (
      <div className="h-[300px] flex items-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );

  const formattedData = Object.entries(data).map(([party, values]) => ({
    party: cleanString(party),
    low_persuasive: values[`low_persuasive_${dataType}`],
    high_persuasive: values[`high_persuasive_${dataType}`],
    others:
      values[`total_${dataType}`] -
      values[`low_persuasive_${dataType}`] -
      values[`high_persuasive_${dataType}`],
  }));

  const sortedData = formattedData.sort(
    (a, b) =>
      b.low_persuasive +
      b.high_persuasive +
      b.others -
      (a.low_persuasive + a.high_persuasive + a.others)
  );

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div
          className={`p-4 ${
            isDarkMode ? "bg-slate-900" : "bg-white"
          } flex flex-col gap-4 rounded-md ${
            !isDarkMode ? "border border-gray-200" : ""
          }`}
        >
          <p
            className={`text-medium text-lg ${
              isDarkMode ? "text-white" : "text-black"
            }`}
          >
            {label}
          </p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}:{" "}
              <span className="ml-2">
                {valuePrefix}
                {formatNumber(entry.value)}
              </span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer
      width="100%"
      height="100%"
      className="flex flex-col items-center justify-center"
    >
      <h3
        className={`text-lg font-semibold ${
          isDarkMode ? "text-white" : "text-black"
        } mt-5`}
      >
        {title}
      </h3>
      <BarChart
        data={sortedData}
        layout="vertical"
        margin={{
          right: 30,
          left: 50,
          top: 5,
          bottom: 15,
        }}
      >
        <CartesianGrid
          horizontal={false}
          vertical={true}
          strokeDasharray="3"
          stroke={isDarkMode ? "#555555" : "#e0e0e0"}
        />
        <XAxis
          type="number"
          tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
          tick={{ fill: isDarkMode ? "#999" : "#333" }}
        />
        <YAxis
          dataKey="party"
          type="category"
          tick={{ fill: isDarkMode ? "#999" : "#333" }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend content={<CustomLegend isDarkMode={isDarkMode} />} />
        <Bar
          dataKey="low_persuasive"
          stackId="a"
          fill={chartColors.chart_color_3}
          name="Low Persuasive"
        />
        <Bar
          dataKey="high_persuasive"
          stackId="a"
          fill={chartColors.chart_color_1}
          name="High Persuasive"
        />
        <Bar
          dataKey="others"
          stackId="a"
          fill={chartColors.chart_color_2}
          name="Others"
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BarChartComponent;
