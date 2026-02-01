import { createHmac } from "crypto";

function base64urlEncode(input: Buffer) {
  return input
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function base64urlDecode(input: string) {
  // pad
  const pad = 4 - (input.length % 4);
  const base64 = (input + (pad === 4 ? "" : "=".repeat(pad)))
    .replace(/-/g, "+")
    .replace(/_/g, "/");
  return Buffer.from(base64, "base64");
}

export function verifyJwt(token: string, secret: string) {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const [headerB64, payloadB64, sigB64] = parts;
    const signature = createHmac("sha256", secret)
      .update(`${headerB64}.${payloadB64}`)
      .digest();
    const expected = base64urlEncode(signature);
    if (expected !== sigB64) return null;
    const payloadJson = base64urlDecode(payloadB64).toString();
    return JSON.parse(payloadJson);
  } catch {
    return null;
  }
}

export function requireAdmin(req: Request) {
  const auth = req.headers.get("authorization");
  if (!auth || !auth.startsWith("Bearer "))
    return { ok: false, status: 401, detail: "Missing Authorization" };
  const token = auth.replace("Bearer ", "");
  const secret = process.env.JWT_SECRET;
  if (!secret)
    return {
      ok: false,
      status: 501,
      detail: "JWT_SECRET not configured on server",
    };
  const payload = verifyJwt(token, secret);
  if (!payload) return { ok: false, status: 401, detail: "Invalid token" };
  if (payload.role !== "admin")
    return { ok: false, status: 403, detail: "Admin role required" };
  return { ok: true, payload };
}

export function signJwt(payload: object, secret: string) {
  const header = { alg: "HS256", typ: "JWT" };
  const headerB = base64urlEncode(Buffer.from(JSON.stringify(header)));
  const payloadB = base64urlEncode(Buffer.from(JSON.stringify(payload)));
  const sig = createHmac("sha256", secret)
    .update(`${headerB}.${payloadB}`)
    .digest();
  const sigB = base64urlEncode(sig);
  return `${headerB}.${payloadB}.${sigB}`;
}

const auth = { verifyJwt, requireAdmin, signJwt };
export default auth;
