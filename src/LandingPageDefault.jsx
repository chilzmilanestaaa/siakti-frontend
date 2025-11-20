import Footer from "./components/footer";
import logo from "./assets/siakti-logo.png";
import { useNavigate } from "react-router-dom";
import imageHero2 from "./assets/titi.png";
import imageHero from "./assets/hero.png";
import "./index.css";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="background">
        <div className="container">
          <img src={logo} width="200" alt="Logo" />

          <div className="content my-5 flex flex-col md:flex-row items-center gap-6 ">
            <div className="text-white md:w-1/2">
              <h1 className="text-3xl md:text-4xl mt-5 font-bold">
                Atur Keuanganmu Dengan Formula <br /> 50 30 20
              </h1>
              <p className="pt-5 text-base md:text-lg">
                Alokasikan dana anda secara cerdas: 50% untuk kebutuhan, 30%
                untuk keinginan, dan 20% untuk tabungan & investasi
              </p>
              <button onClick={() => navigate("/login")} className="btn mt-10 ">
                Mulai Sekarang
              </button>
            </div>
            <img src={imageHero2} className="w-full md:w-1/2 pt-5" alt="Logo" />
          </div>
          <div className="content my-5 flex flex-col md:flex-row items-center gap-6">
            <img src={imageHero} className="w-full md:w-1/2 pt-5" alt="Logo" />
            <div className="text-white md:w-1/2">
              <h1 className="text-3xl md:text-4xl font-bold">
                “Your Money. <br /> Your Control.”
              </h1>
              <p className="pt-5 text-base md:text-lg">
                Dengan Siakti Smart Budget, setiap rupiah yang kamu hasilkan ada
                di tanganmu...
              </p>
            </div>
          </div>

          <Footer />
        </div>
      </div>
    </>
  );
};

export default LandingPage;
