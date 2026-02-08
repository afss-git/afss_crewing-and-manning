/**
 * adminData.ts - Removed local database functionality
 *
 * All data operations now go through the external API directly.
 * See the API endpoints in src/app/api/v1/admin/ for implementation.
 */

export class NotImplementedError extends Error {
  constructor(message?: string) {
    super(message || "Not implemented");
    this.name = "NotImplementedError";
  }
}

// Deprecated: Use external API endpoints instead
export async function approveUser(userId: string): Promise<void> {
  throw new NotImplementedError(
    "approveUser is deprecated. Use POST /api/v1/admin/users/{user_id}/approve instead.",
  );
}

export async function updateDocumentNotes(
  docId: string,
  notes: string,
): Promise<any> {
  throw new NotImplementedError(
    "updateDocumentNotes is deprecated. Use PUT /api/v1/admin/documents/{doc_id}/notes instead.",
  );
}

export async function rejectDocument(
  docId: string,
  notes?: string,
): Promise<any> {
  throw new NotImplementedError(
    "rejectDocument is deprecated. Use POST /api/v1/admin/documents/{doc_id}/reject instead.",
  );
}

export async function approveDocument(docId: string): Promise<any> {
  throw new NotImplementedError(
    "approveDocument is deprecated. Use POST /api/v1/admin/documents/{doc_id}/approve instead.",
  );
}

export async function getPendingUsers(): Promise<any> {
  throw new NotImplementedError(
    "getPendingUsers is deprecated. Use GET /api/v1/admin/users/pending instead.",
  );
}

export async function getAllUsers(): Promise<any> {
  throw new NotImplementedError(
    "getAllUsers is deprecated. Use GET /api/v1/admin/users/all instead.",
  );
}

export async function verifyAdminCredentials(
  email: string,
  password: string,
): Promise<{ email: string; role: string } | null> {
  throw new NotImplementedError(
    "verifyAdminCredentials is deprecated. Use POST /api/v1/admin/login/admin instead.",
  );
}
