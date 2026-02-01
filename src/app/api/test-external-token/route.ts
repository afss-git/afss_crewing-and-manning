import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const externalApiToken = process.env.EXTERNAL_API_TOKEN;

    if (!externalApiToken) {
      return NextResponse.json(
        { error: "EXTERNAL_API_TOKEN not configured" },
        { status: 500 },
      );
    }

    console.log(
      `🧪 Testing external API with token: ${externalApiToken.substring(0, 20)}...`,
    );

    const response = await fetch(
      "https://crewing-mvp.onrender.com/api/v1/admin/seafarers",
      {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${externalApiToken}`,
        },
      },
    );

    const data = response.ok ? await response.json() : null;

    return NextResponse.json({
      status: response.status,
      statusText: response.statusText,
      success: response.ok,
      dataCount: data ? data.length : 0,
      tokenPreview: externalApiToken.substring(0, 20) + "...",
      endpoint: "https://crewing-mvp.onrender.com/api/v1/admin/seafarers",
      sampleData: data ? data.slice(0, 2) : null, // Show first 2 records
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
        success: false,
      },
      { status: 500 },
    );
  }
}
