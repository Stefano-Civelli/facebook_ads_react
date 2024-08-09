import Sidebar from "@/components/Sidebar";

import BarChartComponent from "@/components/charts/BarChartComp";
import LineChartComponent from "@/components/charts/LineChartComp";
import GridItem from "@/components/GridItemComp";
import { DateProvider } from "@/context/DateContext";

export default function Home() {
  return (
    <DateProvider>
      <div className="container grid grid-cols-1 md:grid-cols-4 gap-5">
        <div className="md:col-span-1">
          <Sidebar />
        </div>
        <div className="grid grid-cols-1 col-span-3 gap-4">
          <GridItem>
            <LineChartComponent />
          </GridItem>
          <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            <GridItem>
              <BarChartComponent />
            </GridItem>
          </div>
        </div>
      </div>
    </DateProvider>
  );
}
