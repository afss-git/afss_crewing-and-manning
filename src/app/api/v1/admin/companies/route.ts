import { NextRequest, NextResponse } from "next/server";
import auth from "../../../../../lib/auth";
import { getExternalApiToken } from "../../../../../lib/externalApiToken";

const API_BASE_URL = "https://crewing-mvp.onrender.com/api/v1";

export async function GET(request: NextRequest) {
  try {
    const check = auth.requireAdmin(request as unknown as Request);
    if (!check.ok) {
      return NextResponse.json(
        { detail: check.detail },
        { status: check.status }
      );
    }

    // Get the external API token
    const externalApiToken = await getExternalApiToken();

    // Fetch all companies from external API
    const response = await fetch(`${API_BASE_URL}/admin/companies`, {
      method: "GET",
      headers: {
        "accept": "application/json",
        "Authorization": `Bearer ${externalApiToken}`,
      },
    });

    console.log('Companies API - External response status:', response.status);

    if (!response.ok) {
      console.error("External API error:", response.status, response.statusText);
      return NextResponse.json(
        { detail: `External API error: ${response.status}` },
        { status: response.status }
      );
    }

    const companiesData = await response.json();
    console.log('Companies API - Retrieved companies:', companiesData.length);

    // Return the companies data
    return NextResponse.json(companiesData, { status: 200 });

  } catch (err: unknown) {
    console.error("Admin companies fetch error:", err);
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ detail: message }, { status: 500 });
  }
}
