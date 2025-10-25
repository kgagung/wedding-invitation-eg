import Link from 'next/link';
import tamuData from '../data/tamu.json';

export default function HomePage() {
  return (
    <div className="container">
      <div className="batik-background"></div>
      
      <header className="header">
        <h1 className="title">Undangan Pernikahan</h1>
        <div className="jawa-title">ꦲꦸꦤ꧀ꦝꦔꦤ꧀ꦥꦼꦂꦤꦶꦏꦲꦤ꧀</div>
      </header>

      <main className="main-content">
        <section className="salam-section">
          <p>Selamat datang di undangan pernikahan kami</p>
          <p>Silakan pilih nama tamu:</p>
          
          <div className="tamu-list">
            {Object.entries(tamuData).map(([key, tamu]) => (
              <Link key={key} href={`/${key}`} className="tamu-link">
                {tamu.nama} <br></br>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}