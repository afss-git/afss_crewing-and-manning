import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const documents = await prisma.document.findMany({
      include: {
        user: {
          select: {
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        count: documents.length,
        documents: documents.map((doc) => ({
          id: doc.id,
          docType: doc.docType,
          status: doc.status,
          userId: doc.userId,
          user: doc.user,
          adminNotes: doc.adminNotes,
          verifiedAt: doc.verifiedAt,
          createdAt: doc.createdAt,
        })),
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Debug documents error:", error);
    return NextResponse.json(
      { error: "Failed to fetch documents", details: error },
      { status: 500 },
    );
  }
}
