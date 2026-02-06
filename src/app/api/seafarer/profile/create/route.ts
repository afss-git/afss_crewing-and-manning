import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = "https://crewing-mvp.onrender.com/api/v1";

export async function POST(request: NextRequest) {
  try {
    // Get user's JWT token from the request (not admin token)
    const authHeader = request.headers.get("Authorization");

    if (!authHeader) {
      return NextResponse.json(
        { detail: "User authentication required" },
        { status: 401 },
      );
    }

    // Debug: Log the token being sent
    console.log("Token being sent to external API:", authHeader);

    // Get the form data from the request
    const formData = await request.formData();

    // Debug: Log all form data being sent
    console.log("Form data being sent:");
    for (const [key, value] of formData.entries()) {
      console.log(`  ${key}:`, value);
    }

    // Convert years_of_experience to integer if present
    const yearsExp = formData.get("years_of_experience");
    if (yearsExp && yearsExp !== "") {
      const intValue = parseInt(yearsExp.toString());
      formData.set("years_of_experience", intValue.toString());
      console.log(`  years_of_experience converted to: ${intValue}`);
    }

    // Forward the request with user's JWT token
    const response = await fetch(`${API_BASE_URL}/seafarers/profile`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: authHeader, // Use user's JWT, not admin token
      },
      body: formData,
    });

    // Parse response
    const text = await response.text();
    let data;
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      data = { detail: text || "Unknown response from server" };
    }

    // Enhanced debugging for external API errors
    if (!response.ok) {
      console.error("External API Error:", {
        status: response.status,
        statusText: response.statusText,
        url: `${API_BASE_URL}/seafarers/profile`,
        data: data,
        responseText: text,
      });
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Profile creation proxy error:", error);
    return NextResponse.json(
      { detail: "Failed to connect to the profile server." },
      { status: 500 },
    );
  }
}
