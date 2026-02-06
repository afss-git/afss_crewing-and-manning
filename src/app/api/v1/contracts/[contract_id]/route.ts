import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

interface JWTPayload {
  id: number;
  email: string;
  role?: string;
}

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ contract_id: string }> },
) {
  try {
    const { contract_id } = await params;
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

    const contract = await prisma.contract.findUnique({
      where: {
        id: parseInt(contract_id),
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
    });

    if (!contract) {
      return NextResponse.json(
        { detail: "Contract not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(contract, { status: 200 });
  } catch (error) {
    console.error("Get contract error:", error);
    return NextResponse.json(
      { detail: "Failed to fetch contract" },
      { status: 500 },
    );
  }
}
