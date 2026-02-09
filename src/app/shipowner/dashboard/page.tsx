"use client";

import Link from "next/link";
import React, { useEffect, useState, useRef } from "react";
import Sidebar from "../components/Sidebar";
import ShipOwnerProfile from "../../../components/ShipOwnerProfile";
import ShipOwnerDocuments from "../../../components/ShipOwnerDocuments";
import { useAuth } from "@/context/AuthContext";

interface ContractSummary {
  total_submitted: number;
  under_review: number;
  shortlisted: number;
  approved: number;
}

interface Contract {
  id?: number;
  application_id: string;
  contract_type: string;
  vessel_unit: string;
  submission_date: string;
  status: string;
}

interface DashboardData {
  summary: ContractSummary;
  contracts: Contract[];
}

export default function ShipownerDashboard() {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setIsSidebarOpen(false);
      }
    };

    if (isSidebarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSidebarOpen]);

  // Close sidebar when resizing to desktop view
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isSidebarOpen) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isSidebarOpen]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user?.accessToken) {
        console.warn("Dashboard: No access token found", { user });
        setError("Not authenticated. Please log in.");
        setLoading(false);
        return;
      }

      console.log(
        "Dashboard: Starting fetch with token:",
        user.accessToken.substring(0, 20) + "...",
      );

      try {
        const response = await fetch("/api/v1/shipowners/dashboard/contracts", {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${user.accessToken}`,
          },
        });

        console.log("Dashboard API response status:", response.status);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        console.log("Dashboard API response:", data);
        console.log(
          "First contract fields:",
          Object.keys(data.contracts?.[0] || {}),
        );

        setDashboardData(data);
      } catch (err: any) {
        console.error("Dashboard fetch error:", err);
        const errorMessage = err.message || "Failed to load dashboard data";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user?.accessToken]);

  return (
    <div className="flex h-screen overflow-hidden font-display text-slate-900 dark:text-white bg-background-light dark:bg-background-dark">
      {/* Desktop Sidebar - Hidden on mobile */}
      <div className="hidden md:block">
        <Sidebar active="dashboard" />
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex" ref={sidebarRef}>
          {/* Sidebar Panel */}
          <div className="relative w-64 bg-white dark:bg-[#1A2235] h-full shadow-xl border-r border-slate-200 dark:border-slate-800">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
              <h2 className="font-bold text-slate-900 dark:text-white">Menu</h2>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                aria-label="Close menu"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>
            <Sidebar active="dashboard" />
          </div>

          {/* Overlay Background */}
          <div
            className="flex-1 bg-black/40"
            onClick={() => setIsSidebarOpen(false)}
            aria-label="Close menu"
          ></div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative md:ml-64">
        <header className="h-16 flex items-center justify-between px-4 sm:px-6 bg-white dark:bg-[#1A2235] border-b border-slate-200 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger Menu */}
            <button
              className="md:hidden p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              onClick={() => setIsSidebarOpen(true)}
              aria-expanded={isSidebarOpen}
              aria-controls="mobile-sidebar"
              aria-label="Open menu"
            >
              <span className="material-symbols-outlined text-xl">menu</span>
            </button>

            {/* Search Bar */}
            <div className="flex items-center flex-1 max-w-full sm:max-w-lg">
              <div className="relative w-full">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-base sm:text-lg">
                  search
                </span>
                <input
                  className="w-full pl-10 pr-4 py-2 sm:py-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 border-none focus:ring-2 focus:ring-primary text-sm text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400"
                  placeholder="Search contracts, crew, or vessels..."
                  type="text"
                />
              </div>
            </div>
          </div>

          {/* Header Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            <button className="relative p-1.5 sm:p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
              <span className="material-symbols-outlined text-base sm:text-lg">
                notifications
              </span>
              <span className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-red-500 rounded-full border-[1.5px] border-white dark:border-[#1A2235]"></span>
            </button>
            <button className="p-1.5 sm:p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
              <span className="material-symbols-outlined text-base sm:text-lg">
                apps
              </span>
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
            {/* Page Header - Optimized for mobile stacking */}
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-1">
                  <Link
                    href="#"
                    className="hover:text-primary transition-colors truncate"
                  >
                    Home
                  </Link>
                  <span>/</span>
                  <span className="text-slate-900 dark:text-white font-medium truncate">
                    Contracts
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                  Contract Management
                </h1>
                <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-1">
                  Manage and track all crew supply and management agreements.
                </p>
              </div>

              {/* Action buttons - Stack on mobile, responsive sizing */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <button className="w-full sm:w-auto px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs sm:text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2">
                  <span className="material-symbols-outlined text-base sm:text-lg">
                    tune
                  </span>
                  <span className="hidden xs:inline">Filters</span>
                </button>
                <Link
                  href="/shipowner/contract-type"
                  className="w-full sm:w-auto px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg bg-primary hover:bg-primary-hover text-white font-bold text-xs sm:text-sm shadow-lg shadow-primary/30 transition-all flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2"
                >
                  <span className="material-symbols-outlined text-base sm:text-lg">
                    add
                  </span>
                  <span>Create Contract</span>
                </Link>
              </div>
            </div>

            {/* Company Profile - Already responsive component */}
            <ShipOwnerProfile compact={true} />

            {/* Loading/Error States - Maintain existing functionality */}
            {loading && (
              <div className="flex justify-center items-center py-12">
                <p className="text-slate-500 text-sm">
                  Loading dashboard data...
                </p>
              </div>
            )}

            {error && (
              <div className="p-3 sm:p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 flex items-center gap-2 text-sm">
                <span className="material-symbols-outlined text-lg">error</span>
                <span>{error}</span>
              </div>
            )}

            {/* Stats Cards - Mobile optimized grid */}
            {dashboardData && !loading && (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6">
                  {[
                    {
                      label: "Total Submitted",
                      value: dashboardData.summary.total_submitted,
                      icon: "folder_open",
                      bg: "bg-primary/10 text-primary",
                    },
                    {
                      label: "Under Review",
                      value: dashboardData.summary.under_review,
                      icon: "pending",
                      bg: "bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
                    },
                    {
                      label: "Shortlisted",
                      value: dashboardData.summary.shortlisted,
                      icon: "group",
                      bg: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
                    },
                    {
                      label: "Approved",
                      value: dashboardData.summary.approved,
                      icon: "check_circle",
                      bg: "bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400",
                    },
                  ].map((stat, index) => (
                    <div
                      key={index}
                      className="bg-white dark:bg-[#1A2235] p-3 sm:p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3 sm:gap-4"
                    >
                      <div
                        className={`h-8 w-8 sm:h-10 sm:w-10 rounded-lg ${stat.bg} flex items-center justify-center flex-shrink-0`}
                      >
                        <span className="material-symbols-outlined text-sm sm:text-base">
                          {stat.icon}
                        </span>
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
                          {stat.label}
                        </p>
                        <p className="text-lg sm:text-2xl font-bold text-slate-900 dark:text-white mt-0.5 sm:mt-1">
                          {stat.value}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Company Documents - Already responsive component */}
                {!loading && <ShipOwnerDocuments compact={true} maxItems={3} />}

                {/* Contracts Table - Mobile optimized with horizontal scroll */}
                <div className="bg-white dark:bg-[#1A2235] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                          {[
                            "Application ID",
                            "Type",
                            "Vessel / Unit",
                            "Date",
                            "Status",
                            "Action",
                          ].map((header, index) => (
                            <th
                              key={index}
                              className="px-3 py-3 sm:px-4 md:px-6 md:py-4 text-[10px] xs:text-xs sm:text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap"
                            >
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {dashboardData.contracts &&
                        dashboardData.contracts.length > 0 ? (
                          dashboardData.contracts.map(
                            (contract: any, index: number) => (
                              <tr
                                key={index}
                                className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
                              >
                                <td className="px-3 py-3 sm:px-4 md:px-6 md:py-4">
                                  <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors truncate max-w-[150px] xs:max-w-[200px] sm:max-w-none">
                                    {contract.application_id ||
                                      contract.contract_number ||
                                      "N/A"}
                                  </p>
                                </td>
                                <td className="px-3 py-3 sm:px-4 md:px-6 md:py-4">
                                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] xs:text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30 whitespace-nowrap">
                                    {contract.contract_type || "Unknown"}
                                  </span>
                                </td>
                                <td className="px-3 py-3 sm:px-4 md:px-6 md:py-4 text-xs sm:text-sm text-slate-600 dark:text-slate-400 truncate max-w-[120px] xs:max-w-[150px] sm:max-w-none">
                                  {contract.vessel_unit || "N/A"}
                                </td>
                                <td className="px-3 py-3 sm:px-4 md:px-6 md:py-4 text-xs sm:text-sm text-slate-600 dark:text-slate-400 whitespace-nowrap">
                                  {contract.submission_date
                                    ? new Date(
                                        contract.submission_date,
                                      ).toLocaleDateString()
                                    : "N/A"}
                                </td>
                                <td className="px-3 py-3 sm:px-4 md:px-6 md:py-4">
                                  <span
                                    className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] xs:text-xs font-medium whitespace-nowrap ${
                                      contract.status
                                        ?.toLowerCase?.()
                                        ?.includes("review")
                                        ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-900/50"
                                        : contract.status
                                              ?.toLowerCase?.()
                                              ?.includes("approved")
                                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-900/50"
                                          : "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
                                    }`}
                                  >
                                    {contract.status || "Pending"}
                                  </span>
                                </td>
                                <td className="px-3 py-3 sm:px-4 md:px-6 md:py-4 text-right min-w-[100px]">
                                  {contract.id ? (
                                    contract.contract_type
                                      ?.toLowerCase()
                                      .includes("full") ? (
                                      <Link
                                        href={`/shipowner/full-crew-contract?id=${contract.id}`}
                                        className="text-primary hover:text-primary-hover text-xs sm:text-sm font-medium inline-flex items-center gap-0.5 sm:gap-1 justify-end w-full sm:w-auto"
                                        title={`ID: ${contract.id}`}
                                      >
                                        <span className="hidden xs:inline">
                                          View Details
                                        </span>
                                        <span className="material-symbols-outlined text-base">
                                          arrow_forward
                                        </span>
                                      </Link>
                                    ) : (
                                      <Link
                                        href={`/shipowner/contract?id=${contract.id}`}
                                        className="text-primary hover:text-primary-hover text-xs sm:text-sm font-medium inline-flex items-center gap-0.5 sm:gap-1 justify-end w-full sm:w-auto"
                                        title={`ID: ${contract.id}`}
                                      >
                                        <span className="hidden xs:inline">
                                          View Details
                                        </span>
                                        <span className="material-symbols-outlined text-base">
                                          arrow_forward
                                        </span>
                                      </Link>
                                    )
                                  ) : (
                                    <Link
                                      href={`/shipowner/contract?ref=${contract.application_id || contract.contract_number}`}
                                      className="text-primary hover:text-primary-hover text-xs sm:text-sm font-medium inline-flex items-center gap-0.5 sm:gap-1 justify-end w-full sm:w-auto"
                                      title={`Ref: ${contract.application_id}`}
                                    >
                                      <span className="hidden xs:inline">
                                        View Details
                                      </span>
                                      <span className="material-symbols-outlined text-base">
                                        arrow_forward
                                      </span>
                                    </Link>
                                  )}
                                </td>
                              </tr>
                            ),
                          )
                        ) : (
                          <tr>
                            <td
                              colSpan={6}
                              className="px-3 py-8 text-center text-slate-500 text-sm"
                            >
                              No contracts found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile hint for horizontal scroll */}
                  <div className="md:hidden absolute bottom-2 right-2 bg-white/80 dark:bg-[#1A2235]/80 text-primary text-xs px-2 py-1 rounded-full shadow border border-slate-200 dark:border-slate-800 flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">
                      drag_handle
                    </span>
                    <span>Scroll →</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
