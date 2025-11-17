import React from "react";
import logo from "./assets/siakti-logo.png";
import { useNavigate } from "react-router-dom";
import imageHero2 from "./assets/titi.png";
import imageHero from "./assets/hero.png";
import "./index.css";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="container">
        <img src={logo} width="200" alt="Logo" />
        <div className="content " style={{ paddingTop: 50 }}>
          <div>
            <h1>
              Atur Keuanganmu Dengan Formula <span>50 30 20</span>
            </h1>

            <p className="pt-10 pb-10">
              Alokasikan dana anda secara cerdas: 50% untuk kebutuhan, 30% untuk
              keinginan, dan 20% untuk tabungan & investasi
            </p>
            <button
              onClick={() => navigate("/dashboard")}
              className="btn bg-linear-65 from-purple-500 to-pink-500"
            >
              Mulai Sekarang
            </button>
          </div>
          <img src={imageHero2} width="600" alt="Logo" />
        </div>
        <div className="content" style={{ marginTop: 50 }}>
          <img src={imageHero} width="600" alt="Logo" />
          <div>
            <h1>
              “Your Money. <br /> Your Control.”
            </h1>
            <p className="pt-5 ">
              Dengan Siakti Smart Budget, setiap rupiah yang kamu hasilkan ada
              di tanganmu. Pantau pemasukan, atur pengeluaran, dan prioritaskan
              kebutuhan sesuai metode 50-30-20 dengan mudah. Kamu bukan hanya
              mengelola uang—kamu mengendalikan masa depan finansialmu.
              Sederhana, cerdas, dan penuh kendali.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default LandingPage;
