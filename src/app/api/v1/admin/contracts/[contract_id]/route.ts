import { NextRequest, NextResponse } from "next/server";
import auth from "../../../../../../lib/auth";
import { getExternalApiToken } from "../../../../../../lib/externalApiToken";

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

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ contract_id: string }> },
) {
  const check = auth.requireAdmin(req as unknown as Request);
  if (!check.ok) {
    return NextResponse.json(
      { detail: check.detail },
      { status: check.status },
    );
  }

  try {
    const { contract_id } = await params;

    // Get the external API token
    const externalApiToken = await getExternalApiToken();

    // First, get all contracts to find the one with the matching ID
    const allContractsResponse = await fetch(
      "https://crewing-mvp.onrender.com/api/v1/admin/contracts",
      {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${externalApiToken}`,
        },
      },
    );

    if (!allContractsResponse.ok) {
      console.error(
        "External API error:",
        allContractsResponse.status,
        allContractsResponse.statusText,
      );
      return NextResponse.json(
        { detail: `External API error: ${allContractsResponse.status}` },
        { status: allContractsResponse.status },
      );
    }

    const allContracts: ExternalContract[] = await allContractsResponse.json();
    const contract = allContracts.find(
      (c: ExternalContract) =>
        c.id.toString() === contract_id || c.reference_number === contract_id,
    );

    if (!contract) {
      return NextResponse.json(
        { detail: "Contract not found" },
        { status: 404 },
      );
    }

    // Transform the contract data to match frontend expectations
    // Since the detailed endpoint is returning 500 errors, use the data from the main list
    const transformedContract = {
      id: contract.id,
      contract_number: contract.reference_number,
      status: contract.status,
      admin_notes: contract.admin_notes || null,
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
      port_of_embarkation: contract.details?.port_of_embarkation || "TBD",
      port_of_disembarkation: contract.details?.port_of_disembarkation || "TBD",
      positions: contract.details?.positions || [],
      details: contract.details, // Include full details object for any additional data
    };

    return NextResponse.json(transformedContract, { status: 200 });
  } catch (err: unknown) {
    console.error("Failed to fetch contract details:", err);
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ detail: message }, { status: 500 });
  }
}
