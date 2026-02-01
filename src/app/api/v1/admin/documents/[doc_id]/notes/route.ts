import { NextRequest, NextResponse } from "next/server";
import auth from "../../../../../../../lib/auth";
import {
  updateDocumentNotes,
  NotImplementedError,
} from "../../../../../../../lib/adminData";

export async function PUT(
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
      { status: 422 }
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
      { status: 422 }
    );
  }

  try {
    const notes = (body as Record<string, unknown>)["notes"] as string;
    const updated = await updateDocumentNotes(doc_id, notes);
    return NextResponse.json(
      { message: "Document notes updated", document: updated },
      { status: 200 }
    );
  } catch (err: unknown) {
    if (err instanceof NotImplementedError) {
      return NextResponse.json({ detail: err.message }, { status: 501 });
    }
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ detail: message }, { status: 500 });
  }
}
