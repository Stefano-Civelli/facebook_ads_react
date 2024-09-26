"use client";

import DateSelector from "./DateSelectorComp";

import { useDateContext } from "../context/DateContext";

const Sidebar = () => {
  const { startDate, endDate, setStartDate, setEndDate } = useDateContext();

  return (
    <div className=" w-full sticky top-12 md:h-screen p-5 overflow-y-auto border border-slate-900 bg-slate-900/50">
      <DateSelector
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
      />
      <label className="label cursor-pointer justify-start pb-0">
        <input type="checkbox" defaultChecked className="checkbox-xs" />
        <span className="label-text ml-4">Labor Party</span>
      </label>
      <label className="label cursor-pointer justify-start py-0">
        <input type="checkbox" defaultChecked className="checkbox-xs" />
        <span className="label-text ml-4">Liberal Party</span>
      </label>
      <label className="label cursor-pointer justify-start py-0">
        <input type="checkbox" defaultChecked className="checkbox-xs" />
        <span className="label-text ml-4">Greens Party</span>
      </label>
      <label className="label cursor-pointer justify-start py-0">
        <input type="checkbox" defaultChecked className="checkbox-xs" />
        <span className="label-text ml-4">Indipendents Party</span>
      </label>
    </div>
  );
};

export default Sidebar;

// for example enable the selection of parties to display on the charts
// Date selection
// toggle the presence of persuasive ads
