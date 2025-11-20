import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./LandingPage";
import Dashboard from "./Dashboard";
import Login from "./components/Login";
import "./index.css";
import BudgetPlanner from "./BudgetPlanner";
import ProgressReport from "./ProgressReport";
import IncomeTracking from "./IncomeTracking";
import ExpenseTracking from "./ExpenseTracking";
import FinancialGoals from "./FinancialGoals";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/budgetplanner" element={<BudgetPlanner />} />
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/report" element={<ProgressReport />} />
        <Route path="/incometracking" element={<IncomeTracking />} />
        <Route path="/expensetracking" element={<ExpenseTracking />} />
        <Route path="/financialgoals" element={<FinancialGoals />} />
      </Routes>
    </Router>
  );
}

export default App;
