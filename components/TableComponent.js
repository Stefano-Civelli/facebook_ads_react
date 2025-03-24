import React from "react";
import wordTableData from "@/data/wordTablesData.json";

const TableComponent = ({ tableType = "tfidf" }) => {
  // Get the correct data based on tableType prop
  const data = wordTableData[tableType];
  
  // Set the display name based on the tableType
  const displayName = tableType === "tfidf" ? "TF-IDF" : "Bi-grams";

  return (
    <div className="h-full flex flex-col">
      <h2 className="text-xl font-bold mb-4">{displayName} Persuasion Analysis</h2>
      
      <div className="overflow-x-auto flex-grow">
        <table className="w-full">
          <thead>
            <tr>
              <th className="py-3 text-center font-semibold"></th>
              <th className="py-3 text-center font-semibold">High Persuasion</th>
              <th className="py-3 text-center font-semibold">Low Persuasion</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-2 pl-4 pr-2 font-medium">{displayName}</td>
              <td className="py-2 px-2">
                <div className="grid grid-cols-1 gap-y-2">
                  {data.highPersuasion.map((term, index) => (
                    <div key={`high-${index}`} className="text-center text-blue-600 dark:text-blue-400">
                      {term}
                    </div>
                  ))}
                </div>
              </td>
              <td className="py-2 px-2">
                <div className="grid grid-cols-1 gap-y-2">
                  {data.lowPersuasion.map((term, index) => (
                    <div key={`low-${index}`} className="text-center text-gray-600 dark:text-gray-400">
                      {term}
                    </div>
                  ))}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div className="mt-4 text-xs text-gray-600 dark:text-gray-400">
        <p>Analysis compares linguistic features between high and low persuasion political advertisements.</p>
      </div>
    </div>
  );
};

export default TableComponent;