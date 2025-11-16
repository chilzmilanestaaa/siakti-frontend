import React, { useState } from "react";
import Navbar from "./components/Navbar";
import IncomeExpenseForm from "./components/IncomeExpenseForm";
import TransactionList from "./components/TransactionList";
import FinanceChart from "./components/FinanceChart";

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("all");

  const addTransaction = (transaction) => {
    setTransactions([transaction, ...transactions]);
  };

  const filteredTransactions =
    selectedMonth === "all"
      ? transactions
      : transactions.filter((t) => {
          const month = new Date(t.date).getMonth() + 1;
          return month === parseInt(selectedMonth);
        });

  const totalIncome = filteredTransactions
    .filter((t) => t.type === "income")
    .reduce((acc, t) => acc + t.amount, 0);

  const totalExpense = filteredTransactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => acc + t.amount, 0);

  const balance = totalIncome - totalExpense;

  return (
    <div>
      <Navbar />
      <div style={{ padding: "2rem" }}>
        <IncomeExpenseForm addTransaction={addTransaction} />

        <div style={{ marginBottom: "1rem" }}>
          <label>Pilih Bulan: </label>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            <option value="all">Semua</option>
            <option value="1">Januari</option>
            <option value="2">Februari</option>
            <option value="3">Maret</option>
            <option value="4">April</option>
            <option value="5">Mei</option>
            <option value="6">Juni</option>
            <option value="7">Juli</option>
            <option value="8">Agustus</option>
            <option value="9">September</option>
            <option value="10">Oktober</option>
            <option value="11">November</option>
            <option value="12">Desember</option>
          </select>
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <h3>Total Pemasukan: {totalIncome}</h3>
          <h3>Total Pengeluaran: {totalExpense}</h3>
          <h3 style={{ color: balance >= 0 ? "green" : "red" }}>
            Saldo: {balance} {balance >= 0 ? "(Surplus)" : "(Defisit)"}
          </h3>
        </div>

        <TransactionList transactions={filteredTransactions} />
        <FinanceChart transactions={filteredTransactions} />
      </div>
    </div>
  );
};

export default Dashboard;
