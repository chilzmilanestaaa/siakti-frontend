// Sidebar.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/siakti-logo.png";
import "mingcute_icon/font/Mingcute.css";

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const menuItems = [
    {
      icon: "mgc_home_2_line",
      label: "Dashboard",
      active: true,
      route: "/dashboard",
    },
    {
      icon: "mgc_wallet_3_line",
      label: "Budget Plan",
      active: false,
      route: "/budgetplanner",
    },
    {
      icon: "mgc_coin_line",
      label: "Income Tracking",
      active: false,
      route: "/incometracking",
    },
    {
      icon: "mgc_chart_line_line",
      label: "Expense Tracking",
      active: false,
      route: "/expensetracking",
    },
    {
      icon: "mgc_currency_dollar_2_line",
      label: "Financial Goals",
      active: false,
      route: "/financialgoals",
    },
    {
      icon: "mgc_chart_bar_line",
      label: "Progress Report",
      active: false,
      route: "/report",
    },
    { icon: "mgc_exit_line", label: "Logout", active: false, route: "/" },
  ];

  const handleClick = (route) => {
    navigate(route);
    onClose();
  };
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-purple bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        ></div>
      )}

      <div
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <div className="p-6 ">
          <div className="flex items-center space-x-3">
            <img
              src={logo}
              alt="Logo"
              style={{ width: "150px", height: "auto" }}
            />
          </div>
        </div>

        <div className="p-4">
          <nav className="space-y-1">
            <div className="flex flex-col gap-3">
              {menuItems.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-md cursor-pointer"
                  onClick={() => handleClick(item.route)} // <- klik navigasi
                >
                  <span className={`${item.icon} text-xl`} />
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </nav>
        </div>

        <div className="px-4 py-2">
          <div className="border-t border-gray-200"></div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
