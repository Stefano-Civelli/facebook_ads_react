"use client";

import React, { useState } from "react";
import { PieChart, Pie, Sector, ResponsiveContainer, Cell } from "recharts";
import useSWR from "swr";
import { useDateContext } from "@/context/DateContext";
import { chartColors } from "@/lib/config.js";
import { formatMillions } from "@/lib/util";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

const ImpressionsPieComponent = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const { startDate, endDate } = useDateContext();
  const { data, error, isLoading } = useSWR(
    `http://127.0.0.1:5000/api/general-stats?startDate=${startDate}&endDate=${endDate}`,
    fetcher
  );

  if (error) return <div>Failed to load</div>;
  if (isLoading)
    return (
      <div className="h-[500px] flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );

  const pieData = [
    {
      name: "All Impressions",
      value: data.data.total_impressions_other,
      spend: data.data.total_spend_other,
      cpti: data.data.cost_per_thousand_impressions_other,
    },
    {
      name: "High Persuasive",
      value: data.data.total_impressions_high_persuasive,
      spend: data.data.total_spend_high_persuasive,
      cpti: data.data.cost_per_thousand_impressions_high_persuasive,
    },
    {
      name: "Low Persuasive",
      value: data.data.total_impressions_low_persuasive,
      spend: data.data.total_spend_low_persuasive,
      cpti: data.data.cost_per_thousand_impressions_low_persuasive,
    },
  ];

  const COLORS = [
    chartColors.chart_color_3,
    chartColors.chart_color_2,
    chartColors.chart_color_1,
  ];

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  const renderActiveShape = (props) => {
    const RADIAN = Math.PI / 180;
    const {
      cx,
      cy,
      midAngle,
      innerRadius,
      outerRadius,
      startAngle,
      endAngle,
      fill,
      payload,
      percent,
      value,
    } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? "start" : "end";

    return (
      <g>
        <text x={cx} y={cy - 10} dy={8} textAnchor="middle" fill="#FFFFFF">
          {payload.name.split(" ")[0]}
        </text>
        <text x={cx} y={cy + 10} dy={8} textAnchor="middle" fill="#FFFFFF">
          {payload.name.split(" ")[1] || ""}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
        <path
          d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
          stroke={fill}
          fill="none"
        />
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />

        <text
          x={ex + (cos >= 0 ? 1 : -1) * 12}
          y={ey}
          textAnchor={textAnchor}
          fill="#FFFFFF"
          fontSize="16"
          fontWeight="bold"
        >
          {`${(percent * 100).toFixed(2)}%`}
        </text>
        <text
          x={ex + (cos >= 0 ? 1 : -1) * 12}
          y={ey - 5}
          dy={24}
          textAnchor={textAnchor}
          fill="#999"
        >
          {`Imp: ${formatMillions(value)}`}
        </text>
        <text
          x={ex + (cos >= 0 ? 1 : -1) * 12}
          y={ey - 5}
          dy={42}
          textAnchor={textAnchor}
          fill="#999"
        >
          {`Spend: $${formatMillions(payload.spend)}`}
        </text>
        <text
          x={ex + (cos >= 0 ? 1 : -1) * 12}
          y={ey - 5}
          dy={60}
          textAnchor={textAnchor}
          fill="#999"
        >
          {`CPTI: $${payload.cpti.toFixed(2)}*`}
        </text>
      </g>
    );
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <h3 className="text-lg font-semibold text-white text-center mb-4">
        Impressions Distribution
      </h3>
      <PieChart className="-mt-11">
        <Pie
          activeIndex={activeIndex}
          activeShape={renderActiveShape}
          data={pieData}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          onMouseEnter={onPieEnter}
        >
          {pieData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>

      <text className="absolute bottom-2 right-2" fontSize="6">
        *CPTI: Cost Per Thousand Impressions
      </text>
    </ResponsiveContainer>
  );
};

export default ImpressionsPieComponent;
