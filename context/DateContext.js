"use client";

import React, { createContext, useState, useContext } from "react";

const DateContext = createContext();

export const DateProvider = ({ children }) => {
  const [startDate, setStartDate] = useState("2022-02-15");
  const [endDate, setEndDate] = useState("2022-06-01");

  return (
    <DateContext.Provider
      value={{ startDate, endDate, setStartDate, setEndDate }}
    >
      {children}
    </DateContext.Provider>
  );
};

export const useDateContext = () => useContext(DateContext);
