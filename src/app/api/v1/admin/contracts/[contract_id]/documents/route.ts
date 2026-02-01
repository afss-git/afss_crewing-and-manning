import { NextRequest, NextResponse } from "next/server";
import auth from "../../../../../../../lib/auth";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ contract_id: string }> }
) {
  const check = auth.requireAdmin(req as unknown as Request);
  if (!check.ok) {
    return NextResponse.json(
      { detail: check.detail },
      { status: check.status }
    );
  }

  try {
    const { contract_id } = await params;

    // Validate contract_id is numeric
    const contractIdNum = parseInt(contract_id);
    if (isNaN(contractIdNum)) {
      return NextResponse.json(
        { detail: "Invalid contract ID" },
        { status: 400 }
      );
    }

    // Get the external API token from environment variables
    const externalApiToken = process.env.EXTERNAL_API_TOKEN;

    if (!externalApiToken) {
      return NextResponse.json(
        { detail: "External API token not configured" },
        { status: 500 }
      );
    }

    // Get the FormData from the request
    const formData = await req.formData();

    // Create a new FormData to forward to external API
    const forwardFormData = new FormData();

    // Copy all files from 'files' field
    const files = formData.getAll('files');
    for (const file of files) {
      if (file instanceof Blob) {
        // Forward as is - the external API expects the same field name
        forwardFormData.append('files', file);
      }
    }

    if (forwardFormData.getAll('files').length === 0) {
      return NextResponse.json(
        { detail: "No valid files provided" },
        { status: 400 }
      );
    }

    // Call the external API to upload documents
    const externalResponse = await fetch(
      `https://crewing-mvp.onrender.com/api/v1/admin/contracts/${contractIdNum}/documents`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${externalApiToken}`,
          // NOTE: Don't set Content-Type for FormData - it's set automatically
        },
        body: forwardFormData,
      }
    );

    if (!externalResponse.ok) {
      console.error("External API error:", externalResponse.status, externalResponse.statusText);
      return NextResponse.json(
        { detail: `External API error: ${externalResponse.status}` },
        { status: externalResponse.status }
      );
    }

    const externalData = await externalResponse.json();
    return NextResponse.json(externalData, { status: 201 });

  } catch (err: unknown) {
    console.error("Failed to upload contract documents:", err);
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ detail: message }, { status: 500 });
  }
}