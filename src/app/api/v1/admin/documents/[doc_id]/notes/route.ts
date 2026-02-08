import { NextRequest, NextResponse } from "next/server";
import auth from "../../../../../../../lib/auth";
import { getExternalApiToken } from "../../../../../../../lib/externalApiToken";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ doc_id: string }> },
) {
  const check = auth.requireAdmin(req as unknown as Request);
  if (!check.ok) {
    return NextResponse.json(
      { detail: check.detail },
      { status: check.status },
    );
  }

  const { doc_id } = await params;
  if (!doc_id) {
    return NextResponse.json(
      {
        detail: [
          {
            loc: ["path", "doc_id"],
            msg: "doc_id is required",
            type: "validation_error",
          },
        ],
      },
      { status: 422 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      {
        detail: [
          {
            loc: ["body"],
            msg: "Invalid JSON body",
            type: "validation_error",
          },
        ],
      },
      { status: 422 },
    );
  }

  if (
    typeof body !== "object" ||
    body === null ||
    !("notes" in (body as Record<string, unknown>)) ||
    typeof (body as Record<string, unknown>).notes !== "string"
  ) {
    return NextResponse.json(
      {
        detail: [
          {
            loc: ["body", "notes"],
            msg: "'notes' (string) is required in the request body",
            type: "validation_error",
          },
        ],
      },
      { status: 422 },
    );
  }

  try {
    console.log(`🔍 Update notes route called for document: ${doc_id}`);

    const notes = (body as Record<string, unknown>)["notes"] as string;
    const externalApiToken = await getExternalApiToken();

    const externalResponse = await fetch(
      `https://crewing-mvp.onrender.com/api/v1/admin/documents/${doc_id}/notes`,
      {
        method: "PUT",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${externalApiToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ notes }),
      },
    );

    if (!externalResponse.ok) {
      const errorData = await externalResponse.json().catch(() => ({}));
      console.error(
        `❌ External API notes update failed: ${externalResponse.status}`,
        errorData,
      );
      return NextResponse.json(
        { detail: errorData.detail || "Failed to update notes" },
        { status: externalResponse.status },
      );
    }

    const result = await externalResponse.json();
    console.log(`✅ Document ${doc_id} notes updated successfully`);

    return NextResponse.json(
      { message: "Document notes updated", ...result },
      { status: 200 },
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`❌ Error updating document notes: ${message}`);
    return NextResponse.json({ detail: message }, { status: 500 });
  }
}
