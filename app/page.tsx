import Link from "next/link";
import tamuData from "../data/tamu.json";

export default function HomePage() {
  return (
    <div className="home-container">
      {/* Animated Background */}
      <div className="animated-background">
        <div className="floating-petal petal-1">🌸</div>
        <div className="floating-petal petal-2">✨</div>
        <div className="floating-petal petal-3">🎋</div>
        <div className="floating-petal petal-4">💮</div>
      </div>

      {/* Main Content */}
      <div className="home-content">
        <header className="home-header">
          <div className="header-ornament left">
            <div className="ornament-circle"></div>
          </div>
          <div className="header-main">
            <h1 className="home-title">Undangan Pernikahan</h1>
            <div className="jawa-subtitle">ꦲꦸꦤ꧀ꦝꦔꦤ꧀ꦥꦼꦂꦤꦶꦏꦲꦤ꧀</div>
          </div>
          <div className="header-ornament right">
            <div className="ornament-circle"></div>
          </div>
        </header>

        <main className="home-main">
          <section className="welcome-section">
            <div className="welcome-card">
              <div className="card-decoration top"></div>

              <div className="welcome-icon">💌</div>

              <h2 className="welcome-title">Selamat Datang</h2>

              <p className="welcome-message">Di undangan pernikahan kami</p>

              <div className="divider">
                <span className="divider-line"></span>
                <span className="divider-flower">🌺</span>
                <span className="divider-line"></span>
              </div>

              <p className="instruction">Silakan pilih nama tamu:</p>

              <div className="guest-list">
                {Object.entries(tamuData).map(([key, tamu]) => (
                  <Link key={key} href={`/${key}`} className="guest-link">
                    <span className="guest-name">{tamu.nama}</span>
                    <span className="guest-relation">{tamu.keterangan}</span>
                    <div className="link-arrow">→</div>
                  </Link>
                ))}
              </div>

              <div className="card-decoration bottom"></div>
            </div>
          </section>

          {/* Footer */}
          <footer className="home-footer">
            <p className="footer-text">Dengan hormat yang setinggi-tingginya</p>
            <p className="footer-couple">Erlina & Kuncoro</p>
          </footer>
        </main>
      </div>
    </div>
  );
}
