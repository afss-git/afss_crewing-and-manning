import { NextRequest, NextResponse } from "next/server";
import auth from "../../../../../../lib/auth";

interface ExternalContract {
  id: number;
  reference_number: string;
  status: string;
  admin_notes: string | null;
  details?: {
    vessel_type?: string;
    operational_zone?: string;
    operational_routes?: string;
    target_start_date?: string;
    commencement_date?: string;
    expected_duration_months?: number;
    duration?: string;
    port_of_embarkation?: string;
    port_of_disembarkation?: string;
    positions?: unknown[];
    [key: string]: unknown;
  };
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
    // Get the external API token from environment variables
    const externalApiToken = process.env.EXTERNAL_API_TOKEN;

    if (!externalApiToken) {
      return NextResponse.json(
        { detail: "External API token not configured" },
        { status: 500 },
      );
    }

    // Call the external API for all contracts, then filter pending ones
    const externalResponse = await fetch(
      "https://crewing-mvp.onrender.com/api/v1/admin/contracts",
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
      return NextResponse.json(
        { detail: `External API error: ${externalResponse.status}` },
        { status: externalResponse.status },
      );
    }

    const externalData: ExternalContract[] = await externalResponse.json();

    // Filter only pending contracts and transform the data structure
    const pendingContracts = externalData
      .filter((contract: ExternalContract) => contract.status === "pending")
      .map((contract: ExternalContract) => ({
        id: contract.id,
        contract_number: contract.reference_number,
        status: contract.status,
        admin_notes: null,
        vessel_type: contract.details?.vessel_type || "Unknown",
        operational_zone:
          contract.details?.operational_zone ||
          contract.details?.operational_routes ||
          "Unknown",
        target_start_date:
          contract.details?.target_start_date ||
          contract.details?.commencement_date ||
          new Date().toISOString(),
        expected_duration_months:
          contract.details?.expected_duration_months ||
          (contract.details?.duration?.includes("Year") ? 12 : 6),
        port_of_embarkation: "TBD",
        port_of_disembarkation: "TBD",
        positions: [],
      }));

    return NextResponse.json(pendingContracts, { status: 200 });
  } catch (err: unknown) {
    console.error("Failed to fetch pending contracts:", err);
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ detail: message }, { status: 500 });
  }
}
