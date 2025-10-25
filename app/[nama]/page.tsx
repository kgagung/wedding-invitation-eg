import { Metadata } from "next";
import tamuData from "../../data/tamu.json";
import UndanganClient from "../../components/UndanganClient";

interface PageProps {
  params: Promise<{
    nama: string;
  }>;
}

// Fungsi untuk decode nama dengan error handling
function decodeNama(nama: string): string {
  try {
    return decodeURIComponent(nama);
  } catch {
    return nama;
  }
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { nama } = await params;
  const namaDecoded = decodeNama(nama);

  const dataTamu = (tamuData as any)[nama] || {
    nama: namaDecoded.replace(/-/g, " "),
  };

  return {
    title: `Undangan Pernikahan - ${dataTamu.nama}`,
    description: `Undangan pernikahan adat Jawa untuk ${dataTamu.nama}`,
  };
}

export async function generateStaticParams() {
  return Object.keys(tamuData).map((nama) => ({
    nama: nama,
  }));
}

export default async function UndanganPage({ params }: PageProps) {
  const { nama } = await params;
  const namaDecoded = decodeNama(nama);

  const dataTamu = (tamuData as any)[nama] || {
    nama: namaDecoded.replace(/-/g, " "),
    jumlahTamu: 2,
    salam: "Bapak/Ibu/Saudara/i",
    keterangan: "Tamu Undangan",
  };

  return <UndanganClient dataTamu={dataTamu} />;
}
