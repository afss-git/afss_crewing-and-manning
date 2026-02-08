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

  try {
    console.log(`🔍 Approve route called for document: ${doc_id}`);

    const externalApiToken = useClientToken
      ? (req.headers.get("authorization") || "").replace("Bearer ", "")
      : await getExternalApiToken();

    const externalResponse = await fetch(
      `https://crewing-mvp.onrender.com/api/v1/admin/documents/${doc_id}/approve`,
      {
        method: "POST",
        headers: {
            accept: "application/json",
            Authorization: `Bearer ${externalApiToken}`,
            "Content-Type": "application/json",
          },
      },
    );

    if (!externalResponse.ok) {
      const errorData = await externalResponse.json().catch(() => ({}));
      console.error(
        `❌ External API approval failed: ${externalResponse.status}`,
        errorData,
      );
      return NextResponse.json(
        { detail: errorData.detail || "Failed to approve document" },
        { status: externalResponse.status },
      );
    }

    const result = await externalResponse.json();
    console.log(`✅ Document ${doc_id} approved successfully`);

    return NextResponse.json(
      { message: "Document approved", ...result },
      { status: 200 },
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`❌ Error approving document: ${message}`);
    return NextResponse.json({ detail: message }, { status: 500 });
  }
}
