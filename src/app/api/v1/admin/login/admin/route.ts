import { NextRequest, NextResponse } from "next/server";
import {
  verifyAdminCredentials,
  NotImplementedError,
} from "../../../../../../lib/adminData";
import auth from "../../../../../../lib/auth";

export async function POST(req: NextRequest) {
  const url = new URL(req.url);
  const email = url.searchParams.get("email") || "";
  const password = url.searchParams.get("password") || "";

  if (!email || !password) {
    return NextResponse.json(
      {
        detail: [
          {
            loc: ["query", "email/password"],
            msg: "Both email and password query parameters are required",
            type: "validation_error",
          },
        ],
      },
      { status: 422 }
    );
  }

  try {
    const valid = await verifyAdminCredentials(email, password);
    // verifyAdminCredentials should return an object with at least { email, role }
    if (!valid || valid.role !== "admin") {
      return NextResponse.json(
        { detail: "Invalid admin credentials" },
        { status: 401 }
      );
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return NextResponse.json(
        { detail: "JWT signing not configured (JWT_SECRET missing)" },
        { status: 501 }
      );
    }

    const payload = {
      sub: valid.email,
      role: valid.role,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
    };
    const access_token = auth.signJwt(payload, secret);
    return NextResponse.json(
      { access_token, token_type: "bearer" },
      { status: 200 }
    );
  } catch (err: unknown) {
    if (err instanceof NotImplementedError) {
      const message = err instanceof Error ? err.message : String(err);
      return NextResponse.json({ detail: message }, { status: 501 });
    }
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ detail: message }, { status: 500 });
  }
}
