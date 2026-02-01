import { NextRequest, NextResponse } from "next/server";
import auth from "../../../../../../lib/auth";
import { getAllUsers } from "../../../../../../lib/adminData";

export async function GET(req: NextRequest) {
  const check = auth.requireAdmin(req as unknown as Request);
  if (!check.ok) {
    return NextResponse.json(
      { detail: check.detail },
      { status: check.status }
    );
  }

  try {
    const allUsers = await getAllUsers();
    return NextResponse.json({ users: allUsers }, { status: 200 });
  } catch (err: unknown) {
    console.error("Failed to fetch all users:", err);
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ detail: message }, { status: 500 });
  }
}
