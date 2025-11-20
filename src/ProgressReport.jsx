import { useState } from "react";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import "mingcute_icon/font/Mingcute.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function ProgressReport() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [reportType, setReportType] = useState("monthly"); // monthly or yearly

  // Sample data - dalam aplikasi nyata, ini akan dari API/database
  const monthlyData = {
    income: 12500000,
    expense: 9500000,
    budget: {
      needs: 6250000,
      wants: 3750000,
      savings: 2500000,
    },
    actual: {
      needs: 5800000,
      wants: 2800000,
      savings: 900000,
    },
    categoryExpenses: [
      { name: "Kebutuhan", amount: 5800000, percentage: 61 },
      { name: "Keinginan", amount: 2800000, percentage: 29 },
      { name: "Tabungan", amount: 900000, percentage: 10 },
    ],
    topCategories: [
      { name: "Makan", amount: 2500000, category: "Kebutuhan" },
      { name: "Sewa", amount: 2000000, category: "Kebutuhan" },
      { name: "Transport", amount: 1300000, category: "Kebutuhan" },
      { name: "Hobi", amount: 1500000, category: "Keinginan" },
      { name: "Entertainment", amount: 1300000, category: "Keinginan" },
    ],
  };

  // Yearly data (12 bulan)
  const yearlyData = {
    months: [
      "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
      "Jul", "Agu", "Sep", "Okt", "Nov", "Des"
    ],
    income: [
      12000000, 12500000, 13000000, 12500000, 12800000, 12500000,
      13000000, 12500000, 13200000, 12500000, 13000000, 12500000
    ],
    expense: [
      9500000, 9800000, 10200000, 9600000, 9900000, 9500000,
      10100000, 9700000, 10400000, 9600000, 10000000, 9500000
    ],
    savings: [
      2500000, 2700000, 2800000, 2900000, 2900000, 3000000,
      2900000, 2800000, 2800000, 2900000, 3000000, 3000000
    ],
  };

  // Calculate Performance Score
  const calculatePerformanceScore = () => {
    const budgetTotal = monthlyData.budget.needs + monthlyData.budget.wants + monthlyData.budget.savings;
    const actualTotal = monthlyData.actual.needs + monthlyData.actual.wants + monthlyData.actual.savings;
    
    // Efficiency based on staying within budget
    const needsEfficiency = monthlyData.actual.needs <= monthlyData.budget.needs ? 100 : 
      Math.max(0, 100 - ((monthlyData.actual.needs - monthlyData.budget.needs) / monthlyData.budget.needs * 100));
    const wantsEfficiency = monthlyData.actual.wants <= monthlyData.budget.wants ? 100 : 
      Math.max(0, 100 - ((monthlyData.actual.wants - monthlyData.budget.wants) / monthlyData.budget.wants * 100));
    const savingsEfficiency = monthlyData.actual.savings >= monthlyData.budget.savings * 0.8 ? 100 : 
      (monthlyData.actual.savings / monthlyData.budget.savings * 100);
    
    const avgEfficiency = (needsEfficiency * 0.5 + wantsEfficiency * 0.3 + savingsEfficiency * 0.2);
    return Math.round(avgEfficiency);
  };

  const performanceScore = calculatePerformanceScore();

  // Find most bloated category
  const findMostBloatedCategory = () => {
    const categories = [
      {
        name: "Kebutuhan",
        budget: monthlyData.budget.needs,
        actual: monthlyData.actual.needs,
        difference: monthlyData.actual.needs - monthlyData.budget.needs,
      },
      {
        name: "Keinginan",
        budget: monthlyData.budget.wants,
        actual: monthlyData.actual.wants,
        difference: monthlyData.actual.wants - monthlyData.budget.wants,
      },
      {
        name: "Tabungan",
        budget: monthlyData.budget.savings,
        actual: monthlyData.actual.savings,
        difference: monthlyData.actual.savings - monthlyData.budget.savings,
      },
    ];

    return categories.reduce((max, cat) => 
      Math.abs(cat.difference) > Math.abs(max.difference) ? cat : max
    );
  };

  const mostBloated = findMostBloatedCategory();

  // Chart data for Monthly Report
  const budgetVsActualData = {
    labels: ["Kebutuhan", "Keinginan", "Tabungan"],
    datasets: [
      {
        label: "Budget",
        data: [
          monthlyData.budget.needs,
          monthlyData.budget.wants,
          monthlyData.budget.savings,
        ],
        backgroundColor: "rgba(59, 130, 246, 0.5)",
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 2,
      },
      {
        label: "Real",
        data: [
          monthlyData.actual.needs,
          monthlyData.actual.wants,
          monthlyData.actual.savings,
        ],
        backgroundColor: "rgba(16, 185, 129, 0.5)",
        borderColor: "rgba(16, 185, 129, 1)",
        borderWidth: 2,
      },
    ],
  };

  const categoryExpenseData = {
    labels: monthlyData.categoryExpenses.map((cat) => cat.name),
    datasets: [
      {
        data: monthlyData.categoryExpenses.map((cat) => cat.amount),
        backgroundColor: [
          "rgba(59, 130, 246, 0.8)",
          "rgba(16, 185, 129, 0.8)",
          "rgba(234, 179, 8, 0.8)",
        ],
        borderWidth: 2,
        borderColor: "#fff",
      },
    ],
  };

  // Chart data for Yearly Report
  const yearlyTrendData = {
    labels: yearlyData.months,
    datasets: [
      {
        label: "Pendapatan",
        data: yearlyData.income,
        borderColor: "rgba(59, 130, 246, 1)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        fill: true,
        tension: 0.4,
        borderWidth: 3,
      },
      {
        label: "Pengeluaran",
        data: yearlyData.expense,
        borderColor: "rgba(239, 68, 68, 1)",
        backgroundColor: "rgba(239, 68, 68, 0.1)",
        fill: true,
        tension: 0.4,
        borderWidth: 3,
      },
      {
        label: "Tabungan",
        data: yearlyData.savings,
        borderColor: "rgba(16, 185, 129, 1)",
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        fill: true,
        tension: 0.4,
        borderWidth: 3,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.dataset.label}: Rp ${context.parsed.y.toLocaleString("id-ID")}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            return "Rp " + (value / 1000000).toFixed(1) + "Jt";
          },
        },
      },
    },
  };

  const lineChartOptions = {
    ...chartOptions,
    plugins: {
      ...chartOptions.plugins,
      legend: {
        position: "top",
      },
    },
  };

  // Export functions
  const exportToCSV = () => {
    let csv = "Kategori,Budget,Real,Perbedaan\n";
    csv += `Kebutuhan,${monthlyData.budget.needs},${monthlyData.actual.needs},${monthlyData.actual.needs - monthlyData.budget.needs}\n`;
    csv += `Keinginan,${monthlyData.budget.wants},${monthlyData.actual.wants},${monthlyData.actual.wants - monthlyData.budget.wants}\n`;
    csv += `Tabungan,${monthlyData.budget.savings},${monthlyData.actual.savings},${monthlyData.actual.savings - monthlyData.budget.savings}\n`;

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `laporan-bulanan-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  const exportToPDF = () => {
    window.print();
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-gray-800 mb-2">
                  Progress Reports
                </h1>
                <p className="text-gray-600">
                  Analisis mendalam untuk memahami pola keuangan Anda
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={exportToCSV}
                  className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all flex items-center gap-2"
                >
                  <span className="mgc_file_download_line"></span>
                  Export CSV
                </button>
                <button
                  onClick={exportToPDF}
                  className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all flex items-center gap-2"
                >
                  <span className="mgc_file_pdf_line"></span>
                  Export PDF
                </button>
              </div>
            </div>

            {/* Report Type Toggle */}
            <div className="mb-6 flex gap-4">
              <button
                onClick={() => setReportType("monthly")}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  reportType === "monthly"
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                <span className="mgc_calendar_line mr-2"></span>
                Laporan Bulanan
              </button>
              <button
                onClick={() => setReportType("yearly")}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  reportType === "yearly"
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                <span className="mgc_chart_line_line mr-2"></span>
                Laporan Tahunan
              </button>
            </div>

            {/* Performance Score */}
            <div className="mb-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 text-white shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Performance Score</h3>
                  <p className="text-2xl font-bold">
                    Keuanganmu efisien {performanceScore}% bulan ini
                  </p>
                  <p className="text-sm mt-2 opacity-90">
                    Berdasarkan perbandingan budget vs real spending
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-6xl font-bold">{performanceScore}%</div>
                </div>
              </div>
            </div>

            {reportType === "monthly" ? (
              <>
                {/* Monthly Report */}
                {/* Income vs Expense */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-white rounded-2xl p-6 shadow-xl">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">
                      <span className="mgc_wallet_3_line text-2xl mr-2 text-green-600"></span>
                      Total Income
                    </h3>
                    <p className="text-4xl font-bold text-green-600">
                      Rp {monthlyData.income.toLocaleString("id-ID")}
                    </p>
                  </div>
                  <div className="bg-white rounded-2xl p-6 shadow-xl">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">
                      <span className="mgc_shopping_cart_2_line text-2xl mr-2 text-red-600"></span>
                      Total Expense
                    </h3>
                    <p className="text-4xl font-bold text-red-600">
                      Rp {monthlyData.expense.toLocaleString("id-ID")}
                    </p>
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-sm text-gray-600">
                        Sisa:{" "}
                        <span className="font-bold text-green-600">
                          Rp {(monthlyData.income - monthlyData.expense).toLocaleString("id-ID")}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Budget vs Real */}
                <div className="bg-white rounded-2xl p-6 shadow-xl mb-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-6">
                    <span className="mgc_chart_bar_line text-2xl mr-2"></span>
                    Perbandingan Budget vs Real
                  </h3>
                  <div className="h-80">
                    <Bar data={budgetVsActualData} options={chartOptions} />
                  </div>
                </div>

                {/* Top Categories */}
                <div className="bg-white rounded-2xl p-6 shadow-xl mb-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-6">
                    <span className="mgc_pie_chart_line text-2xl mr-2"></span>
                    Kategori Pengeluaran Terbanyak
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="h-64">
                      <Doughnut data={categoryExpenseData} options={{ ...chartOptions, maintainAspectRatio: true }} />
                    </div>
                    <div className="space-y-4">
                      {monthlyData.topCategories.map((cat, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                              {index + 1}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-800">{cat.name}</p>
                              <p className="text-sm text-gray-500">{cat.category}</p>
                            </div>
                          </div>
                          <p className="font-bold text-gray-800">
                            Rp {cat.amount.toLocaleString("id-ID")}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Spending Analysis */}
                <div className="bg-white rounded-2xl p-6 shadow-xl mb-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-6">
                    <span className="mgc_analysis_line text-2xl mr-2"></span>
                    Kategori Spending Analysis
                  </h3>
                  <div className="space-y-4">
                    {[
                      {
                        name: "Kebutuhan",
                        budget: monthlyData.budget.needs,
                        actual: monthlyData.actual.needs,
                        color: "blue",
                      },
                      {
                        name: "Keinginan",
                        budget: monthlyData.budget.wants,
                        actual: monthlyData.actual.wants,
                        color: "green",
                      },
                      {
                        name: "Tabungan",
                        budget: monthlyData.budget.savings,
                        actual: monthlyData.actual.savings,
                        color: "yellow",
                      },
                    ].map((cat) => {
                      const difference = cat.actual - cat.budget;
                      const percentage = cat.budget > 0 ? (cat.actual / cat.budget) * 100 : 0;
                      const isOver = difference > 0;
                      const isUnder = difference < 0 && cat.name !== "Tabungan";

                      return (
                        <div
                          key={cat.name}
                          className="p-4 border-2 border-gray-200 rounded-xl hover:shadow-md transition-all"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-bold text-gray-800">{cat.name}</h4>
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                isOver
                                  ? "bg-red-100 text-red-600"
                                  : isUnder
                                  ? "bg-yellow-100 text-yellow-600"
                                  : "bg-green-100 text-green-600"
                              }`}
                            >
                              {isOver
                                ? "Overbudget"
                                : isUnder
                                ? "Under Budget"
                                : "On Track"}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-4 mb-3">
                            <div>
                              <p className="text-sm text-gray-600">Budget</p>
                              <p className="font-semibold text-gray-800">
                                Rp {cat.budget.toLocaleString("id-ID")}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Real</p>
                              <p className="font-semibold text-gray-800">
                                Rp {cat.actual.toLocaleString("id-ID")}
                              </p>
                            </div>
                          </div>
                          <div className="mb-2">
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-gray-600">Progress</span>
                              <span className="font-semibold">{percentage.toFixed(1)}%</span>
                            </div>
                            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className={`h-full bg-gradient-to-r ${
                                  cat.color === "blue"
                                    ? "from-blue-500 to-blue-600"
                                    : cat.color === "green"
                                    ? "from-green-500 to-green-600"
                                    : "from-yellow-500 to-yellow-600"
                                } transition-all duration-500`}
                                style={{ width: `${Math.min(percentage, 100)}%` }}
                              ></div>
                            </div>
                          </div>
                          <div className="pt-3 border-t border-gray-200">
                            <p className="text-sm">
                              Selisih:{" "}
                              <span
                                className={`font-bold ${
                                  isOver ? "text-red-600" : isUnder ? "text-yellow-600" : "text-green-600"
                                }`}
                              >
                                {isOver ? "+" : ""}Rp {Math.abs(difference).toLocaleString("id-ID")}
                              </span>
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Most Bloated Category */}
                  <div className="mt-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="mgc_alert_line text-2xl text-red-600"></span>
                      <h4 className="font-bold text-red-800">Kategori Paling Membengkak</h4>
                    </div>
                    <p className="text-gray-700">
                      <span className="font-semibold">{mostBloated.name}</span> melebihi budget sebesar{" "}
                      <span className="font-bold text-red-600">
                        Rp {Math.abs(mostBloated.difference).toLocaleString("id-ID")}
                      </span>
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Yearly Report */}
                <div className="bg-white rounded-2xl p-6 shadow-xl mb-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-6">
                    <span className="mgc_chart_line_line text-2xl mr-2"></span>
                    Tren Keuangan Tahunan
                  </h3>
                  <div className="h-96">
                    <Line data={yearlyTrendData} options={lineChartOptions} />
                  </div>
                </div>

                {/* Yearly Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white rounded-2xl p-6 shadow-xl">
                    <h4 className="text-lg font-semibold text-gray-700 mb-2">Total Income</h4>
                    <p className="text-3xl font-bold text-green-600">
                      Rp {yearlyData.income.reduce((a, b) => a + b, 0).toLocaleString("id-ID")}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">Rata-rata per bulan</p>
                    <p className="text-lg font-semibold text-gray-800">
                      Rp {Math.round(yearlyData.income.reduce((a, b) => a + b, 0) / 12).toLocaleString("id-ID")}
                    </p>
                  </div>
                  <div className="bg-white rounded-2xl p-6 shadow-xl">
                    <h4 className="text-lg font-semibold text-gray-700 mb-2">Total Expense</h4>
                    <p className="text-3xl font-bold text-red-600">
                      Rp {yearlyData.expense.reduce((a, b) => a + b, 0).toLocaleString("id-ID")}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">Rata-rata per bulan</p>
                    <p className="text-lg font-semibold text-gray-800">
                      Rp {Math.round(yearlyData.expense.reduce((a, b) => a + b, 0) / 12).toLocaleString("id-ID")}
                    </p>
                  </div>
                  <div className="bg-white rounded-2xl p-6 shadow-xl">
                    <h4 className="text-lg font-semibold text-gray-700 mb-2">Total Savings</h4>
                    <p className="text-3xl font-bold text-blue-600">
                      Rp {yearlyData.savings.reduce((a, b) => a + b, 0).toLocaleString("id-ID")}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">Rata-rata per bulan</p>
                    <p className="text-lg font-semibold text-gray-800">
                      Rp {Math.round(yearlyData.savings.reduce((a, b) => a + b, 0) / 12).toLocaleString("id-ID")}
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


