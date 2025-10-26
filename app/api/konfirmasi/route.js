// app/api/konfirmasi/route.js
import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";

const dataFilePath = path.join(process.cwd(), "public", "data", "tamu.json");

// Helper function untuk baca file
async function readDataFile() {
  try {
    const data = await fs.readFile(dataFilePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    // Jika file tidak ada, buat array kosong
    return [];
  }
}

// Helper function untuk tulis file
async function writeDataFile(data) {
  // Pastikan folder exists
  const dir = path.dirname(dataFilePath);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2));
}

// GET handler - untuk membaca data
export async function GET(request) {
  try {
    console.log("GET request to /api/konfirmasi");
    const data = await readDataFile();

    return NextResponse.json({
      success: true,
      data: data,
      count: data.length,
    });
  } catch (error) {
    console.error("Error in GET:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Gagal membaca data",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// POST handler - untuk menyimpan data baru
export async function POST(request) {
  try {
    console.log("POST request to /api/konfirmasi");
    const body = await request.json();

    console.log("Received data:", body);

    // Validasi data
    if (!body.nama || !body.kehadiran) {
      return NextResponse.json(
        {
          success: false,
          message: "Data tidak lengkap. Nama dan kehadiran wajib diisi.",
        },
        { status: 400 }
      );
    }

    // Baca data existing
    const existingData = await readDataFile();

    // Data baru
    const newData = {
      id: Date.now().toString(),
      nama: body.nama,
      jumlahTamu: body.jumlahTamu || 1,
      salam: body.salam || "",
      keterangan: body.keterangan || "",
      kehadiran: body.kehadiran,
      pesan: body.pesan || "",
      tanggal: new Date().toISOString(),
      timestamp: Date.now(),
    };

    console.log("New data to save:", newData);

    // Tambah ke array
    existingData.push(newData);

    // Tulis ke file
    await writeDataFile(existingData);

    console.log("Data saved successfully");

    return NextResponse.json(
      {
        success: true,
        message: "Konfirmasi berhasil disimpan",
        data: newData,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in POST:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Gagal menyimpan konfirmasi",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// OPTIONAL: Handler untuk method lainnya
export async function PUT(request) {
  return NextResponse.json(
    { success: false, message: "Method not allowed" },
    { status: 405 }
  );
}

export async function DELETE(request) {
  return NextResponse.json(
    { success: false, message: "Method not allowed" },
    { status: 405 }
  );
}
