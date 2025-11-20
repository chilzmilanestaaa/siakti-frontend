import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/siakti-logo.png";
import "../index.css";

export default function Register() {
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [nohp, setNohp] = useState("");
  const [alamat, setAlamat] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Password dan Konfirmasi Password tidak cocok!");
      return;
    }

    console.log({
      nama,
      email,
      nohp,
      alamat,
      password,
    });

    navigate("/Login");
  };

  return (
    <div className="background min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-white shadow-xl rounded-lg p-8">
        {/* LOGO + TITLE */}
        <div className="text-center mb-6">
          <img src={logo} width="150" className="mx-auto mb-3" alt="Logo" />
          <h2 className="text-2xl font-bold">Register</h2>
        </div>

        {/* FORM START */}
        <form onSubmit={handleSubmit}>
          {/* =============== 2 COLUMN FORM  ================= */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* LEFT FORM */}
            <div className="space-y-4">
              {/* Nama */}
              <div>
                <label className="block mb-1 text-gray-700">Nama Lengkap</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Nama lengkap"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="block mb-1 text-gray-700">Email</label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* RIGHT FORM */}
            <div className="space-y-4">
              {/* Nomor HP */}
              <div>
                <label className="block mb-1 text-gray-700">Nomor HP</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="08xxxxxxxxxx"
                  value={nohp}
                  onChange={(e) => setNohp(e.target.value)}
                  required
                />
              </div>

              {/* Alamat */}
              <div>
                <label className="block mb-1 text-gray-700">Alamat</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Alamat lengkap"
                  value={alamat}
                  onChange={(e) => setAlamat(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          {/* ================== PASSWORD SECTION ================== */}
          <div className="mt-6 space-y-4">
            {/* Password */}
            <div>
              <label className="block mb-1 text-gray-700">Password</label>
              <input
                type="password"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Konfirmasi Password */}
            <div>
              <label className="block mb-1 text-gray-700">
                Konfirmasi Password
              </label>
              <input
                type="password"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            className="btn w-full mt-6 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            onClick={() => navigate("/Dashboard")}
          >
            Daftar
          </button>

          {/* LOGIN LINK */}
          <p className="text-center text-sm mt-4">
            Sudah punya akun?{" "}
            <button
              onClick={() => navigate("/Login")}
              className="text-blue-600 hover:underline"
            >
              Login
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
