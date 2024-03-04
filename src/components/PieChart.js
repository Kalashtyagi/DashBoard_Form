
// // import * as React from "react";
// // import { PieChart } from "@mui/x-charts/PieChart";
// // import { useState, useEffect } from "react";
// // import { BASE_URL } from "../apiConfig";



// // export default function PieActiveArc() {
// //   const [pieData, setPieData] = useState([]);
// //   const [filterData, setFilterData] = useState([]);
// //   const [frequencyMap, setFrequencyMap] = useState(new Map());

// //   const fetchData = async () => {
// //     try {
// //       const response = await fetch(`${BASE_URL}GetallMerchantFormParts`);
// //       if (response?.status === 200) {
// //         const result = await response.json();
// //         setPieData(result?.data);
// //       }
// //     } catch (error) {
// //       console.error("Error fetching data:", error);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchData();
// //   }, []);

// //   useEffect(() => {
// //     // Filter data when pieData changes
// //     const updatedData = pieData.filter((item) => item.partName === "City");
// //     setFilterData(updatedData);

// //     // Update frequency map based on partResponse
// //     const newFrequencyMap = new Map();
// //     updatedData.forEach((item) => {
// //       const partResponse = item.partResponse;
// //       newFrequencyMap.set(
// //         partResponse,
// //         (newFrequencyMap.get(partResponse) || 0) + 1
// //       );
// //     });
// //     setFrequencyMap(newFrequencyMap);
// //   }, [pieData]);

 
// //   const pieChartData = Array.from(frequencyMap).map(([label, value]) => ({
// //     label: `${label} (${value})`, // Modify label to include city name and value
// //     value,
// //   }));

// //   return (
// //     <PieChart
// //       colors={["#00d1b0", "#266888", "#3aceff", "#2888"]}
// //       series={[
// //         {
// //           data: pieChartData,
// //           highlightScope: { faded: "global", highlighted: "item" },
// //           faded: { innerRadius: 30, additionalRadius: -30, color: "gray" },
// //         },
// //       ]}
// //       height={200}
// //       width={550}
// //     />
// //   );
// // }
// import * as React from "react";
// import { PieChart } from "@mui/x-charts/PieChart";
// import { useState, useEffect } from "react";
// import { BASE_URL } from "../apiConfig";

// export default function PieActiveArc() {
//   const [pieData, setPieData] = useState([]);
//   const [filterData, setFilterData] = useState([]);
//   const [frequencyMap, setFrequencyMap] = useState(new Map());

//   const fetchData = async () => {
//     try {
//       const response = await fetch(`${BASE_URL}GetallMerchantFormParts`);
//       if (response?.status === 200) {
//         const result = await response.json();
//         setPieData(result?.data);
//       }
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   useEffect(() => {
//     // Filter data when pieData changes
//     const updatedData = pieData.filter((item) => item.partName === "City");
//     setFilterData(updatedData);

//     // Update frequency map based on partResponse
//     const newFrequencyMap = new Map();
//     updatedData.forEach((item) => {
//       const partResponse = item.partResponse;
//       newFrequencyMap.set(
//         partResponse,
//         (newFrequencyMap.get(partResponse) || 0) + 1
//       );
//     });
//     setFrequencyMap(newFrequencyMap);
//   }, [pieData]);

//   const pieChartData = Array.from(frequencyMap).map(([label, value]) => ({
//     label: `${label}(${value})`, // Modify label to include city name and value
//     value,
//   }));


//   // Sort pieChartData by value in descending order
//   pieChartData.sort((a, b) => b.value - a.value);

//   // Extract the top five data
//   const topFiveData = pieChartData.slice(0, 5);

//   return (
//     <PieChart
//       colors={["#00d1b0", "#266888", "#3aceff", "#2888"]}
//       series={[
//         {
//           data: topFiveData,
//           highlightScope: { faded: "global", highlighted: "item" },
//           faded: { innerRadius: 30, additionalRadius: -30, color: "gray" },
//         },
//       ]}
//       height={200}
//       width={550}
//     />
//   );
// }
import * as React from "react";
import { PieChart } from "@mui/x-charts/PieChart";
import { useState, useEffect } from "react";
import { BASE_URL } from "../apiConfig";

export default function PieActiveArc() {
  const [pieData, setPieData] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [frequencyMap, setFrequencyMap] = useState(new Map());

  const fetchData = async () => {
    try {
      const response = await fetch(`${BASE_URL}GetallMerchantFormParts`);
      if (response?.status === 200) {
        const result = await response.json();
        setPieData(result?.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    // Filter data when pieData changes
    const updatedData = pieData.filter((item) => item.partName === "City");
    setFilterData(updatedData);

    // Update frequency map based on partResponse
    const newFrequencyMap = new Map();
    updatedData.forEach((item) => {
      const partResponse = item.partResponse;
      newFrequencyMap.set(
        partResponse,
        (newFrequencyMap.get(partResponse) || 0) + 1
      );
    });
    setFrequencyMap(newFrequencyMap);
  }, [pieData]);

  let chartContent;

  if (pieData.length === 0) {
    // If pieData is empty, display a simple chart
    chartContent = (
      <PieChart
        series={[
          {
            data: [
              { label: "No Data Available", value: 1 },
            ],
          },
        ]}
        height={200}
        width={550}
      />
    );
  } else {
    // If pieData is not empty, display the actual pie chart
    const pieChartData = Array.from(frequencyMap).map(([label, value]) => ({
      label: `${label}(${value})`, // Modify label to include city name and value
      value,
    }));

    // Sort pieChartData by value in descending order
    pieChartData.sort((a, b) => b.value - a.value);

    // Extract the top five data
    const topFiveData = pieChartData.slice(0, 5);

    chartContent = (
      <PieChart
        colors={["#00d1b0", "#266888", "#3aceff", "#2888"]}
        series={[
          {
            data: topFiveData,
            highlightScope: { faded: "global", highlighted: "item" },
            faded: { innerRadius: 30, additionalRadius: -30, color: "gray" },
          },
        ]}
        height={200}
        width={550}
      />
    );
  }

  return chartContent;
}
