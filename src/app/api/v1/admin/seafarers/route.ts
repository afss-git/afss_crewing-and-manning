import { NextRequest, NextResponse } from "next/server";
import auth from "../../../../../lib/auth";

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
  const check = auth.requireAdmin(req as unknown as Request);
  if (!check.ok) {
    return NextResponse.json(
      { detail: check.detail },
      { status: check.status },
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

    console.log(`🔗 Attempting to fetch seafarers from external API...`);

    // Add retry logic for unreliable external API
    const maxRetries = 2;
    const timeout = 8000; // Reduce timeout to 8 seconds

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(
          `📡 Attempt ${attempt}/${maxRetries} to fetch from external API`,
        );

        // Create AbortController for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        // Fetch seafarers from external API
        const externalResponse = await fetch(
          "https://crewing-mvp.onrender.com/api/v1/admin/seafarers",
          {
            method: "GET",
            headers: {
              accept: "application/json",
              Authorization: `Bearer ${externalApiToken}`,
            },
            signal: controller.signal,
          },
        );

        clearTimeout(timeoutId);

        if (!externalResponse.ok) {
          console.error(
            `❌ External API error: ${externalResponse.status} ${externalResponse.statusText}`,
          );

          if (attempt === maxRetries) {
            // On final attempt, return error details
            return NextResponse.json(
              {
                detail: `External API authentication failed (${externalResponse.status}) after ${maxRetries} attempts. Please verify your EXTERNAL_API_TOKEN is valid.`,
                externalApiStatus: externalResponse.status,
                tokenPreview: externalApiToken.substring(0, 20) + "...",
                endpoint:
                  "https://crewing-mvp.onrender.com/api/v1/admin/seafarers",
              },
              { status: externalResponse.status },
            );
          }

          // Continue to next retry
          console.log(`⏳ Retrying in 1 second...`);
          await new Promise((resolve) => setTimeout(resolve, 1000));
          continue;
        }

        const data: ApiSeafarer[] = await externalResponse.json();

        console.log(
          `✅ Successfully fetched ${data.length} seafarers from external API on attempt ${attempt}`,
        );

        return NextResponse.json(data, { status: 200 });
      } catch (fetchError: unknown) {
        console.error(`❌ Attempt ${attempt} failed:`, fetchError);

        if (attempt === maxRetries) {
          // Final attempt failed - return fallback or error
          console.error(
            "🚨 All retry attempts failed. External API is unavailable.",
          );

          // Return empty array as fallback so dashboard doesn't break
          return NextResponse.json(
            {
              detail:
                "External API is temporarily unavailable. Please try again later.",
              fallback: true,
              data: [],
            },
            { status: 503 },
          );
        }

        // Wait before next retry
        console.log(`⏳ Waiting before retry ${attempt + 1}...`);
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }
  } catch (err: unknown) {
    console.error("Failed to fetch seafarers from external API:", err);
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ detail: message }, { status: 500 });
  }
}
