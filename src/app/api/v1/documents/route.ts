import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    console.log("Documents API - Auth header:", authHeader);

    if (!authHeader) {
      return NextResponse.json(
        { error: "Authorization token required" },
        { status: 401 },
      );
    }

    // Forward to external API
    const externalUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/documents`;
    console.log("Documents API - External URL:", externalUrl);

    const response = await fetch(externalUrl, {
      method: "GET",
      headers: {
        Authorization: authHeader,
        Accept: "application/json",
      },
    });

    console.log("Documents API - External response status:", response.status);

    const data = await response.json();
    console.log("Documents API - External response data:", data);

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Documents fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
