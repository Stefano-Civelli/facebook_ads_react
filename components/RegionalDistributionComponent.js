"use client";

import React from "react";
import useSWR from "swr";
import { useDateContext } from "@/context/DateContext";
import { ResponsiveContainer } from "recharts";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { scaleQuantile } from "d3-scale";
import ReactTooltip from "react-tooltip";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

const geoUrl = "/australia.json"; // You'll need to provide this GeoJSON file

const RegionalDistributionComponent = () => {
  const { startDate, endDate } = useDateContext();
  const { data, error, isLoading } = useSWR(
    `http://127.0.0.1:5000/api/spend-and-impressions-by-region?startDate=${startDate}&endDate=${endDate}`,
    fetcher
  );

  const [tooltipContent, setTooltipContent] = React.useState("");

  if (error) return <div>failed to load</div>;
  if (isLoading)
    return (
      <div className="h-[300px] flex items-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );

  const colorScale = scaleQuantile()
    .domain(Object.values(data.data).map((d) => d.mean_impressions))
    .range([
      "#ffedea",
      "#ffcec5",
      "#ffad9f",
      "#ff8a75",
      "#ff5533",
      "#e2492d",
      "#be3d26",
      "#9a311f",
      "#782618",
    ]);

  return (
    <ResponsiveContainer
      width="100%"
      height={400}
      className="flex flex-col items-center justify-center"
    >
      <h3 className="text-lg font-semibold text-white mt-5">{data.title}</h3>
      <ComposableMap projection="geoMercator" projectionConfig={{ scale: 900 }}>
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const regionData = data.data[geo.properties.STATE_NAME];
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={
                    regionData
                      ? colorScale(regionData.mean_impressions)
                      : "#EEE"
                  }
                  stroke="#FFF"
                  strokeWidth={0.5}
                  onMouseEnter={() => {
                    setTooltipContent(
                      `${geo.properties.STATE_NAME}: ${
                        regionData
                          ? regionData.mean_impressions.toLocaleString()
                          : "N/A"
                      } impressions`
                    );
                  }}
                  onMouseLeave={() => {
                    setTooltipContent("");
                  }}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>
      <ReactTooltip>{tooltipContent}</ReactTooltip>
    </ResponsiveContainer>
  );
};

export default RegionalDistributionComponent;
