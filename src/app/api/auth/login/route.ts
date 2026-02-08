import { NextRequest, NextResponse } from "next/server";

// Use environment variable for flexibility - NO TRAILING SPACES!
const API_BASE_URL =
  process.env.BACKEND_URL || "https://crewing-mvp.onrender.com/api/v1";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // The external API expects form-urlencoded data
    const formData = new URLSearchParams();
    formData.append("email", email);
    formData.append("password", password);

    console.log(
      "📡 Forwarding login request to:",
      `${API_BASE_URL}/auth/login`,
    );
    console.log("📧 Email:", email);

    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
      body: formData.toString(),
    });

    console.log("📡 Backend response status:", response.status);

    // Try to parse response as JSON
    const text = await response.text();
    let data;
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      data = { detail: text || "Unknown response from server" };
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Login proxy error:", error);
    return NextResponse.json(
      { detail: "Failed to connect to the authentication server." },
      { status: 500 },
    );
  }
}
