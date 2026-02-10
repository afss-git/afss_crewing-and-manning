"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Document {
  document_name: string;
  status: string;
  expiry_date: string | null;
  action: string;
}

interface Meeting {
  meeting_id: number;
  title: string;
  meeting_link: string;
  scheduled_date: string;
  status: string;
  notes: string;
}

interface DashboardData {
  name: string;
  application_status: string;
  documents: Document[];
  meetings: Meeting[];
}

export default function DashboardPage() {
  const { user, isHydrated } = useAuth();
  const router = useRouter();

  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isHydrated) return;
    if (!user?.accessToken) {
      setError("Not authenticated. Please log in.");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setError(null);
        const response = await fetch("/api/v1/seafarers/dashboard", {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
            Accept: "application/json",
          },
        });

        if (response.status === 401) {
          localStorage.removeItem("crew-manning-token");
          router.push("/login");
          return;
        }

        if (!response.ok) {
          throw new Error(`Failed to load dashboard (${response.status})`);
        }

        const dashboardData: DashboardData = await response.json();
        setData(dashboardData);
      } catch (err: any) {
        console.error("Dashboard fetch error:", err);
        setError(err.message || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isHydrated, user?.accessToken, router]);

  if (!isHydrated || loading) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-slate-600 dark:text-slate-400">
            Loading your seafarer dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center p-6">
        <div className="w-full max-w-md p-6 rounded-xl bg-white dark:bg-[#1A2235] border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-start gap-4">
            <span className="material-symbols-outlined text-3xl text-red-500">
              error
            </span>
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                Error
              </h3>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                {error}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center p-6">
        <div className="text-center text-slate-500 dark:text-slate-400">
          No dashboard data available at this time.
        </div>
      </div>
    );
  }

  // ── Computed stats ────────────────────────────────────────────────
  const totalDocs = data.documents.length;
  const approvedDocs = data.documents.filter(
    (d) => d.status.toLowerCase() === "approved",
  ).length;
  const pendingDocs = data.documents.filter(
    (d) => d.status.toLowerCase() === "pending",
  ).length;
  const rejectedDocs = data.documents.filter(
    (d) => d.status.toLowerCase() === "rejected",
  ).length;

  const formatDocName = (name: string) =>
    name
      .split("_")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

  const getStatusBadge = (status: string) => {
    const s = status.toLowerCase();
    let classes =
      "px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ";

    if (s === "approved") {
      classes +=
        "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-900/50";
    } else if (s === "pending") {
      classes +=
        "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-900/50";
    } else if (s === "rejected") {
      classes +=
        "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-900/50";
    } else {
      classes +=
        "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700";
    }

    return classes;
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark font-display">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white dark:bg-[#1A2235] border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Welcome back, {data.name}
          </h1>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-1">
            Manage your documents, application status & upcoming interviews
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
        <div className="space-y-6 lg:space-y-8">
          {/* Application Status Card */}
          <div className="bg-white dark:bg-[#1A2235] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-primary text-2xl">
                    assignment
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    Application Status
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1">
                    {data.application_status}
                  </p>
                </div>
              </div>
              <Link
                href="/seafarer/profile"
                className="text-sm font-medium text-primary hover:text-primary-hover transition-colors whitespace-nowrap"
              >
                View Profile →
              </Link>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 lg:gap-6">
            {[
              {
                label: "Total Documents",
                value: totalDocs,
                icon: "description",
                color: "text-slate-500 dark:text-slate-400",
                bg: "bg-slate-50 dark:bg-slate-800/50",
              },
              {
                label: "Approved",
                value: approvedDocs,
                icon: "verified",
                color: "text-green-600 dark:text-green-400",
                bg: "bg-green-50 dark:bg-green-900/20",
                badge: "Approved",
              },
              {
                label: "Pending",
                value: pendingDocs,
                icon: "schedule",
                color: "text-amber-600 dark:text-amber-400",
                bg: "bg-amber-50 dark:bg-amber-900/20",
                badge: "Pending",
              },
              {
                label: "Rejected",
                value: rejectedDocs,
                icon: "block",
                color: "text-red-600 dark:text-red-400",
                bg: "bg-red-50 dark:bg-red-900/20",
                badge: "Rejected",
              },
            ].map((stat, i) => (
              <div
                key={i}
                className="bg-white dark:bg-[#1A2235] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 lg:p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`h-10 w-10 rounded-lg ${stat.bg} flex items-center justify-center`}
                  >
                    <span className={`material-symbols-outlined ${stat.color}`}>
                      {stat.icon}
                    </span>
                  </div>
                  {stat.badge && (
                    <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {stat.badge}
                    </span>
                  )}
                </div>
                <p className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white">
                  {stat.value}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          {/* Documents */}
          <div className="bg-white dark:bg-[#1A2235] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-3">
                <span className="material-symbols-outlined text-slate-500 dark:text-slate-400">
                  description
                </span>
                My Documents
              </h2>
              <Link
                href="/seafarer/documents"
                className="text-sm font-medium text-primary hover:text-primary-hover flex items-center gap-1"
              >
                View All
                <span className="material-symbols-outlined text-base">
                  arrow_forward
                </span>
              </Link>
            </div>

            {data.documents.length === 0 ? (
              <div className="p-12 text-center">
                <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-700 mb-4 block">
                  folder_open
                </span>
                <p className="text-slate-500 dark:text-slate-400">
                  No documents uploaded yet
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
                  <thead className="bg-slate-50 dark:bg-slate-800/50">
                    <tr>
                      <th className="px-4 py-3.5 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Document
                      </th>
                      <th className="px-4 py-3.5 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 py-3.5 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider hidden sm:table-cell">
                        Expiry
                      </th>
                      <th className="px-4 py-3.5 text-right text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {data.documents.map((doc, idx) => (
                      <tr
                        key={idx}
                        className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                      >
                        <td className="px-4 py-4 text-sm font-medium text-slate-900 dark:text-white">
                          {formatDocName(doc.document_name)}
                        </td>
                        <td className="px-4 py-4">
                          <span className={getStatusBadge(doc.status)}>
                            {doc.status.charAt(0).toUpperCase() +
                              doc.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-sm text-slate-600 dark:text-slate-400 hidden sm:table-cell">
                          {doc.expiry_date
                            ? new Date(doc.expiry_date).toLocaleDateString()
                            : "—"}
                        </td>
                        <td className="px-4 py-4 text-right text-sm">
                          <button className="text-primary hover:text-primary-hover font-medium">
                            {doc.action || "View"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Upcoming Meetings */}
          <div className="bg-white dark:bg-[#1A2235] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-3">
                <span className="material-symbols-outlined text-slate-500 dark:text-slate-400">
                  calendar_month
                </span>
                Upcoming Interviews & Meetings
              </h2>
              <Link
                href="/seafarer/interview"
                className="text-sm font-medium text-primary hover:text-primary-hover flex items-center gap-1"
              >
                View All
                <span className="material-symbols-outlined text-base">
                  arrow_forward
                </span>
              </Link>
            </div>

            {data.meetings.length === 0 ? (
              <div className="p-12 text-center">
                <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-700 mb-4 block">
                  event_busy
                </span>
                <p className="text-slate-500 dark:text-slate-400">
                  No upcoming meetings scheduled
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-200 dark:divide-slate-800">
                {data.meetings.map((meeting) => (
                  <div
                    key={meeting.meeting_id}
                    className="p-5 sm:p-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <h3 className="font-semibold text-slate-900 dark:text-white">
                          {meeting.title}
                        </h3>
                        <div className="flex flex-wrap gap-4 text-sm text-slate-600 dark:text-slate-400">
                          <div className="flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-base">
                              calendar_today
                            </span>
                            {new Date(
                              meeting.scheduled_date,
                            ).toLocaleDateString("en-US", {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </div>
                          {meeting.notes && (
                            <div className="flex items-center gap-1.5">
                              <span className="material-symbols-outlined text-base">
                                note
                              </span>
                              {meeting.notes}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <span className={getStatusBadge(meeting.status)}>
                          {meeting.status}
                        </span>
                        {meeting.meeting_link && (
                          <a
                            href={meeting.meeting_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors text-sm font-medium"
                          >
                            <span className="material-symbols-outlined">
                              link
                            </span>
                            Join
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
