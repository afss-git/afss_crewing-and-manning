import { NextRequest, NextResponse } from "next/server";
import { getExternalApiToken } from "../../../../lib/externalApiToken";

const API_BASE_URL = "https://crewing-mvp.onrender.com/api/v1";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, code } = body;

    // Validate required fields
    if (!email || !code) {
      return NextResponse.json(
        { detail: "Email and verification code are required" },
        { status: 400 },
      );
    }

    // Get external API token (auto-refreshes if expired)
    const externalApiToken = await getExternalApiToken();

    console.log("Verify-email request:", {
      email,
      code: code.length + " digits",
    });

    const response = await fetch(`${API_BASE_URL}/auth/verify-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${externalApiToken}`,
      },
      body: JSON.stringify({ email, code }),
    });

    const text = await response.text();
    console.log("Verify-email response:", {
      status: response.status,
      body: text,
    });

    let data;
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      data = { detail: text || "Invalid response from server" };
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Verification proxy error:", error);
    return NextResponse.json(
      { detail: "Failed to connect to the verification server." },
      { status: 500 },
    );
  }
}
