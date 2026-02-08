import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ ref: string }> }
) {
  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { detail: "Authentication required" },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const { ref } = await params;

    console.log(`🔗 Fetching assigned seafarers for contract ${ref}...`);

    const backendUrl = `https://crew-manning.onrender.com/api/v1/shipowners/contracts/full-crew/${ref}/seafarers`;
    console.log(`📡 Calling backend API: ${backendUrl}`);

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
    console.log(
      `📥 Response data:`,
      JSON.stringify(responseData, null, 2)
    );

    if (!externalResponse.ok) {
      console.error(`❌ Backend API error: ${externalResponse.status}`);
      return NextResponse.json(
        {
          detail: `Backend API error: ${externalResponse.status}`,
          error: responseData,
        },
        { status: externalResponse.status }
      );
    }

    console.log(`✅ Successfully fetched assigned seafarers for contract ${ref}`);

    return NextResponse.json(responseData, { status: 200 });
  } catch (error) {
    console.error("Get assigned seafarers error:", error);
    return NextResponse.json(
      { detail: "Failed to fetch assigned seafarers", error: String(error) },
      { status: 500 }
    );
  }
}
