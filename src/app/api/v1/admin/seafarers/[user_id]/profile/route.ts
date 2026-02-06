import { NextRequest, NextResponse } from "next/server";
import auth from "../../../../../../../lib/auth";

const API_BASE_URL = "https://crewing-mvp.onrender.com/api/v1";

interface Document {
  id: number;
  doc_type: string;
  custom_title: string | null;
  file_name: string;
  file_url: string;
  file_size: number;
  status: "pending" | "approved" | "rejected";
  admin_notes: string | null;
  verified_at: string | null;
  created_at: string;
}

interface SeafarerData {
  documents?: Document[];
  [key: string]: unknown;
}

export async function GET(
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
    // Get the external API token from environment variables
    const externalApiToken = process.env.EXTERNAL_API_TOKEN;

    if (!externalApiToken) {
      return NextResponse.json(
        { detail: "External API token not configured" },
        { status: 500 },
      );
    }

    // Use the direct seafarer profile endpoint
    const response = await fetch(`${API_BASE_URL}/admin/seafarers/${user_id}`, {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${externalApiToken}`,
      },
    });

    if (!response.ok) {
      console.error(
        "External API error:",
        response.status,
        response.statusText,
      );
      return NextResponse.json(
        { detail: `External API error: ${response.status}` },
        { status: response.status },
      );
    }

    const seafarerData: SeafarerData = await response.json();

    // Log document information for debugging
    if (seafarerData && seafarerData.documents) {
      console.log(
        `📋 Seafarer ${user_id} has ${seafarerData.documents.length} documents from external API`,
      );

      // Check for duplicate document IDs
      const documentIds = seafarerData.documents.map((doc: Document) => doc.id);
      const uniqueIds = [...new Set(documentIds)];

      if (documentIds.length !== uniqueIds.length) {
        console.warn(
          `⚠️  DUPLICATE DOCUMENTS DETECTED: ${documentIds.length} total, ${uniqueIds.length} unique`,
        );
        console.log("Document IDs:", documentIds);
        console.log("Unique IDs:", uniqueIds);

        // Remove duplicates by filtering to unique IDs only
        const seenIds = new Set<number>();
        seafarerData.documents = seafarerData.documents.filter(
          (doc: Document) => {
            if (seenIds.has(doc.id)) {
              console.log(`🗑️  Removing duplicate document ID: ${doc.id}`);
              return false;
            }
            seenIds.add(doc.id);
            return true;
          },
        );

        console.log(
          `✅ After deduplication: ${seafarerData.documents.length} documents`,
        );
      } else {
        console.log(`✅ No duplicates found in documents`);
      }
    }

    // Return the complete seafarer profile with detailed structure
    return NextResponse.json(seafarerData, { status: 200 });
  } catch (err: unknown) {
    console.error("Admin seafarer profile fetch error:", err);
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ detail: message }, { status: 500 });
  }
}
