import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ contract_id: string }> },
) {
  try {
    const { contract_id } = await params;
    const userId = request.headers.get("user-id");

    if (!userId) {
      return NextResponse.json({ detail: "User ID required" }, { status: 400 });
    }

    // Verify the contract belongs to this shipowner
    const contract = await prisma.contract.findUnique({
      where: {
        id: parseInt(contract_id),
        shipOwner: {
          userId: parseInt(userId),
        },
      },
    });

    if (!contract) {
      return NextResponse.json(
        { detail: "Contract not found or access denied" },
        { status: 404 },
      );
    }

    const body = await request.json();
    const { position, specifications } = body;

    if (!position) {
      return NextResponse.json(
        { detail: "Position name is required" },
        { status: 400 },
      );
    }

    const contractPosition = await prisma.contractPosition.create({
      data: {
        contractId: parseInt(contract_id),
        position,
        specifications: specifications || null,
      },
    });

    return NextResponse.json(contractPosition, { status: 201 });
  } catch (error) {
    console.error("Add contract position error:", error);
    return NextResponse.json(
      { detail: "Failed to add contract position" },
      { status: 500 },
    );
  }
}
