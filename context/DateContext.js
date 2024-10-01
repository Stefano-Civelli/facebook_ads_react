"use client";

import React, { createContext, useState, useContext } from "react";

const DateContext = createContext();

export const DateProvider = ({ children }) => {
  const [startDate, setStartDate] = useState("2022-03-01");
  const [endDate, setEndDate] = useState("2022-06-01");

  const updateStartDate = (newDate) => {
    if (newDate < "2022-03-01") {
      setStartDate("2022-03-01");
    } else if (newDate > endDate) {
      setStartDate(endDate);
    } else {
      setStartDate(newDate);
    }
  };

  const updateEndDate = (newDate) => {
    if (newDate > "2022-06-01") {
      setEndDate("2022-06-01");
    } else if (newDate < startDate) {
      setEndDate(startDate);
    } else {
      setEndDate(newDate);
    }
  };

  return (
    <DateContext.Provider
      value={{ startDate, endDate, updateStartDate, updateEndDate }}
    >
      {children}
    </DateContext.Provider>
  );
};

export const useDateContext = () => useContext(DateContext);
