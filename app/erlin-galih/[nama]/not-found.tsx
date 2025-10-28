// app/not-found.tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: 'url("/images/BG-1-Temaa-11.webp")',
        backgroundRepeat: "repeat",
        backgroundSize: "contain",
      }}
    >
      <div
        className="text-center bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-[#925E2D]/20 max-w-md mx-4"
        style={{ padding: "10px 20px" }}
      >
        <div className="mb-6">
          <div className="text-6xl mb-4">❌</div>
          <h1
            className="text-2xl font-bold mb-2"
            style={{
              fontFamily: '"Cinzel Decorative", Sans-serif',
              color: "#5a3921",
            }}
          >
            Undangan Tidak Ditemukan
          </h1>
          <p className="text-gray-600 mb-4">
            Maaf, undangan yang Anda cari tidak ditemukan atau sudah tidak
            berlaku.
          </p>
        </div>

        <div className="space-y-4">
          <Link
            href="/"
            className="block w-full bg-[#925E2D] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#5a3921] transition-all duration-300 shadow-lg hover:shadow-xl"
            style={{ padding: "10px 20px" }}
          >
            Kembali ke Halaman Utama
          </Link>

          <p className="text-sm text-gray-500">
            Jika Anda merasa ini kesalahan, silakan hubungi mempelai.
          </p>
        </div>
      </div>
    </div>
  );
}
