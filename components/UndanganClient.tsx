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
        <div className="cover-container">
          <div className="cover-background"></div>
          <div className="cover-content">
            <div className="cover-ornament top">
              <img src="/images/bunga-banyak.png" alt="Bunga Ornament" />
            </div>

            <h1 className="cover-title">Undangan Pernikahan</h1>
            <div className="cover-jawa-title">ꦲꦸꦤ꧀ꦝꦔꦤ꧀ꦥꦼꦂꦤꦶꦏꦲꦤ꧀</div>

            <div className="couple-names">
              <h2>Erlina & Galih</h2>
            </div>

            <div className="guest-info">
              <p className="guest-label">Kepada Yth:</p>
              <h3 className="guest-name">{dataTamu.nama}</h3>
              <p className="guest-desc">{dataTamu.keterangan}</p>
            </div>

            <button
              onClick={() => setOpened(true)}
              className="open-invitation-btn"
            >
              Buka Undangan
            </button>

            <div className="cover-ornament bottom">
              <img src="/images/bunga-banyak.png" alt="Bunga Ornament" />
            </div>
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
