import { NextRequest, NextResponse } from "next/server";
import auth from "../../../../../../../lib/auth";

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

export async function POST(
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

    // Get the external API token from environment variables
    const externalApiToken = process.env.EXTERNAL_API_TOKEN;

    if (!externalApiToken) {
      return NextResponse.json(
        { detail: "External API token not configured" },
        { status: 500 },
      );
    }

    // First, get all contracts to find the one with the matching ID and get its reference_number
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
        "Failed to fetch contracts:",
        allContractsResponse.status,
        allContractsResponse.statusText,
      );
      return NextResponse.json(
        { detail: `Failed to fetch contracts: ${allContractsResponse.status}` },
        { status: allContractsResponse.status },
      );
    }

    const allContracts: ExternalContract[] = await allContractsResponse.json();

    // Enhanced contract lookup with detailed logging
    console.log(
      `\ud83d\udd0d Searching for contract ${contract_id} in ${allContracts.length} contracts...`,
    );

    const contract = allContracts.find(
      (c: ExternalContract) =>
        c.id.toString() === contract_id || c.reference_number === contract_id,
    );

    if (!contract) {
      console.log(
        `\u274c Available contracts:`,
        allContracts.map((c) => ({
          id: c.id,
          reference: c.reference_number,
          status: c.status,
        })),
      );
      return NextResponse.json(
        { detail: "Contract not found" },
        { status: 404 },
      );
    }

    console.log(`\u2705 Found contract:`, {
      id: contract.id,
      reference: contract.reference_number,
      status: contract.status,
      searchTerm: contract_id,
    });

    // Call the external API to reject the contract using numeric ID (external API requires integers)
    console.log(
      `Attempting to reject contract with ID/ref ${contract_id} (reference: ${contract.reference_number}, numericId: ${contract.id})...`,
    );

    const externalResponse = await fetch(
      `https://crewing-mvp.onrender.com/api/v1/admin/contracts/${contract.id}/reject`,
      {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${externalApiToken}`,
        },
        body: JSON.stringify({ notes: "Rejected by admin" }), // Include rejection notes
      },
    );

    console.log(
      `External API response: ${externalResponse.status} ${externalResponse.statusText}`,
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

    const externalData = await externalResponse.json();
    return NextResponse.json(externalData, { status: 200 });
  } catch (err: unknown) {
    console.error("Failed to reject contract:", err);
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ detail: message }, { status: 500 });
  }
}
