"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

// ====== TYPES ======
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface Document {
  id: string;
  docType: string;
}

interface PendingUser {
  user_id: string;
  first_name: string;
  last_name: string;
  documents: Document[];
}

// ====== COMPONENT ======
export default function AdminDashboardPage() {
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [pendingLoading, setPendingLoading] = useState(false);

  const [approvingUserId, setApprovingUserId] = useState<string | null>(null);
  const [docLoadingId, setDocLoadingId] = useState<string | null>(null);

  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // ====== AUTH HELPERS ======
  const getAuthToken = () => localStorage.getItem("crew-manning-token") || "";

  const handleLogout = () => {
    localStorage.clear();
    router.replace("/admin/login");
  };

  // ====== AUTH EFFECT ======
  useEffect(() => {
    const storedUser = localStorage.getItem("crew-manning-user");
    const token = getAuthToken();

    if (!storedUser || !token) {
      router.replace("/admin/login");
      return;
    }

    try {
      const parsed: User = JSON.parse(storedUser);
      if (parsed.role !== "admin") {
        router.replace("/admin/login");
        return;
      }
      setUser(parsed);
      fetchPendingUsers();
    } catch (e) {
      console.error("Auth parse error:", e);
      router.replace("/admin/login");
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  // ====== API FUNCTIONS ======
  async function fetchPendingUsers() {
    setPendingLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/v1/admin/users/pending", {
        headers: { Authorization: `Bearer ${getAuthToken()}` },
      });

      if (res.status === 401) {
        setMessage({ type: "error", text: "Session expired. Please log in again." });
        setTimeout(handleLogout, 2000);
        return;
      }

      if (!res.ok) {
        throw new Error(`Failed to fetch pending users: ${res.status}`);
      }

      const data = await res.json();
      setPendingUsers(data.pending_users ?? []);
    } catch (e) {
      console.error("Fetch error:", e);
      setMessage({ type: "error", text: "Failed to load pending users." });
    } finally {
      setPendingLoading(false);
    }
  }

  async function approveSeafarer(userId: string) {
    setApprovingUserId(userId);
    setMessage(null);
    try {
      const res = await fetch(`/api/v1/admin/users/${userId}/approve`, {
        method: "POST",
        headers: { Authorization: `Bearer ${getAuthToken()}` },
      });

      if (res.status === 401) {
        setMessage({ type: "error", text: "Session expired. Redirecting..." });
        setTimeout(handleLogout, 2000);
        return;
      }

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Failed to approve user");
      }

      setMessage({ type: "success", text: "User approved successfully!" });
      fetchPendingUsers(); // Refetch to update list
    } catch (e) {
      console.error("Approve error:", e);
      setMessage({ type: "error", text: "Failed to approve user." });
    } finally {
      setApprovingUserId(null);
    }
  }

  async function approveDocumentApi(docId: string) {
    setDocLoadingId(docId);
    setMessage(null);
    try {
      const res = await fetch(`/api/v1/admin/documents/${docId}/approve`, {
        method: "POST",
        headers: { Authorization: `Bearer ${getAuthToken()}` },
      });

      if (res.status === 401) {
        setMessage({ type: "error", text: "Session expired. Redirecting..." });
        setTimeout(handleLogout, 2000);
        return;
      }

      if (!res.ok) {
        throw new Error("Failed to approve document");
      }

      setMessage({ type: "success", text: "Document approved!" });
      fetchPendingUsers();
    } catch (e) {
      console.error("Document approve error:", e);
      setMessage({ type: "error", text: "Failed to approve document." });
    } finally {
      setDocLoadingId(null);
    }
  }

  async function rejectDocumentApi(docId: string) {
    setDocLoadingId(docId);
    setMessage(null);
    try {
      const res = await fetch(`/api/v1/admin/documents/${docId}/reject`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ notes: "" }), // You can add a notes modal later
      });

      if (res.status === 401) {
        setMessage({ type: "error", text: "Session expired. Redirecting..." });
        setTimeout(handleLogout, 2000);
        return;
      }

      if (!res.ok) {
        throw new Error("Failed to reject document");
      }

      setMessage({ type: "success", text: "Document rejected." });
      fetchPendingUsers();
    } catch (e) {
      console.error("Document reject error:", e);
      setMessage({ type: "error", text: "Failed to reject document." });
    } finally {
      setDocLoadingId(null);
    }
  }

  // ====== LOADING STATE ======
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading admin dashboard...
      </div>
    );
  }

  // ====== RENDER ======
  return (
    <div className="flex h-screen bg-gray-50">
      {/* MOBILE SIDEBAR OVERLAY */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed lg:static z-50 w-64 h-full bg-white border-r p-4 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="flex justify-between items-center mb-6 lg:hidden">
          <span className="font-bold">Admin</span>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        <nav className="space-y-2">
          <Link
            href="/admin/seafarers"
            className={`block p-3 rounded-lg transition-colors ${
              pathname === "/admin/seafarers"
                ? "bg-blue-100 text-blue-700 font-medium"
                : "text-gray-700 hover:bg-gray-100"
            }`}
            onClick={() => setIsSidebarOpen(false)}
          >
            Seafarers
          </Link>
          {/* Add more nav items here as needed */}
        </nav>

        <button
          onClick={handleLogout}
          className="mt-8 w-full py-2 px-4 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm font-medium"
        >
          Logout
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-4 md:p-6 overflow-y-auto">
        {/* Hamburger button for mobile */}
        <div className="lg:hidden mb-4">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 rounded-md bg-gray-200 hover:bg-gray-300"
            aria-label="Open menu"
          >
            ☰
          </button>
        </div>

        <h1 className="text-2xl font-bold text-gray-800 mb-4">Pending Users</h1>

        {/* MESSAGE FEEDBACK */}
        {message && (
          <div
            className={`mb-4 p-3 rounded-md ${
              message.type === "success"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* PENDING USERS LIST */}
        {pendingLoading ? (
          <p className="text-gray-600">Loading pending users...</p>
        ) : pendingUsers.length === 0 ? (
          <p className="text-gray-500">No pending users at the moment.</p>
        ) : (
          <div className="space-y-4">
            {pendingUsers.map((u) => (
              <div key={u.user_id} className="border border-gray-200 rounded-lg p-4 bg-white">
                <p className="font-medium text-gray-800">
                  {u.first_name} {u.last_name}
                </p>

                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => approveSeafarer(u.user_id)}
                    disabled={approvingUserId === u.user_id}
                    className={`px-3 py-1 rounded text-sm font-medium ${
                      approvingUserId === u.user_id
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-green-600 text-white hover:bg-green-700"
                    }`}
                    aria-label={`Approve user ${u.first_name} ${u.last_name}`}
                  >
                    {approvingUserId === u.user_id ? "Approving..." : "Approve User"}
                  </button>
                </div>

                {u.documents && u.documents.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-sm text-gray-600 mb-2">Documents:</p>
                    <div className="space-y-1">
                      {u.documents.map((doc) => (
                        <div key={doc.id} className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">{doc.docType}</span>
                          <div className="flex gap-1">
                            <button
                              onClick={() => approveDocumentApi(doc.id)}
                              disabled={docLoadingId === doc.id}
                              className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${
                                docLoadingId === doc.id
                                  ? "bg-gray-400 cursor-not-allowed"
                                  : "bg-green-600 hover:bg-green-700"
                              }`}
                              aria-label={`Approve ${doc.docType} document`}
                            >
                              ✓
                            </button>
                            <button
                              onClick={() => rejectDocumentApi(doc.id)}
                              disabled={docLoadingId === doc.id}
                              className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${
                                docLoadingId === doc.id
                                  ? "bg-gray-400 cursor-not-allowed"
                                  : "bg-red-600 hover:bg-red-700"
                              }`}
                              aria-label={`Reject ${doc.docType} document`}
                            >
                              ✗
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}