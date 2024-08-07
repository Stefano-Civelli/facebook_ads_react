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

const salesData = [
  {
    label: "Greens",
    value: 625326.5,
  },
  {
    label: "Independents",
    value: 925665,
  },
  {
    label: "Liberal",
    value: 3965220,
  },
  {
    label: "Labor",
    value: 5124779,
  },
];

const BarChartComponent = () => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={salesData}
        layout="vertical"
        margin={{
          right: 30,
          left: 50,
          top: 10,
          bottom: 10,
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
          <span className="ml-2">${payload[0].value}</span>
        </p>
      </div>
    );
  }
};
