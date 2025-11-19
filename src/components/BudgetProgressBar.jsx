// BudgetProgressBar.jsx
import React from "react";

const BudgetProgressBar = ({
  title,
  percentage,
  amount,
  used,
  color,
  type,
}) => {
  const colors = {
    blue: { bg: "bg-blue-500", text: "text-blue-600", light: "bg-blue-50" },
    purple: {
      bg: "bg-purple-500",
      text: "text-purple-600",
      light: "bg-purple-50",
    },
    green: { bg: "bg-green-500", text: "text-green-600", light: "bg-green-50" },
  };

  const c = colors[color] ?? colors.blue;

  const remaining =
    type === "savings"
      ? used
      : `Rp${(
          parseInt(amount.replace(/[^\d]/g, "")) -
          parseInt(used.replace(/[^\d]/g, ""))
        ).toLocaleString("id-ID")}`;

  return (
    <div className="bg-grey rounded-xl shadow-sm p-6">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <span className={`text-sm font-medium ${c.text}`}>
          {percentage}% Used
        </span>
      </div>

      <div className="mb-4">
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className={`${c.bg} h-3 rounded-full`}
            style={{ width: `${percentage}%` }}
          />
        </div>

        <div className="flex justify-between text-sm text-gray-600 mt-2">
          <span>Allocated: {amount}</span>
          <span>Used: {used}</span>
        </div>
      </div>

      <div className={`mt-4 p-3 rounded-lg ${c.light}`}>
        <div className="flex justify-between text-sm">
          <span className="font-medium">
            {type === "savings" ? "Total Saved" : "Remaining Budget"}
          </span>
          <span className={`font-bold ${c.text}`}>{remaining}</span>
        </div>
      </div>
    </div>
  );
};

export default BudgetProgressBar;
