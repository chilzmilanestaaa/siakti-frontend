import { useState, useMemo } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "mingcute_icon/font/Mingcute.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const INCOME_TYPES = [
  { value: "gaji", label: "Gaji" },
  { value: "freelance", label: "Freelance" },
  { value: "bonus", label: "Bonus" },
  { value: "investasi", label: "Investasi" },
  { value: "bisnis", label: "Bisnis" },
  { value: "hibah", label: "Hibah" },
  { value: "lainnya", label: "Lainnya" },
];

export default function IncomeTracking() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [incomes, setIncomes] = useState([]);
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    source: "",
    date: new Date().toISOString().split("T")[0],
    amount: "",
    notes: "",
    proof: null,
  });

  // Filter state
  const [filters, setFilters] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    type: "all",
  });

  // Get available months and years from data
  const availableMonths = useMemo(() => {
    const months = new Set();
    incomes.forEach((income) => {
      const date = new Date(income.date);
      months.add(date.getMonth() + 1);
    });
    return Array.from(months).sort((a, b) => a - b);
  }, [incomes]);

  const availableYears = useMemo(() => {
    const years = new Set();
    incomes.forEach((income) => {
      const date = new Date(income.date);
      years.add(date.getFullYear());
    });
    return Array.from(years).sort((a, b) => b - a);
  }, [incomes]);

  // Filtered incomes
  const filteredIncomes = useMemo(() => {
    return incomes.filter((income) => {
      const date = new Date(income.date);
      const month = date.getMonth() + 1;
      const year = date.getFullYear();

      const monthMatch = filters.month === "all" || month === filters.month;
      const yearMatch = filters.year === "all" || year === filters.year;
      const typeMatch =
        filters.type === "all" || income.source === filters.type;

      return monthMatch && yearMatch && typeMatch;
    });
  }, [incomes, filters]);

  // Calculate monthly income for chart
  const monthlyIncomeData = useMemo(() => {
    const monthlyData = {};

    filteredIncomes.forEach((income) => {
      const date = new Date(income.date);
      const monthKey = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;
      const monthLabel = date.toLocaleDateString("id-ID", {
        month: "short",
        year: "numeric",
      });

      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { label: monthLabel, total: 0 };
      }
      monthlyData[monthKey].total += parseFloat(income.amount) || 0;
    });

    const sorted = Object.entries(monthlyData)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([, data]) => data);

    return sorted;
  }, [filteredIncomes]);

  // Chart data
  const chartData = {
    labels: monthlyIncomeData.map((d) => d.label),
    datasets: [
      {
        label: "Pendapatan (Rp)",
        data: monthlyIncomeData.map((d) => d.total),
        borderColor: "rgb(139, 92, 246)",
        backgroundColor: "rgba(139, 92, 246, 0.1)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const barChartData = {
    labels: monthlyIncomeData.map((d) => d.label),
    datasets: [
      {
        label: "Pendapatan (Rp)",
        data: monthlyIncomeData.map((d) => d.total),
        backgroundColor: "rgba(139, 92, 246, 0.8)",
        borderColor: "rgb(139, 92, 246)",
        borderWidth: 1,
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
            return `Rp ${context.parsed.y.toLocaleString("id-ID")}`;
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, proof: file }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.source || !formData.amount || !formData.date) {
      alert("Harap isi semua field yang wajib!");
      return;
    }

    const newIncome = {
      id: Date.now(),
      source: formData.source,
      date: formData.date,
      amount: parseFloat(formData.amount),
      notes: formData.notes,
      proof: formData.proof ? formData.proof.name : null,
      createdAt: new Date().toISOString(),
    };

    setIncomes((prev) =>
      [...prev, newIncome].sort((a, b) => new Date(b.date) - new Date(a.date))
    );

    // Reset form
    setFormData({
      source: "",
      date: new Date().toISOString().split("T")[0],
      amount: "",
      notes: "",
      proof: null,
    });

    setShowForm(false);
    alert("Pemasukan berhasil ditambahkan!");
  };

  const handleDelete = (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus pemasukan ini?")) {
      setIncomes((prev) => prev.filter((income) => income.id !== id));
    }
  };

  const totalIncome = filteredIncomes.reduce(
    (sum, income) => sum + (income.amount || 0),
    0
  );
  const [chartType, setChartType] = useState("line");

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-800 mb-2">
                Income Tracking
              </h1>
              <p className="text-gray-600">
                Catat dan monitor semua pemasukan untuk melihat pola pendapatan
              </p>
            </div>

            {/* Add Income Button */}
            <div className="mb-6">
              <button
                onClick={() => setShowForm(!showForm)}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                <span className="mgc_add_circle_line text-xl"></span>
                {showForm ? "Tutup Form" : "Tambah Pemasukan"}
              </button>
            </div>

            {/* Add Income Form */}
            {showForm && (
              <div className="bg-white shadow-xl rounded-2xl p-6 mb-6 border-2 border-purple-100">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  <span className="mgc_coin_line text-2xl mr-2"></span>
                  Tambah Pemasukan Baru
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Sumber Pendapatan */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Sumber Pendapatan{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="source"
                        value={formData.source}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none"
                        required
                      >
                        <option value="">Pilih Sumber Pendapatan</option>
                        {INCOME_TYPES.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Tanggal Terima */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Tanggal Terima <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none"
                        required
                      />
                    </div>

                    {/* Jumlah */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Jumlah <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                          Rp
                        </span>
                        <input
                          type="number"
                          name="amount"
                          value={formData.amount}
                          onChange={handleInputChange}
                          placeholder="0"
                          min="0"
                          step="1000"
                          className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none"
                          required
                        />
                      </div>
                    </div>

                    {/* Upload Bukti */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Upload Bukti (Opsional)
                      </label>
                      <input
                        type="file"
                        name="proof"
                        onChange={handleFileChange}
                        accept="image/*,.pdf"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none"
                      />
                      {formData.proof && (
                        <p className="mt-2 text-sm text-gray-600">
                          File: {formData.proof.name}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Catatan */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Catatan (Opsional)
                    </label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      rows="3"
                      placeholder="Tambahkan catatan tentang pemasukan ini..."
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-101 shadow-lg"
                    >
                      <span className="mgc_save_2_line text-xl mr-2"></span>
                      Simpan Pemasukan
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowForm(false);
                        setFormData({
                          source: "",
                          date: new Date().toISOString().split("T")[0],
                          amount: "",
                          notes: "",
                          proof: null,
                        });
                      }}
                      className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-300 transition-all"
                    >
                      Batal
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Summary Card */}
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-lg p-6 mb-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold mb-1">
                    Total Pemasukan
                  </h3>
                  <p className="text-3xl font-bold">
                    Rp {totalIncome.toLocaleString("id-ID")}
                  </p>
                  <p className="text-sm opacity-90 mt-1">
                    {filteredIncomes.length} transaksi
                  </p>
                </div>
                <div className="text-5xl opacity-20">
                  <span className="mgc_coin_line"></span>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-white shadow-lg rounded-xl p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                <span className="mgc_filter_line text-xl mr-2"></span>
                Filter Transaksi
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bulan
                  </label>
                  <select
                    value={filters.month}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        month:
                          e.target.value === "all"
                            ? "all"
                            : parseInt(e.target.value),
                      }))
                    }
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none"
                  >
                    <option value="all">Semua Bulan</option>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map(
                      (month) => (
                        <option key={month} value={month}>
                          {new Date(2024, month - 1).toLocaleDateString(
                            "id-ID",
                            {
                              month: "long",
                            }
                          )}
                        </option>
                      )
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tahun
                  </label>
                  <select
                    value={filters.year}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        year:
                          e.target.value === "all"
                            ? "all"
                            : parseInt(e.target.value),
                      }))
                    }
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none"
                  >
                    <option value="all">Semua Tahun</option>
                    {Array.from(
                      { length: 5 },
                      (_, i) => new Date().getFullYear() - i
                    ).map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Jenis Pendapatan
                  </label>
                  <select
                    value={filters.type}
                    onChange={(e) =>
                      setFilters((prev) => ({ ...prev, type: e.target.value }))
                    }
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none"
                  >
                    <option value="all">Semua Jenis</option>
                    {INCOME_TYPES.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Chart Section */}
            {monthlyIncomeData.length > 0 && (
              <div className="bg-white shadow-lg rounded-xl p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    <span className="mgc_chart_line_line text-xl mr-2"></span>
                    Grafik Tren Pendapatan
                  </h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setChartType("line")}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        chartType === "line"
                          ? "bg-purple-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      Line Chart
                    </button>
                    <button
                      onClick={() => setChartType("bar")}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        chartType === "bar"
                          ? "bg-purple-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      Bar Chart
                    </button>
                  </div>
                </div>
                <div className="h-80">
                  {chartType === "line" ? (
                    <Line data={chartData} options={chartOptions} />
                  ) : (
                    <Bar data={barChartData} options={chartOptions} />
                  )}
                </div>
              </div>
            )}

            {/* Income List */}
            <div className="bg-white shadow-lg rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                <span className="mgc_list_check_line text-xl mr-2"></span>
                Daftar Transaksi Pemasukan
              </h3>

              {filteredIncomes.length === 0 ? (
                <div className="text-center py-12">
                  <span className="mgc_inbox_line text-6xl text-gray-300 block mb-4"></span>
                  <p className="text-gray-500 text-lg">
                    Belum ada transaksi pemasukan
                  </p>
                  <p className="text-gray-400 text-sm mt-2">
                    Klik "Tambah Pemasukan" untuk menambahkan transaksi pertama
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">
                          Tanggal
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">
                          Sumber
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">
                          Jumlah
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">
                          Catatan
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">
                          Bukti
                        </th>
                        <th className="text-center py-3 px-4 font-semibold text-gray-700">
                          Aksi
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredIncomes.map((income) => {
                        const incomeType = INCOME_TYPES.find(
                          (t) => t.value === income.source
                        );
                        return (
                          <tr
                            key={income.id}
                            className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                          >
                            <td className="py-3 px-4 text-gray-700">
                              {new Date(income.date).toLocaleDateString(
                                "id-ID",
                                {
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric",
                                }
                              )}
                            </td>
                            <td className="py-3 px-4">
                              <span className="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                                {incomeType?.label || income.source}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <span className="font-semibold text-gray-800">
                                Rp {income.amount.toLocaleString("id-ID")}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-gray-600 text-sm">
                              {income.notes || "-"}
                            </td>
                            <td className="py-3 px-4">
                              {income.proof ? (
                                <span className="text-green-600 text-sm">
                                  <span className="mgc_file_check_line mr-1"></span>
                                  Ada
                                </span>
                              ) : (
                                <span className="text-gray-400 text-sm">-</span>
                              )}
                            </td>
                            <td className="py-3 px-4">
                              <button
                                onClick={() => handleDelete(income.id)}
                                className="text-red-500 hover:text-red-700 transition-colors"
                                title="Hapus"
                              >
                                <span className="mgc_delete_2_line text-xl"></span>
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
