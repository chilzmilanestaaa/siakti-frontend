import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const FinanceChart = ({ transactions }) => {
  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((acc, t) => acc + t.amount, 0);
  const expense = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => acc + t.amount, 0);

  const data = {
    labels: ["Pemasukan", "Pengeluaran"],
    datasets: [
      {
        label: "Keuangan",
        data: [income, expense],
        backgroundColor: ["#4caf50", "#f44336"],
        borderWidth: 1,
      },
    ],
  };

  return <Pie data={data} />;
};

export default FinanceChart;
