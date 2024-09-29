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
import { formatNumber } from "@/lib/util";
import CustomLegend from "@/components/CustomLegendComponent";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

const BarChartComponent = ({ dataType, title, valuePrefix = "" }) => {
  const { startDate, endDate } = useDateContext();
  const { data, error, isLoading } = useSWR(
    `http://127.0.0.1:5000/api/party-${dataType}?startDate=${startDate}&endDate=${endDate}`,
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
    party,
    low_persuasive: values[`low_persuasive_${dataType}`],
    high_persuasive: values[`high_persuasive_${dataType}`],
    total: values[`total_${dataType}`],
  }));

  const sortedData = formattedData.sort((a, b) => b.total - a.total);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-4 bg-slate-900 flex flex-col gap-4 rounded-md">
          <p className="text-medium text-lg">{label}</p>
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
      <h3 className="text-lg font-semibold text-white mt-5">{title}</h3>
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
        <CartesianGrid strokeDasharray="3" />
        <XAxis
          type="number"
          tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
        />
        <YAxis dataKey="party" type="category" />
        <Tooltip content={<CustomTooltip />} />
        <Legend content={<CustomLegend />} />
        <Bar
          dataKey="low_persuasive"
          stackId="a"
          fill={chartColors.chart_color_1}
          name="Low Persuasive"
        />
        <Bar
          dataKey="high_persuasive"
          stackId="a"
          fill={chartColors.chart_color_2}
          name="High Persuasive"
        />
        <Bar
          dataKey="total"
          stackId="a"
          fill={chartColors.chart_color_3}
          name="Total"
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BarChartComponent;
