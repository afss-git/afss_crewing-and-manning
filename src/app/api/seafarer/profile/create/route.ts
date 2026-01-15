import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = "https://crewing-mvp.onrender.com/api/v1";

export async function POST(request: NextRequest) {
  try {
    // Get the authorization header from the incoming request
    const authHeader = request.headers.get("Authorization");

    if (!authHeader) {
      return NextResponse.json(
        { detail: "Authorization header is required" },
        { status: 401 }
      );
    }

    // Get the form data from the request
    const formData = await request.formData();

    // Forward the request to the backend API
    const response = await fetch(`${API_BASE_URL}/seafarers/profile`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: authHeader,
        // Don't set Content-Type - let fetch set it with the boundary for multipart
      },
      body: formData,
    });

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
    console.error("Profile creation proxy error:", error);
    return NextResponse.json(
      { detail: "Failed to connect to the profile server." },
      { status: 500 }
    );
  }
}
