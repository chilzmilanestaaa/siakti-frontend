import React, { useState } from "react";

const IncomeExpenseForm = ({ addTransaction }) => {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("income");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description || !amount) return;
    addTransaction({
      description,
      amount: parseFloat(amount),
      type,
      date: new Date(), // menyimpan tanggal transaksi
    });
    setDescription("");
    setAmount("");
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "1rem" }}>
      <input
        type="text"
        placeholder="Deskripsi"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <input
        type="number"
        placeholder="Jumlah"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="income">Pemasukan</option>
        <option value="expense">Pengeluaran</option>
      </select>
      <button type="submit">Tambah</button>
    </form>
  );
};

export default IncomeExpenseForm;
