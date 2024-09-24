"use client";

import React from "react";
import useSWR from "swr";
import { useDateContext } from "@/context/DateContext";
import { formatNumber, formatPercentage } from "@/lib/util";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

const StatItem = ({ label, value, subValue }) => (
  <div className="flex flex-col items-center justify-center p-2 text-center">
    <h4 className="text-sm font-semibold text-gray-300">{label}</h4>
    <p className="text-lg font-bold text-blue-400">{value}</p>
    {subValue && <p className="text-xs text-gray-400">{subValue}</p>}
  </div>
);

const GeneralStatsComponent = () => {
  const { startDate, endDate } = useDateContext();
  const { data, error, isLoading } = useSWR(
    `http://127.0.0.1:5000/api/general-stats?startDate=${startDate}&endDate=${endDate}`,
    fetcher
  );

  if (error) return <div>Failed to load</div>;
  if (isLoading)
    return (
      <div className="h-full flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );

  const stats = data.data;

  return (
    <div className="grid grid-cols-3 md:grid-cols-6 gap-2 h-full -mt-2">
      <StatItem
        label="Total Ads"
        value={stats.total_ads.toLocaleString()}
        subValue={`${formatPercentage(
          stats.proportion_high_persuasive
        )}% highly persuasive`}
      />
      <StatItem
        label="Total Spend"
        value={`$${formatNumber(stats.total_spend)}`}
        subValue={`$${stats.average_spend_per_ad.toFixed(2)} avg/ad`}
      />
      <StatItem
        label="Total Impressions"
        value={formatNumber(stats.total_impressions)}
        subValue={`${formatNumber(stats.average_impressions_per_ad)} avg/ad`}
      />
      <StatItem
        label="Cost per 1K Impressions"
        value={`$${stats.cost_per_thousand_impressions.toFixed(2)}`}
        subValue="&nbsp;"
      />
      <StatItem
        label="Unique Funding Entities"
        value={stats.total_number_of_unique_funding_entities.toLocaleString()}
        subValue="&nbsp;"
      />
      <StatItem
        label="Avg Campaign Duration"
        value={`${stats.avg_campaign_duration.toFixed(1)} days`}
        subValue={`${stats.avg_campaign_duration_high_persuasive.toFixed(
          1
        )} highly persuasive`}
      />
    </div>
  );
};

export default GeneralStatsComponent;
