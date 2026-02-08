import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json(
        { error: "Authorization token required" },
        { status: 401 },
      );
    }

    // Determine which external endpoint to call. Prefer the generic profile
    // endpoint which supports different user types. Previously this called
    // the seafarers endpoint only which caused shipowner flows to fail.
    const externalGetUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/profile`;

    const response = await fetch(externalGetUrl, {
      method: "GET",
      headers: {
        Authorization: authHeader,
        Accept: "application/json",
      },
    });

    const data = await response.json();

    // Check if the response indicates profile not found
    if (
      response.status === 404 ||
      (data.detail && data.detail.toLowerCase().includes("profile not found"))
    ) {
      return NextResponse.json(
        { detail: "Company profile not found" },
        { status: 404 },
      );
    }

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Profile fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get the authorization token from the request headers
    const authHeader = request.headers.get("authorization");
    console.log("API Route - Auth header:", authHeader);

    if (!authHeader) {
      return NextResponse.json(
        { error: "Authorization token required" },
        { status: 401 },
      );
    }

    // Create FormData from the incoming request
    const formData = await request.formData();
    console.log("API Route - Form data keys:", Array.from(formData.keys()));

    // Try to detect user role from the Authorization token so we can set the
    // correct user_type when forwarding to the external API. Token should be
    // a JWT in the form 'Bearer <token>'. If detection fails we default to
    // 'seafarer' to preserve previous behaviour.
    try {
      const token = authHeader.split(" ")[1];
      if (token) {
        const payload = JSON.parse(
          Buffer.from(token.split(".")[1], "base64").toString(),
        );
        const role = (
          payload.role ||
          payload.user_type ||
          payload.sub_type ||
          ""
        ).toString();
        if (
          role.toLowerCase() === "ship_owner" ||
          role.toLowerCase() === "shipowner"
        ) {
          formData.append("user_type", "shipowner");
        } else {
          formData.append("user_type", "seafarer");
        }
      } else {
        formData.append("user_type", "seafarer");
      }
    } catch (err) {
      console.warn(
        "Could not decode token to determine role, defaulting user_type to seafarer",
        err,
      );
      formData.append("user_type", "seafarer");
    }

    // Log all FormData contents for debugging
    console.log("API Route - FormData contents:");
    for (const [key, value] of formData.entries()) {
      console.log(
        `  ${key}:`,
        value instanceof File
          ? `File: ${value.name} (${value.size} bytes)`
          : value,
      );
    }

    const externalUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/profile`;
    console.log("API Route - External URL:", externalUrl);

    // Check if NEXT_PUBLIC_API_URL is set
    if (!process.env.NEXT_PUBLIC_API_URL) {
      console.error("API Route - NEXT_PUBLIC_API_URL not set!");
      return NextResponse.json(
        { error: "API configuration error" },
        { status: 500 },
      );
    }

    // Forward the request to the external API
    const response = await fetch(externalUrl, {
      method: "POST",
      headers: {
        Authorization: authHeader,
      },
      body: formData,
    });

    console.log("API Route - External response status:", response.status);
    const headersObj: Record<string, string> = {};
    for (const [k, v] of response.headers.entries()) {
      headersObj[k] = v;
    }
    console.log("API Route - External response headers:", headersObj);

    // Read raw text so we can log and safely attempt JSON parse.
    const rawText = await response.text();
    let data: any = null;
    try {
      data = rawText ? JSON.parse(rawText) : null;
    } catch (parseErr) {
      console.warn("API Route - Failed to parse JSON from external response", parseErr);
      data = null;
    }

    console.log("API Route - External raw response text:", rawText);
    console.log("API Route - External parsed data:", data);

    // Log validation errors in detail if present
    if (response.status === 422 && data && Array.isArray(data.detail)) {
      console.log("API Route - Validation errors:");
      data.detail.forEach(
        (
          error: { loc?: string[]; msg: string; type: string },
          index: number,
        ) => {
          console.log(
            `  ${index + 1}. Field: ${error.loc?.join(".")}, Error: ${error.msg}, Type: ${error.type}`,
          );
        },
      );
    }

    if (!response.ok) {
      const payload =
        data && Object.keys(data).length
          ? data
          : {
              error: "External API error",
              status: response.status,
              statusText: response.statusText,
              raw: rawText,
              headers: headersObj,
            };

      return NextResponse.json(payload, { status: response.status });
    }

    return NextResponse.json(data ?? { ok: true, raw: rawText }, { status: 201 });
  } catch (error) {
    console.error("Profile creation error:", error);

    // More specific error logging
    if (error instanceof SyntaxError && error.message.includes("JSON")) {
      console.error(
        "JSON parsing error - likely received HTML/text response instead of JSON",
      );
    }

    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
