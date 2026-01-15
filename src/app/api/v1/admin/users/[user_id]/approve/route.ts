import { NextRequest, NextResponse } from "next/server";
import auth from "../../../../../../../lib/auth";
import {
  approveUser,
  NotImplementedError,
} from "../../../../../../../lib/adminData";

export async function POST(
  req: NextRequest,
  { params }: { params: { user_id: string } }
) {
  const check = auth.requireAdmin(req as unknown as Request);
  if (!check.ok) {
    return NextResponse.json(
      { detail: check.detail },
      { status: check.status }
    );
  }

  const { user_id } = params;
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
    await approveUser(user_id);
    return NextResponse.json(
      { message: "Seafarer profile approved" },
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
