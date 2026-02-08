import { NextRequest, NextResponse } from "next/server";
import auth from "../../../../../../../lib/auth";
import { getExternalApiToken } from "../../../../../../../lib/externalApiToken";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ user_id: string }> },
) {
  const check = auth.requireAdmin(req as unknown as Request);
  if (!check.ok) {
    return NextResponse.json(
      { detail: check.detail },
      { status: check.status },
    );
  }

  const { user_id } = await params;
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
      { status: 422 },
    );
  }

  try {
    console.log(`🔍 Approve route called for user: ${user_id}`);
    
    // Get token from external API
    const externalApiToken = await getExternalApiToken();
    
    // Call external API to approve the seafarer
    const approveUrl = `https://crewing-mvp.onrender.com/api/v1/admin/users/${user_id}/approve`;
    
    const response = await fetch(approveUrl, {
      method: "POST",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${externalApiToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error(
        `❌ Failed to approve user via external API: ${response.status}`,
        errorData,
      );
      return NextResponse.json(
        { detail: errorData.detail || "Failed to approve user" },
        { status: response.status },
      );
    }

    const result = await response.json();
    console.log(`✅ User ${user_id} approved successfully`);
    
    return NextResponse.json(
      { message: "Seafarer profile approved", ...result },
      { status: 200 },
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`❌ Error approving user: ${message}`);
    return NextResponse.json({ detail: message }, { status: 500 });
  }
}
