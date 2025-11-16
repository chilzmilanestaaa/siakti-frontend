import React from "react";
import logo from "./assets/siakti-logo.png";
import { useNavigate } from "react-router-dom";
import imageHero2 from "./assets/titi.png";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="container">
      <img src={logo} width="100" alt="Logo" />
      <div className="content " style={{ paddingTop: 50 }}>
        <div>
          <h1>
            Atur Keuanganmu Dengan Formula{" "}
            <span style={{ fontSize: 50, color: "#ff00ea" }}>50 - 30 - 20</span>
          </h1>

          <p>
            Alokasikan dana anda secara cerdas: 50% untuk kebutuhan, 30% untuk
            keinginan, dan 20% untuk tabungan & investasi
          </p>
          <button onClick={() => navigate("/dashboard")} className="btn">
            Mulai Sekarang
          </button>
        </div>
        <img src={imageHero2} width="600" alt="Logo" />
      </div>
    </div>
  );
};

export default LandingPage;
