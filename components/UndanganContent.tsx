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
            className="absolute top-65 right-10 w-40 animate-cloud-down-right opacity-90 z-20"
          />

          {/* Awan Bawah foto 2 */}
          <img
            src="/images/cloud2-Tema-11-1024x509.webp"
            alt="Cloud Right"
            className="absolute top-75 left-75 w-60 animate-cloud-down-right opacity-90 z-20"
          />

          {/* Awan Bawah foto 3 */}
          <img
            src="/images/cloud2-Tema-11-1024x509.webp"
            alt="Cloud Right"
            className="absolute top-45 left-70 w-60 animate-cloud-down-right opacity-90 z-20"
          />

          {/* Awan sebelah kiri */}
          <img
            src="/images/cloud2-Tema-11-1024x509.webp"
            alt="Cloud Right"
            className="absolute bottom-10 right-85 w-40 animate-cloud-down-right z-20"
          />

          <img
            src="/images/cloud2-Tema-11-1024x509.webp"
            alt="Cloud Right"
            className="absolute bottom-20 right-78 w-60 animate-cloud-down-right z-15"
          />

          <img
            src="/images/cloud3-Tema-11.webp"
            alt="Cloud Left"
            className="absolute bottom-20 right-75 w-20 animate-cloud-down-right z-15"
          />

          <img
            src="/images/rama-sinta.png"
            alt="Wayang Ornament"
            className="absolute bottom-20 right-65 w-50 animate-float-slow z-10"
          />

          {/* Konten header */}
          <div className="header-content flex justify-between items-start md:items-center w-full px-4 md:px-8 py-4 md:py-6 relative z-10">
            {/* Kiri - Nama & Tanggal */}
            <div
              className="header-text flex flex-col items-center justify-center rounded-b-2xl shadow-md"
              style={{
                backgroundColor: "#925E2D",
                width: "180px",
                height: "450px",
                marginTop: "-100px",
                marginLeft: "20px",
                marginRight: "20px",
              }}
            >
              <h1
                className="text-center mt-4"
                style={{
                  fontFamily: '"Cinzel Decorative", Sans-serif',
                  fontSize: "28px",
                  fontWeight: 600,
                  color: "#FDF2D6",
                  marginTop: "70px",
                  lineHeight: "1.2",
                }}
              >
                ERLINA
                <br /> &<br />
                GALIH
              </h1>

              <p
                className="text-xs md:text-sm"
                style={{
                  marginTop: "30px",
                  color: "#FDF2D6",
                }}
              >
                Save Our Date
              </p>

              <div className="mt-0 pt-1 text-center">
                <p
                  className="leading-none"
                  style={{
                    fontSize: "32pt",
                    color: "#FDF2D6",
                  }}
                >
                  16
                </p>
                <p
                  className="leading-none"
                  style={{
                    fontSize: "32pt",
                    color: "#FDF2D6",
                  }}
                >
                  11
                </p>
                <p
                  className="leading-none"
                  style={{
                    fontSize: "32pt",
                    color: "#FDF2D6",
                  }}
                >
                  '25
                </p>
              </div>
            </div>

            {/* Kanan - Foto */}
            <div
              className="header-photo relative w-40 h-80 rounded-2xl overflow-hidden shadow-xl border-8 border-[#5a3921] z-20"
              style={{ marginRight: "20px", marginTop: "20px" }}
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

        <div
          style={{
            backgroundColor: "#5a3921",
            height: "60px", // ubah sesuai kebutuhan (misal 100px, 150px, dst)
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#FDF2D6", // warna teks biar kontras
          }}
        >
          <h1
            style={{
              fontFamily: '"Cinzel Decorative", Sans-serif',
              fontSize: "16px",
              fontWeight: 600,
              margin: 0, // hapus margin default <h1>
            }}
          >
            Kedua Mempelai
          </h1>
        </div>

        {/* Salam Pembuka dengan enhanced entrance */}
        <section
          ref={(el) => {
            sectionRefs.current[1] = el as HTMLDivElement;
          }}
          className="greeting-section relative overflow-hidden w-full section-hidden"
        >
          {/* Awan Bawah foto 1 */}
          <img
            src="/images/cloud3-Tema-11.webp"
            alt="Cloud Left"
            className="absolute top-70 right-10 w-40 animate-float-medium z-20"
          />

          {/* Awan Bawah foto 2 */}
          <img
            src="/images/cloud2-Tema-11-1024x509.webp"
            alt="Cloud Right"
            className="absolute top-50 left-70 w-60 animate-float-medium z-20"
          />

          {/* Awan Bawah foto kiri 1 (mirror dari kanan) */}
          <img
            src="/images/cloud3-Tema-11.webp"
            alt="Cloud Left Mirrored"
            className="absolute top-70 left-10 w-40 animate-float-medium z-20 scale-x-[-1]"
          />

          {/* Awan Bawah foto kiri 2 (mirror dari kanan) */}
          <img
            src="/images/cloud2-Tema-11-1024x509.webp"
            alt="Cloud Right Mirrored"
            className="absolute top-50 right-70 w-60 animate-float-medium z-20 scale-x-[-1]"
          />
          <div className="couple-names">
            <div className="bride animate-slideIn-left">
              <img
                src="/images/gunungan-vector.png"
                alt="gunungan"
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rotate-345"
                style={{
                  width: "150px",
                  height: "auto",
                  marginTop: "-170px",
                  marginLeft: "-100px",
                  zIndex: 0, // di belakang
                }}
              />

              <img
                src="/images/gunungan-vector.png"
                alt="gunungan"
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rotate-320"
                style={{
                  width: "100px",
                  height: "auto",
                  marginTop: "-130px",
                  marginLeft: "-135px",
                  zIndex: 0, // di belakang
                }}
              />

              <img
                src="/images/gunungan-vector.png"
                alt="gunungan"
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rotate-15"
                style={{
                  width: "200px",
                  height: "auto",
                  marginTop: "-170px",
                  marginLeft: "100px",
                  zIndex: 0, // di belakang
                }}
              />
              <div className="couple-photo-frame animate-rotate-3d">
                <div
                  className="couple-photo"
                  style={{ backgroundImage: "url('/images/foto-wanita.png')" }}
                ></div>
                <div className="photo-glow"></div>
              </div>
              <div className="couple-info">
                <h1
                  className="text-center"
                  style={{
                    fontFamily: '"Cinzel Decorative", Sans-serif',
                    fontSize: "28px",
                    fontWeight: 600,
                    color: "#5a3921",
                    lineHeight: "1.2",
                  }}
                >
                  Erlina Elviana Istiqomah, S.E.
                </h1>
                <p style={{ marginTop: "10px" }}>
                  Putri pertama dari <br /> Bpk. Ridwan Setyawan, S.E. & Ibu
                  Yuli Isruslina, S.E.
                </p>
                <a
                  href="https://instagram.com/erlinaelviana_"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border border-[#5a3921] text-[#5a3921] px-4 py-2 rounded-full shadow-lg hover:bg-[#5a3921] hover:text-white transition-all duration-300"
                  style={{ marginTop: "20px" }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-5 h-5"
                    style={{ marginLeft: "10px" }}
                  >
                    <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5A4.25 4.25 0 0 0 20.5 16.25v-8.5A4.25 4.25 0 0 0 16.25 3.5h-8.5Zm8 2.75a.75.75 0 1 1 0 1.5.75.75 0 0 1 0-1.5ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 1.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Z" />
                  </svg>
                  <p style={{ marginRight: "10px" }}>Instagram</p>
                </a>
              </div>
            </div>
          </div>
        </section>

        <section
          ref={(el) => {
            sectionRefs.current[2] = el as HTMLDivElement;
          }}
          className="greeting-section relative overflow-hidden w-full section-hidden"
        >
          {/* Awan Bawah foto 1 */}
          <img
            src="/images/cloud3-Tema-11.webp"
            alt="Cloud Left"
            className="absolute top-70 right-10 w-40 animate-float-medium z-20"
          />

          {/* Awan Bawah foto 2 */}
          <img
            src="/images/cloud2-Tema-11-1024x509.webp"
            alt="Cloud Right"
            className="absolute top-50 left-70 w-60 animate-float-medium z-20"
          />

          {/* Awan Bawah foto kiri 1 (mirror dari kanan) */}
          <img
            src="/images/cloud3-Tema-11.webp"
            alt="Cloud Left Mirrored"
            className="absolute top-70 left-10 w-40 animate-float-medium z-20 scale-x-[-1]"
          />

          {/* Awan Bawah foto kiri 2 (mirror dari kanan) */}
          <img
            src="/images/cloud2-Tema-11-1024x509.webp"
            alt="Cloud Right Mirrored"
            className="absolute top-50 right-70 w-60 animate-float-medium z-20 scale-x-[-1]"
          />

          <div className="couple-names">
            <div className="bridegroom animate-slideIn-right">
              <img
                src="/images/gunungan-vector.png"
                alt="gunungan"
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rotate-345"
                style={{
                  width: "150px",
                  height: "auto",
                  marginTop: "-170px",
                  marginLeft: "-100px",
                  zIndex: 0, // di belakang
                }}
              />

              <img
                src="/images/gunungan-vector.png"
                alt="gunungan"
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rotate-320"
                style={{
                  width: "100px",
                  height: "auto",
                  marginTop: "-130px",
                  marginLeft: "-135px",
                  zIndex: 0, // di belakang
                }}
              />

              <img
                src="/images/gunungan-vector.png"
                alt="gunungan"
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rotate-15"
                style={{
                  width: "200px",
                  height: "auto",
                  marginTop: "-170px",
                  marginLeft: "100px",
                  zIndex: 0, // di belakang
                }}
              />
              <div className="couple-photo-frame animate-rotate-3d-delayed">
                <div
                  className="couple-photo"
                  style={{ backgroundImage: "url('/images/foto-pria.png')" }}
                ></div>
                <div className="photo-glow"></div>
              </div>
              <div className="couple-info">
                <h1
                  className="text-center"
                  style={{
                    fontFamily: '"Cinzel Decorative", Sans-serif',
                    fontSize: "28px",
                    fontWeight: 600,
                    color: "#5a3921",
                    lineHeight: "1.2",
                  }}
                >
                  Kuncoro Galih Agung, S.Kom.
                </h1>
                <p style={{ marginTop: "10px" }}>
                  Putra pertama dari <br /> Bpk. Supriyanto & Ibu Srimiyem
                </p>

                <a
                  href="https://instagram.com/galihkga"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border border-[#5a3921] text-[#5a3921] px-4 py-2 rounded-full shadow-lg hover:bg-[#5a3921] hover:text-white transition-all duration-300"
                  style={{ marginTop: "20px" }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-5 h-5"
                    style={{ marginLeft: "10px" }}
                  >
                    <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5A4.25 4.25 0 0 0 20.5 16.25v-8.5A4.25 4.25 0 0 0 16.25 3.5h-8.5Zm8 2.75a.75.75 0 1 1 0 1.5.75.75 0 0 1 0-1.5ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 1.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Z" />
                  </svg>
                  <p style={{ marginRight: "10px" }}>Instagram</p>
                </a>
              </div>
            </div>
          </div>
        </section>

        <div className="relative w-full h-[270px] overflow-hidden">
          {/* Awan Belakang */}
          <img
            src="/images/mempelai-bot1-tema-11-1024x468.webp"
            alt="Awan Belakang"
            className="absolute bottom-0 left-0 w-full z-0"
          />

          {/* Wayang di tengah */}
          <img
            src="/images/wayang-new1-Tema-11.webp"
            alt="Wayang Ornament"
            className="absolute bottom-[-40] left-15 -translate-x-1/2 w-64 z-10 animate-float-slow"
          />

          {/* Gunungan di tengah */}
          <img
            src="/images/wayang-bot-Tema-11.webp"
            alt="Wayang Ornament"
            className="absolute bottom-5 right-[-70] -translate-x-1/2 w-35 z-10 animate-float-slow"
          />

          {/* Awan Depan */}
          <img
            src="/images/mempelai-bot2-tema-11-1024x304.webp"
            alt="Awan Depan"
            className="absolute bottom-0 left-0 w-full z-20"
          />
        </div>
        <div
          style={{
            backgroundColor: "#5a3921",
            height: "60px", // ubah sesuai kebutuhan (misal 100px, 150px, dst)
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#FDF2D6", // warna teks biar kontras
          }}
        >
          <h1
            style={{
              fontFamily: '"Nunito", Sans-serif',
              fontSize: "16px",
              fontWeight: 600,
              margin: 0, // hapus margin default <h1>
            }}
          >
            RANGKAIAN ACARA
          </h1>
        </div>

        {/* Detail Acara dengan card animations */}
        <section
          ref={(el) => {
            sectionRefs.current[3] = el as HTMLDivElement;
          }}
          className="event-section section-hidden enhanced-card"
        >
          <img
            src="/images/bg-akad-1-Tema-11.webp"
            alt="Akad"
            className="absolute top-15 w-full h-auto z-0"
          />
          <img
            src="/images/Cloud6-Tema-11.webp"
            alt="Cloud Left"
            className="absolute top-50 left-[-60] w-60 animate-float-medium z-20"
          />
          <img
            src="/images/Cloud6-Tema-11.webp"
            alt="Cloud Left"
            className="absolute top-40 right-[-60] w-60 animate-float-medium z-20  scale-x-[-1]"
          />
          <img
            src="/images/Cloud6-Tema-11.webp"
            alt="Cloud Left"
            className="absolute top-140 left-[-60] w-60 animate-float-medium z-20"
          />
          <img
            src="/images/Cloud6-Tema-11.webp"
            alt="Cloud Left"
            className="absolute top-130 right-[-60] w-60 animate-float-medium z-20  scale-x-[-1]"
          />
          <div
            style={{
              position: "relative",
              zIndex: 10,
              paddingTop: "150px",
            }}
          >
            <h4
              className="leading-none"
              style={{
                fontFamily: '"Cinzel Decorative", Sans-serif',
                fontSize: "32px",
                fontWeight: 600,
                margin: 0,
                color: "#ffffff",
              }}
            >
              Akad
              <br />
              Nikah
            </h4>

            <h4
              className="leading-none"
              style={{
                fontFamily: '"Nunito", Sans-serif',
                fontSize: "20px",
                fontWeight: 500,
                margin: 0,
                color: "#ffffff",
                marginTop: "50px",
              }}
            >
              JUMAT
            </h4>

            <h4
              className="leading-none"
              style={{
                fontFamily: '"Nunito", Sans-serif',
                fontSize: "48px",
                fontWeight: 500,
                margin: 0,
                color: "#ffffff",
                marginTop: "7px",
              }}
            >
              14
            </h4>
            <h4
              className="leading-none"
              style={{
                fontFamily: '"Nunito", Sans-serif',
                fontSize: "20px",
                fontWeight: 500,
                margin: 0,
                color: "#ffffff",
                marginTop: "7px",
              }}
            >
              NOVEMBER 2025
            </h4>

            <p
              className="leading-none"
              style={{
                fontFamily: '"Nunito", Sans-serif',
                fontSize: "16px",
                fontWeight: 500,
                margin: 0,
                color: "#ffffff",
                marginTop: "50px",
              }}
            >
              Pukul 08.30 WIB - Selesai
            </p>

            <div
              style={{
                margin: 0,
                color: "#ffffff",
                marginTop: "15px",
                marginInline: "70px",
              }}
            >
              <hr
                style={{
                  height: "3px", // atur ketebalan garis
                  backgroundColor: "#ffffff", // warna garis
                  border: "none", // hapus border default
                  borderRadius: "2px", // opsional: biar ujungnya halus
                }}
              />
            </div>

            <p
              className="leading-none"
              style={{
                fontFamily: '"Nunito", Sans-serif',
                fontSize: "16px",
                fontWeight: 500,
                margin: 0,
                color: "#ffffff",
                marginTop: "15px",
              }}
            >
              KUA Kalikotes, Kalikotes
            </p>

            <p
              className="leading-none"
              style={{
                fontFamily: '"Nunito", Sans-serif',
                fontSize: "14px",
                fontWeight: 400,
                margin: 0,
                color: "#ffffff",
                marginTop: "7px",
                marginInline: "70px",
              }}
            >
              Jalan Kh. Hasyim Asari No.17, Dusun I, Kalikotes, Kec. Kalikotes,
              Kabupaten Klaten
            </p>

            <a
              href="https://maps.app.goo.gl/hW8JpL14mehw9zxp9"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-[#ffffff] text-[#ffffff] px-4 py-2 rounded-full shadow-lg hover:bg-[#ffffff] hover:text-white transition-all duration-300"
              style={{ marginTop: "60px" }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5"
                style={{ marginLeft: "10px" }}
              >
                <path d="M12 2C8.134 2 5 5.134 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.866-3.134-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z" />
              </svg>
              <p style={{ marginRight: "10px" }}>Lihat Lokasi</p>
            </a>

            <div style={{ marginTop: "180px" }}></div>
          </div>
        </section>

        <section
          ref={(el) => {
            sectionRefs.current[4] = el as HTMLDivElement;
          }}
          className="event-section section-hidden enhanced-card"
        >
          <img
            src="/images/bg-akad-1-Tema-11.webp"
            alt="Akad"
            className="absolute top-15 w-full h-auto z-0"
          />

          <img
            src="/images/bg-akad-1-Tema-11.webp"
            alt="Akad"
            className="absolute top-15 w-full h-auto z-0"
          />
          <img
            src="/images/Cloud6-Tema-11.webp"
            alt="Cloud Left"
            className="absolute top-40 left-[-60] w-60 animate-float-medium z-20"
          />
          <img
            src="/images/Cloud6-Tema-11.webp"
            alt="Cloud Left"
            className="absolute top-50 right-[-60] w-60 animate-float-medium z-20  scale-x-[-1]"
          />
          <img
            src="/images/Cloud6-Tema-11.webp"
            alt="Cloud Left"
            className="absolute top-130 left-[-60] w-60 animate-float-medium z-20"
          />
          <img
            src="/images/Cloud6-Tema-11.webp"
            alt="Cloud Left"
            className="absolute top-140 right-[-60] w-60 animate-float-medium z-20  scale-x-[-1]"
          />

          <div
            style={{
              position: "relative",
              zIndex: 10,
              paddingTop: "150px",
            }}
          >
            <h4
              className="leading-none"
              style={{
                fontFamily: '"Cinzel Decorative", Sans-serif',
                fontSize: "32px",
                fontWeight: 600,
                margin: 0,
                color: "#ffffff",
              }}
            >
              Resepsi
              <br />
              Nikah
            </h4>

            <h4
              className="leading-none"
              style={{
                fontFamily: '"Nunito", Sans-serif',
                fontSize: "20px",
                fontWeight: 500,
                margin: 0,
                color: "#ffffff",
                marginTop: "50px",
              }}
            >
              MINGGU
            </h4>

            <h4
              className="leading-none"
              style={{
                fontFamily: '"Nunito", Sans-serif',
                fontSize: "48px",
                fontWeight: 500,
                margin: 0,
                color: "#ffffff",
                marginTop: "7px",
              }}
            >
              16
            </h4>
            <h4
              className="leading-none"
              style={{
                fontFamily: '"Nunito", Sans-serif',
                fontSize: "20px",
                fontWeight: 500,
                margin: 0,
                color: "#ffffff",
                marginTop: "7px",
              }}
            >
              NOVEMBER 2025
            </h4>

            <p
              className="leading-none"
              style={{
                fontFamily: '"Nunito", Sans-serif',
                fontSize: "16px",
                fontWeight: 500,
                margin: 0,
                color: "#ffffff",
                marginTop: "50px",
              }}
            >
              Pukul 09.00 WIB - Selesai
            </p>

            <div
              style={{
                margin: 0,
                color: "#ffffff",
                marginTop: "15px",
                marginInline: "70px",
              }}
            >
              <hr
                style={{
                  height: "3px", // atur ketebalan garis
                  backgroundColor: "#ffffff", // warna garis
                  border: "none", // hapus border default
                  borderRadius: "2px", // opsional: biar ujungnya halus
                }}
              />
            </div>

            <p
              className="leading-none"
              style={{
                fontFamily: '"Nunito", Sans-serif',
                fontSize: "16px",
                fontWeight: 500,
                margin: 0,
                color: "#ffffff",
                marginTop: "15px",
              }}
            >
              Gedung W. Wongso Menggolo
            </p>

            <p
              className="leading-none"
              style={{
                fontFamily: '"Nunito", Sans-serif',
                fontSize: "14px",
                fontWeight: 400,
                margin: 0,
                color: "#ffffff",
                marginTop: "7px",
                marginInline: "70px",
              }}
            >
              Jl. Klaten - Solo No.KM.3, Ngaran, Mlese, Kec. Ceper, Kabupaten
              Klaten
            </p>

            <a
              href="https://maps.app.goo.gl/hQ5dQctMJPgP2z5PA"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-[#ffffff] text-[#ffffff] px-4 py-2 rounded-full shadow-lg hover:bg-[#ffffff] hover:text-white transition-all duration-300"
              style={{ marginTop: "60px" }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5"
                style={{ marginLeft: "10px" }}
              >
                <path d="M12 2C8.134 2 5 5.134 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.866-3.134-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z" />
              </svg>
              <p style={{ marginRight: "10px" }}>Lihat Lokasi</p>
            </a>

            <div style={{ marginTop: "180px" }}></div>
          </div>
        </section>

        {/* Pasangan Pengantin dengan photo animations */}
        <section
          ref={(el) => {
            sectionRefs.current[5] = el as HTMLDivElement;
          }}
          className="couple-section section-hidden enhanced-card"
        >
          <p>
            "Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan
            pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung
            dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa
            kasih dan sayang. Sungguh, pada yang demikian itu benar-benar
            terdapat tanda-tanda (kebesaran Allah) bagi kaum yang berpikir."
          </p>
          <p>(QS Ar-Rum : 21)</p>
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
          <span>Erlina & Galih</span>
        </div>

        <div className="footer-decoration bottom"></div>
      </footer>

      {/* Custom Notification */}
      <div className="notification-container"></div>
    </div>
  );
}
