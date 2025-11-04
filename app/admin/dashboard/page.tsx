"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import tamuData from "../../../data/tamu.json";

interface TamuData {
  [key: string]: {
    nama: string;
    salam: string;
    keterangan: string;
    jumlahTamu?: number;
  };
}

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [confirmations, setConfirmations] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
    loadConfirmations();
  }, []);

  const checkAuth = () => {
    const token = sessionStorage.getItem("admin_token");
    if (!token) {
      router.push("/admin/login");
      return;
    }
    setIsAuthenticated(true);
    setLoading(false);
  };

  const loadConfirmations = async () => {
    try {
      const response = await fetch("/api/konfirmasi");
      const result = await response.json();

      if (result.success) {
        setConfirmations(result.data || []);
      }
    } catch (error) {
      console.error("Error loading confirmations:", error);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("admin_token");
    router.push("/admin/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDF2D6]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#925E2D] mx-auto"></div>
          <p className="text-[#5a3921] mt-2">Memverifikasi...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const totalTamu = Object.keys(tamuData as TamuData).length;
  const totalKonfirmasi = confirmations.length;
  const totalHadir = confirmations.filter(
    (c) => c.kehadiran === "hadir"
  ).length;
  const totalTidakHadir = confirmations.filter(
    (c) => c.kehadiran === "tidak-hadir"
  ).length;
  const totalMasihRagu = confirmations.filter(
    (c) => c.kehadiran === "masih-ragu"
  ).length;

  return (
    <div className="min-h-screen bg-[#FDF2D6] py-8" style={{ all: "revert" }}>
      <div className="max-w-6xl mx-auto px-4" style={{ padding: "10px" }}>
        {/* Header */}
        <div
          className="flex justify-between items-center mb-8"
          style={{ marginBottom: "20px" }}
        >
          <div>
            <h1
              className="text-3xl font-bold"
              style={{
                fontFamily: '"Cinzel Decorative", Sans-serif',
                color: "#5a3921",
              }}
            >
              Admin Dashboard
            </h1>
            <p className="text-gray-600">Manajemen Data Tamu</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
            style={{ padding: "10px" }}
          >
            Logout
          </button>
        </div>

        {/* Stats */}
        <div
          className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8"
          style={{ marginBottom: "20px" }}
        >
          <div
            className="bg-white rounded-2xl p-6 shadow-lg border border-[#925E2D]/20"
            style={{ padding: "10px", textAlign: "center" }}
          >
            <div className="text-2xl font-bold text-[#5a3921]">{totalTamu}</div>
            <div className="text-gray-600">Total Tamu</div>
          </div>
          <div
            className="bg-white rounded-2xl p-6 shadow-lg border border-[#925E2D]/20"
            style={{ padding: "10px", textAlign: "center" }}
          >
            <div className="text-2xl font-bold text-green-600">
              {totalKonfirmasi}
            </div>
            <div className="text-gray-600">Total Konfirmasi</div>
          </div>
          <div
            className="bg-white rounded-2xl p-6 shadow-lg border border-[#925E2D]/20"
            style={{ padding: "10px", textAlign: "center" }}
          >
            <div className="text-2xl font-bold text-blue-600">{totalHadir}</div>
            <div className="text-gray-600">Akan Hadir</div>
          </div>
          <div
            className="bg-white rounded-2xl p-6 shadow-lg border border-[#925E2D]/20"
            style={{ padding: "10px", textAlign: "center" }}
          >
            <div className="text-2xl font-bold text-orange-600">
              {totalMasihRagu}
            </div>
            <div className="text-gray-600">Masih Ragu</div>
          </div>
          <div
            className="bg-white rounded-2xl p-6 shadow-lg border border-[#925E2D]/20"
            style={{ padding: "10px", textAlign: "center" }}
          >
            <div className="text-2xl font-bold text-red-600">
              {totalTidakHadir}
            </div>
            <div className="text-gray-600">Tidak Hadir</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Daftar Tamu */}
          <div
            className="bg-white rounded-2xl p-6 shadow-lg border border-[#925E2D]/20"
            style={{ padding: "10px" }}
          >
            <h2 className="text-xl font-bold text-[#5a3921] mb-4">
              Daftar Tamu
            </h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {Object.entries(tamuData as TamuData).map(([key, tamu]) => (
                <div
                  key={key}
                  className="flex justify-between items-center p-3 border border-[#925E2D]/10 rounded-lg"
                >
                  <div>
                    <div className="font-semibold text-[#5a3921]">
                      {tamu.nama}
                    </div>
                    <div className="text-sm text-gray-600">
                      {tamu.keterangan}
                    </div>
                  </div>
                  <Link
                    href={`/erlin-galih/${key}`}
                    className="text-[#925E2D] hover:text-[#5a3921] text-sm"
                    target="_blank"
                  >
                    Lihat Undangan →
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Konfirmasi Terbaru */}
          <div
            className="bg-white rounded-2xl p-6 shadow-lg border border-[#925E2D]/20"
            style={{ padding: "10px" }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-[#5a3921]">
                Konfirmasi Terbaru
              </h2>
              <button
                onClick={loadConfirmations}
                className="text-sm bg-[#925E2D] text-white px-3 py-1 rounded hover:bg-[#5a3921] transition-colors"
              >
                Refresh
              </button>
            </div>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {confirmations.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  Belum ada konfirmasi
                </p>
              ) : (
                confirmations.slice(0, 200).map((confirmation, index) => (
                  <div
                    key={index}
                    className="p-3 border border-[#925E2D]/10 rounded-lg"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-semibold text-[#5a3921]">
                          {confirmation.nama}
                        </div>
                        <div className="text-sm text-gray-600">
                          {confirmation.keterangan}
                        </div>
                      </div>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          confirmation.kehadiran === "hadir"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {confirmation.kehadiran === "hadir"
                          ? "Hadir"
                          : "Tidak Hadir"}
                      </span>
                    </div>
                    {confirmation.pesan && (
                      <p className="text-sm text-gray-700 mt-2">
                        "{confirmation.pesan}"
                      </p>
                    )}
                    <div className="text-xs text-gray-500 mt-2">
                      {new Date(confirmation.tanggal).toLocaleString("id-ID")}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
