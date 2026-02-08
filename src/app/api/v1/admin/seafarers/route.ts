import { NextRequest, NextResponse } from "next/server";
import { getExternalApiToken } from "../../../../../lib/externalApiToken";

// Use environment variable for backend URL - NO TRAILING SPACES!
const EXTERNAL_API_BASE_URL =
  process.env.EXTERNAL_API_BASE_URL || "https://crewing-mvp.onrender.com";
const BACKEND_URL = `${EXTERNAL_API_BASE_URL}/api/v1`;

console.log("🔧 Backend URL:", BACKEND_URL);

interface ApiSeafarer {
  user_id: number;
  email: string;
  first_name: string | null;
  last_name: string | null;
  rank: string | null;
  years_of_experience: number | null;
  is_approved: boolean;
}

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    console.log(`🔗 Fetching seafarers from external API...`);

    // Get token from external API (using service account credentials from .env)
    const externalApiToken = await getExternalApiToken();
    console.log(`🔐 External API token obtained`);

    // Add retry logic for unreliable external API
    const maxRetries = 2;
    const timeout = 8000;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(
          `📡 Attempt ${attempt}/${maxRetries} to fetch from external API`,
        );

        // Create AbortController for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        // Fetch seafarers from external API - FIXED URL
        const externalResponse = await fetch(`${BACKEND_URL}/admin/seafarers`, {
          method: "GET",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${externalApiToken}`,
          },
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!externalResponse.ok) {
          console.error(
            `❌ External API error: ${externalResponse.status} ${externalResponse.statusText}`,
          );

          if (attempt === maxRetries) {
            // On final attempt, return error
            return NextResponse.json(
              {
                detail: `External API error: ${externalResponse.status}`,
                externalApiStatus: externalResponse.status,
              },
              { status: externalResponse.status },
            );
          }

          // Continue to next retry
          console.log(`⏳ Retrying in 1 second...`);
          await new Promise((resolve) => setTimeout(resolve, 1000));
          continue;
        }

        // ✅ FIXED: Added missing variable name "data"
        const data: ApiSeafarer[] = await externalResponse.json();

        console.log(
          `✅ Successfully fetched ${data.length} seafarers from external API on attempt ${attempt}`,
        );

        return NextResponse.json(data, { status: 200 });
      } catch (fetchError: unknown) {
        console.error(`❌ Attempt ${attempt} failed:`, fetchError);

        if (attempt === maxRetries) {
          return NextResponse.json(
            {
              detail: "Failed to fetch seafarers after retries",
              error:
                fetchError instanceof Error
                  ? fetchError.message
                  : String(fetchError),
            },
            { status: 503 },
          );
        }

        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    return NextResponse.json(
      { detail: "Failed to fetch seafarers" },
      { status: 500 },
    );
  } catch (err: unknown) {
    console.error("❌ Seafarers endpoint error:", err);
    return NextResponse.json(
      {
        detail: "Failed to fetch seafarers",
        error: err instanceof Error ? err.message : String(err),
      },
      { status: 500 },
    );
  }
}
