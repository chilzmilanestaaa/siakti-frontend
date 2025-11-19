// PieChartAllocation.jsx
import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChartAllocation = ({ needs, wants, savings }) => {
  const data = {
    labels: ["Needs", "Wants", "Savings"],
    datasets: [
      {
        data: [needs, wants, savings],
        backgroundColor: ["#FA259F", "#FFF691", "#A4F7C1"],
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: "bottom" } },
  };

  return (
    <div className="w-60 h-60 mx-auto">
      <Pie data={data} options={options} />
    </div>
  );
};

export default PieChartAllocation;
