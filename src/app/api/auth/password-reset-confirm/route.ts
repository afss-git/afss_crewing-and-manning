import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = "https://crewing-mvp.onrender.com/api/v1";

// POST - Confirm password reset with code and new password
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, code, new_password } = body;

    if (!email) {
      return NextResponse.json(
        { detail: "Email is required" },
        { status: 400 }
      );
    }

    if (!code) {
      return NextResponse.json(
        { detail: "Reset code is required" },
        { status: 400 }
      );
    }

    if (!new_password) {
      return NextResponse.json(
        { detail: "New password is required" },
        { status: 400 }
      );
    }

    if (new_password.length < 8) {
      return NextResponse.json(
        { detail: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    const response = await fetch(
      `${API_BASE_URL}/auth/password-reset-confirm`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email, code, new_password }),
      }
    );

    const contentType = response.headers.get("content-type");
    let data;

    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      const text = await response.text();
      data = { msg: text || "Request processed" };
    }

    if (!response.ok) {
      // Handle validation errors from backend
      if (data.detail && Array.isArray(data.detail)) {
        const errorMsg = data.detail
          .map((e: { msg: string }) => e.msg)
          .join(", ");
        return NextResponse.json(
          { detail: errorMsg },
          { status: response.status }
        );
      }
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Password reset confirm error:", error);
    return NextResponse.json(
      { detail: "Failed to reset password" },
      { status: 500 }
    );
  }
}
