import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.BACKEND_URL || "https://crew-manning.onrender.com/api/v1";

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader) {
      return NextResponse.json({ detail: "Authorization header missing" }, { status: 401 });
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    try {
      const res = await fetch(`${API_BASE_URL}/seafarers/dashboard`, {
        method: "GET",
        headers: {
          Authorization: authHeader,
          Accept: "application/json",
        },
        signal: controller.signal,
      });

      clearTimeout(timeout);

      // Forward the backend response body and status directly to the frontend.
      // This avoids any accidental filtering or shape changes.
      const backendBody = await res.arrayBuffer();
      const contentType = res.headers.get("content-type") || "application/json";

      if (!res.ok) {
        console.error("Dashboard proxy backend error:", res.status);
        // Still forward the backend body so frontend can inspect error details.
      }

      return new NextResponse(backendBody, {
        status: res.status,
        headers: { "content-type": contentType },
      });
    } catch (err: any) {
      clearTimeout(timeout);
      if (err.name === "AbortError") {
        console.error("Dashboard fetch timeout");
        return NextResponse.json({ documents: [], meetings: [] }, { status: 200 });
      }
      throw err;
    }
  } catch (error) {
    console.error("Dashboard route error:", error);
    return NextResponse.json({ documents: [], meetings: [] }, { status: 200 });
  }
}
