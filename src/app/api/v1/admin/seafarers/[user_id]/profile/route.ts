// app/api/admin/seafarers/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getExternalApiToken } from "../../../../../../../lib/externalApiToken";
import { getPresignedUrl } from "../../../../../../../lib/r2";

const EXTERNAL_API_BASE_URL =
  process.env.EXTERNAL_API_BASE_URL?.trim() ||
  "https://crewing-mvp.onrender.com";
const API_BASE_URL = `${EXTERNAL_API_BASE_URL}/api/v1`;

console.log("🔧 Using external API base:", API_BASE_URL);

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

interface SeafarerProfile {
  documents?: Document[];
  profile?: {
    profile_photo_url?: string;
    [key: string]: unknown;
  };
  user_id?: number | string;
  [key: string]: unknown;
}

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<Record<string, string>> },
) {
  try {
    const resolvedParams = await params;
    // Support both possible param names: `id` (used in some routes) and `user_id` (folder name here)
    const rawId = (resolvedParams.id ?? resolvedParams.user_id ?? resolvedParams.userId) as
      | string
      | undefined;

    if (!rawId || rawId.trim() === "") {
      return NextResponse.json(
        {
          detail: "Seafarer ID is required in the URL path",
        },
        { status: 400 },
      );
    }

    const user_id = rawId.trim(); // keep as string — let backend validate
    console.log(`📥 Fetching seafarer profile for ID: ${user_id}`);

    // Get fresh token
    let externalApiToken: string;
    try {
      externalApiToken = await getExternalApiToken();
    } catch (tokenErr) {
      console.error("Failed to obtain external API token:", tokenErr);
      return NextResponse.json(
        { detail: "Authentication service unavailable" },
        { status: 503 },
      );
    }

    const externalUrl = `${API_BASE_URL}/admin/seafarers/${user_id}`;
    console.log(`→ Proxying GET to: ${externalUrl}`);

    const externalRes = await fetch(externalUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${externalApiToken}`,
      },
      // no cache — always fresh for admin
      cache: "no-store",
    });

    if (!externalRes.ok) {
      let errorBody: any = {};
      try {
        errorBody = await externalRes.json();
      } catch {}

      const status = externalRes.status;
      const message =
        errorBody.detail ||
        errorBody.message ||
        errorBody.error ||
        `External API returned ${status}`;

      console.warn(`External API failed: ${status} – ${message}`);

      // Pass through known status codes cleanly
      if (status === 401) {
        return NextResponse.json(
          { detail: "Unauthorized – invalid or expired token" },
          { status: 401 },
        );
      }
      if (status === 403) {
        return NextResponse.json(
          { detail: "Forbidden – insufficient permissions" },
          { status: 403 },
        );
      }
      if (status === 404) {
        return NextResponse.json(
          { detail: "Seafarer not found" },
          { status: 404 },
        );
      }
      if (status === 400) {
        return NextResponse.json(
          { detail: message || "Invalid request (validation error)" },
          { status: 400 },
        );
      }

      // For all other errors → 502 Bad Gateway (proxy failure)
      return NextResponse.json(
        {
          detail: `External service error: ${message}`,
          status: status,
        },
        { status: 502 },
      );
    }

    let data: SeafarerProfile;
    try {
      data = await externalRes.json();
    } catch (parseErr) {
      console.error("Failed to parse external JSON response:", parseErr);
      return NextResponse.json(
        { detail: "Invalid response format from external service" },
        { status: 502 },
      );
    }

    // ── Document deduplication & presigning ────────────────────────────────
    if (data?.documents && Array.isArray(data.documents)) {
      console.log(`Found ${data.documents.length} documents`);

      // Deduplicate by id
      const seen = new Set<number>();
      data.documents = data.documents.filter((doc: Document) => {
        if (seen.has(doc.id)) {
          console.warn(`Duplicate document ID removed: ${doc.id}`);
          return false;
        }
        seen.add(doc.id);
        return true;
      });

      // Presign file_urls (only if R2 configured)
      if (process.env.R2_BUCKET && process.env.R2_ENDPOINT) {
        await Promise.allSettled(
          data.documents.map(async (doc) => {
            if (!doc.file_url) return;
            try {
              const urlObj = new URL(doc.file_url);
              let key = urlObj.pathname.replace(/^\/+/, "");

              // Strip bucket prefix if present
              const bucketPrefix = `${process.env.R2_BUCKET}/`;
              if (key.startsWith(bucketPrefix)) {
                key = key.slice(bucketPrefix.length);
              }

              if (!key) return;

              const presigned = await getPresignedUrl(key, 300); // 5 min expiry
              doc.file_url = presigned;
              console.log(`Presigned document ${doc.id} → ${key}`);
            } catch (presignErr) {
              console.warn(`Presign failed for doc ${doc.id}:`, presignErr);
              // keep original URL as fallback
            }
          }),
        );
      }
    }

    // ── Presign profile photo ──────────────────────────────────────────────
    if (
      data?.profile?.profile_photo_url &&
      process.env.R2_BUCKET &&
      process.env.R2_ENDPOINT
    ) {
      try {
        const urlObj = new URL(data.profile.profile_photo_url);
        let key = urlObj.pathname.replace(/^\/+/, "");
        const bucketPrefix = `${process.env.R2_BUCKET}/`;
        if (key.startsWith(bucketPrefix)) {
          key = key.slice(bucketPrefix.length);
        }

        if (key) {
          const presigned = await getPresignedUrl(key, 300);
          data.profile.profile_photo_url = presigned;
          console.log(`Presigned profile photo → ${key}`);
        }
      } catch (photoErr) {
        console.warn("Profile photo presign failed:", photoErr);
      }
    }

    console.log(`✅ Seafarer ${user_id} profile fetched successfully`);
    return NextResponse.json(data);
  } catch (err: unknown) {
    console.error("Critical error in /admin/seafarers/[id]:", err);
    const message =
      err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ detail: message }, { status: 500 });
  }
}
