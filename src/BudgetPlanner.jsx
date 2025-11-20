import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import "mingcute_icon/font/Mingcute.css";

export default function BudgetPlanner() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [income, setIncome] = useState("");
  const [allocation, setAllocation] = useState({ needs: 50, wants: 30, savings: 20 });
  const [isEditingAllocation, setIsEditingAllocation] = useState(false);

  // Detail kategori dengan sub-kategori
  const [categoryDetails, setCategoryDetails] = useState({
    needs: {
      makan: "",
      sewa: "",
      transport: "",
      listrik: "",
      internet: "",
    },
    wants: {
      hobi: "",
      nongkrong: "",
      belanja: "",
      entertainment: "",
    },
    savings: {
      darurat: "",
      investasi: "",
      danaPendidikan: "",
    },
  });

  // Custom categories (user-added)
  const [customCategories, setCustomCategories] = useState({
    needs: [],
    wants: [],
    savings: [],
  });

  const totalIncome = Number(income) || 0;
  const needs = totalIncome * (allocation.needs / 100);
  const wants = totalIncome * (allocation.wants / 100);
  const savings = totalIncome * (allocation.savings / 100);

  // Hitung total pengeluaran per kategori
  const calculateCategoryTotal = (category) => {
    return Object.values(categoryDetails[category]).reduce(
      (sum, val) => sum + (Number(val) || 0),
      0
    );
  };

  const needsSpent = calculateCategoryTotal("needs");
  const wantsSpent = calculateCategoryTotal("wants");
  const savingsSpent = calculateCategoryTotal("savings");

  // Fungsi untuk mendapatkan status budget
  const getBudgetStatus = (allocated, spent) => {
    if (spent === 0) return { status: "On Track", color: "text-gray-600", bgColor: "bg-gray-100" };
    const percentage = (spent / allocated) * 100;
    if (percentage < 80) return { status: "Under Budget", color: "text-green-600", bgColor: "bg-green-100" };
    if (percentage <= 100) return { status: "On Track", color: "text-blue-600", bgColor: "bg-blue-100" };
    return { status: "Overbudget", color: "text-red-600", bgColor: "bg-red-100" };
  };

  const needsStatus = getBudgetStatus(needs, needsSpent);
  const wantsStatus = getBudgetStatus(wants, wantsSpent);
  const savingsStatus = getBudgetStatus(savings, savingsSpent);

  // Update sub-kategori
  const updateCategoryDetail = (category, subCategory, value) => {
    setCategoryDetails((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [subCategory]: value,
      },
    }));
  };

  // Add custom category
  const addCustomCategory = (category, categoryName) => {
    if (!categoryName.trim()) {
      alert("Nama kategori tidak boleh kosong!");
      return;
    }

    // Check if category already exists
    const defaultKeys = Object.keys(categoryDetails[category]);
    const customKeys = customCategories[category].map((cat) => cat.key);
    const allKeys = [...defaultKeys, ...customKeys];

    if (allKeys.includes(categoryName.toLowerCase().replace(/\s+/g, ""))) {
      alert("Kategori ini sudah ada!");
      return;
    }

    const newCategory = {
      key: categoryName.toLowerCase().replace(/\s+/g, ""),
      label: categoryName,
      icon: "mgc_tag_line", // Default icon
    };

    setCustomCategories((prev) => ({
      ...prev,
      [category]: [...prev[category], newCategory],
    }));

    // Initialize value in categoryDetails
    setCategoryDetails((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [newCategory.key]: "",
      },
    }));
  };

  // Remove custom category
  const removeCustomCategory = (category, categoryKey) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus kategori ini?")) {
      setCustomCategories((prev) => ({
        ...prev,
        [category]: prev[category].filter((cat) => cat.key !== categoryKey),
      }));

      // Remove from categoryDetails
      setCategoryDetails((prev) => {
        const newDetails = { ...prev[category] };
        delete newDetails[categoryKey];
        return {
          ...prev,
          [category]: newDetails,
        };
      });
    }
  };

  // Validasi alokasi harus 100%
  const handleAllocationChange = (type, value) => {
    const numValue = Number(value) || 0;
    if (numValue < 0 || numValue > 100) return;

    const newAllocation = { ...allocation, [type]: numValue };
    const total = Object.values(newAllocation).reduce((sum, val) => sum + val, 0);

    if (total <= 100) {
      setAllocation(newAllocation);
    }
  };

  // Reset alokasi ke default
  const resetAllocation = () => {
    setAllocation({ needs: 50, wants: 30, savings: 20 });
  };

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
                Budget Planner
              </h1>
              <p className="text-gray-600">
                Buat perencanaan keuangan yang jelas sebelum mulai spending
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Input Section */}
              <div className="lg:col-span-1">
                <div className="bg-white shadow-xl rounded-2xl p-6 sticky top-6">
                  <div className="mb-6">
                    <label className="block mb-3 text-gray-700 font-semibold text-lg">
                      <span className="mgc_wallet_3_line text-2xl mr-2"></span>
                      Pendapatan Bulanan
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                        Rp
                      </span>
                      <input
                        type="number"
                        value={income}
                        onChange={(e) => setIncome(e.target.value)}
                        placeholder="0"
                        className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-lg font-semibold transition-all"
                      />
                    </div>
                  </div>

                  {/* Edit Alokasi */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-gray-700 font-semibold text-sm">
                        <span className="mgc_settings_3_line text-lg mr-2"></span>
                        Alokasi Budget
                      </label>
                      <div className="flex gap-2">
                        {isEditingAllocation ? (
                          <>
                            <button
                              onClick={() => {
                                setIsEditingAllocation(false);
                                resetAllocation();
                              }}
                              className="text-xs px-2 py-1 text-gray-600 hover:text-gray-800"
                            >
                              Reset
                            </button>
                            <button
                              onClick={() => setIsEditingAllocation(false)}
                              className="text-xs px-2 py-1 text-blue-600 hover:text-blue-800 font-semibold"
                            >
                              Selesai
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => setIsEditingAllocation(true)}
                            className="text-xs px-2 py-1 text-blue-600 hover:text-blue-800 font-semibold"
                          >
                            Edit
                          </button>
                        )}
                      </div>
                    </div>

                    {isEditingAllocation ? (
                      <div className="space-y-3 p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="text-xs text-gray-600">Kebutuhan</label>
                            <input
                              type="number"
                              value={allocation.needs}
                              onChange={(e) => handleAllocationChange("needs", e.target.value)}
                              className="w-16 px-2 py-1 text-sm border rounded text-center"
                              min="0"
                              max="100"
                            />
                            <span className="text-xs text-gray-500">%</span>
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="text-xs text-gray-600">Keinginan</label>
                            <input
                              type="number"
                              value={allocation.wants}
                              onChange={(e) => handleAllocationChange("wants", e.target.value)}
                              className="w-16 px-2 py-1 text-sm border rounded text-center"
                              min="0"
                              max="100"
                            />
                            <span className="text-xs text-gray-500">%</span>
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="text-xs text-gray-600">Tabungan</label>
                            <input
                              type="number"
                              value={allocation.savings}
                              onChange={(e) => handleAllocationChange("savings", e.target.value)}
                              className="w-16 px-2 py-1 text-sm border rounded text-center"
                              min="0"
                              max="100"
                            />
                            <span className="text-xs text-gray-500">%</span>
                          </div>
                        </div>
                        <div className="pt-2 border-t border-gray-200">
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-600">Total:</span>
                            <span className={`font-semibold ${Object.values(allocation).reduce((a, b) => a + b, 0) === 100 ? "text-green-600" : "text-red-600"}`}>
                              {Object.values(allocation).reduce((a, b) => a + b, 0)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="p-3 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border border-blue-100">
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Kebutuhan</span>
                            <span className="font-semibold text-gray-800">{allocation.needs}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Keinginan</span>
                            <span className="font-semibold text-gray-800">{allocation.wants}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Tabungan</span>
                            <span className="font-semibold text-gray-800">{allocation.savings}%</span>
                          </div>
                        </div>
                        <div className="mt-3 flex items-center gap-2">
                          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full flex">
                              <div className="bg-blue-500" style={{ width: `${allocation.needs}%` }}></div>
                              <div className="bg-green-500" style={{ width: `${allocation.wants}%` }}></div>
                              <div className="bg-yellow-500" style={{ width: `${allocation.savings}%` }}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    className="w-full mt-6 py-3 px-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
                    onClick={() => {
                      if (totalIncome > 0) {
                        alert(`Budget berhasil disimpan!\n\nTotal: Rp ${totalIncome.toLocaleString('id-ID')}\nKebutuhan: Rp ${needs.toLocaleString('id-ID')}\nKeinginan: Rp ${wants.toLocaleString('id-ID')}\nTabungan: Rp ${savings.toLocaleString('id-ID')}`);
                      }
                    }}
                  >
                    <span className="mgc_save_2_line text-xl mr-2"></span>
                    Simpan Budget
                  </button>
                </div>
              </div>

              {/* Budget Cards Section */}
              <div className="lg:col-span-3 space-y-6">
                {/* Kebutuhan */}
                <BudgetCategoryCard
                  label="Kebutuhan"
                  percentage={allocation.needs}
                  allocated={needs}
                  spent={needsSpent}
                  status={needsStatus}
                  icon="mgc_home_2_line"
                  gradient="from-blue-500 to-blue-600"
                  bgColor="bg-blue-50"
                  borderColor="border-blue-200"
                  textColor="text-blue-700"
                  subCategories={[
                    { key: "makan", label: "Makan", icon: "mgc_restaurant_line" },
                    { key: "sewa", label: "Sewa", icon: "mgc_building_2_line" },
                    { key: "transport", label: "Transport", icon: "mgc_car_line" },
                    { key: "listrik", label: "Listrik", icon: "mgc_flash_line" },
                    { key: "internet", label: "Internet", icon: "mgc_wifi_line" },
                  ]}
                  customCategories={customCategories.needs}
                  categoryDetails={categoryDetails.needs}
                  onUpdate={(subCategory, value) => updateCategoryDetail("needs", subCategory, value)}
                  onAddCategory={(name) => addCustomCategory("needs", name)}
                  onRemoveCategory={(key) => removeCustomCategory("needs", key)}
                />

                {/* Keinginan */}
                <BudgetCategoryCard
                  label="Keinginan"
                  percentage={allocation.wants}
                  allocated={wants}
                  spent={wantsSpent}
                  status={wantsStatus}
                  icon="mgc_shopping_bag_2_line"
                  gradient="from-green-500 to-green-600"
                  bgColor="bg-green-50"
                  borderColor="border-green-200"
                  textColor="text-green-700"
                  subCategories={[
                    { key: "hobi", label: "Hobi", icon: "mgc_game_2_line" },
                    { key: "nongkrong", label: "Nongkrong", icon: "mgc_cafe_line" },
                    { key: "belanja", label: "Belanja", icon: "mgc_shopping_cart_2_line" },
                    { key: "entertainment", label: "Entertainment", icon: "mgc_movie_line" },
                  ]}
                  customCategories={customCategories.wants}
                  categoryDetails={categoryDetails.wants}
                  onUpdate={(subCategory, value) => updateCategoryDetail("wants", subCategory, value)}
                  onAddCategory={(name) => addCustomCategory("wants", name)}
                  onRemoveCategory={(key) => removeCustomCategory("wants", key)}
                />

                {/* Tabungan */}
                <BudgetCategoryCard
                  label="Tabungan & Investasi"
                  percentage={allocation.savings}
                  allocated={savings}
                  spent={savingsSpent}
                  status={savingsStatus}
                  icon="mgc_coin_line"
                  gradient="from-yellow-500 to-yellow-600"
                  bgColor="bg-yellow-50"
                  borderColor="border-yellow-200"
                  textColor="text-yellow-700"
                  subCategories={[
                    { key: "darurat", label: "Darurat", icon: "mgc_safe_2_line" },
                    { key: "investasi", label: "Investasi", icon: "mgc_chart_line_line" },
                    { key: "danaPendidikan", label: "Dana Pendidikan", icon: "mgc_book_2_line" },
                  ]}
                  customCategories={customCategories.savings}
                  categoryDetails={categoryDetails.savings}
                  onUpdate={(subCategory, value) => updateCategoryDetail("savings", subCategory, value)}
                  onAddCategory={(name) => addCustomCategory("savings", name)}
                  onRemoveCategory={(key) => removeCustomCategory("savings", key)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BudgetCategoryCard({
  label,
  percentage,
  allocated,
  spent,
  status,
  icon,
  gradient,
  bgColor,
  borderColor,
  textColor,
  subCategories,
  customCategories = [],
  categoryDetails,
  onUpdate,
  onAddCategory,
  onRemoveCategory,
}) {
  const progressPercentage = allocated > 0 ? Math.min((spent / allocated) * 100, 100) : 0;
  const remaining = allocated - spent;
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  return (
    <div className={`bg-white shadow-xl rounded-2xl p-6 border-2 ${borderColor} hover:shadow-2xl transition-all duration-300`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient} text-white`}>
            <span className={`${icon} text-2xl`}></span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">{label}</h3>
            <p className="text-sm text-gray-500">{percentage}% dari pendapatan</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-gray-800">
            Rp {allocated.toLocaleString("id-ID")}
          </p>
          <p className="text-xs text-gray-500">Alokasi</p>
        </div>
      </div>

      {/* Status Indicator */}
      <div className={`mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-full ${status.bgColor} ${status.color} text-sm font-semibold`}>
        <span className={`mgc_${status.status === "Under Budget" ? "check_circle" : status.status === "On Track" ? "time" : "alert"}_line`}></span>
        {status.status}
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-600">Progress</span>
          <span className="text-sm font-semibold text-gray-800">
            {progressPercentage.toFixed(1)}%
          </span>
        </div>
        <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full bg-gradient-to-r ${gradient} transition-all duration-500 ease-out`}
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          <span>Terpakai: Rp {spent.toLocaleString("id-ID")}</span>
          <span>Sisa: Rp {remaining.toLocaleString("id-ID")}</span>
        </div>
      </div>

      {/* Detail Kategori */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-semibold text-gray-700">Detail Kategori:</h4>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="text-xs px-3 py-1 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors flex items-center gap-1"
          >
            <span className="mgc_add_line"></span>
            {showAddForm ? "Batal" : "Tambah Kategori"}
          </button>
        </div>

        {/* Add Category Form */}
        {showAddForm && (
          <div className={`${bgColor} p-3 rounded-lg border-2 ${borderColor} mb-3`}>
            <div className="flex gap-2">
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Nama kategori baru..."
                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    if (newCategoryName.trim()) {
                      onAddCategory(newCategoryName.trim());
                      setNewCategoryName("");
                      setShowAddForm(false);
                    }
                  }
                }}
              />
              <button
                onClick={() => {
                  if (newCategoryName.trim()) {
                    onAddCategory(newCategoryName.trim());
                    setNewCategoryName("");
                    setShowAddForm(false);
                  }
                }}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-semibold"
              >
                <span className="mgc_check_line"></span>
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Default Categories */}
          {subCategories.map((subCat) => (
            <div key={subCat.key} className={`${bgColor} p-3 rounded-lg border ${borderColor}`}>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                <span className={`${subCat.icon} mr-1`}></span>
                {subCat.label}
              </label>
              <div className="relative">
                <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs">
                  Rp
                </span>
                <input
                  type="number"
                  value={categoryDetails[subCat.key] || ""}
                  onChange={(e) => onUpdate(subCat.key, e.target.value)}
                  placeholder="0"
                  className="w-full pl-8 pr-2 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
              </div>
            </div>
          ))}

          {/* Custom Categories */}
          {customCategories.map((subCat) => (
            <div
              key={subCat.key}
              className={`${bgColor} p-3 rounded-lg border-2 ${borderColor} relative`}
            >
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-medium text-gray-600">
                  <span className={`${subCat.icon} mr-1`}></span>
                  {subCat.label}
                </label>
                <button
                  onClick={() => onRemoveCategory(subCat.key)}
                  className="text-red-400 hover:text-red-600 transition-colors"
                  title="Hapus kategori"
                >
                  <span className="mgc_delete_2_line text-sm"></span>
                </button>
              </div>
              <div className="relative">
                <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs">
                  Rp
                </span>
                <input
                  type="number"
                  value={categoryDetails[subCat.key] || ""}
                  onChange={(e) => onUpdate(subCat.key, e.target.value)}
                  placeholder="0"
                  className="w-full pl-8 pr-2 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
