import { NextRequest, NextResponse } from "next/server";
import auth from "../../../../../lib/auth";

export async function GET(req: NextRequest) {
  const check = auth.requireAdmin(req as unknown as Request);
  if (!check.ok) {
    return NextResponse.json(
      { detail: check.detail },
      { status: check.status }
    );
  }

  try {
    // Get the external API token from environment variables
    const externalApiToken = process.env.EXTERNAL_API_TOKEN;

    if (!externalApiToken) {
      return NextResponse.json(
        { detail: "External API token not configured" },
        { status: 500 }
      );
    }

    // Call the external API with the external token
    const externalResponse = await fetch("https://crewing-mvp.onrender.com/api/v1/admin/seafarers", {
      method: "GET",
      headers: {
        "accept": "application/json",
        "Authorization": `Bearer ${externalApiToken}`,
      },
    });

    if (!externalResponse.ok) {
      console.error("External API error:", externalResponse.status, externalResponse.statusText);
      return NextResponse.json(
        { detail: `External API error: ${externalResponse.status}` },
        { status: externalResponse.status }
      );
    }

    const data = await externalResponse.json();
    return NextResponse.json(data, { status: 200 });

  } catch (err: unknown) {
    console.error("Failed to fetch seafarers:", err);
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ detail: message }, { status: 500 });
  }
}
