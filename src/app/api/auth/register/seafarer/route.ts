import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, firstName, lastName } = body;

    // For now, skip password since User model doesn't have auth fields
    // We'll focus on creating the user record for admin management

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { detail: "User with this email already exists" },
        { status: 400 }
      );
    }

    // Create user in local database (without password for now)
    const user = await prisma.user.create({
      data: {
        email,
        firstName,
        lastName,
        approved: false, // Require admin approval
      },
    });

    return NextResponse.json(
      {
        message: "Registration successful",
        user_id: user.id,
        email: user.email,
        first_name: user.firstName,
        last_name: user.lastName,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Local registration error:", error);
    return NextResponse.json(
      { detail: "Failed to register user locally" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
