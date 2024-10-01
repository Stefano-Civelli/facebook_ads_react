"use client";
import React, { useState } from "react";
import { useDateContext } from "../context/DateContext";
import DateSelector from "./DateSelectorComp";
import { electionFacts, parties } from "../lib/config";
import {
  Info,
  ChevronDown,
  ChevronUp,
  Calendar,
  MousePointer,
} from "lucide-react";

const Sidebar = () => {
  const { startDate, endDate, updateStartDate, updateEndDate } =
    useDateContext();
  const [showInfo, setShowInfo] = useState(false);

  return (
    <div className="w-full sticky top-12 md:h-screen p-5 overflow-y-auto border border-slate-800 bg-slate-900/50">
      <h2 className="text-xl font-bold mb-4">Election Insights</h2>

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

      <div className="mb-4 p-3 bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-lg">
        <h3 className="font-semibold mb-2">Key Facts</h3>
        <div className="space-y-2">
          {electionFacts.map((fact, index) => (
            <div
              key={index}
              className="flex items-center text-sm text-gray-300"
            >
              <span className="mr-2">{fact.icon}</span>
              {fact.text}
            </div>
          ))}
        </div>
      </div>

      <div className="mb-4">
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
          <div className="mt-2 text-sm text-gray-300 p-3 bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-lg">
            This dashboard provides insights into the advertising spend and
            impressions for the 2022 Australian Federal Election campaign.
            Explore party-wise data and trends leading up to the election day.
          </div>
        )}
      </div>

      <div className="mt-4">
        <h3 className="font-semibold mb-2">Main Parties:</h3>
        <div className="space-y-2">
          {parties.map((party) => (
            <div key={party.name} className="flex items-center space-x-2">
              <span className={`w-3 h-3 rounded-full ${party.color}`}></span>
              <span className="text-sm">{party.name}</span>
            </div>
          ))}
        </div>
      </div>

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

      <div className="mt-6 text-xs text-gray-400">
        Data last updated: {new Date().toLocaleDateString()}
      </div>
    </div>
  );
};

export default Sidebar;
