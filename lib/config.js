import { TrendingUp, DollarSign, Users } from "lucide-react";

export const chartColors = {
  chart_color_1: "#3b82f6", // Blue
  chart_color_2: "#51247a", // UQ purple
  chart_color_3: "#f7b21a", // CIRES yellow
  chart_color_4: "#4d7a24", // Green
  chart_color_5: "#e7e7e7", // Light Gray
};

export const legendTextColor = "white";

export const australianRegions = [
  "New South Wales",
  "Victoria",
  "Queensland",
  "Western Australia",
  "South Australia",
  "Tasmania",
  "Australian Capital Territory",
  "Northern Territory",
];

// export const startDate = "2022-03-01";
// export const endDate = "2022-06-01";

export const parties = [
  { name: "Labor Party", color: "bg-red-500" },
  { name: "Liberal Coalition", color: "bg-blue-500" },
  { name: "Greens Party", color: "bg-green-500" },
  { name: "Independents", color: "bg-yellow-500" },
];

export const electionFacts = [
  { icon: <TrendingUp size={16} />, text: "51,137 total ads run" },
  { icon: <DollarSign size={16} />, text: "$17.8M total ad spend" },
  { icon: <Users size={16} />, text: "1,494 unique funding entities" },
];
