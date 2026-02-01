import { NextRequest, NextResponse } from "next/server";
import auth from "../../../../../../../lib/auth";
import {
  rejectDocument,
  NotImplementedError,
} from "../../../../../../../lib/adminData";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ doc_id: string }> }
) {
  const check = auth.requireAdmin(req as unknown as Request);
  if (!check.ok) {
    return NextResponse.json(
      { detail: check.detail },
      { status: check.status }
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
      { status: 422 }
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
    const result = await rejectDocument(doc_id, notes);
    return NextResponse.json(
      { message: "Document rejected", document: result },
      { status: 200 }
    );
  } catch (err: unknown) {
    if (err instanceof NotImplementedError) {
      const message = err instanceof Error ? err.message : String(err);
      return NextResponse.json({ detail: message }, { status: 501 });
    }
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ detail: message }, { status: 500 });
  }
}
