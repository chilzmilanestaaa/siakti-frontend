// MoneyManagementDashboard.jsx
import React, { useState } from "react";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import PieChartAllocation from "./components/PieChartAllocation";
import BudgetProgressBar from "./components/BudgetProgressBar";

const MoneyManagementDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const budgetData = {
    income: 12500000,
    needs: { allocated: 6250000, used: 4850000, percentage: 78 },
    wants: { allocated: 3750000, used: 2150000, percentage: 57 },
    savings: { allocated: 2500000, used: 2500000, percentage: 100 },
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {/* Income Section */}
            <div className="bg-purple rounded-xl shadow-sm p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-700 mb-2">
                MONTHLY INCOME
              </h2>
              <p className="text-3xl font-bold text-gray-800">
                Rp{budgetData.income.toLocaleString("id-ID")}
              </p>
            </div>

            {/* Pie Chart */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-4 text-center">
                Budget Allocation Summary
              </h3>
              <PieChartAllocation needs={60} wants={30} savings={10} />
            </div>

            {/* Budget Bars */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <BudgetProgressBar
                title="Needs (50%)"
                percentage={budgetData.needs.percentage}
                amount="Rp6.250.000"
                used="Rp4.850.000"
                color="blue"
                type="needs"
              />

              <BudgetProgressBar
                title="Wants (30%)"
                percentage={budgetData.wants.percentage}
                amount="Rp3.750.000"
                used="Rp2.150.000"
                color="purple"
                type="wants"
              />

              <BudgetProgressBar
                title="Savings (20%)"
                percentage={budgetData.savings.percentage}
                amount="Rp2.500.000"
                used="Rp2.500.000"
                color="green"
                type="savings"
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MoneyManagementDashboard;
