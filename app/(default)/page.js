import Sidebar from "@/components/Sidebar";
import BarChartComponent from "@/components/charts/BarChartComp";
import LineChartComponent from "@/components/charts/LineChartComp";
import GeneralStatsComponent from "@/components/GeneralStatsComponent";
import GridItem from "@/components/GridItemComp";
import PieChartComponent from "@/components/charts/PieChartComp";
import RegionalDistributionComponent from "@/components/charts/RegionalDistributionComp";
import { DateProvider } from "@/context/DateContext";
import DemographicsBarchartComponent from "@/components/charts/DemographicsBarchartComp";
import plotDesc from "@/data/plotDescriptions.json";

export default function Home() {
  return (
    <DateProvider>
      <div className="container grid grid-cols-1 md:grid-cols-4 gap-5">
        <div className="md:col-span-1">
          <Sidebar />
        </div>
        <div className="grid grid-cols-1 col-span-3 mt-3">
          <GridItem className="md:col-span-3 h-[100px]">
            <GeneralStatsComponent />
          </GridItem>
          <GridItem
            className="md:col-span-3 h-[650px]"
            infoContent={plotDesc.lineChart.infoContent}
            blurText={plotDesc.lineChart.blurText}
          >
            <LineChartComponent />
          </GridItem>
          <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-x-6 w-full">
            <GridItem infoContent={plotDesc.spendBarChart.infoContent}>
              <BarChartComponent
                dataType="spend"
                title="Party Spend Breakdown"
                valuePrefix="$"
              />
            </GridItem>
            <GridItem infoContent={plotDesc.impressionsBarChart.infoContent}>
              <BarChartComponent
                dataType="impressions"
                title="Party Impressions Breakdown"
              />
            </GridItem>
            <GridItem infoContent={plotDesc.pieChart.infoContent}>
              <PieChartComponent />
            </GridItem>
            <GridItem infoContent={plotDesc.regionalDistribution.infoContent}>
              <RegionalDistributionComponent />
            </GridItem>
            <GridItem
              className="h-[450px]"
              infoContent={plotDesc.genderDemographics.infoContent}
            >
              <DemographicsBarchartComponent demographicType="gender" />
            </GridItem>
            <GridItem
              className="h-[450px]"
              infoContent={plotDesc.ageDemographics.infoContent}
            >
              <DemographicsBarchartComponent demographicType="age" />
            </GridItem>
          </div>
        </div>
      </div>
    </DateProvider>
  );
}
