"use client";
import Link from "next/link";
import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Sidebar from "../components/Sidebar";
import { useAuth } from "@/context/AuthContext";

interface Document {
  id: number;
  file_name: string;
  file_url: string;
  file_size: string;
  uploaded_at: string;
}

interface Seafarer {
  first_name: string;
  last_name: string;
  email: string;
  rank: number;
  assignment_status: string;
  assigned_at: string;
  duration_months: number;
  monthly_rate_usd: number;
}

interface FullCrewContractData {
  id: number;
  user_id: number;
  reference_number: string;
  vessel_name: string;
  imo_number: string;
  vessel_type: string;
  vessel_flag: string;
  operational_routes: string;
  services: string[];
  commencement_date: string;
  duration: number;
  status: string;
  created_at: string;
  documents: Document[];
}

function FullCrewContractContent() {
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const contractId = searchParams?.get("id") || "";
  const [contract, setContract] = useState<FullCrewContractData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [seafarers, setSeafarers] = useState<Seafarer[]>([]);
  const [loadingSeafarers, setLoadingSeafarers] = useState(false);

  useEffect(() => {
    if (!user?.accessToken) {
      setError("Not authenticated");
      setLoading(false);
      return;
    }

    if (!contractId) {
      setError("Missing contract ID");
      setLoading(false);
      return;
    }

    const fetchContract = async () => {
      try {
        const response = await fetch(
          `/api/v1/shipowners/full-crew-contracts/${contractId}`,
          {
            headers: {
              Authorization: `Bearer ${user.accessToken}`,
              Accept: "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        console.log("Full crew contract data:", data);
        setContract(data);

        // Fetch seafarers if contract is approved
        if (data.status?.toLowerCase() === "approved") {
          await fetchSeafarers(data.reference_number);
        }
      } catch (err: any) {
        console.error("Contract fetch error:", err);
        setError(err.message || "Failed to load contract");
      } finally {
        setLoading(false);
      }
    };

    const fetchSeafarers = async (refNumber: string) => {
      setLoadingSeafarers(true);
      try {
        const response = await fetch(
          `/api/v1/shipowners/contracts/full-crew/${refNumber}/seafarers`,
          {
            headers: {
              Authorization: `Bearer ${user.accessToken}`,
              Accept: "application/json",
            },
          }
        );

        if (!response.ok) {
          console.warn(`Failed to fetch seafarers: HTTP ${response.status}`);
          setSeafarers([]);
          return;
        }

        const data = await response.json();
        console.log("Assigned seafarers:", data);
        setSeafarers(Array.isArray(data) ? data : []);
      } catch (err: any) {
        console.error("Seafarers fetch error:", err);
        setSeafarers([]);
      } finally {
        setLoadingSeafarers(false);
      }
    };

    fetchContract();
  }, [contractId, user?.accessToken]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <p className="text-slate-500">Loading contract details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 flex items-center gap-2">
        <span className="material-symbols-outlined">error</span>
        {error}
      </div>
    );
  }

  if (!contract) {
    return (
      <div className="p-4 rounded-lg bg-amber-50 border border-amber-200 text-amber-700">
        No contract data found
      </div>
    );
  }

  const statusColor: Record<string, string> = {
    pending: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
    approved: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    rejected: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    under_review:
      "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  };

  const statusLabel =
    contract.status?.charAt(0).toUpperCase() + contract.status?.slice(1) ||
    "Pending";

  const commencementDate = new Date(contract.commencement_date);
  const endDate = new Date(commencementDate);
  if (contract.duration > 0) {
    endDate.setMonth(endDate.getMonth() + contract.duration);
  }

  const serviceLabels: Record<string, string> = {
    full_crewing: "Full Crewing",
    technical_mgmt: "Technical Management",
    insurance_legal: "Insurance & Legal",
    procurement: "Procurement",
  };

  return (
    <>
      {/* Page Header */}
      <div className="flex flex-col gap-6 mb-6">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-2">
            <Link href="/shipowner/dashboard" className="hover:text-primary transition-colors">
              Dashboard
            </Link>
            <span>/</span>
            <Link href="/shipowner/dashboard" className="hover:text-primary transition-colors">
              Contracts
            </Link>
            <span>/</span>
            <span className="text-slate-900 dark:text-white font-medium">
              {contract.reference_number}
            </span>
          </div>
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                Full Crew Management Contract
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${
                    statusColor[contract.status] || statusColor.pending
                  }`}
                >
                  {statusLabel}
                </span>
              </h1>
              <p className="text-slate-500 dark:text-slate-400 mt-2 flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">
                  directions_boat
                </span>
                {contract.vessel_name}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="xl:col-span-2 space-y-6">
          {/* Vessel Details */}
          <div className="bg-white dark:bg-[#1A2235] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-slate-400">
                  info
                </span>
                Vessel Details
              </h3>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-10">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Vessel Name
                </label>
                <div className="text-slate-900 dark:text-white font-medium text-lg">
                  {contract.vessel_name}
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Vessel Type
                </label>
                <div className="text-slate-900 dark:text-white font-medium text-lg">
                  {contract.vessel_type}
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  IMO Number
                </label>
                <div className="text-slate-900 dark:text-white font-medium text-lg">
                  {contract.imo_number}
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Vessel Flag
                </label>
                <div className="text-slate-900 dark:text-white font-medium text-lg">
                  {contract.vessel_flag}
                </div>
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Operational Routes
                </label>
                <div className="text-slate-900 dark:text-white font-medium">
                  {contract.operational_routes}
                </div>
              </div>
            </div>
          </div>

          {/* Services */}
          {contract.services && contract.services.length > 0 && (
            <div className="bg-white dark:bg-[#1A2235] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-slate-400">
                    engineering
                  </span>
                  Included Services
                </h3>
              </div>
              <div className="p-6">
                <div className="flex flex-wrap gap-3">
                  {contract.services.map((service, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30"
                    >
                      {serviceLabels[service] || service}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Assigned Seafarers - Only for approved contracts */}
          {contract.status?.toLowerCase() === "approved" && (
            <div className="bg-white dark:bg-[#1A2235] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-slate-400">
                    groups
                  </span>
                  Assigned Seafarers {seafarers.length > 0 && `(${seafarers.length})`}
                </h3>
              </div>
              {loadingSeafarers ? (
                <div className="p-6 flex justify-center">
                  <p className="text-slate-500">Loading assigned seafarers...</p>
                </div>
              ) : seafarers.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                        <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                          Rank
                        </th>
                        <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                          Assignment Status
                        </th>
                        <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                          Duration
                        </th>
                        <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                          Monthly Rate (USD)
                        </th>
                        <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                          Assigned Date
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {seafarers.map((seafarer, idx) => (
                        <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                          <td className="px-6 py-3 text-sm font-semibold text-slate-900 dark:text-white">
                            {seafarer.first_name} {seafarer.last_name}
                          </td>
                          <td className="px-6 py-3 text-sm text-slate-600 dark:text-slate-400">
                            <a href={`mailto:${seafarer.email}`} className="text-primary hover:text-primary-hover">
                              {seafarer.email}
                            </a>
                          </td>
                          <td className="px-6 py-3 text-sm text-slate-600 dark:text-slate-400">
                            Rank {seafarer.rank}
                          </td>
                          <td className="px-6 py-3 text-sm">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              seafarer.assignment_status?.toLowerCase() === "confirmed"
                                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-900/50"
                                : "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-900/50"
                            }`}>
                              {seafarer.assignment_status?.charAt(0).toUpperCase() + seafarer.assignment_status?.slice(1) || "Pending"}
                            </span>
                          </td>
                          <td className="px-6 py-3 text-sm text-slate-600 dark:text-slate-400">
                            {seafarer.duration_months} months
                          </td>
                          <td className="px-6 py-3 text-sm font-medium text-slate-900 dark:text-white">
                            ${seafarer.monthly_rate_usd.toLocaleString()}
                          </td>
                          <td className="px-6 py-3 text-sm text-slate-600 dark:text-slate-400">
                            {new Date(seafarer.assigned_at).toLocaleDateString(
                              "en-US",
                              { year: "numeric", month: "short", day: "numeric" }
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-6 text-center">
                  <p className="text-slate-500">No seafarers assigned yet</p>
                </div>
              )}
            </div>
          )}

          {/* Documents */}
          {contract.documents && contract.documents.length > 0 && (
            <div className="bg-white dark:bg-[#1A2235] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-slate-400">
                    description
                  </span>
                  Uploaded Documents ({contract.documents.length})
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                      <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                        File Name
                      </th>
                      <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Size
                      </th>
                      <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Uploaded
                      </th>
                      <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {contract.documents.map((doc, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <td className="px-6 py-3 text-sm font-medium text-slate-900 dark:text-white">
                          {doc.file_name}
                        </td>
                        <td className="px-6 py-3 text-sm text-slate-600 dark:text-slate-400">
                          {doc.file_size}
                        </td>
                        <td className="px-6 py-3 text-sm text-slate-600 dark:text-slate-400">
                          {new Date(doc.uploaded_at).toLocaleDateString(
                            "en-US",
                            { year: "numeric", month: "short", day: "numeric" }
                          )}
                        </td>
                        <td className="px-6 py-3 text-right">
                          <a
                            href={doc.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:text-primary-hover text-sm font-medium inline-flex items-center gap-1"
                          >
                            Download
                            <span className="material-symbols-outlined text-base">
                              download
                            </span>
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="xl:col-span-1 space-y-6">
          {/* Duration Timeline */}
          <div className="bg-white dark:bg-[#1A2235] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-4">
              Contract Period
            </h3>
            <div className="flex flex-col gap-6 relative pl-2">
              <div className="absolute left-2.5 top-2 bottom-2 w-0.5 bg-slate-200 dark:bg-slate-700"></div>
              <div className="relative flex items-start gap-4">
                <div className="w-5 h-5 rounded-full bg-primary border-4 border-white dark:border-[#1A2235] shrink-0 z-10"></div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase">
                    Commencement Date
                  </p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    {commencementDate.toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
              {contract.duration > 0 && (
                <div className="relative flex items-start gap-4">
                  <div className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-600 border-4 border-white dark:border-[#1A2235] shrink-0 z-10"></div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase">
                      End Date
                    </p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">
                      {endDate.toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Contract Info */}
          <div className="bg-white dark:bg-[#1A2235] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-4">
              Contract Info
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Reference Number
                </label>
                <p className="text-sm font-medium text-slate-900 dark:text-white">
                  {contract.reference_number}
                </p>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Status
                </label>
                <p
                  className={`text-sm font-medium px-2 py-1 rounded inline-block ${
                    statusColor[contract.status] || statusColor.pending
                  }`}
                >
                  {statusLabel}
                </p>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Submitted
                </label>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {new Date(contract.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function FullCrewContractDetail() {
  return (
    <div className="flex h-screen overflow-hidden font-display text-slate-900 dark:text-white bg-background-light dark:bg-background-dark">
      {/* Sidebar */}
      <Sidebar active="contract" />
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
          <div className="max-w-7xl mx-auto">
            <Suspense
              fallback={
                <div className="flex justify-center items-center py-12">
                  <p className="text-slate-500">Loading contract...</p>
                </div>
              }
            >
              <FullCrewContractContent />
            </Suspense>
          </div>
        </div>
      </main>
    </div>
  );
}
