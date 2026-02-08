import { NextRequest, NextResponse } from "next/server";
import auth from "../../../../../../lib/auth";
import { getExternalApiToken } from "../../../../../../lib/externalApiToken";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const check = auth.requireAdmin(req as unknown as Request);
  if (!check.ok) {
    return NextResponse.json(
      { detail: check.detail },
      { status: check.status },
    );
  }

  try {
    console.log(`🔗 Authenticated admin fetching all users...`);

    const externalApiToken = await getExternalApiToken();

    const externalResponse = await fetch(
      "https://crewing-mvp.onrender.com/api/v1/admin/users/all",
      {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${externalApiToken}`,
        },
      },
    );

    if (!externalResponse.ok) {
      console.error(
        `❌ External API error: ${externalResponse.status} ${externalResponse.statusText}`,
      );
      return NextResponse.json(
        {
          detail: `External API error: ${externalResponse.status}`,
          externalApiStatus: externalResponse.status,
        },
        { status: externalResponse.status },
      );
    }

    const data = await externalResponse.json();
    console.log(`✅ Successfully fetched all users from external API`);

    return NextResponse.json({ users: data }, { status: 200 });
  } catch (err: unknown) {
    console.error("Failed to fetch all users:", err);
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ detail: message }, { status: 500 });
  }
}
