import { NextRequest, NextResponse } from "next/server";
import { getExternalApiToken } from "@/lib/externalApiToken";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ contract_id: string }> },
) {
  try {
    const { contract_id } = await params;
    const authHeader = request.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { detail: "Authentication required" },
        { status: 401 },
      );
    }

    // Extract token (from external API) - no local verification needed
    const token = authHeader.substring(7);
    console.log(`🔗 Fetching contract ${contract_id} with external API token...`);

    // Pass the user's token directly to external API
    const externalResponse = await fetch(
      `https://crewing-mvp.onrender.com/api/v1/contracts/${contract_id}`,
      {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!externalResponse.ok) {
      console.error(
        `❌ External API error: ${externalResponse.status}`,
        await externalResponse.text()
      );
      return NextResponse.json(
        { detail: `External API error: ${externalResponse.status}` },
        { status: externalResponse.status },
      );
    }

    const contract = await externalResponse.json();
    console.log(`✅ Successfully fetched contract ${contract_id}`);

    return NextResponse.json(contract, { status: 200 });
  } catch (error) {
    console.error("Get contract error:", error);
    return NextResponse.json(
      { detail: "Failed to fetch contract" },
      { status: 500 },
    );
  }
}
