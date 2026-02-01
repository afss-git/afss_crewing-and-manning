import { NextRequest, NextResponse } from "next/server";
import auth from "../../../../../lib/auth";
import { getAllUsers } from "../../../../../lib/adminData";

type AllUserItem = {
  user_id: number;
  email: string;
  first_name: string | null;
  last_name: string | null;
  approved: boolean;
  documents: unknown[];
};

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const check = auth.requireAdmin(req as unknown as Request);
  if (!check.ok) {
    return NextResponse.json(
      { detail: check.detail },
      { status: check.status }
    );
  }

  try {
    const seafarers = await getAllUsers();
    const formattedSeafarers = seafarers.map((seafarer: AllUserItem) => ({
      user_id: seafarer.user_id,
      email: seafarer.email,
      first_name: seafarer.first_name,
      last_name: seafarer.last_name,
      rank: null, // Not available from getAllUsers, placeholder
      years_of_experience: null, // Not available from getAllUsers, placeholder
      is_approved: seafarer.approved, // Map approved to is_approved
    }));
    return NextResponse.json(formattedSeafarers, { status: 200 });
  } catch (err: unknown) {
    console.error("Failed to fetch seafarers:", err);
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ detail: message }, { status: 500 });
  }
}
