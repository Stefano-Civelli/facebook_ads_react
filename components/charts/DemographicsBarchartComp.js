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

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

const DemographicsBarchartComponent = ({ demographicType }) => {
  const { startDate, endDate } = useDateContext();
  const {
    data: apiResponse,
    error,
    isLoading,
  } = useSWR(
    `${API_URL}/api/${demographicType}-impressions?startDate=${startDate}&endDate=${endDate}`,
    fetcher
  );

  if (error) return <div>failed to load</div>;
  if (isLoading)
    return (
      <div className="h-[300px] flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );

  const { data, title } = apiResponse;

  const formattedData = Object.keys(data[Object.keys(data)[0]].total).map(
    (category) => ({
      category,
      ...Object.fromEntries(
        Object.entries(data).map(([party, values]) => [
          party,
          values.total[category],
        ])
      ),
    })
  );

  // Define the desired order of parties
  const partyOrder = ["Labor", "Liberal", "Independents", "Greens", "Other"];

  // Filter and sort parties based on the defined order
  const sortedParties = partyOrder.filter((party) =>
    data.hasOwnProperty(party)
  );

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-4 bg-slate-900 flex flex-col gap-4 rounded-md">
          <p className="text-medium text-lg">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}:{" "}
              <span className="ml-2">{formatNumber(entry.value)}</span>
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
        layout="vertical"
        data={formattedData}
        margin={{
          right: 30,
          left: 20,
          top: 5,
          bottom: 15,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          type="number"
          tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
        />
        <YAxis type="category" dataKey="category" />
        <Tooltip content={<CustomTooltip />} />
        <Legend content={<CustomLegend />} />
        {sortedParties.map((party, index) => (
          <Bar
            key={party}
            dataKey={party}
            fill={chartColors[`chart_color_${(index % 5) + 1}`]}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
};

export default DemographicsBarchartComponent;
