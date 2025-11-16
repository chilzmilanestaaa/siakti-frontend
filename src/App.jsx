import { useState } from "react";
import React from "react";
import logo from "./assets/siakti-logo.png";
import imageHero from "./assets/hero.png";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="container">
      <img src={logo} width="100" alt="Logo" />
      <div
        className="content "
        style={{ paddingTop: 50, alignItems: "center" }}
      >
        <div>
          <h1>Kelola Anggaran Pribadi dengan Aturan 50-30-20</h1>
          <p>
            Alokasikan dana anda secara cerdas: 50% untuk kebutuhan, 30% untuk
            keinginan, dan 20% untuk tabungan & investasi
          </p>
          <button className="btn">Mulai Sekarang</button>
        </div>
        <img src={imageHero} width="400" alt="Logo" />
      </div>
    </div>
  );
}

export default App;
