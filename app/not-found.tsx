// app/not-found.tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FDF2D6] text-center">
      <h1 className="text-6xl font-bold text-[#5a3921] mb-4">404</h1>
      <h2 className="text-2xl text-[#925E2D] mb-6">Halaman Tidak Ditemukan</h2>
      <p className="text-gray-600 mb-8 max-w-md">
        Maaf, halaman yang kamu cari tidak tersedia atau mungkin sudah
        dipindahkan.
      </p>
      <a
        href="/"
        className="bg-[#925E2D] text-white px-6 py-3 rounded-lg hover:bg-[#5a3921] transition"
        style={{ padding: "10px 20px" }}
      >
        Kembali ke Beranda
      </a>
    </div>
  );
}
