import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getExternalApiToken } from "../../../../../lib/externalApiToken";

const prisma = new PrismaClient();

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { detail: "Email and password are required" },
        { status: 400 },
      );
    }

    // Ensure we have an external API token if needed by the external service
    try {
      await getExternalApiToken();
    } catch (err) {
      // Log but proceed — external endpoint may not require a token for registration
      console.warn("Could not refresh external API token:", err);
    }

    try {
      // Call the correct shipowner registration endpoint with hyphens
      const externalResponse = await fetch(
        "https://crewing-mvp.onrender.com/api/v1/auth/register/ship-owner",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ email, password }),
        },
      );

      const externalData = await externalResponse.json();

      console.log("External shipowner registration response:", {
        status: externalResponse.status,
        data: externalData,
      });

      if (!externalResponse.ok) {
        return NextResponse.json(
          { detail: externalData.detail || "Registration failed" },
          { status: externalResponse.status },
        );
      }

      // Persist a local user record if not present
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (!existingUser) {
        await prisma.user.create({ data: { email, approved: false } });
      }

      return NextResponse.json(
        { msg: externalData.msg || "Verification code sent to email" },
        { status: 201 },
      );
    } catch (externalError) {
      console.error(
        "External API error (shipowner registration):",
        externalError,
      );
      return NextResponse.json(
        {
          detail:
            "Failed to connect to registration service. Please try again.",
        },
        { status: 503 },
      );
    }
  } catch (error) {
    console.error("Shipowner registration error:", error);
    return NextResponse.json(
      { detail: "Internal server error" },
      { status: 500 },
    );
  } finally {
    await prisma.$disconnect();
  }
}
