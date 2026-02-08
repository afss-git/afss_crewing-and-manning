import { NextRequest, NextResponse } from "next/server";
import auth from "../../../../../../../lib/auth";

export async function GET(req: NextRequest) {
  // Try server-side auth first; if it fails but the client supplied a Bearer token
  // (for example the external API token stored by the client), accept that
  // token for proxying requests to the external API.
  let useClientToken = false;
  const check = auth.requireAdmin(req as unknown as Request);
  if (!check.ok) {
    const clientAuth = req.headers.get("authorization") || "";
    if (clientAuth.startsWith("Bearer ")) {
      useClientToken = true;
    } else {
      return NextResponse.json(
        { detail: check.detail },
        { status: check.status },
      );
    }
  }

  try {
    // Get the external API token from environment variables or use client token
    const externalApiToken = useClientToken
      ? (req.headers.get("authorization") || "").replace("Bearer ", "")
      : process.env.EXTERNAL_API_TOKEN;

    if (!externalApiToken) {
      return NextResponse.json(
        { detail: "External API token not configured" },
        { status: 500 },
      );
    }

    // Call the external API for approved contracts
    const externalResponse = await fetch(
      "https://crewing-mvp.onrender.com/api/v1/admin/contracts/status/approved",
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
        "External API error:",
        externalResponse.status,
        externalResponse.statusText,
      );
      return NextResponse.json(
        { detail: `External API error: ${externalResponse.status}` },
        { status: externalResponse.status },
      );
    }

    const externalData = await externalResponse.json();
    return NextResponse.json(externalData, { status: 200 });
  } catch (err: unknown) {
    console.error("Failed to fetch approved contracts:", err);
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ detail: message }, { status: 500 });
  }
}
