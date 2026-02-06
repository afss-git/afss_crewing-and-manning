import { NextRequest, NextResponse } from "next/server";
import auth from "../../../../../../../lib/auth";
import {
  rejectDocument,
  NotImplementedError,
} from "../../../../../../../lib/adminData";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ doc_id: string }> },
) {
  const check = auth.requireAdmin(req as unknown as Request);
  if (!check.ok) {
    return NextResponse.json(
      { detail: check.detail },
      { status: check.status },
    );
  }

  const { doc_id } = await params;
  if (!doc_id) {
    return NextResponse.json(
      {
        detail: [
          {
            loc: ["path", "doc_id"],
            msg: "doc_id is required",
            type: "validation_error",
          },
        ],
      },
      { status: 422 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    // body may be empty — that's acceptable since notes are optional; proceed with undefined
    body = undefined;
  }

  const notes =
    typeof body === "object" &&
    body !== null &&
    "notes" in (body as Record<string, unknown>)
      ? ((body as Record<string, unknown>)["notes"] as string)
      : undefined;

  try {
    console.log(
      `Attempting to reject document ID: ${doc_id} with notes:`,
      notes,
    );

    // First try to reject in local database
    try {
      const result = await rejectDocument(doc_id, notes);
      console.log(`Document rejected successfully in local database:`, result);
      return NextResponse.json(
        { message: "Document rejected", document: result },
        { status: 200 },
      );
    } catch (localError) {
      console.log(
        `Document ${doc_id} not found in local database, trying external API...`,
      );

      // If not found locally, try external API
      const externalApiToken = process.env.EXTERNAL_API_TOKEN;
      if (!externalApiToken) {
        console.error(
          "External API token not configured for fallback rejection",
        );
        throw localError; // Re-throw the original local error
      }

      try {
        const externalResponse = await fetch(
          `https://crewing-mvp.onrender.com/api/v1/admin/documents/${doc_id}/reject`,
          {
            method: "POST",
            headers: {
              accept: "application/json",
              Authorization: `Bearer ${externalApiToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ notes }),
          },
        );

        if (!externalResponse.ok) {
          console.error(
            `External API rejection failed: ${externalResponse.status}`,
          );
          throw new Error(
            `External API rejection failed: ${externalResponse.status}`,
          );
        }

        const externalResult = await externalResponse.json();
        console.log(
          `Document rejected successfully via external API:`,
          externalResult,
        );

        return NextResponse.json(
          {
            message: "Document rejected via external API",
            document: externalResult,
          },
          { status: 200 },
        );
      } catch (externalError) {
        console.error("External API rejection failed:", externalError);
        // Throw the original local error since external API also failed
        throw localError;
      }
    }
  } catch (err: unknown) {
    console.error(`Error rejecting document ${doc_id}:`, err);
    if (err instanceof NotImplementedError) {
      const message = err instanceof Error ? err.message : String(err);
      return NextResponse.json({ detail: message }, { status: 501 });
    }
    const message = err instanceof Error ? err.message : String(err);
    console.error(`Full error details:`, {
      message,
      stack: err instanceof Error ? err.stack : "No stack",
    });
    return NextResponse.json({ detail: message }, { status: 500 });
  }
}
