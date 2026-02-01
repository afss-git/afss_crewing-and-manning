import { NextRequest, NextResponse } from "next/server";
import auth from "../../../../../../lib/auth";

interface ApiSeafarer {
  user_id: number;
  email: string;
  first_name: string | null;
  last_name: string | null;
  rank: string | null;
  years_of_experience: number | null;
  is_approved: boolean;
}

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

    const data: ApiSeafarer[] = await externalResponse.json();

    // Filter for only approved seafarers
    const approvedSeafarers = data.filter((seafarer) => seafarer.is_approved === true);

    return NextResponse.json(approvedSeafarers, { status: 200 });

  } catch (err: unknown) {
    console.error("Failed to fetch approved seafarers:", err);
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ detail: message }, { status: 500 });
  }
}
