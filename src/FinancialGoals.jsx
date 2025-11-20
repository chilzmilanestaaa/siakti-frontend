import { useState, useMemo, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import "mingcute_icon/font/Mingcute.css";

const GOAL_TEMPLATES = [
  {
    title: "Tabungan Darurat",
    target: 10000000,
    icon: "mgc_file_warning_line",
    color: "#3B82F6",
  },
  {
    title: "Dana Liburan",
    target: 5000000,
    icon: "mgc_flight_takeoff_line",
    color: "#10B981",
  },
  {
    title: "Beli Gadget",
    target: 8000000,
    icon: "mgc_cellphone_line",
    color: "#8B5CF6",
  },
  {
    title: "Lunasi Utang",
    target: 15000000,
    icon: "mgc_alert_line",
    color: "#EF4444",
  },
  {
    title: "Dana Pendidikan",
    target: 20000000,
    icon: "mgc_book_2_line",
    color: "#F59E0B",
  },
];

export default function FinancialGoals() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [goals, setGoals] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showReminders, setShowReminders] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    target: "",
    deadline: "",
    currentAmount: "0",
    autoAllocation: true,
    monthlyContribution: "",
  });

  // Budget allocation (default 20% savings, bisa diambil dari BudgetPlanner)
  const savingsPercentage = 20; // 20% dari tabungan
  const monthlyIncome = 10000000; // Default, bisa diambil dari localStorage atau context

  // Check reminders
  useEffect(() => {
    checkReminders();
    const interval = setInterval(checkReminders, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [goals]);

  const checkReminders = () => {
    const reminders = [];
    const now = new Date();

    goals.forEach((goal) => {
      const deadline = new Date(goal.deadline);
      const daysUntilDeadline = Math.ceil(
        (deadline - now) / (1000 * 60 * 60 * 24)
      );
      const progress = (goal.currentAmount / goal.target) * 100;
      const daysSinceCreated = Math.ceil(
        (now - new Date(goal.createdAt)) / (1000 * 60 * 60 * 24)
      );
      const expectedProgress =
        (daysSinceCreated /
          Math.ceil(
            (deadline - new Date(goal.createdAt)) / (1000 * 60 * 60 * 24)
          )) *
        100;

      // Reminder: Mendekati deadline (kurang dari 30 hari)
      if (daysUntilDeadline > 0 && daysUntilDeadline <= 30) {
        reminders.push({
          type: "deadline",
          message: `Goal "${goal.title}" mendekati deadline! Tersisa ${daysUntilDeadline} hari.`,
          goal: goal,
        });
      }

      // Reminder: Deadline sudah lewat
      if (daysUntilDeadline < 0) {
        reminders.push({
          type: "overdue",
          message: `Goal "${goal.title}" sudah melewati deadline!`,
          goal: goal,
        });
      }

      // Reminder: Progress tidak berkembang (progress < expected progress - 20%)
      if (progress < expectedProgress - 20 && daysSinceCreated >= 7) {
        reminders.push({
          type: "stagnant",
          message: `Goal "${goal.title}" progressnya tertinggal. Perlu lebih banyak kontribusi!`,
          goal: goal,
        });
      }
    });

    if (reminders.length > 0) {
      setShowReminders(true);
    }
  };

  const getReminders = () => {
    const reminders = [];
    const now = new Date();

    goals.forEach((goal) => {
      const deadline = new Date(goal.deadline);
      const daysUntilDeadline = Math.ceil(
        (deadline - now) / (1000 * 60 * 60 * 24)
      );
      const progress = (goal.currentAmount / goal.target) * 100;
      const daysSinceCreated = Math.ceil(
        (now - new Date(goal.createdAt)) / (1000 * 60 * 60 * 24)
      );
      const totalDays = Math.ceil(
        (deadline - new Date(goal.createdAt)) / (1000 * 60 * 60 * 24)
      );
      const expectedProgress =
        totalDays > 0 ? (daysSinceCreated / totalDays) * 100 : 0;

      if (daysUntilDeadline > 0 && daysUntilDeadline <= 30) {
        reminders.push({
          type: "deadline",
          message: `Goal "${goal.title}" mendekati deadline! Tersisa ${daysUntilDeadline} hari.`,
          goal: goal,
          severity: daysUntilDeadline <= 7 ? "high" : "medium",
        });
      }

      if (daysUntilDeadline < 0) {
        reminders.push({
          type: "overdue",
          message: `Goal "${goal.title}" sudah melewati deadline!`,
          goal: goal,
          severity: "high",
        });
      }

      if (progress < expectedProgress - 20 && daysSinceCreated >= 7) {
        reminders.push({
          type: "stagnant",
          message: `Goal "${goal.title}" progressnya tertinggal. Perlu lebih banyak kontribusi!`,
          goal: goal,
          severity: "medium",
        });
      }
    });

    return reminders;
  };

  // Calculate auto allocation
  const calculateAutoAllocation = (target, deadline) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const monthsUntilDeadline = Math.max(
      1,
      Math.ceil((deadlineDate - now) / (1000 * 60 * 60 * 24 * 30))
    );
    const monthlySavings = (monthlyIncome * savingsPercentage) / 100;
    const monthlyContribution = Math.min(
      target / monthsUntilDeadline,
      monthlySavings
    );
    return Math.floor(monthlyContribution);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => {
      const newData = {
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      };

      // Auto calculate monthly contribution if auto allocation is enabled
      if (
        name === "target" ||
        name === "deadline" ||
        name === "autoAllocation"
      ) {
        if (newData.autoAllocation && newData.target && newData.deadline) {
          newData.monthlyContribution = calculateAutoAllocation(
            parseFloat(newData.target) || 0,
            newData.deadline
          ).toString();
        }
      }

      return newData;
    });
  };

  const handleTemplateClick = (template) => {
    const deadline = new Date();
    deadline.setMonth(deadline.getMonth() + 6); // Default 6 months from now

    setFormData({
      title: template.title,
      target: template.target.toString(),
      deadline: deadline.toISOString().split("T")[0],
      currentAmount: "0",
      autoAllocation: true,
      monthlyContribution: calculateAutoAllocation(
        template.target,
        deadline.toISOString().split("T")[0]
      ).toString(),
    });
    setShowForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.title || !formData.target || !formData.deadline) {
      alert("Harap isi semua field yang wajib!");
      return;
    }

    const newGoal = {
      id: Date.now(),
      title: formData.title,
      target: parseFloat(formData.target),
      currentAmount: parseFloat(formData.currentAmount) || 0,
      deadline: formData.deadline,
      autoAllocation: formData.autoAllocation,
      monthlyContribution: formData.autoAllocation
        ? parseFloat(formData.monthlyContribution) || 0
        : 0,
      createdAt: new Date().toISOString(),
    };

    setGoals((prev) =>
      [...prev, newGoal].sort(
        (a, b) => new Date(a.deadline) - new Date(b.deadline)
      )
    );

    // Reset form
    setFormData({
      title: "",
      target: "",
      deadline: "",
      currentAmount: "0",
      autoAllocation: true,
      monthlyContribution: "",
    });

    setShowForm(false);
    alert("Goal berhasil dibuat!");
  };

  const handleAddContribution = (goalId, amount) => {
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      alert("Masukkan jumlah yang valid!");
      return;
    }

    setGoals((prev) =>
      prev.map((goal) =>
        goal.id === goalId
          ? {
              ...goal,
              currentAmount: Math.min(
                goal.currentAmount + amountNum,
                goal.target
              ),
            }
          : goal
      )
    );
  };

  const handleDelete = (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus goal ini?")) {
      setGoals((prev) => prev.filter((goal) => goal.id !== id));
    }
  };

  const reminders = getReminders();
  const activeGoals = goals.filter((goal) => {
    const progress = (goal.currentAmount / goal.target) * 100;
    return progress < 100;
  });
  const completedGoals = goals.filter((goal) => {
    const progress = (goal.currentAmount / goal.target) * 100;
    return progress >= 100;
  });

  const totalTarget = activeGoals.reduce((sum, goal) => sum + goal.target, 0);
  const totalCurrent = activeGoals.reduce(
    (sum, goal) => sum + goal.currentAmount,
    0
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
                Financial Goals
              </h1>
              <p className="text-gray-600">
                Buat target finansial jangka pendek & panjang untuk tetap
                konsisten menabung
              </p>
            </div>

            {/* Reminders Banner */}
            {reminders.length > 0 && showReminders && (
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-r-lg">
                <div className="flex items-start justify-between">
                  <div className="flex items-start">
                    <span className="mgc_notification_line text-2xl text-yellow-600 mr-3"></span>
                    <div className="flex-1">
                      <h3 className="font-semibold text-yellow-800 mb-2">
                        Reminder
                      </h3>
                      <div className="space-y-1">
                        {reminders.map((reminder, idx) => (
                          <p
                            key={idx}
                            className={`text-sm ${
                              reminder.severity === "high"
                                ? "text-red-700"
                                : "text-yellow-700"
                            }`}
                          >
                            • {reminder.message}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowReminders(false)}
                    className="text-yellow-600 hover:text-yellow-800"
                  >
                    <span className="mgc_close_line text-xl"></span>
                  </button>
                </div>
              </div>
            )}

            {/* Add Goal Button */}
            <div className="mb-6">
              <button
                onClick={() => setShowForm(!showForm)}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                <span className="mgc_add_circle_line text-xl"></span>
                {showForm ? "Tutup Form" : "Buat Goal Baru"}
              </button>
            </div>

            {/* Goal Templates */}
            {!showForm && (
              <div className="bg-white shadow-lg rounded-xl p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  <span className="mgc_star_line text-xl mr-2"></span>
                  Template Goals
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {GOAL_TEMPLATES.map((template, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleTemplateClick(template)}
                      className="p-4 border-2 border-gray-200 rounded-xl hover:border-purple-400 hover:shadow-md transition-all text-left"
                    >
                      <div
                        className="w-12 h-12 rounded-lg flex items-center justify-center mb-3"
                        style={{ backgroundColor: template.color + "20" }}
                      >
                        <span
                          className={`${template.icon} text-2xl`}
                          style={{ color: template.color }}
                        ></span>
                      </div>
                      <h4 className="font-semibold text-gray-800 mb-1">
                        {template.title}
                      </h4>
                      <p className="text-sm text-gray-600">
                        Rp {template.target.toLocaleString("id-ID")}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Add Goal Form */}
            {showForm && (
              <div className="bg-white shadow-xl rounded-2xl p-6 mb-6 border-2 border-purple-100">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  <span className="mgc_target_line text-2xl mr-2"></span>
                  Buat Goal Baru
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Judul Goal */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Judul Goal <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="Contoh: Beli Laptop, Tabungan Darurat 10 juta"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none"
                        required
                      />
                    </div>

                    {/* Target Jumlah */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Target Jumlah <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                          Rp
                        </span>
                        <input
                          type="number"
                          name="target"
                          value={formData.target}
                          onChange={handleInputChange}
                          placeholder="0"
                          min="0"
                          step="1000"
                          className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none"
                          required
                        />
                      </div>
                    </div>

                    {/* Deadline */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Deadline <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        name="deadline"
                        value={formData.deadline}
                        onChange={handleInputChange}
                        min={new Date().toISOString().split("T")[0]}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none"
                        required
                      />
                    </div>

                    {/* Jumlah Terkumpul Saat Ini */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Jumlah Terkumpul Saat Ini
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                          Rp
                        </span>
                        <input
                          type="number"
                          name="currentAmount"
                          value={formData.currentAmount}
                          onChange={handleInputChange}
                          placeholder="0"
                          min="0"
                          step="1000"
                          className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Auto Allocation */}
                  <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                          <input
                            type="checkbox"
                            name="autoAllocation"
                            checked={formData.autoAllocation}
                            onChange={handleInputChange}
                            className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                          />
                          Auto Allocation dari 20% Tabungan
                        </label>
                        <p className="text-xs text-gray-600 mt-1 ml-6">
                          Otomatis menghitung kontribusi bulanan dari 20%
                          alokasi tabungan
                        </p>
                      </div>
                    </div>
                    {formData.autoAllocation &&
                      formData.target &&
                      formData.deadline && (
                        <div className="ml-6 p-3 bg-white rounded-lg">
                          <p className="text-sm text-gray-700">
                            <span className="font-semibold">
                              Kontribusi Bulanan:
                            </span>{" "}
                            <span className="text-purple-600 font-bold">
                              Rp{" "}
                              {formData.monthlyContribution.toLocaleString(
                                "id-ID"
                              )}
                            </span>
                          </p>
                        </div>
                      )}
                  </div>

                  {/* Submit Button */}
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-101 shadow-lg"
                    >
                      <span className="mgc_save_2_line text-xl mr-2"></span>
                      Simpan Goal
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowForm(false);
                        setFormData({
                          title: "",
                          target: "",
                          deadline: "",
                          currentAmount: "0",
                          autoAllocation: true,
                          monthlyContribution: "",
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
                    Total Target Goals
                  </h3>
                  <p className="text-3xl font-bold">
                    Rp {totalTarget.toLocaleString("id-ID")}
                  </p>
                  <p className="text-sm opacity-90 mt-2">
                    Terkumpul: Rp {totalCurrent.toLocaleString("id-ID")} (
                    {totalTarget > 0
                      ? ((totalCurrent / totalTarget) * 100).toFixed(1)
                      : 0}
                    %)
                  </p>
                </div>
                <div className="text-5xl opacity-20">
                  <span className="mgc_target_line"></span>
                </div>
              </div>
            </div>

            {/* Active Goals */}
            {activeGoals.length > 0 && (
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  <span className="mgc_rocket_line text-2xl mr-2"></span>
                  Goals Aktif ({activeGoals.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {activeGoals.map((goal) => {
                    const progress = (goal.currentAmount / goal.target) * 100;
                    const deadline = new Date(goal.deadline);
                    const now = new Date();
                    const daysLeft = Math.ceil(
                      (deadline - now) / (1000 * 60 * 60 * 24)
                    );
                    const remaining = goal.target - goal.currentAmount;

                    return (
                      <div
                        key={goal.id}
                        className="bg-white shadow-lg rounded-xl p-6 border-2 border-purple-100 hover:shadow-xl transition-all"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h4 className="text-xl font-bold text-gray-800 mb-1">
                              {goal.title}
                            </h4>
                            <p className="text-sm text-gray-500">
                              Deadline:{" "}
                              {deadline.toLocaleDateString("id-ID", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              })}
                            </p>
                          </div>
                          <button
                            onClick={() => handleDelete(goal.id)}
                            className="text-red-400 hover:text-red-600 transition-colors"
                            title="Hapus"
                          >
                            <span className="mgc_delete_2_line text-xl"></span>
                          </button>
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-600">
                              Progress
                            </span>
                            <span className="text-sm font-bold text-purple-600">
                              {progress.toFixed(1)}%
                            </span>
                          </div>
                          <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                              style={{ width: `${Math.min(progress, 100)}%` }}
                            ></div>
                          </div>
                          <div className="flex justify-between mt-2 text-xs text-gray-500">
                            <span>
                              Rp {goal.currentAmount.toLocaleString("id-ID")}
                            </span>
                            <span>
                              Rp {goal.target.toLocaleString("id-ID")}
                            </span>
                          </div>
                        </div>

                        {/* Info */}
                        <div className="space-y-2 mb-4 text-sm">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Sisa:</span>
                            <span className="font-semibold text-gray-800">
                              Rp {remaining.toLocaleString("id-ID")}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Hari Tersisa:</span>
                            <span
                              className={`font-semibold ${
                                daysLeft <= 30
                                  ? "text-red-600"
                                  : "text-gray-800"
                              }`}
                            >
                              {daysLeft > 0 ? `${daysLeft} hari` : "Terlambat"}
                            </span>
                          </div>
                          {goal.autoAllocation &&
                            goal.monthlyContribution > 0 && (
                              <div className="flex items-center justify-between">
                                <span className="text-gray-600">
                                  Kontribusi Bulanan:
                                </span>
                                <span className="font-semibold text-purple-600">
                                  Rp{" "}
                                  {goal.monthlyContribution.toLocaleString(
                                    "id-ID"
                                  )}
                                </span>
                              </div>
                            )}
                        </div>

                        {/* Add Contribution */}
                        <div className="border-t border-gray-200 pt-4">
                          <div className="flex gap-2">
                            <input
                              type="number"
                              placeholder="Tambah jumlah"
                              min="0"
                              step="1000"
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                              onKeyPress={(e) => {
                                if (e.key === "Enter") {
                                  handleAddContribution(
                                    goal.id,
                                    e.target.value
                                  );
                                  e.target.value = "";
                                }
                              }}
                            />
                            <button
                              onClick={(e) => {
                                const input = e.target.previousElementSibling;
                                handleAddContribution(goal.id, input.value);
                                input.value = "";
                              }}
                              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-semibold"
                            >
                              <span className="mgc_add_line mr-1"></span>
                              Tambah
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Completed Goals */}
            {completedGoals.length > 0 && (
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  <span className="mgc_check_circle_line text-2xl mr-2"></span>
                  Goals Selesai ({completedGoals.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {completedGoals.map((goal) => {
                    const deadline = new Date(goal.deadline);

                    return (
                      <div
                        key={goal.id}
                        className="bg-gradient-to-br from-green-50 to-emerald-50 shadow-lg rounded-xl p-6 border-2 border-green-200"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="mgc_check_circle_fill text-green-600 text-xl"></span>
                              <h4 className="text-xl font-bold text-gray-800">
                                {goal.title}
                              </h4>
                            </div>
                            <p className="text-sm text-gray-500">
                              Selesai:{" "}
                              {deadline.toLocaleDateString("id-ID", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              })}
                            </p>
                          </div>
                          <button
                            onClick={() => handleDelete(goal.id)}
                            className="text-red-400 hover:text-red-600 transition-colors"
                            title="Hapus"
                          >
                            <span className="mgc_delete_2_line text-xl"></span>
                          </button>
                        </div>

                        <div className="bg-white rounded-lg p-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">
                              Target:
                            </span>
                            <span className="font-bold text-green-600">
                              Rp {goal.target.toLocaleString("id-ID")}
                            </span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full mt-2 overflow-hidden">
                            <div className="h-full bg-green-500 w-full"></div>
                          </div>
                          <p className="text-xs text-green-600 mt-1 text-center font-semibold">
                            100% Tercapai!
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Empty State */}
            {goals.length === 0 && (
              <div className="text-center py-12 bg-white rounded-xl shadow-lg">
                <span className="mgc_target_line text-6xl text-gray-300 block mb-4"></span>
                <p className="text-gray-500 text-lg">Belum ada goals</p>
                <p className="text-gray-400 text-sm mt-2">
                  Klik "Buat Goal Baru" atau pilih template untuk memulai
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
