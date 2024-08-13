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
  const [partySpend, setPartySpend] = useState("Labor");
  const [partyImpressions, setPartyImpressions] = useState("Labor");

  const {
    data: dataSpend,
    error: errorSpend,
    isLoading: isLoadingSpend,
  } = useSWR(
    `http://127.0.0.1:5000/api/time-series?startDate=${startDate}&endDate=${endDate}&party=${partySpend}&metric=spend`,
    fetcher
  );

  const {
    data: dataImpressions,
    error: errorImpressions,
    isLoading: isLoadingImpressions,
  } = useSWR(
    `http://127.0.0.1:5000/api/time-series?startDate=${startDate}&endDate=${endDate}&party=${partyImpressions}&metric=impressions`,
    fetcher
  );

  if (errorSpend || errorImpressions) return <div>failed to load</div>;
  if (isLoadingSpend || isLoadingImpressions)
    return (
      <div className="h-[300px] flex items-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );

  return (
    <div className=" w-full flex flex-col items-center justify-center h-full">
      <h3 className="text-lg font-semibold text-white ">{dataSpend.title}</h3>
      <div className="w-full relative">
        <PartySelector
          value={partySpend}
          onChange={(e) => setPartySpend(e.target.value)}
        />

        <ResponsiveContainer width="100%" height={270}>
          <LineChart
            data={dataSpend.data}
            syncId="timeSeriesCharts"
            margin={{
              right: 30,
              left: 0,
              top: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#555555" />
            <XAxis dataKey="date" tickFormatter={formatDate} />
            <YAxis tickFormatter={(x) => `${x / 1000000}M`} />

            <Tooltip content={<CustomTooltipSpend />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="df1_mean_spend"
              stroke={chartColors.chart_color_1}
              name="Mean Spend High Persuasive"
              dot={{ r: 1, strokeWidth: 0 }}
              activeDot={{
                strokeWidth: 0,
                fill: "white",
                r: 3,
              }}
            />

            <Line
              type="monotone"
              dataKey="df2_mean_spend"
              stroke={chartColors.chart_color_3}
              name="Mean Spend Low Persuasive"
              dot={{ r: 1, strokeWidth: 0 }}
              activeDot={{
                strokeWidth: 0,
                fill: "white",
                r: 3,
              }}
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
          value={partyImpressions}
          onChange={(e) => setPartyImpressions(e.target.value)}
        />
        <ResponsiveContainer width="100%" height={270}>
          <LineChart
            data={dataImpressions.data}
            syncId="timeSeriesCharts"
            margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#555555" />
            <XAxis dataKey="date" tickFormatter={formatDate} />
            <YAxis tickFormatter={(x) => `${x / 1000000}M`} />
            <Tooltip content={<CustomTooltipImpressions />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="df1_mean_impressions"
              stroke={chartColors.chart_color_1}
              name="Mean Impressions High Persuasive"
              dot={{ r: 1, strokeWidth: 0 }}
              activeDot={{
                strokeWidth: 0,
                fill: "white",
                r: 3,
              }}
            />
            <Line
              type="monotone"
              dataKey="df2_mean_impressions"
              stroke={chartColors.chart_color_3}
              name="Mean Impressions Low Persuasive"
              dot={{ r: 1, strokeWidth: 0 }}
              activeDot={{
                strokeWidth: 0,
                fill: "white",
                r: 3,
              }}
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

const CustomTooltipSpend = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-4 bg-slate-900 flex flex-col gap-4 rounded-md">
        <p className="text-medium text-lg">{formatDate(label)}</p>
        <p className="text-sm" style={{ color: payload[0].stroke }}>
          <span className="ml-2">${formatNumber(payload[0].value)}</span>
        </p>
        <p className="text-sm" style={{ color: payload[1].stroke }}>
          <span className="ml-2">${formatNumber(payload[1].value)}</span>
        </p>
      </div>
    );
  }
};

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

const PartySelector = ({ value, onChange }) => {
  return (
    <select
      className="select select-xs z-10 bg-gray-800 text-white"
      value={value}
      onChange={onChange}
    >
      <option value="Labor">Labor</option>
      <option value="Liberal">Liberal</option>
      <option value="Greens">Greens</option>
      <option value="Independents">Independents</option>
      <option value="All">All</option>
    </select>
  );
};
