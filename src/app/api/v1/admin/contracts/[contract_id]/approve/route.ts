import { NextRequest, NextResponse } from "next/server";
import auth from "../../../../../../../lib/auth";

interface ExternalContract {
  id: number;
  reference_number: string;
  status: string;
  admin_notes: string | null;
  details?: {
    vessel_type?: string;
    operational_zone?: string;
    operational_routes?: string;
    target_start_date?: string;
    commencement_date?: string;
    expected_duration_months?: number;
    duration?: string;
    port_of_embarkation?: string;
    port_of_disembarkation?: string;
    positions?: unknown[];
    [key: string]: unknown;
  };
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ contract_id: string }> },
) {
  const check = auth.requireAdmin(req as unknown as Request);
  if (!check.ok) {
    return NextResponse.json(
      { detail: check.detail },
      { status: check.status },
    );
  }

  try {
    const { contract_id } = await params;
    console.log(`🔍 Approve route called for contract: ${contract_id}`);

    // Get the external API token from environment variables
    const externalApiToken = process.env.EXTERNAL_API_TOKEN;

    if (!externalApiToken) {
      return NextResponse.json(
        { detail: "External API token not configured" },
        { status: 500 },
      );
    }

    console.log(`🔑 Using API token: ${externalApiToken.substring(0, 20)}...`);

    // Step 1: Test token permissions by checking if we can access admin endpoints
    console.log("🔍 Step 1: Testing token permissions...");

    const permissionTests = [
      {
        name: "Admin Contracts",
        url: "https://crewing-mvp.onrender.com/api/v1/admin/contracts",
      },
      {
        name: "Admin Profile",
        url: "https://crewing-mvp.onrender.com/api/v1/admin/profile",
      },
      {
        name: "Admin Users",
        url: "https://crewing-mvp.onrender.com/api/v1/admin/users",
      },
    ];

    for (const test of permissionTests) {
      try {
        const testResponse = await fetch(test.url, {
          method: "GET",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${externalApiToken}`,
          },
        });
        console.log(
          `✅ ${test.name}: ${testResponse.status} ${testResponse.statusText}`,
        );

        if (testResponse.status === 403) {
          console.log(
            `❌ Permission denied for ${test.name} - token may have limited scope`,
          );
        } else if (testResponse.status === 401) {
          console.log(
            `❌ Unauthorized for ${test.name} - token may be invalid`,
          );
        }
      } catch (err) {
        console.log(`❌ ${test.name}: Network error -`, err);
      }
    }

    // Step 2: Get detailed contract information
    console.log("🔍 Step 2: Getting detailed contract information...");

    const contractDetailResponse = await fetch(
      `https://crewing-mvp.onrender.com/api/v1/admin/contracts/${contract_id}`,
      {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${externalApiToken}`,
        },
      },
    );

    console.log(
      `📄 Contract detail response: ${contractDetailResponse.status} ${contractDetailResponse.statusText}`,
    );

    if (contractDetailResponse.ok) {
      const contractDetail = await contractDetailResponse.json();
      console.log(`📋 Contract details:`, {
        id: contractDetail.id,
        reference_number: contractDetail.reference_number,
        status: contractDetail.status,
        admin_notes: contractDetail.admin_notes,
        hasDetails: !!contractDetail.details,
        detailKeys: contractDetail.details
          ? Object.keys(contractDetail.details)
          : [],
      });
    } else {
      console.log(
        `⚠️ Contract detail endpoint returned ${contractDetailResponse.status}, continuing with approval attempt...`,
      );
      // Don't return early - the contract might still be approvable even if detail endpoint fails
    }

    // Step 3: Check if contract exists in pending contracts specifically
    console.log("🔍 Step 3: Checking pending contracts endpoint...");

    const pendingContractsResponse = await fetch(
      "https://crewing-mvp.onrender.com/api/v1/admin/contracts/pending",
      {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${externalApiToken}`,
        },
      },
    );

    if (pendingContractsResponse.ok) {
      const pendingContracts: ExternalContract[] =
        await pendingContractsResponse.json();
      console.log(`📋 Found ${pendingContracts.length} pending contracts`);

      const targetContract = pendingContracts.find(
        (c: ExternalContract) =>
          c.id.toString() === contract_id || c.reference_number === contract_id,
      );

      if (targetContract) {
        console.log(`✅ Contract found in pending contracts:`, {
          id: targetContract.id,
          reference_number: targetContract.reference_number,
          status: targetContract.status,
          admin_notes: targetContract.admin_notes,
        });
      } else {
        console.log(
          `❌ Contract not found in pending contracts. Available pending contracts:`,
          pendingContracts.map((c) => ({
            id: c.id,
            reference: c.reference_number,
            status: c.status,
          })),
        );
        console.log(
          `⚠️ Contract not in pending list, but will still attempt approval...`,
        );
      }
    } else {
      console.log(
        `❌ Failed to get pending contracts: ${pendingContractsResponse.status} - continuing anyway...`,
      );
    }

    // Step 4: Test approval endpoint with detailed debugging
    console.log("🔍 Step 4: Attempting contract approval...");

    const approveUrl = `https://crewing-mvp.onrender.com/api/v1/admin/contracts/${contract_id}/approve`;
    console.log(`🎯 Approval URL: ${approveUrl}`);

    const approvalPayloads = [
      {}, // Empty payload
      { admin_notes: "Approved via admin interface" }, // With notes
      { status: "approved" }, // Explicit status
      { approved: true }, // Boolean flag
    ];

    for (let i = 0; i < approvalPayloads.length; i++) {
      const payload = approvalPayloads[i];
      console.log(`🔄 Approval attempt ${i + 1}/4 with payload:`, payload);

      const externalResponse = await fetch(approveUrl, {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${externalApiToken}`,
        },
        body: JSON.stringify(payload),
      });

      console.log(
        `📊 Response: ${externalResponse.status} ${externalResponse.statusText}`,
      );

      // Log response headers for debugging
      console.log(
        `📋 Response headers:`,
        Object.fromEntries(externalResponse.headers.entries()),
      );

      if (externalResponse.ok) {
        const successData = await externalResponse.json();
        console.log(`✅ Approval successful:`, successData);
        return NextResponse.json(successData, { status: 200 });
      } else {
        let errorDetail = `External API error: ${externalResponse.status}`;
        try {
          const errorData = await externalResponse.json();
          console.log(`❌ Error response:`, errorData);
          if (errorData.detail) {
            errorDetail = errorData.detail;
          } else if (errorData.message) {
            errorDetail = errorData.message;
          } else if (errorData.error) {
            errorDetail = errorData.error;
          }
        } catch (parseError) {
          console.log(`⚠️ Could not parse error response:`, parseError);
          // Try to get response as text
          try {
            const textResponse = await externalResponse.text();
            console.log(`📄 Raw error response:`, textResponse);
            errorDetail += ` - Raw response: ${textResponse}`;
          } catch (textError) {
            console.log(`❌ Could not read error response as text:`, textError);
          }
        }

        if (
          externalResponse.status !== 404 &&
          externalResponse.status !== 400
        ) {
          // If it's not a 404 or 400, this might be the right endpoint with a different error
          return NextResponse.json(
            { detail: errorDetail },
            { status: externalResponse.status },
          );
        }
      }
    }

    // Step 5: If all approval attempts failed, provide comprehensive diagnostics
    console.log("❌ All approval attempts failed. Providing diagnostics...");

    return NextResponse.json(
      {
        detail: "Contract approval failed after multiple attempts",
        diagnostics: {
          contractId: contract_id,
          tokenPrefix: externalApiToken.substring(0, 20) + "...",
          approvalUrl: approveUrl,
          message:
            "The contract exists and is in pending status, but the approval endpoint returns 404. This suggests either: 1) The API token lacks approval permissions, 2) The contract workflow requires additional steps before approval, 3) There's a different approval process or endpoint, or 4) The external API has restrictions on which contracts can be approved.",
        },
      },
      { status: 400 },
    );
  } catch (err: unknown) {
    console.error("❌ Failed to approve contract:", err);
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ detail: message }, { status: 500 });
  }
}
