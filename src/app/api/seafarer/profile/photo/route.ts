import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = "https://crewing-mvp.onrender.com/api/v1";

// PUT - Update profile photo only
export async function PUT(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader) {
      return NextResponse.json(
        { detail: "Authorization header missing" },
        { status: 401 }
      );
    }

    console.log("Photo update request - Auth header:", authHeader);

    // Get the form data from the request
    const formData = await request.formData();
    const profilePhoto = formData.get("profile_photo");

    if (!profilePhoto || !(profilePhoto instanceof File)) {
      console.error("Invalid file:", profilePhoto);
      return NextResponse.json(
        { detail: "No valid profile photo provided" },
        { status: 400 }
      );
    }

    console.log("Photo update - File info:", {
      name: profilePhoto.name,
      size: profilePhoto.size,
      type: profilePhoto.type
    });

    // Create new FormData to send to backend - ensure exact same field name
    const backendFormData = new FormData();
    backendFormData.append("profile_photo", profilePhoto);

    console.log("Sending request to:", `${API_BASE_URL}/seafarers/profile/photo`);

    const response = await fetch(`${API_BASE_URL}/seafarers/profile/photo`, {
      method: "PUT", 
      headers: {
        Authorization: authHeader,
        // Note: No Content-Type header - let browser set multipart boundary
      },
      body: backendFormData,
    });

    // Parse response
    const text = await response.text();
    let data;
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      data = { detail: text || "Unknown response from server" };
    }

    console.log("External API response:", {
      status: response.status,
      statusText: response.statusText,
      data: data,
      responseText: text
    });

    if (!response.ok) {
      console.error("External API error:", response.status, data);
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Profile photo update error:", error);
    return NextResponse.json(
      { detail: "Failed to update profile photo" },
      { status: 500 }
    );
  }
}
