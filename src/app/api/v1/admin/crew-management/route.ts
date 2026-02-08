import { NextRequest, NextResponse } from "next/server";
import auth from "../../../../../lib/auth";
import { getExternalApiToken } from "../../../../../lib/externalApiToken";

interface CrewManagementApi {
  id: number;
  reference_number: string;
  status: string;
  admin_notes: string;
  vessel_name: string;
  imo_number: string;
  vessel_type: string;
  vessel_flag: string;
  operational_routes: string;
  services: string[];
  commencement_date: string;
  duration: string;
  documents: Array<{
    id: number;
    file_name: string;
    file_url: string;
    file_size: string;
    uploaded_at: string;
  }>;
}

export async function GET(req: NextRequest) {
  const check = auth.requireAdmin(req as unknown as Request);
  if (!check.ok) {
    return NextResponse.json(
      { detail: check.detail },
      { status: check.status },
    );
  }

  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    const externalApiToken = await getExternalApiToken();

    // Build the external API URL with optional status filter
    let externalUrl = `https://crewing-mvp.onrender.com/api/v1/admin/crew-management`;
    if (status) {
      externalUrl += `?status=${encodeURIComponent(status)}`;
    }

    // Call the external API
    const externalResponse = await fetch(externalUrl, {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${externalApiToken}`,
      },
    });

    if (!externalResponse.ok) {
      console.error(
        "External API error:",
        externalResponse.status,
        externalResponse.statusText,
      );
      return NextResponse.json(
        { detail: `External API error: ${externalResponse.status}` },
        { status: externalResponse.status },
      );
    }

    const externalData: CrewManagementApi[] = await externalResponse.json();

    return NextResponse.json(externalData, { status: 200 });
  } catch (err: unknown) {
    console.error("Failed to fetch crew management requests:", err);
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ detail: message }, { status: 500 });
  }
}
