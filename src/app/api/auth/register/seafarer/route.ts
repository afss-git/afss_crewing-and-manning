import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getExternalApiToken } from "../../../../../lib/externalApiToken";

const prisma = new PrismaClient();

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { detail: "Email and password are required" },
        { status: 400 },
      );
    }

    // Get external API token (auto-refreshes if expired)
    const externalApiToken = await getExternalApiToken();

    // Call external API for registration and email verification
    try {
      const externalResponse = await fetch(
        "https://crewing-mvp.onrender.com/api/v1/auth/register/seafarer",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            // Note: Registration endpoint might not need Bearer token, but verification does
          },
          body: JSON.stringify({
            email,
            password,
          }),
        },
      );

      const externalData = await externalResponse.json();

      console.log("External registration response:", {
        status: externalResponse.status,
        data: externalData,
      });

      if (!externalResponse.ok) {
        // Return the exact error from the external API
        return NextResponse.json(
          { detail: externalData.detail || "Registration failed" },
          { status: externalResponse.status },
        );
      }

      // If external registration is successful, check and create local user record
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (!existingUser) {
        await prisma.user.create({
          data: {
            email,
            approved: false, // Require admin approval after email verification
          },
        });
      }

      // Return the same response format as the external API
      return NextResponse.json(
        {
          msg: externalData.msg || "Verification code sent to email",
        },
        { status: 201 },
      );
    } catch (externalError) {
      console.error("External API error:", externalError);
      return NextResponse.json(
        {
          detail:
            "Failed to connect to registration service. Please try again.",
        },
        { status: 503 },
      );
    }
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { detail: "Internal server error" },
      { status: 500 },
    );
  } finally {
    await prisma.$disconnect();
  }
}
