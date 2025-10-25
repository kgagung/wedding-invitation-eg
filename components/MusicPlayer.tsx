"use client";

import { useState, useEffect, useRef } from "react";

interface MusicPlayerProps {
  autoPlay?: boolean;
}

export default function MusicPlayer({ autoPlay = false }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize audio
    audioRef.current = new Audio(
      "/audio/Nadin Amizah - Berpayung Tuhan (Official Music Video) - Nadin Amizah.mp3"
    ); // Ganti dengan file musik Anda
    audioRef.current.loop = true;

    // Auto play jika diminta
    if (autoPlay) {
      const playAudio = async () => {
        try {
          await audioRef.current?.play();
          setIsPlaying(true);
        } catch (error) {
          console.warn("Auto-play blocked:", error);
          // User perlu interaksi manual
        }
      };

      playAudio();
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [autoPlay]);

  const toggleMusic = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch((e) => {
          console.warn("Audio play failed:", e);
        });
    }
  };

  // Sembunyikan tombol jika auto-play berhasil
  if (isPlaying && autoPlay) {
    return null; // Tidak render tombol jika auto-play berhasil
  }

  return (
    <button className="music-toggle-btn" onClick={toggleMusic}>
      {isPlaying ? "🔇" : "🎵"}
    </button>
  );
}
