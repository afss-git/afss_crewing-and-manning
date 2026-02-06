import { NextRequest, NextResponse } from "next/server";
import auth from "../../../../../lib/auth";

interface ExternalContract {
  id: number;
  contract_number: string;
  reference_number?: string;
  status: string;
  admin_notes: string | null;
  vessel_type: string;
  operational_zone: string;
  target_start_date: string;
  expected_duration_months: number;
  port_of_embarkation: string;
  port_of_disembarkation: string;
  contact_email?: string;
  details?: {
    vessel_name?: string;
    vessel_type?: string;
    imo_number?: string;
    position?: string;
    position_type?: string;
    target_start_date?: string;
    commencement_date?: string;
    expected_duration_months?: number;
    duration?: string;
    required_certifications?: string;
    minimum_qualifications?: string;
    day_rate?: string;
    salary_range?: string;
    client_name?: string;
    company_name?: string;
    client_company?: string;
    ship_owner?: string;
    contact_email?: string;
    special_instructions?: string;
    positions?: Array<{
      rank_id?: string;
      position?: string;
      quantity?: number;
      min_experience_years?: number;
      nationality_preference?: string;
      specifications?: string;
      assigned_seafarer_id?: number;
      status?: string;
      assigned_at?: string;
    }>;
  };
  positions: Array<{
    rank_id: string;
    quantity: number;
    min_experience_years: number;
    nationality_preference: string;
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

    console.log("External API response status:", externalResponse.status);

    if (!externalResponse.ok) {
      console.error(
        "External API error:",
        externalResponse.status,
        externalResponse.statusText,
      );
      const errorText = await externalResponse.text();
      console.error("External API error details:", errorText);
      return NextResponse.json(
        { detail: `External API error: ${externalResponse.status}` },
        { status: externalResponse.status },
      );
    }

    const externalData: ExternalContract[] = await externalResponse.json();
    console.log(
      "External API raw data:",
      JSON.stringify(externalData, null, 2),
    );

    // Transform the data structure to match frontend expectations
    const transformedContracts = externalData.map(
      (contract: ExternalContract) => ({
        id: contract.id,
        contractId:
          contract.reference_number ||
          contract.contract_number ||
          `CONTRACT-${contract.id}`,
        vesselName:
          contract.details?.vessel_name ||
          contract.details?.vessel_type ||
          "Unknown Vessel",
        vesselImoNumber: contract.details?.imo_number || null,
        position:
          contract.details?.positions?.[0]?.rank_id ||
          contract.details?.position ||
          "Unknown Position",
        positionType:
          contract.details?.position_type?.toLowerCase() || "scheduled",
        startDate:
          contract.details?.target_start_date ||
          contract.details?.commencement_date ||
          new Date().toISOString(),
        endDate: (() => {
          const start = new Date(
            contract.details?.target_start_date ||
              contract.details?.commencement_date ||
              new Date(),
          );
          const months =
            contract.details?.expected_duration_months ||
            (contract.details?.duration?.includes("Year") ? 12 : 6);
          start.setMonth(start.getMonth() + months);
          return start.toISOString();
        })(),
        duration:
          contract.details?.duration ||
          `${contract.details?.expected_duration_months || 6} months`,
        requiredCertifications:
          contract.details?.required_certifications ||
          contract.details?.minimum_qualifications ||
          "Standard maritime certificates",
        dayRate:
          contract.details?.day_rate || contract.details?.salary_range || "TBD",
        status: (() => {
          const status = contract.status?.toLowerCase();
          switch (status) {
            case "submitted":
              return "open";
            case "approved":
              return "assigned";
            case "rejected":
              return "cancelled";
            case "completed":
              return "completed";
            case "in_review":
              return "reviewing";
            default:
              return "open";
          }
        })(),
        clientName:
          contract.details?.client_name ||
          contract.details?.company_name ||
          "Unknown Client",
        clientCompany:
          contract.details?.client_company ||
          contract.details?.company_name ||
          null,
        specificInstructions:
          contract.admin_notes ||
          contract.details?.special_instructions ||
          null,
        shipOwner: {
          companyName:
            contract.details?.ship_owner ||
            contract.details?.client_company ||
            contract.details?.company_name ||
            "Unknown Company",
          user: {
            email:
              contract.details?.contact_email ||
              contract.contact_email ||
              "unknown@company.com",
          },
        },
        positions: contract.details?.positions?.map((pos, index: number) => ({
          id: index + 1,
          contractId: contract.id,
          position: pos.rank_id || pos.position || "Unknown Position",
          specifications:
            pos.specifications ||
            `${pos.quantity || 1} person(s)${pos.min_experience_years ? `, min ${pos.min_experience_years} years experience` : ""}`,
          assignedSeafarer: pos.assigned_seafarer_id || null,
          status: pos.status || "open",
          assignedAt: pos.assigned_at ? new Date(pos.assigned_at) : null,
          createdAt: new Date(),
        })) || [
          {
            id: 1,
            contractId: contract.id,
            position: contract.details?.position || "Unknown Position",
            specifications: "1 person",
            assignedSeafarer: null,
            status: "open",
            assignedAt: null,
            createdAt: new Date(),
          },
        ],
      }),
    );

    console.log(
      "Transformed contracts:",
      JSON.stringify(transformedContracts, null, 2),
    );
    return NextResponse.json(transformedContracts, { status: 200 });
  } catch (err: unknown) {
    console.error("Failed to fetch contracts:", err);
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ detail: message }, { status: 500 });
  }
}
