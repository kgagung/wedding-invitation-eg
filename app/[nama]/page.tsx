import { Metadata } from "next";
import { notFound } from "next/navigation";
import tamuData from "../../data/tamu.json";
import UndanganClient from "../../components/UndanganClient";

interface PageProps {
  params: Promise<{
    nama: string;
  }>;
}

interface TamuData {
  [key: string]: {
    nama: string;
    salam: string;
    keterangan: string;
    jumlahTamu?: number; // Jadikan optional
  };
}

// Fungsi untuk decode nama dengan error handling
function decodeNama(nama: string): string {
  try {
    return decodeURIComponent(nama);
  } catch {
    return nama;
  }
}

// Normalize nama untuk comparison
function normalizeNama(nama: string): string {
  return decodeNama(nama)
    .toLowerCase()
    .replace(/-/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// Fungsi untuk cek apakah nama ada di data tamu
function isValidTamu(nama: string): boolean {
  const normalizedNama = normalizeNama(nama);
  const namaKeys = Object.keys(tamuData as TamuData);

  return namaKeys.some((key) => {
    const normalizedKey = normalizeNama(key);
    return normalizedKey === normalizedNama;
  });
}

// Fungsi untuk mendapatkan data tamu dengan default values
function getTamuData(nama: string) {
  const normalizedNama = normalizeNama(nama);
  const namaKeys = Object.keys(tamuData as TamuData);

  // Cari exact match di keys
  const exactMatch = namaKeys.find(
    (key) => normalizeNama(key) === normalizedNama
  );

  if (exactMatch) {
    const data = (tamuData as TamuData)[exactMatch];

    // Return dengan default values untuk property yang missing
    return {
      nama: data.nama,
      salam: data.salam,
      keterangan: data.keterangan,
      jumlahTamu: data.jumlahTamu || 2, // Default 2 orang
    };
  }

  return null;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { nama } = await params;

  if (!isValidTamu(nama)) {
    return {
      title: "Undangan Tidak Ditemukan",
      description: "Halaman undangan tidak ditemukan",
    };
  }

  const dataTamu = getTamuData(nama);
  const namaTamu = dataTamu?.nama || decodeNama(nama).replace(/-/g, " ");

  return {
    title: `Undangan Pernikahan - ${namaTamu}`,
    description: `Undangan pernikahan adat Jawa untuk ${namaTamu}`,
    robots: "noindex, nofollow",
  };
}

export async function generateStaticParams() {
  const namaKeys = Object.keys(tamuData as TamuData);

  return namaKeys.map((nama) => ({
    nama: nama,
  }));
}

export default async function UndanganPage({ params }: PageProps) {
  const { nama } = await params;

  // Cek jika nama tidak valid
  if (!isValidTamu(nama)) {
    notFound();
  }

  const dataTamu = getTamuData(nama);

  if (!dataTamu) {
    notFound();
  }

  return <UndanganClient dataTamu={dataTamu} />;
}
