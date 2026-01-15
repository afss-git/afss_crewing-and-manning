import { NextRequest, NextResponse } from "next/server";
import auth from "../../../../../../../lib/auth";
import {
  approveDocument,
  NotImplementedError,
} from "../../../../../../../lib/adminData";

export async function POST(
  req: NextRequest,
  { params }: { params: { doc_id: string } }
) {
  const check = auth.requireAdmin(req as unknown as Request);
  if (!check.ok) {
    return NextResponse.json(
      { detail: check.detail },
      { status: check.status }
    );
  }

  const { doc_id } = params;
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

  try {
    const result = await approveDocument(doc_id);
    return NextResponse.json(
      { message: "Document approved", document: result },
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
