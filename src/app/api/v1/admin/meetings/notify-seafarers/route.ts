import { NextRequest, NextResponse } from "next/server";

interface MeetingNotificationRequest {
  meeting_link: string;
  meeting_time: string;
  meeting_location: string;
  description: string;
  recipient_emails: string[];
}

interface MeetingNotificationResponse {
  success_count: number;
  failed_count: number;
  failed_emails: string[];
  message: string;
}

export async function POST(request: NextRequest) {
  try {
    // Get the request body
    const body: MeetingNotificationRequest = await request.json();

    // Get auth token from headers
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Authorization token required" },
        { status: 401 },
      );
    }

    // Validate required fields
    if (!body.meeting_link || !body.meeting_time || !body.description) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: meeting_link, meeting_time, description",
        },
        { status: 400 },
      );
    }

    // Forward request to external API
    const externalApiUrl = process.env.NEXT_PUBLIC_API_URL;
    const externalToken = process.env.EXTERNAL_API_TOKEN;

    if (!externalApiUrl || !externalToken) {
      console.error("Missing external API configuration");
      return NextResponse.json(
        { error: "External API not configured" },
        { status: 500 },
      );
    }

    const response = await fetch(
      `${externalApiUrl}/api/v1/admin/meetings/notify-seafarers`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${externalToken}`,
        },
        body: JSON.stringify({
          meeting_link: body.meeting_link,
          meeting_time: body.meeting_time,
          meeting_location: body.meeting_location || "",
          description: body.description,
          recipient_emails: body.recipient_emails || [],
        }),
      },
    );

    if (!response.ok) {
      console.error(`External API error: ${response.status}`);
      return NextResponse.json(
        { error: "Failed to send meeting notification" },
        { status: response.status },
      );
    }

    const result: MeetingNotificationResponse = await response.json();

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Meeting notification error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
