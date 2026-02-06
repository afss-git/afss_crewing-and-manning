import { NextRequest, NextResponse } from "next/server";
import auth from "../../../../../../lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const check = auth.requireAdmin(req as unknown as Request);
  if (!check.ok) {
    return NextResponse.json(
      { detail: check.detail },
      { status: check.status },
    );
  }

  try {
    const documents = await prisma.document.findMany({
      where: {
        status: "pending",
      },
      include: {
        user: {
          select: {
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const formatted = documents.map((doc) => ({
      id: doc.id,
      docType: doc.docType,
      status: doc.status,
      user: {
        id: doc.userId,
        name:
          `${doc.user.firstName || ""} ${doc.user.lastName || ""}`.trim() ||
          "Unknown",
        email: doc.user.email,
      },
      adminNotes: doc.adminNotes,
      createdAt: doc.createdAt,
    }));

    return NextResponse.json(
      {
        count: formatted.length,
        documents: formatted,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Get pending documents error:", error);
    return NextResponse.json(
      { error: "Failed to fetch pending documents" },
      { status: 500 },
    );
  }
}
