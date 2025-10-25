"use client";

import { useState, useEffect, useRef } from "react";

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
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Data foto prewedding (ganti dengan foto Anda)
  const preweddingPhotos = [
    "/images/prewedding/prewed-1.jpg",
    "/images/prewedding/prewed-2.jpg",
    "/images/prewedding/prewed-13.jpg",
    "/images/prewedding/prewed-14.jpg",
  ];

  // Auto slide
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % preweddingPhotos.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [preweddingPhotos.length]);

  // Intersection Observer untuk animasi scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fadeInUp");
          }
        });
      },
      { threshold: 0.1 }
    );

    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  // Set visible setelah component mount
  useEffect(() => {
    setIsVisible(true);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % preweddingPhotos.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + preweddingPhotos.length) % preweddingPhotos.length
    );
  };

  return (
    <div
      className={`invitation-content ${
        isVisible ? "opacity-100" : "opacity-0"
      } transition-opacity duration-1000`}
    >
      {/* Background dengan motif batik animasi */}
      <div className="batik-background"></div>

      {/* Ornamen floating */}
      <div className="floating-ornament ornament-1">🌸</div>
      <div className="floating-ornament ornament-2">✨</div>
      <div className="floating-ornament ornament-3">🎋</div>

      {/* Header */}
      <header
        ref={(el) => (sectionRefs.current[0] = el)}
        className="invitation-header section-hidden"
      >
        <div className="wayang-ornament animate-float-slow">
          <img src="/images/rama-sinta.png" alt="Wayang Ornament" />
        </div>
        <div className="header-title">
          <h1>Undangan Pernikahan</h1>
          <div className="jawa-title">ꦲꦸꦤ꧀ꦝꦔꦤ꧀ꦥꦼꦂꦤꦶꦏꦲꦤ꧀</div>
        </div>
        <div className="wayang-ornament flipped animate-float-slow">
          <img src="/images/rama-sinta.png" alt="Wayang Ornament" />
        </div>
      </header>

      {/* Konten Utama */}
      <main className="invitation-main">
        {/* Salam Pembuka */}
        <section
          ref={(el) => (sectionRefs.current[1] = el)}
          className="greeting-section section-hidden"
        >
          <div className="flower-ornament animate-bounce-slow">
            <img src="/images/bunga-kamboja.png" alt="Bunga Kamboja" />
          </div>
          <p className="greeting">
            Assalamu'alaikum Warahmatullahi Wabarakatuh
          </p>
          <p className="greeting-jawa">ꦲꦱꦭꦲꦸꦩꦸꦭꦲꦶꦑꦸꦩ꧀</p>

          <div className="guest-section">
            <p>Dengan penuh hormat, kami mengundang:</p>
            <h2 className="guest-name animate-pulse-slow">{dataTamu.nama}</h2>
            <p className="guest-category">{dataTamu.keterangan}</p>
          </div>
        </section>

        {/* Detail Acara */}
        <section
          ref={(el) => (sectionRefs.current[2] = el)}
          className="event-section section-hidden"
        >
          <h3>ꦢꦺꦠ꦳ꦺꦭ꧀ꦲꦕꦫ</h3>
          <h3>Detail Acara</h3>

          <div className="event-grid">
            <div className="event-card animate-float">
              <div className="event-icon">💒</div>
              <h4>Akad Nikah</h4>
              <p>📅 Jumat, 14 November 2025</p>
              <p>⏰ 08.30 - 10.00 WIB</p>
              <p>📍 KUA Kalikotes</p>
              <p>Kalikotes</p>
            </div>

            <div
              className="event-card animate-float"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="event-icon">🎉</div>
              <h4>Resepsi</h4>
              <p>📅 Minggu, 16 November 2025</p>
              <p>⏰ 09.00 - 12.00 WIB</p>
              <p>📍 Gedung W. Wongso Menggolo</p>
              <p>Jl. Jogja-Solo</p>
            </div>
          </div>
        </section>

        {/* Pasangan Pengantin */}
        <section
          ref={(el) => (sectionRefs.current[3] = el)}
          className="couple-section section-hidden"
        >
          <h3>ꦥ꦳ꦱꦁꦒꦤ꧀ꦥꦼꦔꦤ꧀ꦠꦶꦤ꧀</h3>
          <h3>Pasangan Pengantin</h3>

          <div className="couple-names">
            <div className="bride animate-float">
              <div className="couple-photo-frame">
                <div
                  className="couple-photo"
                  style={{ backgroundImage: "url('/images/bride.jpg')" }}
                ></div>
              </div>
              <h4>Erlina Elviana Istiqomah, S.E.</h4>
              <p>
                Putri pertama dari Bpk. Ridwan Setyawan, S.E. & Ibu Yuli
                Isruslina, S.E.
              </p>
            </div>

            <div className="and-symbol animate-heartbeat">💖</div>

            <div
              className="bridegroom animate-float"
              style={{ animationDelay: "0.3s" }}
            >
              <div className="couple-photo-frame">
                <div
                  className="couple-photo"
                  style={{ backgroundImage: "url('/images/groom.jpg')" }}
                ></div>
              </div>
              <h4>Kuncoro Galih Agung, S.Kom.</h4>
              <p>Putra pertama dari Bpk. Supriyanto & Ibu Srimiyem</p>
            </div>
          </div>
        </section>

        {/* Gallery Prewedding Slider */}
        <section
          ref={(el) => (sectionRefs.current[4] = el)}
          className="gallery-section section-hidden"
        >
          <h3>ꦒꦭꦺꦫꦶ</h3>
          <h3>Gallery Cinta Kami</h3>

          <div className="slider-container">
            <div className="slider-wrapper">
              {preweddingPhotos.map((photo, index) => (
                <div
                  key={index}
                  className={`slide ${index === currentSlide ? "active" : ""}`}
                  style={{ backgroundImage: `url(${photo})` }}
                >
                  <div className="slide-overlay"></div>
                </div>
              ))}
            </div>

            {/* Navigation Buttons */}
            <button className="slider-nav prev" onClick={prevSlide}>
              ‹
            </button>
            <button className="slider-nav next" onClick={nextSlide}>
              ›
            </button>

            {/* Dots Indicator */}
            <div className="slider-dots">
              {preweddingPhotos.map((_, index) => (
                <button
                  key={index}
                  className={`dot ${index === currentSlide ? "active" : ""}`}
                  onClick={() => setCurrentSlide(index)}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Konfirmasi Kehadiran */}
        <section
          ref={(el) => (sectionRefs.current[5] = el)}
          className="confirmation-section section-hidden"
        >
          <h3>Konfirmasi Kehadiran</h3>
          <p className="guest-count">
            Jumlah tamu: {dataTamu.jumlahTamu} orang
          </p>
          <a
            href={`https://wa.me/6281234567890?text=Halo,%20saya%20${encodeURIComponent(
              dataTamu.nama
            )}%20akan%20hadir%20dengan%20${dataTamu.jumlahTamu}%20orang`}
            className="whatsapp-btn animate-pulse-slow"
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
