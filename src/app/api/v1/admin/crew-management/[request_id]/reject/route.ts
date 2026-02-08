import { NextRequest, NextResponse } from "next/server";
import auth from "../../../../../../../lib/auth";
import { getExternalApiToken } from "../../../../../../../lib/externalApiToken";
interface RejectRequest {
  notes: string;
}

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

    const externalApiToken = await getExternalApiToken();

    // Parse request body to get rejection notes
    const body: RejectRequest = await req.json();
    if (
      !body.notes ||
      typeof body.notes !== "string" ||
      body.notes.trim().length === 0
    ) {
      return NextResponse.json(
        { detail: "Rejection notes are required" },
        { status: 400 },
      );
    }

    // Call the external API to reject the crew management request with notes
    const externalResponse = await fetch(
      `https://crewing-mvp.onrender.com/api/v1/admin/crew-management/${request_id}/reject`,
      {
        method: "POST",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${externalApiToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ notes: body.notes }),
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
    console.error("Failed to reject crew management request:", err);
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ detail: message }, { status: 500 });
  }
}
