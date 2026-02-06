import { NextRequest, NextResponse } from "next/server";

interface DocumentStatusResponse {
  total_documents: number;
  approved_count: number;
  rejected_count: number;
  pending_count: number;
  not_submitted_count: number;
  submitted_documents: string[];
  approved_documents: string[];
  rejected_documents: string[];
  not_submitted_documents: string[];
}

export async function GET(request: NextRequest) {
  try {
    // Extract user's authentication token from request headers
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json(
        { error: "Authorization header missing" },
        { status: 401 }
      );
    }

    // Extract token from "Bearer <token>" format
    const token = authHeader.startsWith("Bearer ") ? authHeader.substring(7) : authHeader;

    console.log("🔍 Fetching document status from external API with user token...");

    const externalResponse = await fetch(
      "https://crewing-mvp.onrender.com/api/v1/seafarers/documents/status",
      {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!externalResponse.ok) {
      console.error(
        `External API error: ${externalResponse.status} ${externalResponse.statusText}`
      );

      // Return a fallback response if the external API fails
      const fallbackResponse: DocumentStatusResponse = {
        total_documents: 6,
        approved_count: 0,
        rejected_count: 0,
        pending_count: 0,
        not_submitted_count: 6,
        submitted_documents: [],
        approved_documents: [],
        rejected_documents: [],
        not_submitted_documents: [
          "medical_fitness",
          "sea_service",
          "seaman_book",
          "psc_lifeboat",
          "stcw_basic_safety",
          "coc_or_rating"
        ],
      };

      return NextResponse.json(fallbackResponse, { status: 200 });
    }

    const documentData: DocumentStatusResponse = await externalResponse.json();

    console.log("✅ Document status fetched:", {
      total: documentData.total_documents,
      not_submitted: documentData.not_submitted_count,
      approved: documentData.approved_count,
    });

    return NextResponse.json(documentData, { status: 200 });

  } catch (error) {
    console.error("Failed to fetch document status:", error);

    // Return fallback data on error
    const fallbackResponse: DocumentStatusResponse = {
      total_documents: 6,
      approved_count: 0,
      rejected_count: 0,
      pending_count: 0,
      not_submitted_count: 6,
      submitted_documents: [],
      approved_documents: [],
      rejected_documents: [],
      not_submitted_documents: [
        "medical_fitness",
        "sea_service",
        "seaman_book",
        "psc_lifeboat",
        "stcw_basic_safety",
        "coc_or_rating"
      ],
    };

    return NextResponse.json(fallbackResponse, { status: 200 });
  }
}