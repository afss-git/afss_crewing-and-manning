import { NextRequest, NextResponse } from "next/server";
import auth from "../../../../../lib/auth";

interface ExternalContract {
  id: number;
  contract_number: string;
  status: string;
  admin_notes: string | null;
  vessel_type: string;
  operational_zone: string;
  target_start_date: string;
  expected_duration_months: number;
  port_of_embarkation: string;
  port_of_disembarkation: string;
  positions: Array<{
    rank_id: string;
    quantity: number;
    min_experience_years: number;
    nationality_preference: string;
  }>;
}

interface FrontendContract {
  id: string;
  type: "full-crew" | "one-off";
  vesselName: string;
  ownerName: string;
  seafarerName: string;
  seafarerRank: string;
  seafarerAvatar: string;
  startDate: string;
  endDate: string;
  progress: number;
  status: "active" | "pending" | "completed" | "suspended" | "expired";
  statusNote?: string;
  isDraft?: boolean;
  isArchived?: boolean;
  contractNumber?: string;
  numericId?: number;
}

function mapStatus(externalStatus: string): FrontendContract["status"] {
  switch (externalStatus.toLowerCase()) {
    case "submitted":
      return "pending";
    case "approved":
      return "active";
    case "rejected":
      return "suspended";
    case "completed":
      return "completed";
    case "expired":
      return "expired";
    default:
      return "pending";
  }
}

function calculateEndDate(startDate: string, months: number): string {
  const start = new Date(startDate);
  start.setMonth(start.getMonth() + months);
  return start.toISOString().split("T")[0];
}

function mapType(positionsCount: number): "full-crew" | "one-off" {
  return positionsCount > 3 ? "full-crew" : "one-off";
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

    // Call the external API
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

    // Transform the data structure to match frontend expectations
    const transformedContracts = externalData.map((contract: any) => ({
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
    }));

    return NextResponse.json(transformedContracts, { status: 200 });
  } catch (err: unknown) {
    console.error("Failed to fetch contracts:", err);
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ detail: message }, { status: 500 });
  }
}
