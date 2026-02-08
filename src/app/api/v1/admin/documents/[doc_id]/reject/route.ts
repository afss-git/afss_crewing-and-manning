import { NextRequest, NextResponse } from "next/server";
import auth from "../../../../../../../lib/auth";
import { getExternalApiToken } from "../../../../../../../lib/externalApiToken";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ doc_id: string }> },
) {
  // Try server-side auth first; if it fails but the client supplied a Bearer token
  // (e.g. the external API's token), accept that token for proxying the request.
  let useClientToken = false;
  const check = auth.requireAdmin(req as unknown as Request);
  if (!check.ok) {
    const clientAuth = req.headers.get("authorization") || "";
    if (clientAuth.startsWith("Bearer ")) {
      useClientToken = true;
    } else {
      return NextResponse.json(
        { detail: check.detail },
        { status: check.status },
      );
    }
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
    // body may be empty — that's acceptable since notes are optional; proceed with undefined
    body = undefined;
  }

  const notes =
    typeof body === "object" &&
    body !== null &&
    "notes" in (body as Record<string, unknown>)
      ? ((body as Record<string, unknown>)["notes"] as string)
      : undefined;

  try {
    console.log(`🔍 Reject route called for document: ${doc_id}`);

    const externalApiToken = useClientToken
      ? (req.headers.get("authorization") || "").replace("Bearer ", "")
      : await getExternalApiToken();

    const externalResponse = await fetch(
      `https://crewing-mvp.onrender.com/api/v1/admin/documents/${doc_id}/reject`,
      {
        method: "POST",
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
        `❌ External API rejection failed: ${externalResponse.status}`,
        errorData,
      );
      return NextResponse.json(
        { detail: errorData.detail || "Failed to reject document" },
        { status: externalResponse.status },
      );
    }

    const result = await externalResponse.json();
    console.log(`✅ Document ${doc_id} rejected successfully`);

    return NextResponse.json(
      { message: "Document rejected", ...result },
      { status: 200 },
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`❌ Error rejecting document: ${message}`);
    return NextResponse.json({ detail: message }, { status: 500 });
  }
}
