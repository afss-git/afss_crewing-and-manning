import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

interface JWTPayload {
  id: number;
  email: string;
  role?: string;
}

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { detail: "Authentication required" },
        { status: 401 },
      );
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
    const userId = decoded.id;

    const contracts = await prisma.contract.findMany({
      where: {
        shipOwner: {
          userId: userId,
        },
      },
      include: {
        shipOwner: {
          select: {
            companyName: true,
            user: {
              select: {
                email: true,
              },
            },
          },
        },
        positions: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(contracts, { status: 200 });
  } catch (error) {
    console.error("Get contracts error:", error);
    return NextResponse.json(
      { detail: "Failed to fetch contracts" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { detail: "Authentication required" },
        { status: 401 },
      );
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
    const userId = decoded.id;

    // Verify user is a shipowner
    const shipOwner = await prisma.shipOwner.findUnique({
      where: { userId: userId },
    });

    if (!shipOwner) {
      return NextResponse.json(
        { detail: "Shipowner profile not found" },
        { status: 404 },
      );
    }

    const body = await request.json();
    const {
      vesselName,
      vesselImoNumber,
      position,
      positionType,
      startDate,
      endDate,
      duration,
      requiredCertifications,
      dayRate,
      clientName,
      clientCompany,
      specificInstructions,
    } = body;

    // Generate unique contract ID
    const contractId = `CT-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    const contract = await prisma.contract.create({
      data: {
        shipOwnerId: shipOwner.id,
        contractId,
        vesselName,
        vesselImoNumber,
        position,
        positionType,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        duration,
        requiredCertifications,
        dayRate,
        clientName,
        clientCompany,
        specificInstructions,
      },
      include: {
        shipOwner: {
          select: {
            companyName: true,
            user: {
              select: {
                email: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(contract, { status: 201 });
  } catch (error) {
    console.error("Create contract error:", error);
    return NextResponse.json(
      { detail: "Failed to create contract" },
      { status: 500 },
    );
  }
}
