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
    "/images/prewedding/prewed-3.jpg",
    "/images/prewedding/prewed-9.jpg",
    "/images/prewedding/prewed-6.jpg",
    "/images/prewedding/prewed-11.jpg",
    "/images/prewedding/prewed-16.jpg",
    "/images/prewedding/prewed-19.jpg",
  ];

  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openPopup = (index: number) => {
    setCurrentIndex(index);
    setIsOpen(true);
  };

  const closePopup = () => setIsOpen(false);

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
    setCurrentIndex((prev) => (prev + 1) % preweddingPhotos.length);
  };

  const prevSlide = () => {
    setCurrentIndex(
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

  // Di dalam component UndanganContent
  const [attendanceStatus, setAttendanceStatus] = useState("");
  const [message, setMessage] = useState("");
  interface ConfirmationStatus {
    type: "success" | "error" | null;
    message: string | null;
  }

  const [confirmationStatus, setConfirmationStatus] =
    useState<ConfirmationStatus | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [jumlahTamuHadir, setJumlahTamuHadir] = useState(1); // Default 1 orang

  // State untuk konfirmasi
  const [pesanTamu, setPesanTamu] = useState([]);
  const [loadingPesan, setLoadingPesan] = useState(false);

  // Function untuk load pesan tamu
  const loadPesanTamu = async () => {
    setLoadingPesan(true);
    try {
      console.log("Loading pesan tamu...");

      const response = await fetch("/api/konfirmasi", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-cache",
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("API response:", result);

      if (result.success) {
        // Filter hanya yang ada pesan dan akan hadir
        const pesanDenganUcapan = result.data
          .filter(
            (item: { pesan: string; timestamp: string }) =>
              item.pesan && item.pesan.trim() !== ""
          )
          .sort(
            (a: { timestamp: string }, b: { timestamp: string }) =>
              Number(new Date(b.timestamp)) - Number(new Date(a.timestamp))
          );

        console.log("Filtered messages:", pesanDenganUcapan);
        setPesanTamu(pesanDenganUcapan);
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error("Error loading messages:", error);
      // Fallback: tampilkan pesan error yang user-friendly
      setPesanTamu([]);
    } finally {
      setLoadingPesan(false);
    }
  };

  // Function untuk handle konfirmasi
  const handleConfirmation = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!attendanceStatus) {
      setConfirmationStatus({
        type: "error",
        message: "Silakan pilih status kehadiran terlebih dahulu",
      });
      return;
    }

    // Validasi untuk yang memilih hadir tapi jumlah tamu 0
    if (attendanceStatus === "hadir" && jumlahTamuHadir === 0) {
      setConfirmationStatus({
        type: "error",
        message: "Silakan pilih jumlah tamu yang akan hadir",
      });
      return;
    }

    setIsSubmitting(true);

    const confirmationData = {
      nama: dataTamu.nama,
      jumlahTamu: attendanceStatus === "hadir" ? jumlahTamuHadir : 0,
      salam: dataTamu.salam,
      keterangan: dataTamu.keterangan,
      kehadiran: attendanceStatus,
      pesan: message,
    };

    try {
      console.log("Sending confirmation:", confirmationData);

      const response = await fetch("/api/konfirmasi", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(confirmationData),
      });

      console.log("Response status:", response.status);

      const result = await response.json();
      console.log("Response data:", result);

      if (!response.ok) {
        throw new Error(result.message || "Failed to save data");
      }

      if (result.success) {
        setConfirmationStatus({
          type: "success",
          message:
            attendanceStatus === "hadir"
              ? `✅ Konfirmasi berhasil! Terima kasih atas konfirmasi kehadiran ${jumlahTamuHadir} orang.`
              : "✅ Konfirmasi berhasil! Terima kasih atas konfirmasinya.",
        });

        // Reset form
        setAttendanceStatus("");
        setJumlahTamuHadir(1);
        setMessage("");

        // Reload pesan tamu untuk menampilkan yang baru
        setTimeout(() => {
          loadPesanTamu();
        }, 1000);
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error("Error saving confirmation:", error);
      setConfirmationStatus({
        type: "error",
        message: "❌ Gagal menyimpan konfirmasi. Silakan coba lagi.",
      });
    } finally {
      setIsSubmitting(false);

      // Auto clear status message setelah 5 detik
      setTimeout(() => {
        setConfirmationStatus(null);
      }, 5000);
    }
  };

  // Load data saat component mount
  useEffect(() => {
    loadPesanTamu();
  }, []);

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
          <img
            src="/images/Cloud6-Tema-11.webp"
            alt="Cloud Left"
            className="absolute top-3 left-[-60] w-60 animate-cloud-down-left z-20"
          />
          <img
            src="/images/Cloud6-Tema-11.webp"
            alt="Cloud Right"
            className="absolute top-3 right-[-60] w-60 animate-cloud-up-right z-20  scale-x-[-1]"
          />

          <img
            src="/images/Cloud6-Tema-11.webp"
            alt="Cloud Left"
            className="absolute top-76 left-[-60] w-60 animate-cloud-down-left z-20"
          />
          <img
            src="/images/Cloud6-Tema-11.webp"
            alt="Cloud Right"
            className="absolute top-76 right-[-60] w-60 animate-cloud-up-right z-20  scale-x-[-1]"
          />
          <div
            className="quran-section"
            style={{
              border: "7px solid #5a3921",
              backgroundColor: "rgba(255, 255, 255, 0.5)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                marginBottom: "20px",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="64"
                height="64"
                viewBox="0 0 128 128"
                stroke="#5a3921"
              >
                <title>WEDDING ARCH</title>
                <g>
                  <path d="M81.581,33.512a24.761,24.761,0,0,1,2.958,3.68,1.75,1.75,0,1,0,2.926-1.921,28.291,28.291,0,0,0-3.378-4.2,1.75,1.75,0,0,0-2.506,2.443Z"></path>
                  <path d="M121.5,119.75H107.06V115.5a1.745,1.745,0,0,0-1.5-1.725V98.332a4.055,4.055,0,0,0,3.472-1.021c1.291-1.291,1.4-3.4.438-5.515,2.179-.817,3.59-2.382,3.59-4.208s-1.406-3.385-3.578-4.2c.983-2.124.866-4.2-.45-5.519-1.18-1.181-3.042-1.362-4.972-.65V50.64A40.128,40.128,0,0,0,78.526,13.312,8.616,8.616,0,0,0,64,7.1a8.611,8.611,0,0,0-14.522,6.215A40.128,40.128,0,0,0,23.94,50.64V77.216c-1.931-.712-3.793-.531-4.973.649-1.291,1.291-1.4,3.4-.437,5.515-2.18.817-3.59,2.383-3.59,4.208s1.411,3.391,3.59,4.208c-.963,2.12-.854,4.224.437,5.515a4.056,4.056,0,0,0,3.473,1.021v15.443a1.745,1.745,0,0,0-1.5,1.725v4.25H6.5a1.75,1.75,0,0,0,0,3.5h115a1.75,1.75,0,0,0,0-3.5ZM96.56,100.091a3.657,3.657,0,0,0,5.5,0V113.75h-5.5Zm10-19.751c.154.155.135,1.471-1.24,3.069a1.75,1.75,0,0,0,1.2,2.886c2.1.158,3.045,1.075,3.045,1.293s-.945,1.136-3.045,1.293a1.75,1.75,0,0,0-1.2,2.887c1.374,1.6,1.393,2.913,1.238,3.068s-1.471.135-3.067-1.239a1.75,1.75,0,0,0-2.886,1.2c-.158,2.1-1.076,3.046-1.294,3.046s-1.136-.944-1.293-3.046a1.75,1.75,0,0,0-2.887-1.2c-1.595,1.373-2.909,1.4-3.068,1.239s-.135-1.471,1.239-3.068a1.75,1.75,0,0,0-1.2-2.887c-2.1-.157-3.045-1.075-3.045-1.293S90,86.453,92.105,86.3a1.75,1.75,0,0,0,1.2-2.886c-1.375-1.6-1.394-2.914-1.24-3.069s1.467-.138,3.068,1.24a1.751,1.751,0,0,0,2.887-1.2c.157-2.1,1.074-3.046,1.293-3.046s1.136.944,1.294,3.046a1.75,1.75,0,0,0,2.886,1.2C105.087,80.205,106.4,80.184,106.558,80.34ZM54.242,21.709l5.118,5.118C54.844,38.7,46.185,51.16,39.43,58.407a1.75,1.75,0,1,0,2.56,2.386A112.874,112.874,0,0,0,61.6,30.619c-1.81,20.157-7.36,34.5-17.4,44.951-.653.672-1.324,1.334-2.005,1.976-.883.832-1.81,1.637-2.765,2.421a3.684,3.684,0,0,0-1.012-2.1c-1.182-1.181-3.043-1.362-4.973-.649V50.64A30.758,30.758,0,0,1,54.242,21.709Zm19.516,0A30.757,30.757,0,0,1,94.56,50.64V77.215c-1.931-.713-3.792-.531-4.972.65a3.73,3.73,0,0,0-1.03,2.087c-.947-.781-1.87-1.58-2.747-2.406-.682-.642-1.354-1.3-2-1.968C73.76,65.115,68.21,50.776,66.4,30.617A112.871,112.871,0,0,0,86.01,60.793a1.75,1.75,0,0,0,2.56-2.386c-6.755-7.247-15.414-19.7-19.93-31.58ZM40.027,83.95a58.405,58.405,0,0,0,4.564-3.857Q45.668,79.077,46.712,78C55.784,68.56,61.38,56.248,64,39.8c2.62,16.447,8.217,28.759,17.294,38.207.688.709,1.4,1.407,2.116,2.085a58.575,58.575,0,0,0,4.561,3.857,4.332,4.332,0,0,0-2.411,3.637A4.14,4.14,0,0,0,87.5,90.921c-.185.3-.359.593-.521.888-3.647,6.448-5.977,17.028-6.2,27.941H47.228C47,108.837,44.67,98.257,41.033,91.825q-.252-.454-.531-.9a4.14,4.14,0,0,0,1.938-3.333A4.332,4.332,0,0,0,40.027,83.95ZM100.56,50.64V74.074a3.428,3.428,0,0,0-2.5,0V50.64A34.293,34.293,0,0,0,76.449,18.972a8.808,8.808,0,0,0,.687-.909c.015-.022.027-.046.041-.068a8.527,8.527,0,0,0,.638-1.2A36.622,36.622,0,0,1,100.56,50.64ZM54.47,9.75a5.123,5.123,0,0,1,7.239,0L62.763,10.8a1.75,1.75,0,0,0,2.474,0l1.054-1.054a5.118,5.118,0,0,1,7.238,7.239L64,26.518l-9.529-9.53A5.124,5.124,0,0,1,54.47,9.75ZM50.19,16.8a8.533,8.533,0,0,0,1.351,2.163A34.305,34.305,0,0,0,29.94,50.64V74.066a3.624,3.624,0,0,0-1.25-.228,3.508,3.508,0,0,0-1.25.236V50.64A36.624,36.624,0,0,1,50.19,16.8ZM21.442,94.836c-.154-.154-.135-1.471,1.239-3.068a1.75,1.75,0,0,0-1.2-2.887c-2.1-.157-3.046-1.075-3.046-1.293s.944-1.135,3.046-1.293a1.75,1.75,0,0,0,1.2-2.887c-1.374-1.6-1.393-2.914-1.239-3.068s1.472-.134,3.068,1.24a1.75,1.75,0,0,0,2.887-1.2c.158-2.1,1.075-3.046,1.293-3.046s1.136.944,1.293,3.046a1.751,1.751,0,0,0,2.887,1.2c1.6-1.375,2.913-1.394,3.068-1.24s.135,1.471-1.239,3.068A1.75,1.75,0,0,0,35.9,86.3c2.1.158,3.045,1.075,3.045,1.293S38,88.724,35.9,88.881a1.751,1.751,0,0,0-1.2,2.887c1.374,1.6,1.393,2.913,1.239,3.068s-1.472.135-3.068-1.239a1.751,1.751,0,0,0-2.887,1.2c-.157,2.1-1.075,3.046-1.293,3.046s-1.135-.944-1.293-3.046a1.75,1.75,0,0,0-2.887-1.2C22.913,94.972,21.6,94.99,21.442,94.836Zm7.248,6.5a3.87,3.87,0,0,0,2.75-1.214V113.75h-5.5V100.091A3.859,3.859,0,0,0,28.69,101.338ZM24.44,119.75v-2.5h8.5v2.5Zm12,0V115.5a1.745,1.745,0,0,0-1.5-1.725V98.333a4.056,4.056,0,0,0,3.473-1.022,3.542,3.542,0,0,0,.805-1.281c2.654,6.031,4.321,14.718,4.513,23.72ZM88.783,96.031a3.523,3.523,0,0,0,.8,1.279,4.058,4.058,0,0,0,3.473,1.023v15.442a1.744,1.744,0,0,0-1.5,1.725v4.25H84.269C84.462,110.754,86.126,102.072,88.783,96.031ZM95.06,119.75v-2.5h8.5v2.5Z"></path>
                  <path d="M99.31,82.238a5.35,5.35,0,1,0,5.35,5.35A5.355,5.355,0,0,0,99.31,82.238Zm0,7.2a1.85,1.85,0,1,1,1.85-1.85A1.852,1.852,0,0,1,99.31,89.438Z"></path>
                  <path d="M28.69,92.938a5.35,5.35,0,1,0-5.35-5.35A5.356,5.356,0,0,0,28.69,92.938Zm0-7.2a1.85,1.85,0,1,1-1.85,1.85A1.852,1.852,0,0,1,28.69,85.738Z"></path>
                </g>
              </svg>
            </div>

            <p className="leading-4">
              "Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan
              pasangan-pasangan untukmu dari jenismu sendiri, agar kamu
              cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di
              antaramu rasa kasih dan sayang. Sungguh, pada yang demikian itu
              benar-benar terdapat tanda-tanda (kebesaran Allah) bagi kaum yang
              berpikir."
            </p>
            <p>(QS Ar-Rum : 21)</p>
            <div style={{ marginBottom: "40px" }}></div>
          </div>
        </section>

        {/* Gallery Prewedding Slider dengan enhanced transitions */}
        <section
          ref={(el) => {
            sectionRefs.current[6] = el as HTMLDivElement;
          }}
          className="gallery-section section-hidden enhanced-card"
        >
          <h1
            className="text-center mt-4"
            style={{
              fontFamily: '"Cinzel Decorative", Sans-serif',
              fontSize: "28px",
              fontWeight: 800,
              color: "#2f1b10",
              lineHeight: "1.2",
            }}
          >
            Gallery
          </h1>
          <h1
            className="text-center mt-4"
            style={{
              fontFamily: '"Cinzel Decorative", Sans-serif',
              fontSize: "28px",
              fontWeight: 600,
              color: "#5a3921",
              lineHeight: "1.2",
              marginBottom: "20px",
            }}
          >
            cinta kami
          </h1>

          {/* Gallery Grid */}
          <div className="grid grid-cols-3 gap-4 px-6">
            {preweddingPhotos.map((photo, index) => (
              <div
                key={index}
                className="relative overflow-hidden rounded-xl shadow-lg cursor-pointer group"
                onClick={() => openPopup(index)}
              >
                <img
                  src={photo}
                  alt={`Prewedding ${index + 1}`}
                  className="w-full h-64 object-cover transform transition-transform duration-500 group-hover:scale-110"
                />
              </div>
            ))}
          </div>

          {/* Popup / Modal */}
          {isOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-90 flex flex-col items-center justify-center z-50">
              <button
                className="absolute top-6 right-8 text-white text-4xl font-bold hover:text-gray-400 transition"
                onClick={closePopup}
              >
                ✕
              </button>

              <button
                className="absolute left-5 text-white text-5xl font-bold hover:text-gray-400 transition"
                onClick={prevSlide}
              >
                ‹
              </button>

              <img
                src={preweddingPhotos[currentIndex]}
                alt="Full View"
                className="max-h-[90vh] max-w-[90vw] object-contain rounded-xl shadow-2xl"
              />

              <button
                className="absolute right-5 text-white text-5xl font-bold hover:text-gray-400 transition"
                onClick={nextSlide}
              >
                ›
              </button>

              <div className="absolute bottom-6 text-white text-sm">
                {currentIndex + 1} / {preweddingPhotos.length}
              </div>
            </div>
          )}
        </section>

        <section
          ref={(el) => {
            sectionRefs.current[7] = el as HTMLDivElement;
          }}
          className="timeline-section section-hidden enhanced-card"
        >
          <h1
            className="text-center mt-4"
            style={{
              fontFamily: '"Cinzel Decorative", Sans-serif',
              fontSize: "28px",
              fontWeight: 800,
              color: "#2f1b10",
              lineHeight: "1.2",
              marginTop: "50px",
            }}
          >
            Cerita
          </h1>
          <h1
            className="text-center mt-4"
            style={{
              fontFamily: '"Cinzel Decorative", Sans-serif',
              fontSize: "28px",
              fontWeight: 600,
              color: "#5a3921",
              lineHeight: "1.2",
              marginBottom: "20px",
            }}
          >
            tentang kita
          </h1>

          <img
            src="/images/cloud3-Tema-11.webp"
            alt="Cloud Right"
            className="absolute top-0 right-0 w-40 animate-cloud-down-right opacity-90 z-20"
          />

          <img
            src="/images/cloud3-Tema-11.webp"
            alt="Cloud Left"
            className="absolute top-0 left-0 w-40 animate-cloud-down-right opacity-90 z-20 scale-x-[-1]"
          />

          {/* Timeline Container */}
          <div className="timeline-container relative max-w-2xl mx-auto px-4 sm:px-6">
            {/* Timeline Items */}
            <div className="space-y-8 relative z-10">
              {/* Item 1 - Awal Bertemu */}
              <div className="timeline-item group relative pl-12">
                <div className="absolute left-6 top-2 transform -translate-x-1/2 z-10">
                  <div className="timeline-heart w-6 h-6 bg-[#925E2D] border-2 border-white rounded-xl shadow-lg group-hover:scale-125 transition-transform duration-300 relative flex items-center justify-center">
                    <svg
                      className="w-3 h-3 text-[#FDF2D6]"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>

                {/* Konten di kanan */}
                <div className="timeline-content">
                  <div className="p-4">
                    <span
                      style={{
                        fontFamily: '"Nunito", Sans-serif',
                        color: "#000000",
                        fontWeight: "400",
                        fontSize: "16px",
                      }}
                    >
                      2018
                    </span>
                    <h3
                      className="leading-none"
                      style={{
                        fontFamily: '"Nunito", Sans-serif',
                        color: "#8F5B2A",
                        fontWeight: "700",
                        fontSize: "1.5rem",
                        marginBlock: "10px",
                      }}
                    >
                      Awal Bertemu
                    </h3>
                    <p
                      className="text-sm leading-relaxed"
                      style={{ textAlign: "justify" }}
                    >
                      Masih teringat saat pertama kali kamu bertemu, yaitu
                      mengikuti ekstrakurikuler yang sama. Saat itu kami kelas
                      11 SMA, mengikuti ekstrakurikuler karawitan. Pertemanan
                      kami semakin dekat karena banyak bertemu untuk
                      mempersiapkan lomba.
                    </p>
                  </div>
                </div>
              </div>

              {/* Item 2 - Berkomitmen */}
              <div className="timeline-item group relative pl-12">
                <div className="absolute left-6 top-2 transform -translate-x-1/2 z-10">
                  <div className="timeline-heart w-6 h-6 bg-[#925E2D] border-2 border-white rounded-xl shadow-lg group-hover:scale-125 transition-transform duration-300 relative flex items-center justify-center">
                    <svg
                      className="w-3 h-3 text-[#FDF2D6]"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>

                {/* Konten di kanan */}
                <div className="timeline-content">
                  <div className="p-4">
                    <span
                      style={{
                        fontFamily: '"Nunito", Sans-serif',
                        color: "#000000",
                        fontWeight: "400",
                        fontSize: "16px",
                      }}
                    >
                      25 Juni 2019
                    </span>
                    <h3
                      className="leading-none"
                      style={{
                        fontFamily: '"Nunito", Sans-serif',
                        color: "#8F5B2A",
                        fontWeight: "700",
                        fontSize: "1.5rem",
                        marginBlock: "10px",
                      }}
                    >
                      Memutuskan Berkomitmen
                    </h3>
                    <p
                      className="text-sm leading-relaxed"
                      style={{ textAlign: "justify" }}
                    >
                      Setelah 1 tahun semakin dekat dan akrab, kami berkomitmen
                      untuk menjalin hubungan yang lebih serius. Saling
                      memberikan dukungan dan kasih sayang sehingga kami semakin
                      kuat.
                    </p>
                  </div>
                </div>
              </div>

              {/* Item 3 - Lamaran */}
              <div className="timeline-item group relative pl-12">
                <div className="absolute left-6 top-2 transform -translate-x-1/2 z-10">
                  <div className="timeline-heart w-6 h-6 bg-[#925E2D] border-2 border-white rounded-xl shadow-lg group-hover:scale-125 transition-transform duration-300 relative flex items-center justify-center">
                    <svg
                      className="w-3 h-3 text-[#FDF2D6]"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>

                {/* Konten di kanan */}
                <div className="timeline-content">
                  <div className="p-4">
                    <span
                      style={{
                        fontFamily: '"Nunito", Sans-serif',
                        color: "#000000",
                        fontWeight: "400",
                        fontSize: "16px",
                      }}
                    >
                      17 Agustus 2025
                    </span>
                    <h3
                      className="leading-none"
                      style={{
                        fontFamily: '"Nunito", Sans-serif',
                        color: "#8F5B2A",
                        fontWeight: "700",
                        fontSize: "1.5rem",
                        marginBlock: "10px",
                      }}
                    >
                      Lamaran
                    </h3>
                    <p
                      className="text-sm leading-relaxed"
                      style={{ textAlign: "justify" }}
                    >
                      Setelah perjalanan panjang yang kami lalui, akhirnya kami
                      memutuskan untuk melaksanakan prosesi lamaran sederhana.
                      Dengan dihadiri keluarga inti, kami melaksanakan lamaran
                      dengan penuh hikmat dan haru.
                    </p>
                  </div>
                </div>
              </div>

              {/* Item 4 - Pernikahan */}
              <div className="timeline-item group relative pl-12">
                <div className="absolute left-6 top-2 transform -translate-x-1/2 z-10">
                  <div className="timeline-heart w-6 h-6 bg-[#925E2D] border-2 border-white rounded-xl shadow-lg group-hover:scale-125 transition-transform duration-300 relative flex items-center justify-center">
                    <svg
                      className="w-3 h-3 text-[#FDF2D6]"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>

                {/* Konten di kanan */}
                <div className="timeline-content">
                  <div className="p-4">
                    <span
                      style={{
                        fontFamily: '"Nunito", Sans-serif',
                        color: "#000000",
                        fontWeight: "400",
                        fontSize: "16px",
                      }}
                    >
                      14 November 2025
                    </span>
                    <h3
                      className="leading-none"
                      style={{
                        fontFamily: '"Nunito", Sans-serif',
                        color: "#8F5B2A",
                        fontWeight: "700",
                        fontSize: "1.5rem",
                        marginBlock: "10px",
                      }}
                    >
                      Pernikahan
                    </h3>
                    <p
                      className="text-sm leading-relaxed"
                      style={{ textAlign: "justify" }}
                    >
                      Setelah lebih dari 6 tahun berkomitmen dalam hubungan,
                      kami memiliki tujuan selanjutnya yang lebih jauh yaitu
                      pernikahan. Terpilihlah tanggal tersebut sebagai hari
                      pernikahan kami.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Amplop Digital dengan toggle animation */}
        <section
          ref={(el) => {
            sectionRefs.current[8] = el as HTMLDivElement;
          }}
          className="amplop-section section-hidden enhanced-card z-50"
        >
          <h3 className="section-title animate-fadeInUp">Amplop Digital</h3>
          <p
            className="amplop-description animate-fadeInUp-delayed"
            style={{ textAlign: "justify" }}
          >
            Do'a restu keluarga, sahabat, serta rekan-rekan semua di pernikahan
            kami sudah sangat cukup sebagai hadiah, namun jika memberi merupakan
            tanda kasih, kami dengan senang hati menerimanya dan tentunya
            semakin melengkapi kebahagiaan kami.
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

        {/* Background Section */}
        <div className="relative w-full top-[-150] h-[200px] overflow-hidden">
          <div
            className="absolute inset-0 z-0"
            style={{
              backgroundColor: "#8e5a2a",
              backgroundImage:
                "linear-gradient(135deg, #8e5a2a 0%, #a67c52 100%)",
            }}
          ></div>

          {/* Awan Belakang */}
          <img
            src="/images/mempelai-bot1-tema-11-1024x468.webp"
            alt="Awan Belakang"
            className="absolute bottom-0 left-0 w-full z-10 opacity-80"
          />

          {/* Awan Depan */}
          <img
            src="/images/mempelai-bot2-tema-11-1024x304.webp"
            alt="Awan Depan"
            className="absolute bottom-0 left-0 w-full z-20"
          />
        </div>

        {/* Konfirmasi Kehadiran Section */}
        <section
          ref={(el) => {
            sectionRefs.current[9] = el as HTMLDivElement;
          }}
          className="confirmation-section section-hidden enhanced-card relative z-30 -mt-20 pt-20 pb-12"
          style={{
            backgroundColor: "#8e5a2a",
            backgroundImage:
              "linear-gradient(135deg, #8e5a2a 0%, #a67c52 50%, #8e5a2a 100%)",
          }}
        >
          {/* Dekorasi */}
          <div className="absolute top-4 left-4 right-4 flex justify-between items-center opacity-60">
            <img
              src="/images/cloud3-Tema-11.webp"
              alt="Cloud Left"
              className="w-20 animate-float-slow"
            />
            <img
              src="/images/cloud3-Tema-11.webp"
              alt="Cloud Right"
              className="w-20 animate-float-medium scale-x-[-1]"
            />
          </div>

          <div className="relative z-10 max-w-md mx-auto px-6">
            <h3
              className="section-title text-center animate-fadeInUp mb-6"
              style={{
                fontFamily: '"Cinzel Decorative", Sans-serif',
                fontSize: "24px",
                color: "#FDF2D6",
                textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
              }}
            >
              Konfirmasi Kehadiran
            </h3>

            {/* Info Tamu */}
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 mb-6 border border-[#FDF2D6]/30">
              <p className="text-[#FDF2D6] text-center text-sm">
                <strong>{dataTamu.nama}</strong>
                <br />
                <span className="opacity-90">{dataTamu.keterangan}</span>
              </p>
            </div>

            {/* Form Konfirmasi */}
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border border-[#FDF2D6]/30">
              <form onSubmit={handleConfirmation} className="space-y-6">
                {/* Status Kehadiran */}
                <div>
                  <label className="block text-sm font-medium text-[#5a3921] mb-3 text-center">
                    Apakah Anda akan hadir?
                  </label>
                  <div className="flex justify-center space-x-4">
                    <button
                      type="button"
                      onClick={() => {
                        setAttendanceStatus("hadir");
                        // Reset jumlah tamu jika memilih tidak hadir
                        if (attendanceStatus === "tidak-hadir") {
                          setJumlahTamuHadir(1);
                        }
                      }}
                      className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                        attendanceStatus === "hadir"
                          ? "bg-green-500 text-white shadow-lg scale-105"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      ✅ Akan Hadir
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setAttendanceStatus("tidak-hadir");
                        // Set jumlah tamu 0 jika tidak hadir
                        setJumlahTamuHadir(0);
                      }}
                      className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                        attendanceStatus === "tidak-hadir"
                          ? "bg-red-500 text-white shadow-lg scale-105"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      ❌ Tidak Hadir
                    </button>
                  </div>
                </div>

                {/* Pilihan Jumlah Tamu - Hanya tampil jika memilih "Akan Hadir" */}
                {attendanceStatus === "hadir" && (
                  <div className="animate-fadeIn">
                    <label className="block text-sm font-medium text-[#5a3921] mb-3 text-center">
                      Berapa orang yang akan hadir?
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {[1, 2, 3, 4, 5, 6].map((jumlah) => (
                        <button
                          key={jumlah}
                          type="button"
                          onClick={() => setJumlahTamuHadir(jumlah)}
                          className={`py-3 rounded-lg font-semibold transition-all duration-300 border-2 ${
                            jumlahTamuHadir === jumlah
                              ? "bg-[#925E2D] text-white border-[#925E2D] shadow-lg scale-105"
                              : "bg-white text-[#5a3921] border-[#925E2D]/30 hover:border-[#925E2D] hover:bg-[#FDF2D6]"
                          }`}
                        >
                          {jumlah} {jumlah === 1 ? "Orang" : "Orang"}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Pesan/Ucapan */}
                <div>
                  <label className="block text-sm font-medium text-[#5a3921] mb-2">
                    Pesan / Ucapan untuk Mempelai
                    <span className="text-xs text-gray-500 ml-1">
                      (pesan akan ditampilkan di website)
                    </span>
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 rounded-lg border border-[#925E2D]/30 focus:border-[#925E2D] focus:ring-2 focus:ring-[#925E2D]/20 transition-all duration-300 bg-white/80 resize-none"
                    placeholder="Tuliskan ucapan dan doa untuk mempelai. Pesan Anda akan ditampilkan di website..."
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={
                    !attendanceStatus ||
                    (attendanceStatus === "hadir" && jumlahTamuHadir === 0)
                  }
                  className={`w-full py-4 px-6 rounded-lg font-semibold shadow-lg transition-all duration-300 flex items-center justify-center space-x-2 ${
                    attendanceStatus &&
                    (attendanceStatus === "tidak-hadir" || jumlahTamuHadir > 0)
                      ? "bg-gradient-to-r from-[#925E2D] to-[#5a3921] text-white hover:shadow-xl transform hover:scale-105"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  <span className="btn-icon">💌</span>
                  <span className="btn-text">
                    {isSubmitting ? "Mengirim..." : "Kirim Konfirmasi"}
                  </span>
                </button>
              </form>
            </div>

            {/* Status Message */}
            {confirmationStatus && (
              <div
                className={`mt-4 text-center text-sm p-3 rounded-lg ${
                  confirmationStatus.type === "success"
                    ? "bg-green-100 text-green-800 border border-green-200"
                    : "bg-red-100 text-red-800 border border-red-200"
                }`}
              >
                {confirmationStatus.message}
              </div>
            )}
          </div>
        </section>

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
            {pesanTamu.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">💌</div>
                <p className="text-[#5a3921] text-lg">
                  Jadilah yang pertama mengirimkan ucapan!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pesanTamu.map(
                  (tamu: {
                    id: string;
                    nama: string;
                    keterangan: string;
                    tanggal: string;
                    pesan: string;
                    kehadiran: string;
                    jumlahTamu: number;
                  }) => (
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
                  )
                )}
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
