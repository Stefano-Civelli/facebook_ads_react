"use client";

import React, { useState, useEffect } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import highchartsMap from "highcharts/modules/map";
import useSWR from "swr";
import { useDateContext } from "@/context/DateContext";
import { usePartyContext } from "@/context/PartyContext";
import { australianRegions } from "@/lib/config";
import { formatNumber } from "@/lib/util";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Initialize highchartsMap
if (typeof Highcharts === "object") {
  highchartsMap(Highcharts);
}

const fetcher = (...args) => fetch(...args).then((res) => res.json());

const RegionalDistributionComponent = ({
  width = "100%",
  height = "350px",
}) => {
  const { startDate, endDate } = useDateContext();
  const [mapOptions, setMapOptions] = useState({});
  const [title, setTitle] = useState("");
  const { selectedParties } = usePartyContext();

  const { data, error, isLoading } = useSWR(
    `${API_URL}/api/spend-and-impressions-by-region?startDate=${startDate}&endDate=${endDate}&parties=${selectedParties}`,
    fetcher
  );

  useEffect(() => {
    const fetchMapData = async () => {
      const mapData = await fetch(
        "https://code.highcharts.com/mapdata/countries/au/au-all.topo.json"
      ).then((response) => response.json());

      if (data) {
        const seriesData = mapData.objects.default.geometries
          .filter((feature) =>
            australianRegions.includes(feature.properties.name)
          )
          .map((feature) => ({
            "hc-key": feature.properties["hc-key"],
            value: data.data[feature.properties.name]?.mean_impressions || 0,
            high_persuasive_impressions:
              data.data[feature.properties.name]?.high_persuasive_impressions ||
              0,
            low_persuasive_impressions:
              data.data[feature.properties.name]?.low_persuasive_impressions ||
              0,
            mean_spend: data.data[feature.properties.name]?.mean_spend || 0,
            high_persuasive_spend:
              data.data[feature.properties.name]?.high_persuasive_spend || 0,
            low_persuasive_spend:
              data.data[feature.properties.name]?.low_persuasive_spend || 0,
          }));

        setTitle(data.title);

        setMapOptions({
          chart: {
            map: mapData,
            backgroundColor: "transparent",
            margin: [10, 10, 10, 10],
          },
          title: {
            text: undefined,
          },
          credits: {
            enabled: false,
          },
          colorAxis: {
            min: 0,
            stops: [
              [0, "#fff7e6"],
              [0.5, "#f7b21a"],
              [1, "#664700"],
            ],
            labels: {
              style: {
                color: "#ffffff",
              },
            },
          },
          legend: {
            align: "right",
            verticalAlign: "middle",
            layout: "vertical",
            x: -30,
            title: {
              text: "Impressions",
              style: {
                color: "#ffffff",
              },
            },
            itemStyle: {
              color: "#ffffff",
            },
          },
          series: [
            {
              data: seriesData,
              name: "Impressions",
              states: {
                hover: {
                  color: "#ffd480",
                },
              },
              dataLabels: {
                enabled: false, // Disable state name labels
              },
            },
            {
              type: "mappoint",
              name: "ACT",
              data: [
                {
                  name: "ACT",
                  lat: -35.4735,
                  lon: 149.0124,
                  z:
                    data.data["Australian Capital Territory"]
                      ?.mean_impressions || 0,
                  high_persuasive_impressions:
                    data.data["Australian Capital Territory"]
                      ?.high_persuasive_impressions || 0,
                  low_persuasive_impressions:
                    data.data["Australian Capital Territory"]
                      ?.low_persuasive_impressions || 0,
                  mean_spend:
                    data.data["Australian Capital Territory"]?.mean_spend || 0,
                  high_persuasive_spend:
                    data.data["Australian Capital Territory"]
                      ?.high_persuasive_spend || 0,
                  low_persuasive_spend:
                    data.data["Australian Capital Territory"]
                      ?.low_persuasive_spend || 0,
                },
              ],
              color: Highcharts.getOptions().colors[0],
              marker: {
                fillColor: Highcharts.getOptions().colors[0],
                lineWidth: 2,
                lineColor: "#ffffff",
              },
            },
          ],
          tooltip: {
            backgroundColor: "#0f1729",
            borderWidth: 0,
            style: {
              color: "#ffffff",
            },
            useHTML: true,
            pointFormatter: function () {
              const titleFontSize = "18px";
              const contentFontSize = "14px";
              const impressions =
                this.value !== undefined ? this.value : this.z;

              return `
                <div style="color: white;">
                  <div style="font-size: ${titleFontSize}; font-weight: bold; margin-bottom: 12px;">
                    ${this.name}
                  </div>
                  <div style="font-size: ${contentFontSize}; line-height: 1.5;">
                    Total Impressions: ${formatNumber(impressions)}<br/>
                    <span style="color: #8f4ecb;">High Persuasive Impressions: ${formatNumber(
                      this.high_persuasive_impressions
                    )}</span><br/>
                    <div style="color: #3b82f6; margin-bottom: 10px;">Low Persuasive Impressions: ${formatNumber(
                      this.low_persuasive_impressions
                    )}</div>
                    Total Spend: $${formatNumber(this.mean_spend, 2)}<br/>
                    <span style="color: #8f4ecb;">High Persuasive Spend: $${formatNumber(
                      this.high_persuasive_spend,
                      2
                    )}</span><br/>
                    <span style="color: #3b82f6;">Low Persuasive Spend: $${formatNumber(
                      this.low_persuasive_spend,
                      2
                    )}</span>
                  </div>
                </div>
              `;
            },
          },
        });
      }
    };
    fetchMapData();
  }, [data]);

  if (error) return <div>failed to load</div>;
  if (isLoading)
    return (
      <div className="h-[300px] flex items-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );

  return (
    <div
      style={{ width, height }}
      className="flex flex-col items-center justify-center"
    >
      <h3 className="text-lg font-semibold text-white mt-5">{title}</h3>
      <HighchartsReact
        highcharts={Highcharts}
        options={mapOptions}
        constructorType={"mapChart"}
      />
    </div>
  );
};

export default RegionalDistributionComponent;
