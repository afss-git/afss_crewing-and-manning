import { NextRequest, NextResponse } from "next/server";
import auth from "../../../../../../lib/auth";
import { getExternalApiToken } from "../../../../../../lib/externalApiToken";

export async function GET(req: NextRequest) {
  const check = auth.requireAdmin(req as unknown as Request);
  if (!check.ok) {
    return NextResponse.json(
      { detail: check.detail },
      { status: check.status },
    );
  }

  try {
    console.log(`🔗 Authenticated admin fetching pending documents...`);

    const externalApiToken = await getExternalApiToken();

    const externalResponse = await fetch(
      "https://crewing-mvp.onrender.com/api/v1/admin/documents/pending",
      {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${externalApiToken}`,
        },
      },
    );

    if (!externalResponse.ok) {
      console.error(
        `❌ External API error: ${externalResponse.status} ${externalResponse.statusText}`,
      );
      return NextResponse.json(
        {
          detail: `External API error: ${externalResponse.status}`,
          externalApiStatus: externalResponse.status,
        },
        { status: externalResponse.status },
      );
    }

    const data = await externalResponse.json();
    console.log(`✅ Successfully fetched pending documents from external API`);

    return NextResponse.json(
      {
        count: data.length || 0,
        documents: data,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Get pending documents error:", error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: "Failed to fetch pending documents", detail: message },
      { status: 500 },
    );
  }
}
