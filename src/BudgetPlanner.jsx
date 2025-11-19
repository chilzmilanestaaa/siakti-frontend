import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

export default function BudgetPlanner() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [income, setIncome] = useState("");

  const totalIncome = Number(income) || 0;
  const needs = totalIncome * 0.5;
  const wants = totalIncome * 0.3;
  const savings = totalIncome * 0.2;

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

        <div className=" grid grid-cols-1 lg:grid-cols-2 gap-6 h-screen bg-gray-100 flex items-center justify-center p-6">
          <div className="bg-white shadow-xl rounded-xl max-w-xl w-full p-8">
            <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">
              Budget Planner 50 / 30 / 20
            </h1>

            {/* Input Pendapatan */}
            <div className="mb-6">
              <label className="block mb-2 text-gray-700 font-medium">
                Pendapatan Bulanan
              </label>
              <input
                type="number"
                value={income}
                onChange={(e) => setIncome(e.target.value)}
                placeholder="Masukkan pendapatan..."
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>

            {/* Hasil Perhitungan */}
            <div className="space-y-4">
              <BudgetCard
                label="Kebutuhan (50%)"
                amount={needs}
                color="bg-blue-100 text-blue-700"
              />
              <BudgetCard
                label="Keinginan (30%)"
                amount={wants}
                color="bg-green-100 text-green-700"
              />
              <BudgetCard
                label="Tabungan / Investasi (20%)"
                amount={savings}
                color="bg-yellow-100 text-yellow-700"
              />
            </div>
            <div className="btn mt-6 text-center">
              <button>simpan</button>
            </div>
          </div>
          <div className="bg-white shadow-xl rounded-xl max-w-xl w-full p-8">
            <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">
              Budget Planner 50 / 30 / 20
            </h1>

            {/* Input Pendapatan */}
            <div className="mb-6">
              <label className="block mb-2 text-gray-700 font-medium">
                Pendapatan Bulanan
              </label>
              <input
                type="number"
                value={income}
                onChange={(e) => setIncome(e.target.value)}
                placeholder="Masukkan pendapatan..."
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>

            {/* Hasil Perhitungan */}
            <div className="space-y-4">
              <BudgetCard
                label="Kebutuhan (50%)"
                amount={needs}
                color="bg-blue-100 text-blue-700"
              />
              <BudgetCard
                label="Keinginan (30%)"
                amount={wants}
                color="bg-green-100 text-green-700"
              />
              <BudgetCard
                label="Tabungan / Investasi (20%)"
                amount={savings}
                color="bg-yellow-100 text-yellow-700"
              />
            </div>
            <div className="btn mt-6 text-center">
              <button>simpan</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BudgetCard({ label, amount, color }) {
  return (
    <div className={`p-4 rounded-lg ${color} flex justify-between`}>
      <span className="font-medium">{label}</span>
      <span className="font-bold">Rp {amount.toLocaleString("id-ID")}</span>
    </div>
  );
}
