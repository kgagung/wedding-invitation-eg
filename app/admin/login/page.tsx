"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.success) {
        // Simpan token di sessionStorage
        sessionStorage.setItem("admin_token", data.token);
        router.push("/admin/dashboard");
      } else {
        setError(data.message || "Login gagal");
      }
    } catch (error) {
      setError("Terjadi kesalahan saat login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: 'url("/images/BG-1-Temaa-11.webp")',
        backgroundRepeat: "repeat",
        backgroundSize: "contain",
      }}
    >
      <div className="bg-white/95 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-[#925E2D]/20 max-w-md w-full mx-4">
        <div className="text-center mb-8">
          <div className="text-4xl mb-4">🔐</div>
          <h1
            className="text-2xl font-bold mb-2"
            style={{
              fontFamily: '"Cinzel Decorative", Sans-serif',
              color: "#5a3921",
            }}
          >
            Admin Login
          </h1>
          <p className="text-gray-600">Masuk untuk melihat daftar tamu</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#5a3921] mb-2">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-[#925E2D]/30 focus:border-[#925E2D] focus:ring-2 focus:ring-[#925E2D]/20 transition-all duration-300"
              placeholder="Masukkan username"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#5a3921] mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-[#925E2D]/30 focus:border-[#925E2D] focus:ring-2 focus:ring-[#925E2D]/20 transition-all duration-300"
              placeholder="Masukkan password"
              required
            />
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#925E2D] text-white hover:bg-[#5a3921] shadow-lg hover:shadow-xl"
            }`}
          >
            {loading ? "Memproses..." : "Masuk"}
          </button>
        </form>
      </div>
    </div>
  );
}
