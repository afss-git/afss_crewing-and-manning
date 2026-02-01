import { NextRequest, NextResponse } from "next/server";
import auth from "../../../../../../../lib/auth";

export async function POST(
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

    // Get the external API token from environment variables
    const externalApiToken = process.env.EXTERNAL_API_TOKEN;

    if (!externalApiToken) {
      return NextResponse.json(
        { detail: "External API token not configured" },
        { status: 500 },
      );
    }

    // Call the external API to approve the crew management request
    const externalResponse = await fetch(
      `https://crewing-mvp.onrender.com/api/v1/admin/crew-management/${request_id}/approve`,
      {
        method: "POST",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${externalApiToken}`,
        },
        body: "", // Empty body as per the API spec
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

    const externalData = await externalResponse.json();
    return NextResponse.json(externalData, { status: 200 });
  } catch (err: unknown) {
    console.error("Failed to approve crew management request:", err);
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ detail: message }, { status: 500 });
  }
}
