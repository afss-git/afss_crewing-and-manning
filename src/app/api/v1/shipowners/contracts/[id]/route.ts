import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = "https://crewing-mvp.onrender.com/api/v1";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const authHeader = request.headers.get("authorization");

    if (!authHeader) {
      return NextResponse.json(
        { detail: "Authorization header missing" },
        { status: 401 },
      );
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);

    try {
      const res = await fetch(`${API_BASE_URL}/shipowners/contracts/${id}`, {
        method: "GET",
        headers: {
          Authorization: authHeader,
          Accept: "application/json",
        },
        signal: controller.signal,
      });

      clearTimeout(timeout);

      // Forward backend response body and status directly
      const backendBody = await res.arrayBuffer();
      const contentType = res.headers.get("content-type") || "application/json";

      return new NextResponse(backendBody, {
        status: res.status,
        headers: { "content-type": contentType },
      });
    } catch (err: any) {
      clearTimeout(timeout);
      if (err.name === "AbortError") {
        console.error("Shipowner contract fetch timeout");
        return NextResponse.json(
          { detail: "Request timeout" },
          { status: 504 },
        );
      }
      throw err;
    }
  } catch (error) {
    console.error("Shipowner contract route error:", error);
    return NextResponse.json(
      { detail: "Failed to fetch contract" },
      { status: 500 },
    );
  }
}
