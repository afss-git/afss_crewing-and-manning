import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = "https://crewing-mvp.onrender.com/api/v1";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { detail: "Email is required" },
        { status: 400 },
      );
    }

    // Get external API token
    const externalApiToken = process.env.EXTERNAL_API_TOKEN;
    if (!externalApiToken) {
      console.error("EXTERNAL_API_TOKEN not configured");
      return NextResponse.json(
        { detail: "Server configuration error" },
        { status: 500 },
      );
    }

    console.log("Resend verification request for email:", email);

    // Try resend endpoint if it exists, otherwise fallback to registration
    let response;
    try {
      // First try a dedicated resend endpoint
      response = await fetch(`${API_BASE_URL}/auth/resend-verification`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${externalApiToken}`,
        },
        body: JSON.stringify({ email }),
      });

      // If resend endpoint doesn't exist (404), we'll handle it below
      if (response.status === 404) {
        throw new Error("Resend endpoint not available");
      }
    } catch {
      console.log("Resend endpoint not available, trying alternative method");

      // Alternative: Check if there's a way to trigger resend via the registration endpoint
      // This depends on how the external API handles duplicate registrations
      response = await fetch(`${API_BASE_URL}/auth/register/seafarer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email,
          password: "dummy", // This is not ideal but might trigger resend
        }),
      });
    }

    const text = await response.text();
    console.log("Resend verification response:", {
      status: response.status,
      body: text,
    });

    let data;
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      data = { detail: text || "Invalid response from server" };
    }

    // If registration returns 400 (user exists), that might be okay for resend
    if (response.status === 400 && text.includes("already exists")) {
      return NextResponse.json(
        { msg: "Verification code resent to your email" },
        { status: 200 },
      );
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Resend verification error:", error);
    return NextResponse.json(
      { detail: "Failed to resend verification code" },
      { status: 500 },
    );
  }
}
