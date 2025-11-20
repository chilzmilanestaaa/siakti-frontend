// MoneyManagementDashboard.jsx
import React, { useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import PieChartAllocation from "./components/PieChartAllocation";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const MoneyManagementDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Sample data dashboard (bisa dihubungkan ke backend / localStorage nanti)
  const monthlySummary = {
    income: 12500000,
    expenses: 8250000,
  };
  const remaining = monthlySummary.income - monthlySummary.expenses;

  const allocation = { needs: 50, wants: 30, savings: 20 };

  const expenseByCategory = [
    { label: "Kebutuhan", value: 5200000 },
    { label: "Keinginan", value: 2300000 },
    { label: "Tabungan / Investasi", value: 750000 },
  ];

  const lastMonthsTrend = [
    { month: "Jan", income: 11000000, expenses: 7800000 },
    { month: "Feb", income: 12000000, expenses: 8000000 },
    { month: "Mar", income: 11500000, expenses: 7600000 },
    { month: "Apr", income: 13000000, expenses: 9000000 },
    { month: "Mei", income: 12500000, expenses: 8250000 },
    { month: "Jun", income: 12800000, expenses: 8400000 },
  ];

  const goalsQuickInfo = {
    totalGoals: 4,
    completedGoals: 1,
    overallProgress: 56, // %
  };

  const biggestExpenseThisWeek = {
    label: "Ngopi & Nongkrong",
    amount: 350000,
    category: "Keinginan",
    date: "Senin, 17 Mar 2025",
  };

  const billReminders = [
    {
      label: "Tagihan Internet",
      dueInDays: 3,
      amount: 350000,
    },
    {
      label: "Cicilan HP",
      dueInDays: 7,
      amount: 750000,
    },
    {
      label: "Listrik Prabayar",
      dueInDays: 10,
      amount: 250000,
    },
  ];

  // Chart: komposisi pengeluaran (pie)
  const expensePieData = {
    labels: expenseByCategory.map((item) => item.label),
    datasets: [
      {
        data: expenseByCategory.map((item) => item.value),
        backgroundColor: ["#4F46E5", "#EC4899", "#22C55E"],
        borderColor: "#ffffff",
        borderWidth: 2,
      },
    ],
  };

  const expensePieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 800,
      easing: "easeOutQuart",
    },
    plugins: {
      legend: {
        position: "bottom",
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.label || "";
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage =
              total > 0 ? ((value / total) * 100).toFixed(1) : 0;
            return `${label}: Rp ${value.toLocaleString(
              "id-ID"
            )} (${percentage}%)`;
          },
        },
      },
    },
  };

  // Chart: tren 3–6 bulan terakhir (bar)
  const trendChartData = {
    labels: lastMonthsTrend.map((item) => item.month),
    datasets: [
      {
        label: "Pemasukan",
        data: lastMonthsTrend.map((item) => item.income),
        backgroundColor: "rgba(34, 197, 94, 0.7)",
        borderRadius: 8,
        maxBarThickness: 40,
      },
      {
        label: "Pengeluaran",
        data: lastMonthsTrend.map((item) => item.expenses),
        backgroundColor: "rgba(248, 113, 113, 0.85)",
        borderRadius: 8,
        maxBarThickness: 40,
      },
    ],
  };

  const trendChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 900,
      easing: "easeOutCubic",
    },
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${
              context.dataset.label
            }: Rp ${context.parsed.y.toLocaleString("id-ID")}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            return `Rp ${value.toLocaleString("id-ID")}`;
          },
        },
      },
    },
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6 pb-16">
            {/* Header */}
            <div className="mb-4">
              <h1 className="text-4xl font-bold text-gray-800 mb-1">
                Dashboard
              </h1>
              <p className="text-gray-600">
                Ringkasan cepat pemasukan, pengeluaran, dan progress keuangan
                kamu bulan ini.
              </p>
            </div>

            {/* Ringkasan Bulanan */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-2xl shadow-lg p-5 border border-indigo-100 transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl">
                <p className="text-xs font-semibold text-indigo-500 uppercase mb-1">
                  Total Pemasukan Bulan Ini
                </p>
                <p className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">
                  Rp {monthlySummary.income.toLocaleString("id-ID")}
                </p>
                <p className="text-xs text-gray-500">
                  Dari semua sumber pendapatan
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-5 border border-rose-100 transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl">
                <p className="text-xs font-semibold text-rose-500 uppercase mb-1">
                  Total Pengeluaran Bulan Ini
                </p>
                <p className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">
                  Rp {monthlySummary.expenses.toLocaleString("id-ID")}
                </p>
                <p className="text-xs text-gray-500">Termasuk semua kategori</p>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-5 border border-emerald-100 transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl">
                <p className="text-xs font-semibold text-emerald-500 uppercase mb-1">
                  Sisa Uang Bulan Ini
                </p>
                <p className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">
                  Rp {remaining.toLocaleString("id-ID")}
                </p>
                <p className="text-xs text-gray-500">Pemasukan - Pengeluaran</p>
              </div>

              <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl shadow-lg p-5 text-white flex flex-col justify-between transition-transform duration-300 hover:-translate-y-1 hover:shadow-2xl">
                <div>
                  <p className="text-xs font-semibold uppercase mb-1 opacity-90">
                    Progress Goals
                  </p>
                  <p className="text-2xl md:text-3xl font-bold mb-1">
                    {goalsQuickInfo.overallProgress}%
                  </p>
                  <p className="text-xs opacity-90">
                    {goalsQuickInfo.completedGoals} dari{" "}
                    {goalsQuickInfo.totalGoals} goals tercapai
                  </p>
                </div>
              </div>
            </div>

            {/* Distribusi 50-30-20 & Komposisi Pengeluaran */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Distribusi 50-30-20 */}
              <div className="bg-white rounded-2xl shadow-lg p-6 transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-800">
                    Distribusi 50 / 30 / 20
                  </h2>
                  <span className="text-xs text-gray-500">
                    Berdasarkan budget planner
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                  <div className="flex justify-center">
                    <div className="transition-transform duration-500 hover:scale-105">
                      <PieChartAllocation
                        needs={allocation.needs}
                        wants={allocation.wants}
                        savings={allocation.savings}
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-indigo-500"></span>
                        <span className="text-sm text-gray-700">
                          Kebutuhan (50%)
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-gray-800">
                        Rp{" "}
                        {(monthlySummary.income * 0.5).toLocaleString("id-ID")}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-pink-400"></span>
                        <span className="text-sm text-gray-700">
                          Keinginan (30%)
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-gray-800">
                        Rp{" "}
                        {(monthlySummary.income * 0.3).toLocaleString("id-ID")}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-emerald-400"></span>
                        <span className="text-sm text-gray-700">
                          Tabungan / Investasi (20%)
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-gray-800">
                        Rp{" "}
                        {(monthlySummary.income * 0.2).toLocaleString("id-ID")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Komposisi Pengeluaran */}
              <div className="bg-white rounded-2xl shadow-lg p-6 transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-800">
                    Komposisi Pengeluaran
                  </h2>
                  <span className="text-xs text-gray-500">
                    Berdasarkan kategori
                  </span>
                </div>
                <div className="h-64">
                  <Pie data={expensePieData} options={expensePieOptions} />
                </div>
              </div>
            </div>

            {/* Tren 3–6 bulan terakhir & Info Cepat */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
              {/* Tren bulanan */}
              <div className="xl:col-span-2 bg-white rounded-2xl shadow-lg p-6 transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-800">
                    Tren 6 Bulan Terakhir
                  </h2>
                  <span className="text-xs text-gray-500">
                    Bandingkan pemasukan dan pengeluaran
                  </span>
                </div>
                <div className="h-72">
                  <Bar data={trendChartData} options={trendChartOptions} />
                </div>
              </div>

              {/* Info Cepat */}
              <div className="space-y-4 flex flex-col">
                {/* Progress Financial Goals */}
                <div className="bg-white rounded-2xl shadow-lg p-5 border border-purple-100 transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-gray-800">
                      Progress Financial Goals
                    </h3>
                    <span className="mgc_target_line text-xl text-purple-500"></span>
                  </div>
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-500">
                        Total Progress
                      </span>
                      <span className="text-xs font-semibold text-purple-600">
                        {goalsQuickInfo.overallProgress}%
                      </span>
                    </div>
                    <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                        style={{
                          width: `${Math.min(
                            goalsQuickInfo.overallProgress,
                            100
                          )}%`,
                        }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      {goalsQuickInfo.completedGoals} goals selesai dari{" "}
                      {goalsQuickInfo.totalGoals}.
                    </p>
                  </div>
                  <a
                    href="/financialgoals"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-purple-600 hover:text-purple-700"
                  >
                    Lihat detail goals
                    <span className="mgc_arrow_right_line text-sm"></span>
                  </a>
                </div>

                {/* Pengeluaran terbesar minggu ini */}
                <div className="bg-white rounded-2xl shadow-lg p-5 border border-rose-100 transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-gray-800">
                      Pengeluaran Terbesar Minggu Ini
                    </h3>
                    <span className="mgc_fire_line text-xl text-rose-500"></span>
                  </div>
                  <p className="text-base font-bold text-gray-800 mb-1">
                    {biggestExpenseThisWeek.label}
                  </p>
                  <p className="text-2xl font-extrabold text-rose-500 mb-1">
                    Rp {biggestExpenseThisWeek.amount.toLocaleString("id-ID")}
                  </p>
                  <p className="text-xs text-gray-500 mb-1">
                    Kategori: {biggestExpenseThisWeek.category}
                  </p>
                  <p className="text-xs text-gray-400">
                    {biggestExpenseThisWeek.date}
                  </p>
                </div>

                {/* Reminder Tagihan Rutin */}
                <div className="bg-white rounded-2xl shadow-lg p-5 border border-amber-100 transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-gray-800">
                      Reminder Tagihan Rutin
                    </h3>
                    <span className="mgc_notification_line text-xl text-amber-500"></span>
                  </div>
                  <div className="space-y-2">
                    {billReminders.map((bill, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between text-xs bg-amber-50 rounded-lg px-3 py-2"
                      >
                        <div>
                          <p className="font-semibold text-gray-800">
                            {bill.label}
                          </p>
                          <p className="text-[11px] text-gray-500">
                            Jatuh tempo dalam {bill.dueInDays} hari
                          </p>
                        </div>
                        <p className="font-bold text-amber-600">
                          Rp {bill.amount.toLocaleString("id-ID")}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MoneyManagementDashboard;
