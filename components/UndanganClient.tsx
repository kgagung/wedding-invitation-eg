"use client";

import { useState, useEffect } from "react";
import MusicPlayer from "./MusicPlayer";
import UndanganContent from "./UndanganContent";

interface TamuData {
  nama: string;
  salam: string;
  keterangan: string;
  jumlahTamu?: number;
}

interface UndanganClientProps {
  dataTamu: TamuData;
}

export default function UndanganClient({ dataTamu }: UndanganClientProps) {
  const [opened, setOpened] = useState(false);
  const [audioStarted, setAudioStarted] = useState(false);

  // Auto play music ketika undangan dibuka
  useEffect(() => {
    if (opened && !audioStarted) {
      setAudioStarted(true);
    }
  }, [opened, audioStarted]);

  // Debug data tamu
  console.log("Data Tamu:", dataTamu);

  if (!dataTamu?.nama) {
    return (
      <div className="mobile-container">
        <div className="error-message">
          <h2>Data tamu tidak ditemukan</h2>
          <p>Silakan gunakan link undangan yang valid</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mobile-container">
      {!opened ? (
        // COVER UNDANGAN
        <div
          className="cover-container"
          style={{ marginBottom: "-70px", marginTop: "-16px" }}
        >
          <img
            src="/images/BG-1-Temaa-11.webp"
            alt="Background"
            className="absolute"
          />
          <div className="cover-content">
            <div
              className="top"
              style={{
                width: "200px",
                height: "auto",
                margin: "0 auto",
              }}
            >
              <img src="/images/gunungan-vector.png" alt="gunungan ornament" />
            </div>

            <img
              src="/images/Cloud6-Tema-11.webp"
              alt="Cloud Left"
              className="absolute top-50 left-[-200] w-80 animate-cloud-down-right z-20"
            />

            <img
              src="/images/wayang-new1-Tema-11.webp"
              alt="Cloud Left"
              className="absolute top-0 left-[-200] w-80 animate-float-medium z-10"
            />

            <img
              src="/images/Cloud6-Tema-11.webp"
              alt="Cloud Left"
              className="absolute top-50 right-[-200] w-80 animate-cloud-down-right z-20 scale-x-[-1]"
            />

            <img
              src="/images/wayang-new1-Tema-11.webp"
              alt="Cloud Left"
              className="absolute top-0 right-[-200] w-80 animate-float-medium z-10 scale-x-[-1]"
            />

            <h1
              className="text-center mt-4"
              style={{
                fontFamily: '"Cinzel Decorative", Sans-serif',
                fontSize: "24px",
                fontWeight: 600,
                color: "#5a3921",
                lineHeight: "1.2",
              }}
            >
              Undangan Pernikahan
            </h1>
            <div className="cover-jawa-title">ꦲꦸꦤ꧀ꦝꦔꦤ꧀ꦥꦼꦂꦤꦶꦏꦲꦤ꧀</div>

            <div className="couple-names">
              <h1
                className="text-center mt-4"
                style={{
                  fontFamily: '"Cinzel Decorative", Sans-serif',
                  fontSize: "42px",
                  fontWeight: 1900,
                  color: "#5a3921",
                  lineHeight: "1.2",
                }}
              >
                Erlina
                <br /> &<br />
                Galih
              </h1>
            </div>

            <div className="guest-info" style={{ marginTop: "50px" }}>
              <p className="guest-label">Kepada Yth. Bapak/Ibu/Sdr/i</p>
              <h1
                className="text-center mt-4"
                style={{
                  fontFamily: '"Nunito", Sans-serif',
                  fontSize: "32px",
                  fontWeight: 700,
                  color: "#ffffff",
                  lineHeight: "1.2",
                  marginTop: "8px",
                }}
              >
                {dataTamu.nama}
              </h1>
              {/* <p className="guest-desc">{dataTamu.keterangan}</p> */}
            </div>

            <button
              onClick={() => setOpened(true)}
              className="open-invitation-btn"
              style={{ marginBottom: "100px", marginTop: "-10px" }}
            >
              Buka Undangan
            </button>
          </div>
          {/* Awan Belakang */}
          <img
            src="/images/mempelai-bot1-tema-11-1024x468.webp"
            alt="Awan Belakang"
            className="absolute top-91 left-0 w-full z-1]"
          />

          {/* Awan Depan */}
          <img
            src="/images/mempelai-bot2-tema-11-1024x304.webp"
            alt="Awan Depan"
            className="absolute top-107 left-0 w-full z-1"
          />

          {/* Background Section */}
          <div className="absolute w-full top-[538] h-[305px] overflow-hidden z-0">
            <div
              style={{
                backgroundColor: "#8e5a2a",
                backgroundImage:
                  "linear-gradient(180deg, #8e5a2a 0%, #8e5a2a 50%, #a67c52 90%, #a67c52 100%)",

                height: "720px",
                width: "auto",
                marginBottom: "-500px",
              }}
            ></div>
          </div>
        </div>
      ) : (
        // KONTEN UNDANGAN UTAMA
        <>
          {audioStarted && <MusicPlayer autoPlay={true} />}
          <UndanganContent dataTamu={dataTamu} />
        </>
      )}
    </div>
  );
}
