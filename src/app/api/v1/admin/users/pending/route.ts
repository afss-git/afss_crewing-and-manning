import { NextRequest, NextResponse } from "next/server";
import auth from "../../../../../../lib/auth";
import {
  getPendingUsers,
  NotImplementedError,
} from "../../../../../../lib/adminData";

export async function GET(req: NextRequest) {
  const check = auth.requireAdmin(req as unknown as Request);
  if (!check.ok) {
    return NextResponse.json(
      { detail: check.detail },
      { status: check.status }
    );
  }

  try {
    const pending = await getPendingUsers();
    return NextResponse.json({ pending_users: pending }, { status: 200 });
  } catch (err: unknown) {
    if (err instanceof NotImplementedError) {
      const message = err instanceof Error ? err.message : String(err);
      return NextResponse.json({ detail: message }, { status: 501 });
    }
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ detail: message }, { status: 500 });
  }
}
