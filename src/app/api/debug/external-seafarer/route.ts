import { NextRequest, NextResponse } from "next/server";
import { getExternalApiToken } from "../../../../lib/externalApiToken";

interface Document {
  id: number;
  doc_type: string;
  [key: string]: unknown;
}

interface RawApiData {
  documents?: Document[];
  [key: string]: unknown;
}

interface DocumentAnalysis {
  totalDocuments: number;
  documentIds: number[];
  uniqueDocumentIds: number[];
  documentTypes: string[];
  hasDuplicates: boolean;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId") || "4"; // Default to user 4

    const externalApiToken = await getExternalApiToken();
    if (!externalApiToken) {
      return NextResponse.json(
        { error: "External API token not configured" },
        { status: 500 },
      );
    }

    console.log(`🔍 Fetching raw data for user ${userId} from external API...`);

    const response = await fetch(
      `https://crewing-mvp.onrender.com/api/v1/admin/seafarers/${userId}`,
      {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${externalApiToken}`,
        },
      },
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: `External API error: ${response.status}` },
        { status: response.status },
      );
    }

    const rawData: RawApiData = await response.json();

    // Analyze documents
    const analysis: DocumentAnalysis = {
      totalDocuments: rawData.documents ? rawData.documents.length : 0,
      documentIds: rawData.documents
        ? rawData.documents.map((d: Document) => d.id)
        : [],
      uniqueDocumentIds: rawData.documents
        ? [...new Set(rawData.documents.map((d: Document) => d.id))]
        : [],
      documentTypes: rawData.documents
        ? rawData.documents.map((d: Document) => d.doc_type)
        : [],
      hasDuplicates: false, // Will be set below
    };

    analysis.hasDuplicates =
      analysis.totalDocuments !== analysis.uniqueDocumentIds.length;

    return NextResponse.json(
      {
        userId,
        analysis,
        rawApiResponse: rawData,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Debug external API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch from external API", details: error },
      { status: 500 },
    );
  }
}
