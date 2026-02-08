import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  
  if (!authHeader) {
    return NextResponse.json(
      { message: "No auth header provided. Pass ?token=YOUR_TOKEN to test." },
      { status: 400 }
    );
  }

  const token = authHeader.replace("Bearer ", "");

  try {
    console.log("\n=== DASHBOARD DEBUG REQUEST ===");
    console.log(`Token: ${token.substring(0, 20)}...`);

    // Try the main dashboard endpoint
    console.log("Trying: https://crewing-mvp.onrender.com/api/v1/shipowners/dashboard/contracts");
    const dashboardRes = await fetch(
      "https://crewing-mvp.onrender.com/api/v1/shipowners/dashboard/contracts",
      {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log(`Status: ${dashboardRes.status}`);
    const dashboardData = await dashboardRes.json().catch(() => dashboardRes.text());
    console.log("Dashboard response:", JSON.stringify(dashboardData, null, 2));

    // Also try the contracts endpoint for comparison
    console.log("\nTrying: https://crewing-mvp.onrender.com/api/v1/contracts");
    const contractsRes = await fetch(
      "https://crewing-mvp.onrender.com/api/v1/contracts",
      {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log(`Status: ${contractsRes.status}`);
    const contractsData = await contractsRes.json().catch(() => contractsRes.text());
    console.log("Contracts response:", JSON.stringify(contractsData, null, 2));

    console.log("=== END DEBUG ===\n");

    return NextResponse.json({
      dashboard: {
        status: dashboardRes.status,
        data: dashboardData,
      },
      contracts: {
        status: contractsRes.status,
        data: contractsData,
      },
    });
  } catch (error) {
    console.error("Debug error:", error);
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}
