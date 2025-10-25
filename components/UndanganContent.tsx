interface TamuData {
  nama: string;
  jumlahTamu: number;
  salam: string;
  keterangan: string;
}

interface UndanganContentProps {
  dataTamu: TamuData;
}

export default function UndanganContent({ dataTamu }: UndanganContentProps) {
  return (
    <div className="invitation-content">
      {/* Background dengan motif batik */}
      <div className="batik-background"></div>

      {/* Header */}
      <header className="invitation-header">
        <div className="wayang-ornament">
          <img src="/images/rama-sinta.png" alt="Wayang Ornament" />
        </div>
        <div className="header-title">
          <h1>Undangan Pernikahan</h1>
          <div className="jawa-title">ꦲꦸꦤ꧀ꦝꦔꦤ꧀ꦥꦼꦂꦤꦶꦏꦲꦤ꧀</div>
        </div>
        <div className="wayang-ornament flipped">
          <img src="/images/rama-sinta.png" alt="Wayang Ornament" />
        </div>
      </header>

      {/* Konten Utama */}
      <main className="invitation-main">
        {/* Salam Pembuka */}
        <section className="greeting-section">
          <div className="flower-ornament">
            <img src="/images/bunga-kamboja.png" alt="Bunga Kamboja" />
          </div>
          <p className="greeting">
            Assalamu'alaikum Warahmatullahi Wabarakatuh
          </p>
          <p className="greeting-jawa">ꦲꦱꦭꦲꦸꦩꦸꦭꦲꦶꦑꦸꦩ꧀</p>

          <div className="guest-section">
            <p>Dengan penuh hormat, kami mengundang:</p>
            <h2 className="guest-name">{dataTamu.nama}</h2>
            <p className="guest-category">{dataTamu.keterangan}</p>
          </div>
        </section>

        {/* Detail Acara */}
        <section className="event-section">
          <h3>ꦢꦺꦠ꦳ꦺꦭ꧀ꦲꦕꦫ</h3>
          <h3>Detail Acara</h3>

          <div className="event-grid">
            <div className="event-card">
              <h4>Akad Nikah</h4>
              <p>📅 Jumat, 14 November 2025</p>
              <p>⏰ 08.30 - 10.00 WIB</p>
              <p>📍 KUA Kalikotes</p>
              <p>Kalikotes</p>
            </div>

            <div className="event-card">
              <h4>Resepsi</h4>
              <p>📅 Minggu, 16 November 2025</p>
              <p>⏰ 09.00 - 12.00 WIB</p>
              <p>📍 Gedung W. Wongso Menggolo</p>
              <p>Jl. Jogja-Solo</p>
            </div>
          </div>
        </section>

        {/* Pasangan Pengantin */}
        <section className="couple-section">
          <h3>ꦥ꦳ꦱꦁꦒꦤ꧀ꦥꦼꦔꦤ꧀ꦠꦶꦤ꧀</h3>
          <h3>Pasangan Pengantin</h3>

          <div className="couple-names">
            <div className="bride">
              <h4>Erlina Elviana Istiqomah, S.E.</h4>
              <p>
                Putri pertama dari Bpk. Ridwan Setyawan, S.E. & Ibu Yuli
                Isruslina, S.E.
              </p>
            </div>

            <div className="and-symbol">&</div>

            <div className="bridegroom">
              <h4>Kuncoro Galih Agung, S.Kom.</h4>
              <p>Putra pertama dari Bpk. Supriyanto & Ibu Srimiyem</p>
            </div>
          </div>
        </section>

        {/* Konfirmasi Kehadiran */}
        <section className="confirmation-section">
          <h3>Konfirmasi Kehadiran</h3>
          <p>Jumlah tamu: {dataTamu.jumlahTamu} orang</p>
          <a
            href={`https://wa.me/6281234567890?text=Halo,%20saya%20${encodeURIComponent(
              dataTamu.nama
            )}%20akan%20hadir%20dengan%20${dataTamu.jumlahTamu}%20orang`}
            className="whatsapp-btn"
            target="_blank"
            rel="noopener noreferrer"
          >
            💬 Konfirmasi via WhatsApp
          </a>
        </section>
      </main>

      <footer className="invitation-footer">
        <p>ꦩꦠꦸꦂꦤꦸꦮꦸꦤ꧀ꦲꦶꦁꦒꦼꦃꦲꦸꦠꦮꦶꦫꦤꦺꦴꦩꦠꦼꦱ꧀ꦱꦶ</p>
        <p>Matur nuwun ingkang gegah utawi rinomatosi</p>
        <p>Terima kasih atas perhatiannya</p>
      </footer>
    </div>
  );
}
