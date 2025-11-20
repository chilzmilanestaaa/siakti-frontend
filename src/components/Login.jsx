import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/siakti-logo.png";
import "../index.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Email:", email);
    console.log("Password:", password);
    // Tambahkan logika autentikasi di sini
    navigate("/Dashboard");
  };

  return (
    <div className="background">
      <div className=" min-h-screen flex items-center justify-center p-4">
        <div className=" w-full max-w-sm bg-white shadow-lg rounded-lg p-6">
          <img className="mx-auto mb-4  " src={logo} width="200" alt="Logo" />
          <h2 className="text-2xl font-bold text-center mb-6 text-light-800">
            Login
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 text-gray-700">Email</label>
              <input
                type="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:outline-none"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block mb-1 text-gray-700">Password</label>
              <input
                type="password"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:outline-none"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Masuk
            </button>
          </form>

          <p className="text-sm text-center text-gray-600 mt-4">
            Belum punya akun?{" "}
            <button
              onClick={() => navigate("/Register")}
              className="text-blue-600 hover:underline"
            >
              Daftar
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
