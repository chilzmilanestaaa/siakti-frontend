import { useState, useMemo } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import { Line, Bar, Pie } from "react-chartjs-2";
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
} from "chart.js";
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
  Legend
);

const EXPENSE_CATEGORIES = [
  {
    value: "needs",
    label: "Kebutuhan",
    icon: "mgc_home_2_line",
    color: "#3B82F6",
    subCategories: ["makan", "sewa", "transport", "listrik", "internet"],
  },
  {
    value: "wants",
    label: "Keinginan",
    icon: "mgc_shopping_bag_2_line",
    color: "#10B981",
    subCategories: ["hobi", "nongkrong", "belanja", "entertainment"],
  },
  {
    value: "savings",
    label: "Tabungan",
    icon: "mgc_coin_line",
    color: "#F59E0B",
    subCategories: ["darurat", "investasi", "danaPendidikan"],
  },
];

const PAYMENT_METHODS = [
  { value: "cash", label: "Cash", icon: "mgc_money_2_line" },
  { value: "ewallet", label: "E-Wallet", icon: "mgc_wallet_3_line" },
  { value: "bank", label: "Bank Transfer", icon: "mgc_bank_line" },
];

const SUB_CATEGORIES = {
  needs: [
    { value: "makan", label: "Makan" },
    { value: "sewa", label: "Sewa" },
    { value: "transport", label: "Transport" },
    { value: "listrik", label: "Listrik" },
    { value: "internet", label: "Internet" },
  ],
  wants: [
    { value: "hobi", label: "Hobi" },
    { value: "nongkrong", label: "Nongkrong" },
    { value: "belanja", label: "Belanja" },
    { value: "entertainment", label: "Entertainment" },
  ],
  savings: [
    { value: "darurat", label: "Darurat" },
    { value: "investasi", label: "Investasi" },
    { value: "danaPendidikan", label: "Dana Pendidikan" },
  ],
};

export default function ExpenseTracking() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    category: "",
    subCategory: "",
    amount: "",
    paymentMethod: "",
    date: new Date().toISOString().split("T")[0],
    notes: "",
  });

  // Filter state
  const [filters, setFilters] = useState({
    category: "all",
    paymentMethod: "all",
    dateFrom: "",
    dateTo: "",
  });

  // Trend view state
  const [trendView, setTrendView] = useState("daily"); // daily or weekly

  // Get subcategories based on selected category
  const availableSubCategories = useMemo(() => {
    if (!formData.category) return [];
    return SUB_CATEGORIES[formData.category] || [];
  }, [formData.category]);

  // Filtered expenses
  const filteredExpenses = useMemo(() => {
    return expenses.filter((expense) => {
      const categoryMatch =
        filters.category === "all" || expense.category === filters.category;
      const paymentMatch =
        filters.paymentMethod === "all" ||
        expense.paymentMethod === filters.paymentMethod;

      let dateMatch = true;
      if (filters.dateFrom) {
        dateMatch =
          dateMatch && new Date(expense.date) >= new Date(filters.dateFrom);
      }
      if (filters.dateTo) {
        dateMatch =
          dateMatch && new Date(expense.date) <= new Date(filters.dateTo);
      }

      return categoryMatch && paymentMatch && dateMatch;
    });
  }, [expenses, filters]);

  // Calculate totals by category
  const categoryTotals = useMemo(() => {
    const totals = { needs: 0, wants: 0, savings: 0 };
    filteredExpenses.forEach((expense) => {
      if (totals[expense.category] !== undefined) {
        totals[expense.category] += parseFloat(expense.amount) || 0;
      }
    });
    return totals;
  }, [filteredExpenses]);

  // Pie chart data for expense composition
  const pieChartData = {
    labels: EXPENSE_CATEGORIES.map((cat) => cat.label),
    datasets: [
      {
        data: [
          categoryTotals.needs,
          categoryTotals.wants,
          categoryTotals.savings,
        ],
        backgroundColor: EXPENSE_CATEGORIES.map((cat) => cat.color),
        borderColor: "#fff",
        borderWidth: 2,
      },
    ],
  };

  // Daily/Weekly trend data
  const trendData = useMemo(() => {
    const dataMap = {};

    filteredExpenses.forEach((expense) => {
      const date = new Date(expense.date);
      let key;

      if (trendView === "daily") {
        key = date.toLocaleDateString("id-ID", {
          day: "numeric",
          month: "short",
        });
      } else {
        // Weekly: Get week number
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        key = `Minggu ${weekStart.toLocaleDateString("id-ID", {
          day: "numeric",
          month: "short",
        })}`;
      }

      if (!dataMap[key]) {
        dataMap[key] = 0;
      }
      dataMap[key] += parseFloat(expense.amount) || 0;
    });

    const sorted = Object.entries(dataMap)
      .sort(([a], [b]) => {
        // Simple sort - in production, use proper date parsing
        return a.localeCompare(b);
      })
      .map(([label, total]) => ({ label, total }));

    return sorted;
  }, [filteredExpenses, trendView]);

  const trendChartData = {
    labels: trendData.map((d) => d.label),
    datasets: [
      {
        label: "Pengeluaran (Rp)",
        data: trendData.map((d) => d.total),
        borderColor: "rgb(239, 68, 68)",
        backgroundColor: "rgba(239, 68, 68, 0.1)",
        tension: 0.4,
        fill: true,
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

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newData = { ...prev, [name]: value };
      // Reset subCategory when category changes
      if (name === "category") {
        newData.subCategory = "";
      }
      return newData;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.category ||
      !formData.amount ||
      !formData.date ||
      !formData.paymentMethod
    ) {
      alert("Harap isi semua field yang wajib!");
      return;
    }

    const newExpense = {
      id: Date.now(),
      category: formData.category,
      subCategory: formData.subCategory || "",
      amount: parseFloat(formData.amount),
      paymentMethod: formData.paymentMethod,
      date: formData.date,
      notes: formData.notes,
      createdAt: new Date().toISOString(),
    };

    setExpenses((prev) =>
      [...prev, newExpense].sort((a, b) => new Date(b.date) - new Date(a.date))
    );

    // Reset form
    setFormData({
      category: "",
      subCategory: "",
      amount: "",
      paymentMethod: "",
      date: new Date().toISOString().split("T")[0],
      notes: "",
    });

    setShowForm(false);
    alert("Pengeluaran berhasil ditambahkan!");
  };

  const handleDelete = (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus pengeluaran ini?")) {
      setExpenses((prev) => prev.filter((expense) => expense.id !== id));
    }
  };

  const totalExpenses = filteredExpenses.reduce(
    (sum, expense) => sum + (expense.amount || 0),
    0
  );
  const categoryInfo = EXPENSE_CATEGORIES.find(
    (cat) => cat.value === formData.category
  );

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
                Expense Tracking
              </h1>
              <p className="text-gray-600">
                Catat seluruh pengeluaran harian dan kontrol uang keluar
              </p>
            </div>

            {/* Add Expense Button */}
            <div className="mb-6">
              <button
                onClick={() => setShowForm(!showForm)}
                className="px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white font-semibold rounded-xl hover:from-red-700 hover:to-pink-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                <span className="mgc_add_circle_line text-xl"></span>
                {showForm ? "Tutup Form" : "Tambah Pengeluaran"}
              </button>
            </div>

            {/* Add Expense Form */}
            {showForm && (
              <div className="bg-white shadow-xl rounded-2xl p-6 mb-6 border-2 border-red-100">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  <span className="mgc_shopping_cart_2_line text-2xl mr-2"></span>
                  Tambah Pengeluaran Baru
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Kategori */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Kategori <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:outline-none"
                        required
                      >
                        <option value="">Pilih Kategori</option>
                        {EXPENSE_CATEGORIES.map((cat) => (
                          <option key={cat.value} value={cat.value}>
                            {cat.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Sub Kategori */}
                    {formData.category && availableSubCategories.length > 0 && (
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Sub Kategori (Opsional)
                        </label>
                        <select
                          name="subCategory"
                          value={formData.subCategory}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:outline-none"
                        >
                          <option value="">Pilih Sub Kategori</option>
                          {availableSubCategories.map((subCat) => (
                            <option key={subCat.value} value={subCat.value}>
                              {subCat.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

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
                          className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:outline-none"
                          required
                        />
                      </div>
                    </div>

                    {/* Metode Pembayaran */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Metode Pembayaran{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="paymentMethod"
                        value={formData.paymentMethod}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:outline-none"
                        required
                      >
                        <option value="">Pilih Metode</option>
                        {PAYMENT_METHODS.map((method) => (
                          <option key={method.value} value={method.value}>
                            {method.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Tanggal */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Tanggal <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:outline-none"
                        required
                      />
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
                      placeholder="Tambahkan catatan tentang pengeluaran ini..."
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:outline-none resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white font-semibold rounded-xl hover:from-red-700 hover:to-pink-700 transition-all transform hover:scale-101 shadow-lg"
                    >
                      <span className="mgc_save_2_line text-xl mr-2"></span>
                      Simpan Pengeluaran
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowForm(false);
                        setFormData({
                          category: "",
                          subCategory: "",
                          amount: "",
                          paymentMethod: "",
                          date: new Date().toISOString().split("T")[0],
                          notes: "",
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

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-gradient-to-r from-red-500 to-pink-500 rounded-xl shadow-lg p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold mb-1 opacity-90">
                      Total Pengeluaran
                    </h3>
                    <p className="text-2xl font-bold">
                      Rp {totalExpenses.toLocaleString("id-ID")}
                    </p>
                  </div>
                  <span className="mgc_shopping_cart_2_line text-4xl opacity-20"></span>
                </div>
              </div>

              {EXPENSE_CATEGORIES.map((cat) => (
                <div
                  key={cat.value}
                  className="bg-white rounded-xl shadow-lg p-6 border-2"
                  style={{ borderColor: cat.color + "40" }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-600 mb-1">
                        {cat.label}
                      </h3>
                      <p
                        className="text-xl font-bold"
                        style={{ color: cat.color }}
                      >
                        Rp {categoryTotals[cat.value].toLocaleString("id-ID")}
                      </p>
                    </div>
                    <span
                      className={`${cat.icon} text-3xl`}
                      style={{ color: cat.color + "40" }}
                    ></span>
                  </div>
                </div>
              ))}
            </div>

            {/* Filters */}
            <div className="bg-white shadow-lg rounded-xl p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                <span className="mgc_filter_line text-xl mr-2"></span>
                Filter Pengeluaran
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kategori
                  </label>
                  <select
                    value={filters.category}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        category: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:outline-none"
                  >
                    <option value="all">Semua Kategori</option>
                    {EXPENSE_CATEGORIES.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Metode Pembayaran
                  </label>
                  <select
                    value={filters.paymentMethod}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        paymentMethod: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:outline-none"
                  >
                    <option value="all">Semua Metode</option>
                    {PAYMENT_METHODS.map((method) => (
                      <option key={method.value} value={method.value}>
                        {method.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dari Tanggal
                  </label>
                  <input
                    type="date"
                    value={filters.dateFrom}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        dateFrom: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sampai Tanggal
                  </label>
                  <input
                    type="date"
                    value={filters.dateTo}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        dateTo: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Pie Chart */}
              {totalExpenses > 0 && (
                <div className="bg-white shadow-lg rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    <span className="mgc_pie_chart_line text-xl mr-2"></span>
                    Komposisi Pengeluaran
                  </h3>
                  <div className="h-80">
                    <Pie data={pieChartData} options={pieChartOptions} />
                  </div>
                </div>
              )}

              {/* Trend Chart */}
              {trendData.length > 0 && (
                <div className="bg-white shadow-lg rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                      <span className="mgc_chart_line_line text-xl mr-2"></span>
                      Tren Pengeluaran
                    </h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setTrendView("daily")}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          trendView === "daily"
                            ? "bg-red-600 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        Harian
                      </button>
                      <button
                        onClick={() => setTrendView("weekly")}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          trendView === "weekly"
                            ? "bg-red-600 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        Mingguan
                      </button>
                    </div>
                  </div>
                  <div className="h-80">
                    <Line data={trendChartData} options={chartOptions} />
                  </div>
                </div>
              )}
            </div>

            {/* Expense List */}
            <div className="bg-white shadow-lg rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                <span className="mgc_list_check_line text-xl mr-2"></span>
                Daftar Pengeluaran
              </h3>

              {filteredExpenses.length === 0 ? (
                <div className="text-center py-12">
                  <span className="mgc_inbox_line text-6xl text-gray-300 block mb-4"></span>
                  <p className="text-gray-500 text-lg">Belum ada pengeluaran</p>
                  <p className="text-gray-400 text-sm mt-2">
                    Klik "Tambah Pengeluaran" untuk menambahkan transaksi
                    pertama
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredExpenses.map((expense) => {
                    const categoryInfo = EXPENSE_CATEGORIES.find(
                      (cat) => cat.value === expense.category
                    );
                    const paymentInfo = PAYMENT_METHODS.find(
                      (method) => method.value === expense.paymentMethod
                    );
                    const subCategoryInfo = expense.subCategory
                      ? SUB_CATEGORIES[expense.category]?.find(
                          (sub) => sub.value === expense.subCategory
                        )
                      : null;

                    return (
                      <div
                        key={expense.id}
                        className="bg-white border-2 rounded-xl p-5 shadow-md hover:shadow-lg transition-all"
                        style={{ borderColor: categoryInfo?.color + "40" }}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div
                              className="p-2 rounded-lg text-white"
                              style={{ backgroundColor: categoryInfo?.color }}
                            >
                              <span
                                className={`${categoryInfo?.icon} text-xl`}
                              ></span>
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-800">
                                {categoryInfo?.label}
                              </h4>
                              {subCategoryInfo && (
                                <p className="text-xs text-gray-500">
                                  {subCategoryInfo.label}
                                </p>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={() => handleDelete(expense.id)}
                            className="text-red-400 hover:text-red-600 transition-colors"
                            title="Hapus"
                          >
                            <span className="mgc_delete_2_line text-xl"></span>
                          </button>
                        </div>

                        <div className="mb-3">
                          <p className="text-2xl font-bold text-gray-800">
                            Rp {expense.amount.toLocaleString("id-ID")}
                          </p>
                        </div>

                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2 text-gray-600">
                            <span className={paymentInfo?.icon}></span>
                            <span>{paymentInfo?.label}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <span className="mgc_calendar_line"></span>
                            <span>
                              {new Date(expense.date).toLocaleDateString(
                                "id-ID",
                                {
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric",
                                }
                              )}
                            </span>
                          </div>
                          {expense.notes && (
                            <div className="text-gray-500 pt-2 border-t border-gray-100">
                              <p className="line-clamp-2">{expense.notes}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
