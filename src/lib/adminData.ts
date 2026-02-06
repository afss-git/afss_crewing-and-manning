import prisma from "./prisma";
import crypto from "crypto";

export class NotImplementedError extends Error {
  constructor(message?: string) {
    super(message || "Not implemented");
    this.name = "NotImplementedError";
  }
}

function genSalt(): string {
  return crypto.randomBytes(16).toString("hex");
}

function hashPassword(password: string, salt: string): string {
  return crypto.scryptSync(password, salt, 64).toString("hex");
}

export async function approveUser(userId: string): Promise<void> {
  const id = Number(userId);
  await prisma.user.update({ where: { id }, data: { approved: true } });
}

export async function updateDocumentNotes(
  docId: string,
  notes: string,
): Promise<any> {
  const id = Number(docId);
  const doc = await prisma.document.update({
    where: { id },
    data: { adminNotes: notes },
  });
  return doc;
}

export type AdminCredentialResult = { email: string; role: string } | null;
export async function verifyAdminCredentials(
  email: string,
  password: string,
): Promise<AdminCredentialResult> {
  let admin = await prisma.admin.findUnique({ where: { email } });
  // If no admin in DB but env vars provided, create admin from env for local dev
  if (!admin) {
    const envEmail = process.env.ADMIN_EMAIL;
    const envPassword = process.env.ADMIN_PASSWORD;
    if (envEmail && envPassword && envEmail === email) {
      const salt = genSalt();
      const hash = hashPassword(envPassword, salt);
      admin = await prisma.admin.create({
        data: { email: envEmail, salt, hash, role: "admin" },
      });
      const providedHash = hashPassword(password, salt);
      if (providedHash === admin.hash)
        return { email: admin.email, role: admin.role };
      return null;
    }
    return null;
  }
  const hashed = hashPassword(password, admin.salt);
  if (hashed === admin.hash) return { email: admin.email, role: admin.role };
  return null;
}

export async function rejectDocument(
  docId: string,
  notes?: string,
): Promise<any> {
  const id = Number(docId);

  // Check if document exists first
  const existingDoc = await prisma.document.findUnique({
    where: { id },
  });

  if (!existingDoc) {
    throw new Error(`Document with ID ${id} not found`);
  }

  const doc = await prisma.document.update({
    where: { id },
    data: {
      status: "rejected",
      adminNotes: notes ?? undefined,
      verifiedAt: new Date(),
    },
  });
  return doc;
}

export async function approveDocument(docId: string): Promise<any> {
  const id = Number(docId);

  // Check if document exists first
  const existingDoc = await prisma.document.findUnique({
    where: { id },
  });

  if (!existingDoc) {
    throw new Error(`Document with ID ${id} not found`);
  }

  // Check if document is already approved
  if (existingDoc.status === "approved") {
    console.log(
      `Document ${id} is already approved, updating verifiedAt timestamp`,
    );
    // Just update the verified timestamp
    const doc = await prisma.document.update({
      where: { id },
      data: { verifiedAt: new Date() },
    });
    return doc;
  }

  const doc = await prisma.document.update({
    where: { id },
    data: { status: "approved", verifiedAt: new Date() },
  });
  return doc;
}

export async function getPendingUsers(): Promise<any> {
  const setting = await prisma.setting.findUnique({
    where: { key: "required_document_types" },
  });
  let requiredTypes: string[] = [];
  if (setting && setting.value) {
    try {
      requiredTypes = JSON.parse(setting.value as string);
    } catch (e) {
      // ignore parse errors
      requiredTypes = [];
    }
  }

  const users = await prisma.user.findMany({ include: { documents: true } });
  const pending: any[] = [];
  for (const u of users) {
    const docs = u.documents || [];
    if (requiredTypes.length > 0) {
      const hasAll = requiredTypes.every((t) =>
        docs.some((d) => d.docType === t),
      );
      if (!hasAll) continue;
    } else if (docs.length === 0) continue;
    const hasUnapproved = docs.some((d) => d.status !== "approved");
    if (hasUnapproved) {
      pending.push({
        user_id: u.id,
        email: u.email,
        first_name: u.firstName,
        last_name: u.lastName,
        documents: docs,
      });
    }
  }
  return pending;
}

export async function getAllUsers(): Promise<any> {
  const users = await prisma.user.findMany({
    include: {
      documents: true,
    },
  });

  return users.map((user) => ({
    user_id: user.id,
    email: user.email,
    first_name: user.firstName,
    last_name: user.lastName,
    approved: user.approved,
    documents: user.documents || [],
  }));
}
