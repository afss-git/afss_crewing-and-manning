import { NextRequest, NextResponse } from "next/server";
import auth from "../../../../../../../lib/auth";

const API_BASE_URL = "https://crewing-mvp.onrender.com/api/v1";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ user_id: string }> }
) {
  const check = auth.requireAdmin(req as unknown as Request);
  if (!check.ok) {
    return NextResponse.json(
      { detail: check.detail },
      { status: check.status }
    );
  }

  const { user_id } = await params;
  if (!user_id) {
    return NextResponse.json(
      {
        detail: [
          {
            loc: ["path", "user_id"],
            msg: "user_id is required",
            type: "validation_error",
          },
        ],
      },
      { status: 422 }
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

    // Use the direct seafarer profile endpoint
    const response = await fetch(`${API_BASE_URL}/admin/seafarers/${user_id}`, {
      method: "GET",
      headers: {
        "accept": "application/json",
        "Authorization": `Bearer ${externalApiToken}`,
      },
    });

    if (!response.ok) {
      console.error("External API error:", response.status, response.statusText);
      return NextResponse.json(
        { detail: `External API error: ${response.status}` },
        { status: response.status }
      );
    }

    const seafarerData = await response.json();

    // Return the complete seafarer profile with detailed structure
    return NextResponse.json(seafarerData, { status: 200 });

  } catch (err: unknown) {
    console.error("Admin seafarer profile fetch error:", err);
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ detail: message }, { status: 500 });
  }
}
