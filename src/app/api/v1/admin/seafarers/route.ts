import { NextRequest, NextResponse } from "next/server";
import auth from "../../../../../lib/auth";

interface ApiSeafarer {
  user_id: number;
  email: string;
  first_name: string | null;
  last_name: string | null;
  rank: string | null;
  years_of_experience: number | null;
  is_approved: boolean;
}

export const dynamic = "force-dynamic";

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

    console.log(`🔗 Attempting to fetch seafarers from external API...`);

    // Fetch seafarers from external API
    const externalResponse = await fetch(
      "https://crewing-mvp.onrender.com/api/v1/admin/seafarers",
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
        `❌ External API error: ${externalResponse.status} ${externalResponse.statusText}`,
      );
      console.log(`💡 Token used: ${externalApiToken.substring(0, 20)}...`);

      // Return helpful error message about token validity
      return NextResponse.json(
        {
          detail: `External API authentication failed (${externalResponse.status}). Please verify your EXTERNAL_API_TOKEN is valid.`,
          externalApiStatus: externalResponse.status,
          tokenPreview: externalApiToken.substring(0, 20) + "...",
          endpoint: "https://crewing-mvp.onrender.com/api/v1/admin/seafarers",
        },
        { status: externalResponse.status },
      );
    }

    const data: ApiSeafarer[] = await externalResponse.json();

    console.log(
      `✅ Successfully fetched ${data.length} seafarers from external API`,
    );

    return NextResponse.json(data, { status: 200 });
  } catch (err: unknown) {
    console.error("Failed to fetch seafarers from external API:", err);
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ detail: message }, { status: 500 });
  }
}
