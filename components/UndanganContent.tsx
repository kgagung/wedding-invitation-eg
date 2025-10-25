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
  const [showAmplop, setShowAmplop] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Data foto prewedding
  const preweddingPhotos = [
    "/images/prewedding/prewed-1.jpg",
    "/images/prewedding/prewed-2.jpg",
    "/images/prewedding/prewed-13.jpg",
    "/images/prewedding/prewed-14.jpg",
  ];

  // Initialize audio
  useEffect(() => {
    audioRef.current = new Audio("/audio/gamelan.mp3");
    audioRef.current.loop = true;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  // Auto play music when component mounts
  useEffect(() => {
    const playMusic = async () => {
      if (audioRef.current) {
        try {
          await audioRef.current.play();
          setIsPlaying(true);
        } catch (error) {
          console.log("Auto-play was prevented");
          // User interaction required
        }
      }
    };

    playMusic();
  }, []);

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  // Countdown timer
  useEffect(() => {
    const calculateTimeLeft = () => {
      const resepsiDate = new Date("2025-11-16T09:00:00");
      const now = new Date();
      const difference = resepsiDate.getTime() - now.getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor(
            (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          ),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, []);

  // Auto slide untuk gallery
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % preweddingPhotos.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [preweddingPhotos.length]);

  // Enhanced Intersection Observer dengan staggered animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = sectionRefs.current.findIndex(
              (ref) => ref === entry.target
            );
            // Staggered delay berdasarkan index section
            const delay = index * 200;
            setTimeout(() => {
              entry.target.classList.add("animate-fadeInUp");
            }, delay);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  // Set visible setelah component mount dengan delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % preweddingPhotos.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + preweddingPhotos.length) % preweddingPhotos.length
    );
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      // Show custom notification instead of alert
      const notification = document.createElement("div");
      notification.className = "copy-notification show";
      notification.textContent = "Berhasil disalin!";
      document.body.appendChild(notification);

      setTimeout(() => {
        notification.remove();
      }, 2000);
    });
  };

  return (
    <div
      className={`invitation-content enhanced-animations ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Enhanced Background dengan multiple layers */}
      <div className="background-layers">
        <div className="bg-layer-1 batik-background"></div>
        <div className="bg-layer-2 gradient-overlay"></div>
      </div>

      {/* Enhanced Floating Ornaments dengan berbagai animasi */}
      <div className="floating-ornaments">
        <div className="floating-ornament ornament-1 animate-float-slow">
          🌸
        </div>
        <div className="floating-ornament ornament-2 animate-float-medium">
          ✨
        </div>
        <div className="floating-ornament ornament-3 animate-float-fast">
          🎋
        </div>
        <div className="floating-ornament ornament-4 animate-bounce-slow">
          💮
        </div>
        <div className="floating-ornament ornament-5 animate-pulse-slow">
          🌺
        </div>
      </div>

      {/* Music Toggle Button */}
      <button
        className={`music-toggle-btn ${
          isPlaying ? "playing" : ""
        } animate-pulse-slow`}
        onClick={toggleMusic}
      >
        {isPlaying ? "🔇" : "🎵"}
      </button>

      {/* Konten Utama */}
      <main
        className="invitation-main relative"
        style={{
          backgroundImage: 'url("/images/BG-1-Temaa-11.webp")',
          backgroundRepeat: "repeat",
          backgroundSize: "contain",
        }}
      >
        {/* Section Pertama (Header tanpa margin) */}
        <section
          ref={(el) => {
            sectionRefs.current[0] = el as HTMLDivElement;
          }}
          className="invitation-header-new relative overflow-hidden w-full section-hidden"
          style={{ marginTop: "-800px," }}
        >
          {/* Awan Bawah foto 1 */}
          <img
            src="/images/cloud3-Tema-11.webp"
            alt="Cloud Left"
            className="absolute bottom-100 right-10 w-25 md:w-40 animate-cloud-down-right opacity-90 z-20"
          />

          {/* Awan Bawah foto 2 */}
          <img
            src="/images/cloud2-Tema-11-1024x509.webp"
            alt="Cloud Right"
            className="absolute bottom-80 left-75 w-40 md:w-60 animate-cloud-down-right opacity-90 z-20"
          />

          {/* Awan Bawah foto 3 */}
          <img
            src="/images/cloud2-Tema-11-1024x509.webp"
            alt="Cloud Right"
            className="absolute bottom-115 left-60 w-40 md:w-60 animate-cloud-down-right opacity-90 z-20"
          />

          {/* Awan sebelah kiri */}
          <img
            src="/images/cloud2-Tema-11-1024x509.webp"
            alt="Cloud Right"
            className="absolute bottom-10 right-85 w-20 md:w-40 animate-cloud-down-right z-20"
          />

          <img
            src="/images/cloud2-Tema-11-1024x509.webp"
            alt="Cloud Right"
            className="absolute bottom-20 right-85 w-40 md:w-60 animate-cloud-down-right z-15"
          />

          <img
            src="/images/rama-sinta.png"
            alt="Wayang Ornament"
            className="absolute bottom-20 right-65 w-30 md:w-50 animate-float-slow z-10"
          />

          {/* Konten header */}
          <div className="header-content flex justify-between items-start md:items-center w-full px-4 md:px-8 py-4 md:py-6 relative z-10">
            {/* Kiri - Nama & Tanggal */}
            <div
              className="header-text flex flex-col items-center justify-center text-white rounded-b-2xl shadow-md"
              style={{
                backgroundColor: "#925E2D",
                width: "140px",
                height: "500px",
                marginTop: "-160px",
                marginLeft: "20px",
                marginRight: "20px",
              }}
            >
              <h1
                className="text-xl md:text-2xl font-semibold text-center mt-4"
                style={{ marginTop: "70px" }}
              >
                ERLINA
                <br /> &
                <br />
                GALIH
              </h1>
              <p
                className="text-xs md:text-sm"
                style={{
                  marginTop: "8px",
                }}
              >
                Save Our Date
              </p>
              <div
                className="mt-0 pt-1 text-center"
                style={{ marginTop: "12px" }}
              >
                <h2 className="text-lg font-bold leading-none">16</h2>
                <h2 className="text-lg font-bold leading-none">11</h2>
                <h2 className="text-lg font-bold leading-none">'25</h2>
              </div>
            </div>

            {/* Kanan - Foto */}
            <div
              className="header-photo relative w-40 h-60 md:w-40 md:h-80 rounded-2xl overflow-hidden shadow-xl border-8 border-[#5a3921] z-20"
              style={{ marginRight: "20px" }}
            >
              <img
                src="/images/prewedding/prewed-15.jpg"
                alt="Foto Pasangan"
                className="object-cover w-full h-full"
              />
            </div>
          </div>
          <div
            className="greeting-content"
            style={{
              marginTop: "120px",
              marginLeft: "40%",
              marginRight: "20px",
            }}
          >
            <p className="invitation-text animate-fadeInUp-slow">
              Assalamu'alaikum Wr. Wb. Dengan memohon Rahmat dan Ridho Allah SWT
              yang telah menciptakan Makhluk-Nya secara berpasang-pasangan, kami
              bermaksud menyelenggarakan pernikahan pada
            </p>
          </div>

          <p
            className="countdown-date animate-fadeInUp-slow"
            style={{ marginLeft: "40%", marginRight: "20px" }}
          >
            Minggu, 16 November 2025
          </p>

          <div
            className="countdown-timer animate-bounce-in"
            style={{
              marginRight: "10px",
              marginLeft: "30%",
              marginTop: "-20px",
            }}
          >
            {Object.entries(timeLeft).map(([key, value]) => (
              <div key={key} className="countdown-item">
                <div className="countdown-number-wrapper">
                  <span className="countdown-number animate-flip">
                    {value.toString().padStart(2, "0")}
                  </span>
                </div>
                <span className="countdown-label">
                  {key === "days" && "Hari"}
                  {key === "hours" && "Jam"}
                  {key === "minutes" && "Menit"}
                  {key === "seconds" && "Detik"}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Salam Pembuka dengan enhanced entrance */}
        <section
          ref={(el) => {
            sectionRefs.current[1] = el as HTMLDivElement;
          }}
          className="greeting-section section-hidden enhanced-card"
        >
          <div className="section-decoration top"></div>

          <div className="flower-ornament animate-bounce-slow">
            <img src="/images/bunga-biru.png" alt="Bunga biru" />
          </div>

          <div className="greeting-content">
            <p className="greeting animate-fadeInUp-slow">
              Assalamu'alaikum Warahmatullahi Wabarakatuh
            </p>
            <p className="greeting-jawa animate-fadeInUp-slower">
              ꦲꦱꦭꦲꦸꦩꦸꦭꦲꦶꦑꦸꦩ꧀
            </p>

            <div className="guest-section animate-scale-in">
              <p className="invitation-text">
                Dengan penuh hormat, kami mengundang:
              </p>
              <h2 className="guest-name animate-pulse-gentle">
                {dataTamu.nama}
              </h2>
              <p className="guest-category">{dataTamu.keterangan}</p>
            </div>
          </div>

          <div className="section-decoration bottom"></div>
        </section>

        {/* Ayat Al-Quran dengan elegant animation */}
        <section
          ref={(el) => {
            sectionRefs.current[2] = el as HTMLDivElement;
          }}
          className="quran-section section-hidden enhanced-card quran-card"
        >
          <div className="quran-icon animate-rotate-slow">📖</div>
          <div className="quran-content">
            <p className="quran-verse animate-typewriter">
              "Dan di antara tanda-tanda kekuasaan-Nya diciptakan-Nya untukmu
              pasangan hidup dari jenismu sendiri supaya kamu dapat ketenangan
              hati dan dijadikannya kasih sayang di antara kamu. Sesungguhnya
              yang demikian menjadi tanda-tanda kebesaran-Nya bagi orang-orang
              yang berpikir."
            </p>
            <p className="quran-source animate-fadeInUp-delayed">
              - Q.S. Ar-Rum: 21 -
            </p>
          </div>
        </section>

        {/* Countdown Timer dengan digital animation */}
        <section
          ref={(el) => {
            sectionRefs.current[3] = el as HTMLDivElement;
          }}
          className="countdown-section section-hidden enhanced-card countdown-card"
        >
          <h3 className="countdown-title animate-slideIn-left">
            Count The Date
          </h3>
          <p className="countdown-description animate-slideIn-right">
            Siang dan malam berganti begitu cepat, diantara saat saat
            mendebarkan yang belum pernah kami rasakan sebelum nya. kami
            nantikan kehadiran para keluarga dan sahabat, untuk menjadi saksi
            ikrar janji suci kami di hari yang bahagia:
          </p>

          <div className="countdown-timer animate-bounce-in">
            {Object.entries(timeLeft).map(([key, value]) => (
              <div key={key} className="countdown-item">
                <div className="countdown-number-wrapper">
                  <span className="countdown-number animate-flip">
                    {value.toString().padStart(2, "0")}
                  </span>
                </div>
                <span className="countdown-label">
                  {key === "days" && "Hari"}
                  {key === "hours" && "Jam"}
                  {key === "minutes" && "Menit"}
                  {key === "seconds" && "Detik"}
                </span>
              </div>
            ))}
          </div>

          <p className="countdown-date animate-fadeInUp-slow">
            Menuju Resepsi Pernikahan - 16 November 2025
          </p>
        </section>

        {/* Detail Acara dengan card animations */}
        <section
          ref={(el) => {
            sectionRefs.current[4] = el as HTMLDivElement;
          }}
          className="event-section section-hidden enhanced-card"
        >
          <h3 className="section-title-aksara animate-fadeInUp">ꦢꦺꦠ꦳ꦺꦭ꧀ꦲꦕꦫ</h3>
          <h3 className="section-title animate-fadeInUp-delayed">
            Detail Acara
          </h3>

          <div className="event-grid">
            <div className="event-card animate-float-hover">
              <div className="event-icon animate-bounce-slow">💒</div>
              <h4>Akad Nikah</h4>
              <div className="event-details">
                <p>📅 Jumat, 14 November 2025</p>
                <p>⏰ 08.30 - 10.00 WIB</p>
                <p>📍 KUA Kalikotes</p>
                <p>Kalikotes</p>
              </div>
              <div className="event-decoration"></div>
            </div>

            <div className="event-card animate-float-hover-delayed">
              <div className="event-icon animate-bounce-slow-delayed">🎉</div>
              <h4>Resepsi</h4>
              <div className="event-details">
                <p>📅 Minggu, 16 November 2025</p>
                <p>⏰ 09.00 - 12.00 WIB</p>
                <p>📍 Gedung W. Wongso Menggolo</p>
                <p>Jl. Jogja-Solo</p>
              </div>
              <div className="event-decoration"></div>
            </div>
          </div>
        </section>

        {/* Pasangan Pengantin dengan photo animations */}
        <section
          ref={(el) => {
            sectionRefs.current[5] = el as HTMLDivElement;
          }}
          className="couple-section section-hidden enhanced-card"
        >
          <h3 className="section-title-aksara animate-fadeInUp">
            ꦥ꦳ꦱꦁꦒꦤ꧀ꦥꦼꦔꦤ꧀ꦠꦶꦤ꧀
          </h3>
          <h3 className="section-title animate-fadeInUp-delayed">
            Pasangan Pengantin
          </h3>

          <div className="couple-names">
            <div className="bride animate-slideIn-left">
              <div className="couple-photo-frame animate-rotate-3d">
                <div
                  className="couple-photo"
                  style={{ backgroundImage: "url('/images/bride.jpg')" }}
                ></div>
                <div className="photo-glow"></div>
              </div>
              <div className="couple-info">
                <h4>Erlina Elviana Istiqomah, S.E.</h4>
                <p>
                  Putri pertama dari Bpk. Ridwan Setyawan, S.E. & Ibu Yuli
                  Isruslina, S.E.
                </p>
              </div>
            </div>

            <div className="and-symbol animate-heartbeat">💖</div>

            <div className="bridegroom animate-slideIn-right">
              <div className="couple-photo-frame animate-rotate-3d-delayed">
                <div
                  className="couple-photo"
                  style={{ backgroundImage: "url('/images/groom.jpg')" }}
                ></div>
                <div className="photo-glow"></div>
              </div>
              <div className="couple-info">
                <h4>Kuncoro Galih Agung, S.Kom.</h4>
                <p>Putra pertama dari Bpk. Supriyanto & Ibu Srimiyem</p>
              </div>
            </div>
          </div>
        </section>

        {/* Gallery Prewedding Slider dengan enhanced transitions */}
        <section
          ref={(el) => {
            sectionRefs.current[6] = el as HTMLDivElement;
          }}
          className="gallery-section section-hidden enhanced-card"
        >
          <h3 className="section-title-aksara animate-fadeInUp">ꦒꦭꦺꦫꦶ</h3>
          <h3 className="section-title animate-fadeInUp-delayed">
            Gallery Cinta Kami
          </h3>

          <div className="slider-container enhanced-slider">
            <div className="slider-wrapper">
              {preweddingPhotos.map((photo, index) => (
                <div
                  key={index}
                  className={`slide ${index === currentSlide ? "active" : ""} ${
                    index === currentSlide
                      ? "animate-zoom-in"
                      : "animate-zoom-out"
                  }`}
                  style={{ backgroundImage: `url(${photo})` }}
                >
                  <div className="slide-overlay animate-fadeIn-slow"></div>
                  <div className="slide-number">
                    {index + 1} / {preweddingPhotos.length}
                  </div>
                </div>
              ))}
            </div>

            {/* Enhanced Navigation Buttons */}
            <button
              className="slider-nav prev animate-bounce-horizontal"
              onClick={prevSlide}
            >
              <span>‹</span>
            </button>
            <button
              className="slider-nav next animate-bounce-horizontal"
              onClick={nextSlide}
            >
              <span>›</span>
            </button>

            {/* Enhanced Dots Indicator */}
            <div className="slider-dots">
              {preweddingPhotos.map((_, index) => (
                <button
                  key={index}
                  className={`dot ${
                    index === currentSlide
                      ? "active animate-pulse"
                      : "animate-fadeIn"
                  }`}
                  onClick={() => setCurrentSlide(index)}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Amplop Digital dengan toggle animation */}
        <section
          ref={(el) => {
            sectionRefs.current[7] = el as HTMLDivElement;
          }}
          className="amplop-section section-hidden enhanced-card"
        >
          <h3 className="section-title animate-fadeInUp">Amplop Digital</h3>
          <p className="amplop-description animate-fadeInUp-delayed">
            Doa Restu Anda merupakan karunia yang sangat berarti bagi kami.
            Namun jika memberi adalah ungkapan tanda kasih Anda, Anda dapat
            memberi kado secara cashless.
          </p>

          <button
            className={`amplop-toggle-btn ${
              showAmplop ? "active" : ""
            } animate-bounce-gentle`}
            onClick={() => setShowAmplop(!showAmplop)}
          >
            <span className="btn-content">
              {showAmplop ? "✕ Tutup Amplop" : "🎁 Buka Amplop Digital"}
            </span>
            <span className="btn-arrow">{showAmplop ? "↑" : "↓"}</span>
          </button>

          <div className={`amplop-content-wrapper ${showAmplop ? "show" : ""}`}>
            {showAmplop && (
              <div className="amplop-content animate-expand">
                {/* Bank 1 */}
                <div className="bank-card animate-slideIn-left">
                  <div className="bank-header">
                    <img
                      src="/images/bca-logo.png"
                      alt="BCA"
                      className="bank-logo animate-bounce-slow"
                    />
                    <div className="bank-info">
                      <p className="bank-name">a.n Erlina Elviana Istiqomah</p>
                      <p className="account-number">1380 0123 4567 8901</p>
                    </div>
                  </div>
                  <button
                    className="copy-btn animate-pulse-gentle"
                    onClick={() => copyToClipboard("1380012345678901")}
                  >
                    📋 Salin No. Rekening
                  </button>
                </div>

                {/* Bank 2 */}
                <div className="bank-card animate-slideIn-right">
                  <div className="bank-header">
                    <img
                      src="/images/bri-logo.png"
                      alt="BRI"
                      className="bank-logo animate-bounce-slow-delayed"
                    />
                    <div className="bank-info">
                      <p className="bank-name">a.n Kuncoro Galih Agung</p>
                      <p className="account-number">3401 0123 4567 8901</p>
                    </div>
                  </div>
                  <button
                    className="copy-btn animate-pulse-gentle"
                    onClick={() => copyToClipboard("3401012345678901")}
                  >
                    📋 Salin No. Rekening
                  </button>
                </div>

                {/* E-Wallet */}
                <div className="bank-card animate-slideIn-left-delayed">
                  <div className="bank-header">
                    <img
                      src="/images/gopay-logo.png"
                      alt="Gopay"
                      className="bank-logo animate-bounce-slow"
                    />
                    <div className="bank-info">
                      <p className="bank-name">a.n Erlina Elviana Istoqomah</p>
                      <p className="account-number">0838 5272 1234</p>
                    </div>
                  </div>
                  <button
                    className="copy-btn animate-pulse-gentle"
                    onClick={() => copyToClipboard("083852721234")}
                  >
                    📋 Salin No. e-wallet
                  </button>
                </div>

                {/* Alamat */}
                <div className="address-card animate-slideIn-right-delayed">
                  <div className="address-icon animate-bounce-slow">🏠</div>
                  <div className="address-info">
                    <p className="address-title">Kirimkan Hadiah kepada</p>
                    <p className="address-name">MEMPELAI</p>
                    <p className="address-detail">
                      Jl. Prigi Wetan No. 123, Kalikotes, Klaten, Jawa Tengah
                    </p>
                  </div>
                  <button
                    className="copy-btn animate-pulse-gentle"
                    onClick={() =>
                      copyToClipboard(
                        "Jl. Prigi Wetan No. 123, Kalikotes, Klaten, Jawa Tengah"
                      )
                    }
                  >
                    📋 Salin Alamat
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Konfirmasi Kehadiran dengan WhatsApp integration */}
        <section
          ref={(el) => {
            sectionRefs.current[8] = el as HTMLDivElement;
          }}
          className="confirmation-section section-hidden enhanced-card"
        >
          <h3 className="section-title animate-fadeInUp">
            Konfirmasi Kehadiran
          </h3>
          <p className="guest-count animate-fadeInUp-delayed">
            Jumlah tamu:{" "}
            <span className="highlight">{dataTamu.jumlahTamu}</span> orang
          </p>
          <a
            href={`https://wa.me/6281234567890?text=Halo,%20saya%20${encodeURIComponent(
              dataTamu.nama
            )}%20akan%20hadir%20dengan%20${dataTamu.jumlahTamu}%20orang`}
            className="whatsapp-btn animate-pulse-gentle"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="btn-icon">💬</span>
            <span className="btn-text">Konfirmasi via WhatsApp</span>
            <span className="btn-arrow">→</span>
          </a>
        </section>
      </main>

      {/* Enhanced Footer */}
      <footer className="invitation-footer enhanced-footer">
        <div className="footer-decoration top"></div>

        <div className="footer-content">
          <p className="footer-aksara animate-fadeInUp">
            ꦩꦠꦸꦂꦤꦸꦮꦸꦤ꧀ꦲꦶꦁꦒꦼꦃꦲꦸꦠꦮꦶꦫꦤꦺꦴꦩꦠꦼꦱ꧀ꦱꦶ
          </p>
          <p className="footer-text animate-fadeInUp-delayed">
            Matur nuwun ingkang gegah utawi rinomatosi
          </p>
          <p className="footer-text-sub animate-fadeInUp-slower">
            Terima kasih atas perhatiannya
          </p>
        </div>

        <div className="footer-couple animate-bounce-very-slow">
          <span>Erlina & Kuncoro</span>
        </div>

        <div className="footer-decoration bottom"></div>
      </footer>

      {/* Custom Notification */}
      <div className="notification-container"></div>
    </div>
  );
}
