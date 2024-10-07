import Sidebar from "@/components/Sidebar";
import BarChartComponent from "@/components/charts/BarChartComp";
import LineChartComponent from "@/components/charts/LineChartComp";
import GeneralStatsComponent from "@/components/GeneralStatsComponent";
import GridItem from "@/components/GridItemComp";
import PieChartComponent from "@/components/charts/PieChartComp";
import RegionalDistributionComponent from "@/components/charts/RegionalDistributionComp";
import { DateProvider } from "@/context/DateContext";
import { PartyProvider } from "@/context/PartyContext";
import DemographicsBarchartComponent from "@/components/charts/DemographicsBarchartComp";
import plotDesc from "@/data/plotDescriptions.json";

export default function Home() {
  return (
    <DateProvider>
      <PartyProvider>
        <div className="container grid grid-cols-1 lg:grid-cols-4 gap-7 dark">
          <div className="lg:col-span-1">
            <Sidebar />
          </div>
          <div className="grid grid-cols-1 col-span-3 mt-3">
            <GridItem className="lg:col-span-3 h-[120px]">
              <GeneralStatsComponent />
            </GridItem>
            <GridItem
              className="lg:col-span-3 h-[650px]"
              infoContent={plotDesc.lineChart.infoContent}
              blurText={plotDesc.lineChart.blurText}
            >
              <LineChartComponent />
            </GridItem>
            <div className="lg:col-span-3 grid grid-cols-1 lg:grid-cols-2 gap-x-8 w-full">
              <GridItem
                infoContent={plotDesc.spendBarChart.infoContent}
                blurText={plotDesc.spendBarChart.blurText}
              >
                <BarChartComponent
                  dataType="spend"
                  title="Party Spend Breakdown"
                  valuePrefix="$"
                />
              </GridItem>
              <GridItem
                infoContent={plotDesc.impressionsBarChart.infoContent}
                blurText={plotDesc.impressionsBarChart.blurText}
              >
                <BarChartComponent
                  dataType="impressions"
                  title="Party Impressions Breakdown"
                />
              </GridItem>
              <GridItem
                infoContent={plotDesc.pieChart.infoContent}
                blurText={plotDesc.pieChart.blurText}
                className="border-[#f7b11a] border"
              >
                <PieChartComponent />
              </GridItem>
              <GridItem
                infoContent={plotDesc.regionalDistribution.infoContent}
                blurText={plotDesc.regionalDistribution.blurText}
                className="border-[#f7b21a] border"
              >
                <RegionalDistributionComponent />
              </GridItem>
              <GridItem
                className="h-[500px] border-[#f7b21a] border"
                infoContent={plotDesc.genderDemographics.infoContent}
                blurText={plotDesc.genderDemographics.blurText}
              >
                <DemographicsBarchartComponent demographicType="gender" />
              </GridItem>
              <GridItem
                className="h-[500px] border-[#f7b21a] border"
                infoContent={plotDesc.ageDemographics.infoContent}
                blurText={plotDesc.ageDemographics.blurText}
              >
                <DemographicsBarchartComponent demographicType="age" />
              </GridItem>
            </div>
          </div>
        </div>
      </PartyProvider>
    </DateProvider>
  );
}
