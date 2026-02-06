import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = "https://crewing-mvp.onrender.com/api/v1";

export async function GET(request: NextRequest) {
  try {
    // Get the authorization header from the incoming request
    const authHeader = request.headers.get("Authorization");

    if (!authHeader) {
      return NextResponse.json(
        { detail: "Authorization header is required" },
        { status: 401 }
      );
    }

    console.log("Fetching profile with auth:", authHeader);

    const response = await fetch(`${API_BASE_URL}/seafarers/profile`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: authHeader,
      },
    });

    // Try to parse response as JSON
    const text = await response.text();
    let data;
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      data = { detail: text || "Unknown response from server" };
    }

    console.log("Profile fetch response:", {
      status: response.status,
      data: data,
      hasProfilePhoto: !!(data?.profile_photo_url)
    });

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Profile fetch proxy error:", error);
    return NextResponse.json(
      { detail: "Failed to connect to the profile server." },
      { status: 500 }
    );
  }
}
