import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { detail: "Authentication required" },
        { status: 401 },
      );
    }

    // Extract token
    const token = authHeader.substring(7);
    console.log(
      `🔗 Fetching shipowner dashboard contracts...`,
    );

    const backendUrl =
      "https://crew-manning.onrender.com/api/v1/shipowners/dashboard/contracts";
    console.log(`📡 Calling backend API: ${backendUrl}`);

    // Pass the user's token to the backend API
    const externalResponse = await fetch(backendUrl, {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const contentType = externalResponse.headers.get("content-type");
    let responseData: any;

    if (contentType?.includes("application/json")) {
      responseData = await externalResponse.json();
    } else {
      responseData = await externalResponse.text();
    }

    console.log(`📥 Backend API response status: ${externalResponse.status}`);
    console.log(`📥 Response data:`, JSON.stringify(responseData, null, 2));

    if (!externalResponse.ok) {
      console.error(`❌ Backend API error: ${externalResponse.status}`);
      return NextResponse.json(
        {
          detail: `Backend API error: ${externalResponse.status}`,
          error: responseData,
        },
        { status: externalResponse.status },
      );
    }

    console.log(`✅ Successfully fetched shipowner dashboard from backend API`);

    return NextResponse.json(responseData, { status: 200 });
  } catch (error) {
    console.error("Get shipowner dashboard error:", error);
    return NextResponse.json(
      { detail: "Failed to fetch shipowner dashboard", error: String(error) },
      { status: 500 },
    );
  }
}
