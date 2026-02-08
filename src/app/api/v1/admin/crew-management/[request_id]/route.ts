import { NextRequest, NextResponse } from "next/server";
import auth from "../../../../../../lib/auth";
import { getExternalApiToken } from "../../../../../../lib/externalApiToken";

interface CrewManagementDetailApi {
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

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ request_id: string }> },
) {
  const check = auth.requireAdmin(req as unknown as Request);
  if (!check.ok) {
    return NextResponse.json(
      { detail: check.detail },
      { status: check.status },
    );
  }

  try {
    const { request_id } = await params;

    const externalApiToken = await getExternalApiToken();

    // Call the external API to get specific request details
    const externalResponse = await fetch(
      `https://crewing-mvp.onrender.com/api/v1/admin/crew-management/${request_id}`,
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
        "External API error:",
        externalResponse.status,
        externalResponse.statusText,
      );
      if (externalResponse.status === 422) {
        const errorData = await externalResponse.json();
        return NextResponse.json(errorData, { status: 422 });
      }
      return NextResponse.json(
        { detail: `External API error: ${externalResponse.status}` },
        { status: externalResponse.status },
      );
    }

    const externalData: CrewManagementDetailApi = await externalResponse.json();

    return NextResponse.json(externalData, { status: 200 });
  } catch (err: unknown) {
    console.error("Failed to fetch crew management request details:", err);
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ detail: message }, { status: 500 });
  }
}
