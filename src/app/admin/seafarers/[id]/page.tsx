"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

interface SeafarerProfile {
  user_id: number;
  email: string;
  is_verified: boolean;
  is_approved: boolean;
  profile: {
    first_name: string;
    last_name: string;
    date_of_birth: string;
    gender: string;
    nationality: string;
    phone_number: string;
    address: string;
    state_province: string;
    city: string;
    rank: string;
    years_of_experience: number;
    profile_photo_url: string | null;
  };
  documents: Document[];
}

interface Document {
  id: number;
  doc_type: string;
  custom_title: string | null;
  file_name: string;
  file_url: string;
  file_size: number;
  status: "pending" | "approved" | "rejected";
  admin_notes: string | null;
  verified_at: string | null;
  created_at: string;
}

export default function AdminSeafarerProfilePage() {
  const router = useRouter();
  const params = useParams();
  const userId = params?.id as string;

  const [userProfile, setUserProfile] = useState<SeafarerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  // Fetch user profile data
  const fetchUserProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("crew-manning-token");
      if (!token) {
        router.push("/admin/login");
        return;
      }

      // Fetch complete seafarer profile using the new admin endpoint
      const response = await fetch(
        `/api/v1/admin/seafarers/${userId}/profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Seafarer not found");
        }
        throw new Error(`Failed to fetch seafarer profile: ${response.status}`);
      }

      const seafarerData = await response.json();

      // The new API returns data in the correct format, so we can use it directly
      setUserProfile(seafarerData);
    } catch (err) {
      console.error("Failed to fetch seafarer profile:", err);
      setError(
        err instanceof Error ? err.message : "Failed to load seafarer profile",
      );
    } finally {
      setLoading(false);
    }
  }, [userId, router]);

  // Handle document approval
  const handleApproveDocument = async (documentId: number) => {
    try {
      setActionLoading(documentId);

      const token = localStorage.getItem("crew-manning-token");
      if (!token) {
        router.push("/admin/login");
        return;
      }

      const response = await fetch(
        `/api/v1/admin/documents/${documentId}/approve`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to approve document");
      }

      // Refresh user data
      await fetchUserProfile();
    } catch (err) {
      console.error("Failed to approve document:", err);
      setError("Failed to approve document");
    } finally {
      setActionLoading(null);
    }
  };

  // Handle document rejection
  const handleRejectDocument = async (documentId: number, notes?: string) => {
    try {
      setActionLoading(documentId);

      const token = localStorage.getItem("crew-manning-token");
      if (!token) {
        router.push("/admin/login");
        return;
      }

      const response = await fetch(
        `/api/v1/admin/documents/${documentId}/reject`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            notes: notes || "Document rejected by admin",
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to reject document");
      }

      // Refresh user data
      await fetchUserProfile();
    } catch (err) {
      console.error("Failed to reject document:", err);
      setError("Failed to reject document");
    } finally {
      setActionLoading(null);
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("crew-manning-token");
    localStorage.removeItem("crew-manning-user");
    router.push("/admin/login");
  };

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem("crew-manning-token");
    if (!token) {
      router.push("/admin/login");
    }
  }, [router]);

  // Fetch user profile on mount
  useEffect(() => {
    if (userId) {
      fetchUserProfile();
    }
  }, [userId, fetchUserProfile]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <span className="text-text-main-light dark:text-text-main-dark">
            Loading user profile...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-md text-center">
          <h2 className="text-xl font-bold text-red-700 dark:text-red-300 mb-3">
            Error Loading Profile
          </h2>
          <p className="text-red-600 dark:text-red-200 mb-4">{error}</p>
          <button
            onClick={fetchUserProfile}
            className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const displayName = userProfile?.profile
    ? `${userProfile.profile.first_name} ${userProfile.profile.last_name}`
    : "Unknown User";

  const totalDocuments = userProfile?.documents?.length || 0;
  const approvedDocuments =
    userProfile?.documents?.filter((doc) => doc.status === "approved").length ||
    0;
  const rejectedDocuments =
    userProfile?.documents?.filter((doc) => doc.status === "rejected").length ||
    0;
  const pendingDocuments =
    userProfile?.documents?.filter((doc) => doc.status === "pending").length ||
    0;

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white antialiased">
      {/* Side Navigation */}
      <aside className="w-72 bg-surface-light dark:bg-surface-dark border-r border-slate-200 dark:border-slate-800 flex flex-col h-full hidden lg:flex">
        {/* Logo Area */}
        <div className="px-6 py-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center bg-primary text-white rounded-lg size-10 shadow-lg shadow-primary/30">
              <span className="material-symbols-outlined">anchor</span>
            </div>
            <div className="flex flex-col">
              <h1 className="text-slate-900 dark:text-white text-lg font-bold leading-none tracking-tight">
                CrewManager
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-xs font-medium mt-1">
                Admin Console
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <span className="material-symbols-outlined">dashboard</span>
            <span className="text-sm font-medium">Dashboard</span>
          </Link>

          <div className="pt-4 pb-2 px-4">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Manning
            </p>
          </div>

          <Link
            href="/admin/seafarers"
            className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary/10 text-primary dark:text-primary-light transition-colors"
          >
            <span className="material-symbols-outlined fill-1">groups</span>
            <span className="text-sm font-semibold">Seafarers</span>
          </Link>

          <Link
            href="/admin/shipowners"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <span className="material-symbols-outlined">directions_boat</span>
            <span className="text-sm font-medium">Ship Owners / Agents</span>
          </Link>

          <Link
            href="/admin/contracts"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <span className="material-symbols-outlined">description</span>
            <span className="text-sm font-medium">Contracts</span>
          </Link>

          <Link
            href="/admin/interviews"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <span className="material-symbols-outlined">event_available</span>
            <span className="text-sm font-medium">Interviews</span>
          </Link>

          <Link
            href="/admin/crew-management"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <span className="material-symbols-outlined">work</span>
            <span className="text-sm font-medium">Full Crew Management</span>
          </Link>
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-1">
          <Link
            href="/admin/settings"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <span className="material-symbols-outlined">settings</span>
            <span className="text-sm font-medium">Settings</span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <span className="material-symbols-outlined">logout</span>
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>

        {/* User Profile Mini */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3 px-2">
            <div
              className="bg-center bg-no-repeat bg-cover rounded-full size-10 border-2 border-white shadow-sm"
              style={{
                backgroundImage:
                  "url('https://ui-avatars.com/api/?name=Admin&background=1F2937&color=fff&size=36')",
              }}
            ></div>
            <div className="flex flex-col">
              <p className="text-slate-900 dark:text-white text-sm font-semibold">
                Capt. James T.
              </p>
              <p className="text-slate-500 dark:text-slate-400 text-xs">
                Senior Crew Manager
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full bg-background-light dark:bg-background-dark overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-surface-light dark:bg-surface-dark border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/admin/dashboard")}
              className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">
              Seafarer Profile
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <button className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 shadow-sm shadow-primary/20 transition-colors">
              <span className="material-symbols-outlined text-[20px]">
                edit
              </span>
              <span>Edit Profile</span>
            </button>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Profile Header */}
            <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-border-light dark:border-border-dark overflow-hidden">
              {/* Cover Image */}
              <div className="h-32 bg-gradient-to-r from-primary to-primary-hover relative">
                <div className="absolute -bottom-16 left-8">
                  <div className="w-32 h-32 rounded-full border-4 border-white dark:border-surface-dark shadow-lg bg-gray-200 overflow-hidden">
                    <div className="w-full h-full flex items-center justify-center bg-primary text-white text-4xl font-bold">
                      {displayName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                  </div>
                </div>
              </div>

              {/* Profile Info */}
              <div className="pt-20 pb-6 px-8">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-bold text-text-main-light dark:text-text-main-dark">
                      {displayName}
                    </h1>
                    <p className="text-primary dark:text-red-400 font-medium">
                      Seafarer Application
                    </p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-sm text-text-muted-light dark:text-text-muted-dark">
                        User ID: #{userProfile?.user_id}
                      </span>
                      <span className="text-sm text-text-muted-light dark:text-text-muted-dark">
                        Email: {userProfile?.email}
                      </span>
                    </div>
                  </div>

                  {/* Document Status Summary */}
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {approvedDocuments}
                      </div>
                      <div className="text-xs text-text-muted-light dark:text-text-muted-dark">
                        Approved
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-600">
                        {pendingDocuments}
                      </div>
                      <div className="text-xs text-text-muted-light dark:text-text-muted-dark">
                        Pending
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">
                        {rejectedDocuments}
                      </div>
                      <div className="text-xs text-text-muted-light dark:text-text-muted-dark">
                        Rejected
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Documents Section */}
            <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-border-light dark:border-border-dark p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary dark:text-red-400">
                    description
                  </span>
                  <h3 className="text-lg font-bold text-text-main-light dark:text-text-main-dark">
                    Documents ({totalDocuments})
                  </h3>
                </div>
                <div className="flex items-center gap-2 text-sm text-text-muted-light dark:text-text-muted-dark">
                  <span>Last updated: {new Date().toLocaleDateString()}</span>
                </div>
              </div>

              {userProfile?.documents && userProfile.documents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {userProfile.documents.map((document) => (
                    <div
                      key={document.id}
                      className="bg-background-light dark:bg-background-dark rounded-lg border border-border-light dark:border-border-dark p-4 hover:shadow-md transition-shadow"
                    >
                      {/* Document Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-semibold text-text-main-light dark:text-text-main-dark capitalize">
                            {document.doc_type
                              ? document.doc_type.replace(/_/g, " ")
                              : "Unknown Document"}
                          </h4>
                          <p className="text-xs text-text-muted-light dark:text-text-muted-dark">
                            Uploaded:{" "}
                            {new Date(document.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            document.status === "approved"
                              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                              : document.status === "rejected"
                                ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                                : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                          }`}
                        >
                          {document.status}
                        </span>
                      </div>

                      {/* Document Actions */}
                      <div className="flex items-center gap-2 mb-3">
                        <button
                          onClick={() =>
                            window.open(document.file_url, "_blank")
                          }
                          className="flex-1 text-xs bg-primary hover:bg-primary-hover text-white px-3 py-2 rounded font-medium transition-colors"
                        >
                          View Document
                        </button>
                        <button className="text-xs border border-border-light dark:border-border-dark px-3 py-2 rounded hover:bg-background-light dark:hover:bg-background-dark transition-colors">
                          Download
                        </button>
                      </div>

                      {/* Admin Actions */}
                      {document.status === "pending" ? (
                        <div className="space-y-2">
                          <button
                            onClick={() => handleApproveDocument(document.id)}
                            disabled={actionLoading === document.id}
                            className="w-full text-xs bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded font-medium transition-colors disabled:opacity-50"
                          >
                            {actionLoading === document.id
                              ? "Approving..."
                              : "Approve"}
                          </button>
                          <button
                            onClick={() => handleRejectDocument(document.id)}
                            disabled={actionLoading === document.id}
                            className="w-full text-xs bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded font-medium transition-colors disabled:opacity-50"
                          >
                            {actionLoading === document.id
                              ? "Rejecting..."
                              : "Reject"}
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="w-full text-xs bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 px-3 py-2 rounded font-medium text-center">
                            {document.status === "approved"
                              ? "✓ Document Approved"
                              : "✗ Document Rejected"}
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                            No actions available
                          </p>
                        </div>
                      )}

                      {/* Admin Notes */}
                      {document.admin_notes && (
                        <div className="mt-3 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded text-xs">
                          <p className="font-medium text-yellow-800 dark:text-yellow-200">
                            Admin Note:
                          </p>
                          <p className="text-yellow-700 dark:text-yellow-300">
                            {document.admin_notes}
                          </p>
                        </div>
                      )}

                      {/* Verification Info */}
                      {document.verified_at && (
                        <div className="mt-2 text-xs text-text-muted-light dark:text-text-muted-dark">
                          Verified on:{" "}
                          {new Date(document.verified_at).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-text-muted-light dark:text-text-muted-dark">
                  <span className="material-symbols-outlined text-4xl mb-2">
                    description
                  </span>
                  <p>No documents uploaded yet.</p>
                </div>
              )}
            </div>

            {/* Personal Information */}
            {userProfile?.profile && (
              <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-border-light dark:border-border-dark p-6">
                <div className="flex items-center gap-2 mb-6">
                  <span className="material-symbols-outlined text-primary dark:text-red-400">
                    person
                  </span>
                  <h3 className="text-lg font-bold text-text-main-light dark:text-text-main-dark">
                    Personal Information
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-text-muted-light dark:text-text-muted-dark">
                      Full Name
                    </label>
                    <p className="text-text-main-light dark:text-text-main-dark font-medium">
                      {userProfile.profile.first_name}{" "}
                      {userProfile.profile.last_name}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium text-text-muted-light dark:text-text-muted-dark">
                      Email
                    </label>
                    <p className="text-text-main-light dark:text-text-main-dark font-medium">
                      {userProfile.email}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium text-text-muted-light dark:text-text-muted-dark">
                      Phone
                    </label>
                    <p className="text-text-main-light dark:text-text-main-dark font-medium">
                      {userProfile.profile.phone_number}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium text-text-muted-light dark:text-text-muted-dark">
                      Date of Birth
                    </label>
                    <p className="text-text-main-light dark:text-text-main-dark font-medium">
                      {new Date(
                        userProfile.profile.date_of_birth,
                      ).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium text-text-muted-light dark:text-text-muted-dark">
                      Gender
                    </label>
                    <p className="text-text-main-light dark:text-text-main-dark font-medium capitalize">
                      {userProfile.profile.gender}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium text-text-muted-light dark:text-text-muted-dark">
                      Nationality
                    </label>
                    <p className="text-text-main-light dark:text-text-main-dark font-medium">
                      {userProfile.profile.nationality}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium text-text-muted-light dark:text-text-muted-dark">
                      Rank
                    </label>
                    <p className="text-text-main-light dark:text-text-main-dark font-medium capitalize">
                      {userProfile.profile.rank}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium text-text-muted-light dark:text-text-muted-dark">
                      Years of Experience
                    </label>
                    <p className="text-text-main-light dark:text-text-main-dark font-medium">
                      {userProfile.profile.years_of_experience} years
                    </p>
                  </div>

                  <div className="space-y-1 md:col-span-2">
                    <label className="text-sm font-medium text-text-muted-light dark:text-text-muted-dark">
                      Address
                    </label>
                    <p className="text-text-main-light dark:text-text-main-dark font-medium">
                      {userProfile.profile.address}, {userProfile.profile.city},{" "}
                      {userProfile.profile.state_province}
                    </p>
                  </div>
                </div>

                {/* Verification Status */}
                <div className="mt-6 pt-6 border-t border-border-light dark:border-border-dark">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-green-600">
                          verified_user
                        </span>
                        <span className="text-sm font-medium">
                          Email Verified
                        </span>
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            userProfile.is_verified
                              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                              : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                          }`}
                        >
                          {userProfile.is_verified ? "Verified" : "Unverified"}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        Application Status
                      </span>
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          userProfile.is_approved
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                        }`}
                      >
                        {userProfile.is_approved ? "Approved" : "Pending"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Application Status */}
            <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-border-light dark:border-border-dark p-6">
              <div className="flex items-center gap-2 mb-6">
                <span className="material-symbols-outlined text-primary dark:text-red-400">
                  analytics
                </span>
                <h3 className="text-lg font-bold text-text-main-light dark:text-text-main-dark">
                  Application Status
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-background-light dark:bg-background-dark p-4 rounded-lg border border-border-light dark:border-border-dark">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">
                      Overall Progress
                    </span>
                    <span className="text-lg font-bold">
                      {totalDocuments > 0
                        ? Math.round((approvedDocuments / totalDocuments) * 100)
                        : 0}
                      %
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{
                        width: `${totalDocuments > 0 ? (approvedDocuments / totalDocuments) * 100 : 0}%`,
                      }}
                    ></div>
                  </div>
                </div>

                <div className="bg-background-light dark:bg-background-dark p-4 rounded-lg border border-border-light dark:border-border-dark">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">
                      Documents Reviewed
                    </span>
                    <span className="text-lg font-bold">
                      {approvedDocuments + rejectedDocuments}
                    </span>
                  </div>
                  <p className="text-xs text-text-muted-light dark:text-text-muted-dark">
                    {totalDocuments - pendingDocuments} of {totalDocuments}{" "}
                    processed
                  </p>
                </div>

                <div className="bg-background-light dark:bg-background-dark p-4 rounded-lg border border-border-light dark:border-border-dark">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">
                      Application Status
                    </span>
                    <span
                      className={`text-sm font-bold ${
                        pendingDocuments === 0 && approvedDocuments > 0
                          ? "text-green-600"
                          : rejectedDocuments > 0
                            ? "text-red-600"
                            : "text-yellow-600"
                      }`}
                    >
                      {pendingDocuments === 0 && approvedDocuments > 0
                        ? "Ready for Review"
                        : rejectedDocuments > 0
                          ? "Requires Attention"
                          : "Under Review"}
                    </span>
                  </div>
                  <p className="text-xs text-text-muted-light dark:text-text-muted-dark">
                    Last activity: {new Date().toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
