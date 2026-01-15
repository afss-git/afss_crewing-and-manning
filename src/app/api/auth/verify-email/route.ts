import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = "https://crewing-mvp.onrender.com/api/v1";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Log what we're sending
    console.log("Verify-email request body:", body);

    const response = await fetch(`${API_BASE_URL}/auth/verify-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    });

    // Try to parse response as JSON
    const text = await response.text();

    // Log the raw response
    console.log("Verify-email response:", {
      status: response.status,
      body: text,
    });

    let data;
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      data = { detail: text || "Unknown response from server" };
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Verification proxy error:", error);
    return NextResponse.json(
      { detail: "Failed to connect to the verification server." },
      { status: 500 }
    );
  }
}
