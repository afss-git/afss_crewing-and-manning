import { NextRequest, NextResponse } from "next/server";
import auth from "../../../../../../lib/auth";
import { getExternalApiToken } from "../../../../../../lib/externalApiToken";

export async function GET(req: NextRequest) {
  const check = auth.requireAdmin(req as unknown as Request);
  if (!check.ok) {
    return NextResponse.json(
      { detail: check.detail },
      { status: check.status },
    );
  }

  try {
    console.log(`🔗 Authenticated admin fetching pending users...`);

    const externalApiToken = await getExternalApiToken();

    const externalResponse = await fetch(
      "https://crewing-mvp.onrender.com/api/v1/admin/users/pending",
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
    console.log(`✅ Successfully fetched pending users from external API`);

    return NextResponse.json({ pending_users: data }, { status: 200 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`❌ Error fetching pending users: ${message}`);
    return NextResponse.json(
      {
        detail: "Failed to fetch pending users",
        error: message,
      },
      { status: 500 },
    );
  }
}
