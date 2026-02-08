import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ detail: "Authentication required" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    console.log(`🔗 Forwarding crew-management POST to backend`);

    const backendUrl = "https://crew-manning.onrender.com/api/v1/crew-management";
    console.log(`📡 Calling backend API: ${backendUrl}`);

    // Read raw body to preserve multipart/form-data
    const bodyBuffer = await request.arrayBuffer();

    const headers: Record<string, string> = {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    };

    const contentType = request.headers.get("content-type");
    if (contentType) headers["content-type"] = contentType;

    const externalResponse = await fetch(backendUrl, {
      method: "POST",
      headers,
      body: bodyBuffer,
    });

    const respContentType = externalResponse.headers.get("content-type");
    let responseData: any;
    if (respContentType?.includes("application/json")) {
      responseData = await externalResponse.json();
    } else {
      responseData = await externalResponse.text();
    }

    console.log(`📥 Backend API response status: ${externalResponse.status}`);
    console.log(`📥 Response data:`, typeof responseData === "string" ? responseData : JSON.stringify(responseData, null, 2));

    if (!externalResponse.ok) {
      return NextResponse.json({ detail: `Backend API error: ${externalResponse.status}`, error: responseData }, { status: externalResponse.status });
    }

    return NextResponse.json(responseData, { status: externalResponse.status });
  } catch (error) {
    console.error("Crew-management proxy error:", error);
    return NextResponse.json({ detail: "Failed to proxy crew-management request", error: String(error) }, { status: 500 });
  }
}
