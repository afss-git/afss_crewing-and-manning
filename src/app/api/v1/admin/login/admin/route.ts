import { NextRequest, NextResponse } from "next/server";

// Use environment variable for flexibility - NO TRAILING SPACES!
const API_BASE_URL = process.env.BACKEND_URL || "http://127.0.0.1:8000/api/v1";

export async function POST(request: NextRequest) {
  try {
    // Parse query parameters from the request URL
    const searchParams = request.nextUrl.searchParams;
    const email = searchParams.get("email");
    const password = searchParams.get("password");

    if (!email || !password) {
      return NextResponse.json(
        { detail: "Email and password are required" },
        { status: 400 },
      );
    }

    console.log(
      "📡 Forwarding admin login request to:",
      `${API_BASE_URL}/admin/login/admin`,
    );
    console.log("📧 Email:", email);

    // Call the backend admin endpoint with query parameters
    const response = await fetch(
      `${API_BASE_URL}/admin/login/admin?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`,
      {
        method: "POST",
        headers: {
          accept: "application/json",
        },
      },
    );

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
    console.error("Admin login proxy error:", error);
    return NextResponse.json(
      { detail: "Failed to connect to the authentication server." },
      { status: 500 },
    );
  }
}
