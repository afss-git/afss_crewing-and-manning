"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import Image from "next/image";
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
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user?.accessToken) {
        console.warn("Dashboard: No access token found", { user });
        setError("Not authenticated. Please log in.");
        setLoading(false);
        return;
      }

      console.log("Dashboard: Starting fetch with token:", user.accessToken.substring(0, 20) + "...");

      try {
        // Fetch the dashboard-specific endpoint
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
        console.log("First contract fields:", Object.keys(data.contracts?.[0] || {}));
        
        // Use the API response as-is
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
      {/* Sidebar */}
      <Sidebar active="dashboard" />
      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <header className="h-16 flex items-center justify-between px-6 bg-white dark:bg-[#1A2235] border-b border-slate-200 dark:border-slate-800 shrink-0">
          <div className="flex items-center flex-1 max-w-lg">
            <div className="relative w-full">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                search
              </span>
              <input
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border-none focus:ring-2 focus:ring-primary text-sm text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400"
                placeholder="Search contracts, crew, or vessels..."
                type="text"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-[#1A2235]"></span>
            </button>
            <button className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
              <span className="material-symbols-outlined">apps</span>
            </button>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-6 lg:p-10">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-1">
                  <Link
                    href="#"
                    className="hover:text-primary transition-colors"
                  >
                    Home
                  </Link>
                  <span>/</span>
                  <span className="text-slate-900 dark:text-white font-medium">
                    Contracts
                  </span>
                </div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                  Contract Management
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1">
                  Manage and track all crew supply and management agreements.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button className="px-4 py-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg">
                    tune
                  </span>
                  Filters
                </button>
                <Link href="/shipowner/contract-type" className="px-4 py-2.5 rounded-lg bg-primary hover:bg-primary-hover text-white font-bold text-sm shadow-lg shadow-primary/30 transition-all flex items-center gap-2 inline-block">
                  <span className="material-symbols-outlined text-lg">add</span>
                  Create New Contract
                </Link>
              </div>
            </div>

            {/* Company Profile */}
            <ShipOwnerProfile compact={true} />

            {/* Loading State */}
            {loading && (
              <div className="flex justify-center items-center py-12">
                <p className="text-slate-500">Loading dashboard data...</p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 flex items-center gap-2">
                <span className="material-symbols-outlined">error</span>
                {error}
              </div>
            )}

            {/* Stats Cards */}
            {dashboardData && !loading && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-white dark:bg-[#1A2235] p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                        Total Submitted
                      </p>
                      <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                        {dashboardData.summary.total_submitted}
                      </p>
                    </div>
                    <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                      <span className="material-symbols-outlined">folder_open</span>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-[#1A2235] p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                        Under Review
                      </p>
                      <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                        {dashboardData.summary.under_review}
                      </p>
                    </div>
                    <div className="h-10 w-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                      <span className="material-symbols-outlined">pending</span>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-[#1A2235] p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                        Shortlisted
                      </p>
                      <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                        {dashboardData.summary.shortlisted}
                      </p>
                    </div>
                    <div className="h-10 w-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                      <span className="material-symbols-outlined">group</span>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-[#1A2235] p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                        Approved
                      </p>
                      <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                        {dashboardData.summary.approved}
                      </p>
                    </div>
                    <div className="h-10 w-10 rounded-lg bg-green-50 text-green-600 flex items-center justify-center">
                      <span className="material-symbols-outlined">
                        check_circle
                      </span>
                    </div>
                  </div>
                </div>

            {/* Company Documents */}
            {!loading && <ShipOwnerDocuments compact={true} maxItems={3} />}

                {/* Contracts Table */}
                <div className="bg-white dark:bg-[#1A2235] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                          <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                            Application ID
                          </th>
                          <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                            Type
                          </th>
                          <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                            Vessel / Unit
                          </th>
                          <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                            Submission Date
                          </th>
                          <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {dashboardData.contracts && dashboardData.contracts.length > 0 ? (
                          dashboardData.contracts.map((contract: any, index: number) => (
                            <tr key={index} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                              <td className="px-6 py-4">
                                <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">
                                  {contract.application_id || contract.contract_number || "N/A"}
                                </p>
                              </td>
                              <td className="px-6 py-4">
                                <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30">
                                  {contract.contract_type || "Unknown"}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                                {contract.vessel_unit || "N/A"}
                              </td>
                              <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                                {contract.submission_date || "N/A"}
                              </td>
                              <td className="px-6 py-4">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  contract.status?.toLowerCase?.()?.includes("review")
                                    ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-900/50"
                                    : contract.status?.toLowerCase?.()?.includes("approved")
                                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-900/50"
                                      : "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
                                }`}>
                                  {contract.status || "Pending"}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-right">
                                {contract.id ? (
                                  contract.contract_type?.toLowerCase().includes("full") ? (
                                    <Link href={`/shipowner/full-crew-contract?id=${contract.id}`} className="text-primary hover:text-primary-hover text-sm font-medium inline-flex items-center gap-1" title={`ID: ${contract.id}`}>
                                      View Details
                                      <span className="material-symbols-outlined text-base">arrow_forward</span>
                                    </Link>
                                  ) : (
                                    <Link href={`/shipowner/contract?id=${contract.id}`} className="text-primary hover:text-primary-hover text-sm font-medium inline-flex items-center gap-1" title={`ID: ${contract.id}`}>
                                      View Details
                                      <span className="material-symbols-outlined text-base">arrow_forward</span>
                                    </Link>
                                  )
                                ) : (
                                  <Link href={`/shipowner/contract?ref=${contract.application_id || contract.contract_number}`} className="text-primary hover:text-primary-hover text-sm font-medium inline-flex items-center gap-1" title={`Ref: ${contract.application_id}`}>
                                    View Details
                                    <span className="material-symbols-outlined text-base">arrow_forward</span>
                                  </Link>
                                )}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={6} className="px-6 py-4 text-center text-slate-500">
                              No contracts found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
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
