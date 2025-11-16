import React from "react";

const TransactionList = ({ transactions }) => {
  return (
    <ul>
      {transactions.map((t, index) => (
        <li
          key={index}
          style={{ color: t.type === "income" ? "green" : "red" }}
        >
          {t.description}: {t.amount}
        </li>
      ))}
    </ul>
  );
};

export default TransactionList;
