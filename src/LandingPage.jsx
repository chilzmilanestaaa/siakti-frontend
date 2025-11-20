import "./index.css";
import { useNavigate } from "react-router-dom";
import imageHero2 from "./assets/titi.png";
import Footer from "./components/Footer";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="background">
      {/* ================= HERO SECTION ================= */}
      <section className="h-screen bg-purple-200/20 backdrop-blur-lg text-white pt-20">
        <div className="max-w-7xl mx-auto text-center px-4 h-full">
          <div className="h-full flex flex-col lg:flex-row items-center justify-start mt-10">
            {/* Konten Teks */}
            <div className="w-full lg:w-1/2 text-center lg:text-left pb-25">
              <h1 className="text-3xl md:text-5xl lg:text-7xl my-5 font-bold">
                Kelola Keuangan Lebih Mudah dengan{" "}
                <span className="font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-pink-500 bg-clip-text text-transparent">
                  SIAKTI
                </span>
              </h1>
              <p className="px-1 pt-5 text-base md:text-lg">
                Alokasikan dana anda secara cerdas: <br />
                50% untuk kebutuhan, 30% untuk keinginan, dan 20% untuk tabungan
                & investasi
              </p>
              <div>
                <button onClick={() => navigate("/login")} className="btn mt-5">
                  Mulai Sekarang
                </button>
              </div>
            </div>

            {/* Gambar */}
            <div className="w-full lg:w-1/2 mt-5 lg:mt-0">
              <img src={imageHero2} className="w-full h-auto" alt="Logo" />
            </div>
          </div>
        </div>
      </section>

      {/* ================= ABOUT ================= */}
      <section className="py-16 px-6 bg-white/20 backdrop-blur-lg rounded-xl p-6 shadow-lg">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl text-stone-50 font-bold mb-4">
            Apa itu SIAKTI?
          </h2>
          <p className="text-stone-50 text-lg max-w-3xl mx-auto mb-4">
            SIAKTI adalah platform manajemen keuangan yang membantu Anda membagi
            pemasukan secara otomatis menggunakan formula{" "}
            <span className="font-semibold  text-stone-50">
              50% kebutuhan – 30% keinginan – 20% tabungan & investasi
            </span>
          </p>
        </div>

        {/* ================= 50 30 20 SECTION ================= */}

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-6 bg-white rounded-xl shadow">
            <h3 className="text-2xl font-bold text-blue-600 mb-2">50%</h3>
            <p className="text-gray-700 font-medium mb-2">Kebutuhan</p>
            <p className="text-gray-600 text-sm">
              Termasuk makan, transport, tagihan, dan kebutuhan pokok lainnya.
            </p>
          </div>

          <div className="p-6 bg-white rounded-xl shadow">
            <h3 className="text-2xl font-bold text-green-600 mb-2">30%</h3>
            <p className="text-gray-700 font-medium mb-2">Keinginan</p>
            <p className="text-gray-600 text-sm">
              Hiburan, shopping, nongkrong, atau langganan aplikasi.
            </p>
          </div>

          <div className="p-6 bg-white rounded-xl shadow">
            <h3 className="text-2xl font-bold text-yellow-500 mb-2">20%</h3>
            <p className="text-gray-700 font-medium mb-2">
              Tabungan & Investasi
            </p>
            <p className="text-gray-600 text-sm">
              Dana darurat, tabungan masa depan, atau instrumen investasi.
            </p>
          </div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="py-16 px-6 ">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl text-stone-50 font-bold mb-8">
            Fitur Unggulan SIAKTI
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              "Otomatis Menghitung Anggaran 50/30/20",
              "Visualisasi Grafik Real-Time",
              "Pengingat Batas Pengeluaran",
              "Kategori Pengeluaran Detail",
              "Tujuan Keuangan (Financial Goals)",
              "Keamanan Data Terjamin",
            ].map((feature, i) => (
              <div
                key={i}
                className="p-4 bg-white rounded-lg shadow flex items-center space-x-3"
              >
                <span className="text-blue-600 text-xl">✔</span>
                <p className="text-gray-700">{feature}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= TESTIMONIAL ================= */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-stone-50 mb-10">
            Apa Kata Pengguna?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-white rounded-lg shadow">
              <p className="text-gray-700 italic">
                "SIAKTI bikin saya sadar pola belanja. Jadi lebih teratur!"
              </p>
              <p className="font-bold mt-3 text-blue-600">— Vira</p>
            </div>

            <div className="p-6 bg-white rounded-lg shadow">
              <p className="text-gray-700 italic">
                "Gaji langsung otomatis dibagi. Hemat waktu dan pikiran."
              </p>
              <p className="font-bold mt-3 text-blue-600">— Anjani</p>
            </div>

            <div className="p-6 bg-white rounded-lg shadow">
              <p className="text-gray-700 italic">
                "Jadi lebih konsisten nabung tiap bulan."
              </p>
              <p className="font-bold mt-3 text-blue-600">— Dewi</p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="py-16 px-6  text-white text-center bg-white/20 backdrop-blur-lg rounded-xl">
        <h2 className="text-3xl font-bold mb-4">
          Siap Mengubah Keuangan Anda?
        </h2>
        <p className="text-blue-100 max-w-3xl mx-auto mb-6">
          Mulailah perjalanan finansial yang lebih sehat dengan SIAKTI.
        </p>
        <button
          className="btn bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-8 py-3 rounded-lg"
          onClick={() => navigate("/register")}
        >
          Buat Akun Sekarang
        </button>
      </section>

      {/* ================= FOOTER ================= */}
      <Footer />
    </div>
  );
};

export default LandingPage;
