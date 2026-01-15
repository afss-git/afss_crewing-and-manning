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

    // Get the form data from the request
    const formData = await request.formData();
    const profilePhoto = formData.get("profile_photo");

    if (!profilePhoto) {
      return NextResponse.json(
        { detail: "No profile photo provided" },
        { status: 400 }
      );
    }

    // Create new FormData to send to backend
    const backendFormData = new FormData();
    backendFormData.append("profile_photo", profilePhoto);

    const response = await fetch(`${API_BASE_URL}/seafarers/profile/photo`, {
      method: "PUT",
      headers: {
        Authorization: authHeader,
        // Don't set Content-Type - let fetch set it with boundary for multipart
      },
      body: backendFormData,
    });

    const data = await response.json();

    if (!response.ok) {
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
