"use client";

import React, { useState } from "react";
import useSWR from "swr";
import { useDateContext } from "../context/DateContext";
import { usePartyContext } from "../context/PartyContext";
import DateSelector from "./DateSelectorComp";
import { defaultStartDate, defaultEndDate, parties } from "../lib/config";
import { formatNumber } from "../lib/util";
import PartySelectionComponent from "./PartySelectionComponent";

import {
  Info,
  ChevronDown,
  ChevronUp,
  Calendar,
  MousePointer,
  DollarSign,
  Eye,
  BarChart2,
  Percent,
  TrendingUp,
  Users,
  AlertCircle,
} from "lucide-react";

console.log(defaultEndDate, defaultStartDate);

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

const Sidebar = () => {
  const { startDate, endDate, updateStartDate, updateEndDate } =
    useDateContext();
  const { selectedParties, updateSelectedParties } = usePartyContext();
  const [showInfo, setShowInfo] = useState(false);

  const {
    data: generalStats,
    error,
    isLoading,
  } = useSWR(
    `${API_URL}/api/general-stats?startDate=${defaultStartDate}&endDate=${defaultEndDate}`,
    fetcher
  );

  return (
    <div className="w-full sticky top-12 md:h-screen p-5 overflow-y-auto border border-slate-800 bg-slate-900/50">
      <div className="mb-6 p-4 bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-lg shadow-lg">
        <h3 className="font-semibold mb-3 flex items-center">
          <Calendar size={18} className="mr-2" />
          Date Range Selection
        </h3>
        <DateSelector
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={updateStartDate}
          onEndDateChange={updateEndDate}
        />
      </div>

      {!isLoading && !error && generalStats && (
        <div className="mb-6 p-4 bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-lg shadow-lg">
          <h3 className="font-semibold mb-3 flex items-center">
            <BarChart2 size={18} className="mr-2" />
            Key Facts
          </h3>
          <div className="space-y-2">
            <div className="flex items-center text-sm text-gray-300">
              <TrendingUp size={16} className="mr-2" />
              {formatNumber(generalStats.data.total_ads)} total ads run
            </div>
            <div className="flex items-center text-sm text-gray-300">
              <DollarSign size={16} className="mr-2" />$
              {formatNumber(generalStats.data.total_spend)} total ad spend
            </div>
            <div className="flex items-center text-sm text-gray-300">
              <Users size={16} className="mr-2" />
              {formatNumber(
                generalStats.data.total_number_of_unique_funding_entities
              )}{" "}
              unique funding entities
            </div>
            <div className="flex items-center text-sm text-gray-300">
              <Eye size={16} className="mr-2" />
              Total Impressions:{" "}
              {formatNumber(generalStats.data.total_impressions)}
            </div>
            <div className="flex items-center text-sm text-gray-300">
              <Percent size={16} className="mr-2" />
              High Persuasive Ads:{" "}
              {(generalStats.data.proportion_high_persuasive * 100).toFixed(2)}%
            </div>
          </div>
        </div>
      )}

      <div className="p-4 backdrop-blur-md bg-[#020617b3] rounded-md flex items-start space-x-2 mb-2">
        <AlertCircle className="h-5 w-5 mt-0.5" />
        <p className="text-sm">
          Party selection affects only plots surrounded by a{" "}
          <span className="text-[#f7b21a]">yellow</span> border.
        </p>
      </div>
      <PartySelectionComponent
        parties={parties}
        selectedParties={selectedParties}
        updateSelectedParties={updateSelectedParties}
      />

      {/* <div className="my-6">
        <button
          className="flex items-center text-sm text-blue-400 hover:text-blue-300 transition-colors duration-200"
          onClick={() => setShowInfo(!showInfo)}
        >
          <Info size={16} className="mr-1" />
          {showInfo ? "Hide" : "Show"} Info
          {showInfo ? (
            <ChevronUp size={16} className="ml-1" />
          ) : (
            <ChevronDown size={16} className="ml-1" />
          )}
        </button>
        {showInfo && (
          <div className="mt-2 text-sm text-gray-300 p-3">
            This dashboard provides insights into the advertising spend and
            impressions for the 2022 Australian Federal Election campaign.
            Explore party-wise data and trends leading up to the election day.
          </div>
        )}
      </div> */}

      <div className="mt-6 p-3 bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-lg">
        <h3 className="font-semibold mb-2 flex items-center">
          <MousePointer size={16} className="mr-2" />
          Tip
        </h3>
        <p className="text-sm text-gray-300">
          Click on the plots to show more detailed information about how the
          data was obtained and processed.
        </p>
      </div>

      {/* <div className="mt-6 text-xs text-gray-400">
        Data last updated: {new Date().toLocaleDateString()}
      </div> */}
    </div>
  );
};

export default Sidebar;
