import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    // Validasi credentials dari environment variables
    const adminUsername = process.env.ADMIN_USERNAME;
    const adminPassword = process.env.ADMIN_PASSWORD;
    const adminSecret = process.env.ADMIN_SECRET;

    if (!adminUsername || !adminPassword) {
      return NextResponse.json(
        { success: false, message: "Admin credentials not configured" },
        { status: 500 }
      );
    }

    if (username === adminUsername && password === adminPassword) {
      // Generate simple token (bisa diganti dengan JWT yang lebih aman)
      const token = btoa(`${username}:${Date.now()}:${adminSecret}`);

      return NextResponse.json({
        success: true,
        message: "Login berhasil",
        token: token,
      });
    } else {
      return NextResponse.json(
        { success: false, message: "Username atau password salah" },
        { status: 401 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan" },
      { status: 500 }
    );
  }
}
