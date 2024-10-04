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
  ReferenceLine,
} from "recharts";

import useSWR from "swr";
import { useDateContext } from "../../context/DateContext";
import { chartColors } from "@/lib/config.js";
import { formatDate, formatNumber } from "@/lib/util.js";
import { useState } from "react";
import { PartySelector } from "../ui/partySelector";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

const LineChartComponent = () => {
  const { startDate, endDate } = useDateContext();
  const [party1, setParty1] = useState("Labor");
  const [party2, setParty2] = useState("Liberal");

  const {
    data: data1,
    error: error1,
    isLoading: isLoading1,
  } = useSWR(
    `${API_URL}/api/time-series?startDate=${startDate}&endDate=${endDate}&party=${party1}`,
    fetcher
  );

  const {
    data: data2,
    error: error2,
    isLoading: isLoading2,
  } = useSWR(
    `${API_URL}/api/time-series?startDate=${startDate}&endDate=${endDate}&party=${party2}`,
    fetcher
  );

  if (error1 || error2) return <div>Failed to load</div>;
  if (isLoading1 || isLoading2)
    return (
      <div className="h-[300px] flex items-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );

  return (
    <div className=" w-full flex flex-col items-center justify-center h-full">
      <h3 className="text-lg font-semibold text-white ">{data1.title}</h3>
      <div className="w-full relative">
        <PartySelector
          value={party1}
          onChange={(e) => setParty1(e.target.value)}
        />

        <ResponsiveContainer width="100%" height={270}>
          <LineChart
            data={data1.data}
            syncId="timeSeriesCharts"
            margin={{
              right: 30,
              left: 0,
              top: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#555555" />
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              tick={{ fill: "#999" }}
            />
            <YAxis
              tickFormatter={(x) => `${x / 1000000}M`}
              tick={{ fill: "#999" }}
            />

            <Tooltip content={<CustomTooltipImpressions />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="high_persuasive_impressions"
              stroke={chartColors.chart_color_1}
              name="High Persuasive Impressions"
              dot={{ r: 1, strokeWidth: 0 }}
              activeDot={{
                strokeWidth: 0,
                fill: "white",
                r: 3,
              }}
              strokeWidth={1.7}
            />

            <Line
              type="monotone"
              dataKey="low_persuasive_impressions"
              stroke={chartColors.chart_color_3}
              name="Low Persuasive Impressions"
              dot={{ r: 1, strokeWidth: 0 }}
              activeDot={{
                strokeWidth: 0,
                fill: "white",
                r: 3,
              }}
              strokeWidth={1.7}
            />

            <ReferenceLine
              x="2022-05-21"
              stroke="red"
              strokeDasharray="3 3"
              label={{
                value: "Election Day (21 May)",
                fill: "white",
                position: "top",
              }}
            />

            <ReferenceLine
              x="2022-04-10"
              stroke="green"
              strokeDasharray="3 3"
              label={{
                value: "Call for Election (10 April)",
                fill: "white",
                position: "top",
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="w-full relative">
        <PartySelector
          value={party2}
          onChange={(e) => setParty2(e.target.value)}
        />
        <ResponsiveContainer width="100%" height={270}>
          <LineChart
            data={data2.data}
            syncId="timeSeriesCharts"
            margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#555555" />
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              tick={{ fill: "#999" }}
            />
            <YAxis
              tickFormatter={(x) => `${x / 1000000}M`}
              tick={{ fill: "#999" }}
            />
            <Tooltip content={<CustomTooltipImpressions />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="high_persuasive_impressions"
              stroke={chartColors.chart_color_1}
              name="High Persuasive Impressions"
              dot={{ r: 1, strokeWidth: 0 }}
              activeDot={{
                strokeWidth: 0,
                fill: "white",
                r: 3,
              }}
              strokeWidth={1.7}
            />
            <Line
              type="monotone"
              dataKey="low_persuasive_impressions"
              stroke={chartColors.chart_color_3}
              name="Low Persuasive Impressions"
              dot={{ r: 1, strokeWidth: 0 }}
              activeDot={{
                strokeWidth: 0,
                fill: "white",
                r: 3,
              }}
              strokeWidth={1.7}
            />
            <ReferenceLine x="2022-05-21" stroke="red" strokeDasharray="3 3" />
            <ReferenceLine
              x="2022-04-10"
              stroke="green"
              strokeDasharray="3 3"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default LineChartComponent;

const CustomTooltipImpressions = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-4 bg-slate-900 flex flex-col gap-4 rounded-md">
        <p className="text-medium text-lg">{formatDate(label)}</p>
        <p className="text-sm" style={{ color: payload[0].stroke }}>
          <span className="ml-2">{formatNumber(payload[0].value)}</span>
        </p>
        <p className="text-sm" style={{ color: payload[1].stroke }}>
          <span className="ml-2">{formatNumber(payload[1].value)}</span>
        </p>
      </div>
    );
  }
};
