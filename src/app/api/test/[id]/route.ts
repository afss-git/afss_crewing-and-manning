import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    console.log(`Test route accessed with id: ${id}`);

    return NextResponse.json(
      {
        message: `Test route working for id: ${id}`,
        success: true,
      },
      { status: 200 },
    );
  } catch (err: unknown) {
    console.error("Test route error:", err);
    return NextResponse.json({ error: "Test failed" }, { status: 500 });
  }
}
