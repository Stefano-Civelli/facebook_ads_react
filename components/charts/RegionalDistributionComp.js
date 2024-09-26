"use client";
import React, { useState, useEffect } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import highchartsMap from "highcharts/modules/map";
import useSWR from "swr";
import { useDateContext } from "@/context/DateContext";
import { australianRegions } from "@/lib/config";
import { formatNumber } from "@/lib/util";

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
  const { data, error, isLoading } = useSWR(
    `http://127.0.0.1:5000/api/spend-and-impressions-by-region?startDate=${startDate}&endDate=${endDate}`,
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
            events: {
              load: function () {
                this.renderer
                  .rect(10, 10, 30, 30)
                  .attr({
                    fill: Highcharts.getOptions().colors[0],
                    stroke: "white",
                    "stroke-width": 1,
                  })
                  .add();

                this.renderer
                  .text("ACT", 45, 30)
                  .attr({
                    zIndex: 5,
                  })
                  .css({
                    color: "#ffffff",
                    fontSize: "12px",
                  })
                  .add();
              },
            },
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
          ],
          tooltip: {
            backgroundColor: "#0f1729",
            borderWidth: 0,
            style: {
              color: "#ffffff",
            },
            useHTML: true,
            pointFormatter: function () {
              const titleFontSize = "18px"; // Adjust this value for the title font size
              const contentFontSize = "14px"; // Adjust this value for the content font size

              return `
                <div style="color: white;">
                  <div style="font-size: ${titleFontSize}; font-weight: bold; margin-bottom: 10px;">
                    ${this.name}
                  </div>
                  <div style="font-size: ${contentFontSize}; line-height: 1.5;">
                    Total Impressions: ${formatNumber(this.value)}<br/>
                    <span style="color: #51247a;">High Persuasive Impressions: ${formatNumber(
                      this.high_persuasive_impressions
                    )}</span><br/>
                    <span style="color: #3b82f6;">Low Persuasive Impressions: ${formatNumber(
                      this.low_persuasive_impressions
                    )}</span><br/>
                    Total Spend: $${formatNumber(this.mean_spend, 2)}<br/>
                    <span style="color: #51247a;">High Persuasive Spend: $${formatNumber(
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
