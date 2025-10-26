// Ganti komponen PesanTamuSection dengan ini:
const PesanTamuSection = () => {
  return (
    <section
      ref={(el) => {
        sectionRefs.current[10] = el as HTMLDivElement;
      }}
      className="pesan-tamu-section section-hidden enhanced-card py-12 bg-[#FDF2D6]"
    >
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h2
            className="text-3xl font-bold mb-4"
            style={{
              fontFamily: '"Cinzel Decorative", Sans-serif',
              color: "#5a3921",
            }}
          >
            Ucapan & Doa
          </h2>
          <div className="w-24 h-1 bg-[#925E2D] mx-auto rounded-full"></div>
          <p className="text-[#5a3921] mt-4 opacity-80">
            Doa dan ucapan dari keluarga & sahabat
          </p>
        </div>

        {/* Grid Pesan */}
        {loadingPesan ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#925E2D] mx-auto"></div>
            <p className="text-[#5a3921] mt-2">Memuat pesan...</p>
          </div>
        ) : pesanTamu.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">💌</div>
            <p className="text-[#5a3921] text-lg">
              Jadilah yang pertama mengirimkan ucapan!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pesanTamu.map((tamu) => (
              <div
                key={tamu.id}
                className="bg-white rounded-2xl shadow-lg p-6 border border-[#925E2D]/20 hover:shadow-xl transition-all duration-300"
              >
                {/* Header Pesan */}
                <div className="flex items-start space-x-3 mb-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#925E2D] to-[#5a3921] rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {tamu.nama.charAt(0)}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-[#5a3921]">
                      {tamu.nama}
                    </h4>
                    <p className="text-xs text-gray-500">
                      {tamu.keterangan} •{" "}
                      {new Date(tamu.tanggal).toLocaleDateString("id-ID")}
                    </p>
                  </div>
                </div>

                {/* Isi Pesan */}
                <div className="bg-[#FDF2D6]/50 rounded-lg p-4 border border-[#925E2D]/10">
                  <p className="text-[#5a3921] leading-relaxed text-sm">
                    "{tamu.pesan}"
                  </p>
                </div>

                {/* Footer */}
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-[#925E2D]/10">
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      tamu.kehadiran === "hadir"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {tamu.kehadiran === "hadir"
                      ? "✓ Akan Hadir"
                      : "Tidak Hadir"}
                  </span>
                  <span className="text-xs text-gray-400">
                    {tamu.jumlahTamu} orang
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Refresh Button */}
        <div className="text-center mt-8">
          <button
            onClick={loadPesanTamu}
            className="inline-flex items-center space-x-2 bg-[#925E2D] text-white px-6 py-3 rounded-full hover:bg-[#5a3921] transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <span>🔄</span>
            <span>Muat Ulang Pesan</span>
          </button>
        </div>
      </div>
    </section>
  );
};
