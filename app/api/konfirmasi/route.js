// app/api/konfirmasi/route.js
import { NextResponse } from "next/server";

// Ganti dengan Web App URL Anda
const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbxpPSfl4W45xIxvM6L6SmDjQZBk8gk0pYEkNFrQ-Vv51fnmulmVC3WLD4tkiaAYrvYgZg/exec";

export async function GET(request) {
  try {
    console.log("Fetching data from Google Sheets...");

    const response = await fetch(GOOGLE_SCRIPT_URL);
    const result = await response.json();

    console.log("Google Sheets response:", result);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching from Google Sheets:", error);
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

export async function POST(request) {
  try {
    const body = await request.json();

    console.log("Sending data to Google Sheets:", body);

    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...body,
        id: Date.now().toString(),
        tanggal: new Date().toISOString(),
      }),
    });

    const result = await response.json();
    console.log("Google Sheets POST response:", result);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error posting to Google Sheets:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Gagal menyimpan data",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
