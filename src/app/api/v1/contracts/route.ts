import { NextRequest, NextResponse } from "next/server";
import { getExternalApiToken } from "@/lib/externalApiToken";

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

    // Extract token (from external API) - no local verification needed
    const token = authHeader.substring(7);
    console.log(`🔗 Fetching contracts with external API token...`);

    // Pass the user's token directly to external API
    const externalResponse = await fetch(
      "https://crewing-mvp.onrender.com/api/v1/contracts",
      {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!externalResponse.ok) {
      console.error(`❌ External API error: ${externalResponse.status}`);
      return NextResponse.json(
        { detail: `External API error: ${externalResponse.status}` },
        { status: externalResponse.status },
      );
    }

    const contracts = await externalResponse.json();
    console.log(`✅ Successfully fetched contracts from external API`);

    return NextResponse.json(contracts, { status: 200 });
  } catch (error) {
    console.error("Get contracts error:", error);
    return NextResponse.json(
      { detail: "Failed to fetch contracts" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { detail: "Authentication required" },
        { status: 401 },
      );
    }

    // Extract token (from external API) - no local verification needed
    const token = authHeader.substring(7);
    console.log(`🔗 Creating contract for authenticated user...`);

    const body = await request.json();
    console.log(
      `📤 Sending contract data to external API:`,
      JSON.stringify(body, null, 2)
    );

    const externalResponse = await fetch(
      "https://crewing-mvp.onrender.com/api/v1/contracts",
      {
        method: "POST",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      },
    );

    const responseText = await externalResponse.text();
    console.log(
      `📥 External API response status: ${externalResponse.status}`,
      `Content-Type: ${externalResponse.headers.get("content-type")}`,
      `Response text: ${responseText.substring(0, 500)}`
    );

    if (!externalResponse.ok) {
      let errorData;
      try {
        errorData = JSON.parse(responseText);
      } catch {
        errorData = { raw: responseText };
      }
      console.error(
        `❌ External API error: ${externalResponse.status}`,
        JSON.stringify(errorData, null, 2),
      );
      return NextResponse.json(
        {
          detail:
            errorData.detail ||
            errorData.message ||
            errorData.error ||
            responseText ||
            "Failed to create contract",
        },
        { status: externalResponse.status },
      );
    }

    const contract = JSON.parse(responseText);
    console.log(`✅ Contract created successfully:`, contract);

    return NextResponse.json(contract, { status: 201 });
  } catch (error) {
    console.error("Create contract error:", error);
    const errorMsg =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { detail: errorMsg },
      { status: 500 },
    );
  }
}
