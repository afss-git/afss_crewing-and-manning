"use client";
import Link from "next/link";
import React, { useEffect, useState, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

interface ContractPosition {
  rank_id: string;
  quantity: number;
  min_experience_years: number;
  nationality_preference?: string;
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

interface ContractData {
  id: number;
  contract_number: string;
  status: string;
  admin_notes?: string;
  vessel_type: string;
  operational_zone: string;
  target_start_date: string;
  expected_duration_months: number;
  port_of_embarkation: string;
  port_of_disembarkation: string;
  positions: ContractPosition[];
}

// Inline Sidebar Component to avoid import issues
const Sidebar: React.FC<{ active: string }> = ({ active }) => {
  return (
    <aside className="w-64 flex-shrink-0 bg-white dark:bg-[#1A2235] border-r border-slate-200 dark:border-slate-800 flex flex-col h-full transition-colors duration-300">
      <div className="h-16 flex items-center px-6 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2 text-primary font-bold text-xl tracking-tight">
          <span className="material-symbols-outlined text-3xl icon-fill">
            anchor
          </span>
          MaritimeOps
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        <div className="px-3 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Menu
        </div>
        <Link
          href="/shipowner/dashboard"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg ${
            active === "dashboard"
              ? "bg-primary/10 text-primary font-medium"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors font-medium"
          }`}
        >
          <span className="material-symbols-outlined">grid_view</span>
          Dashboard
        </Link>
        <Link
          href="/shipowner/contract-type"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg ${
            active === "contract"
              ? "bg-primary/10 text-primary font-medium"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors font-medium"
          }`}
        >
          <span className="material-symbols-outlined icon-fill">
            description
          </span>
          Contracts
        </Link>
        <Link
          href="#"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors font-medium group"
        >
          <span className="material-symbols-outlined">toc</span>
          Contract List
        </Link>
        <Link
          href="#"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors font-medium group"
        >
          <span className="material-symbols-outlined">groups</span>
          Crew Management
        </Link>
        <Link
          href="#"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors font-medium group"
        >
          <span className="material-symbols-outlined">sailing</span>
          Vessels
        </Link>
        <div className="px-3 mt-6 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
          System
        </div>
        <Link
          href="#"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors font-medium group"
        >
          <span className="material-symbols-outlined">settings</span>
          Settings
        </Link>
        <Link
          href="#"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors font-medium group"
        >
          <span className="material-symbols-outlined">help</span>
          Help & Support
        </Link>
      </nav>
      <div className="p-4 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 bg-cover bg-center"
            style={{
              backgroundImage: "url('/images/default-shipowner-avatar.jpg')",
            }}
          ></div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-slate-900 dark:text-white">
              Agent Smith
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Senior Agent
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
};

function ContractDetailContent() {
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const contractId = searchParams?.get("id") || "";
  const [contract, setContract] = useState<ContractData | null>(null);
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
        if (contractId) {
          const response = await fetch(`/api/v1/shipowners/contracts/${contractId}`, {
            headers: {
              Authorization: `Bearer ${user.accessToken}`,
              Accept: "application/json",
            },
          });

          if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
          }

          const data = await response.json();
          console.log("Contract ", data);
          setContract(data);

          // Fetch seafarers if contract is approved
          if (data.status?.toLowerCase() === "approved" && user.accessToken) {
            await fetchSeafarers(contractId, user.accessToken);
          }

          return;
        }
      } catch (err: any) {
        console.error("Contract fetch error:", err);
        setError(err.message || "Failed to load contract");
      } finally {
        setLoading(false);
      }
    };

    const fetchSeafarers = async (id: string, token: string) => {
      setLoadingSeafarers(true);
      try {
        const response = await fetch(
          `/api/v1/shipowners/contracts/crew-supply/${id}/seafarers`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          },
        );

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        console.log("Seafarers ", data);
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
        <p className="text-slate-500 text-sm">Loading contract details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-3 sm:p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 flex items-center gap-2 text-sm">
        <span className="material-symbols-outlined text-lg">error</span>
        {error}
      </div>
    );
  }

  if (!contract) {
    return (
      <div className="p-4 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 text-sm">
        No contract data found
      </div>
    );
  }

  const statusColor = {
    submitted:
      "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
    approved:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    rejected: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    under_review:
      "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  } as Record<string, string>;

  const statusLabel =
    contract.status?.charAt(0).toUpperCase() + contract.status?.slice(1) ||
    "Unknown";

  const startDate = new Date(contract.target_start_date);
  const endDate = new Date(startDate);
  endDate.setMonth(endDate.getMonth() + contract.expected_duration_months);

  return (
    <>
      {/* Page Header - Responsive */}
      <div className="flex flex-col gap-4 sm:gap-6 mb-6">
        <div>
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-2">
            <Link
              href="/shipowner/dashboard"
              className="hover:text-primary transition-colors truncate"
            >
              Dashboard
            </Link>
            <span>/</span>
            <Link
              href="/shipowner/dashboard"
              className="hover:text-primary transition-colors truncate"
            >
              Contracts
            </Link>
            <span>/</span>
            <span className="text-slate-900 dark:text-white font-medium truncate">
              {contract.contract_number}
            </span>
          </div>
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight flex flex-wrap items-center gap-2 sm:gap-3">
                <span className="truncate">{contract.contract_number}</span>
                <span
                  className={`inline-flex items-center px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-medium border whitespace-nowrap ${
                    statusColor[contract.status] || statusColor.submitted
                  }`}
                >
                  {statusLabel}
                </span>
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 flex items-center gap-2">
                <span className="material-symbols-outlined text-base sm:text-lg">
                  directions_boat
                </span>
                <span className="truncate">{contract.vessel_type}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid - Responsive */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-8">
        {/* Left Column */}
        <div className="xl:col-span-2 space-y-6">
          {/* Operational Details - Responsive */}
          <div className="bg-white dark:bg-[#1A2235] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 text-base sm:text-lg">
                <span className="material-symbols-outlined text-slate-400 text-base">
                  info
                </span>
                Operational Details
              </h3>
            </div>
            <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-y-4 sm:gap-y-6 gap-x-6 sm:gap-x-10">
              <div>
                <label className="block text-[10px] xs:text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Vessel Type
                </label>
                <div className="text-slate-900 dark:text-white font-medium text-base sm:text-lg">
                  {contract.vessel_type}
                </div>
              </div>
              <div>
                <label className="block text-[10px] xs:text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Operational Zone
                </label>
                <div className="text-slate-900 dark:text-white font-medium text-base sm:text-lg">
                  {contract.operational_zone}
                </div>
              </div>
              <div>
                <label className="block text-[10px] xs:text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Port of Embarkation
                </label>
                <div className="text-slate-900 dark:text-white font-medium text-sm">
                  {contract.port_of_embarkation}
                </div>
              </div>
              <div>
                <label className="block text-[10px] xs:text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Port of Disembarkation
                </label>
                <div className="text-slate-900 dark:text-white font-medium text-sm">
                  {contract.port_of_disembarkation}
                </div>
              </div>
              <div>
                <label className="block text-[10px] xs:text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Target Start Date
                </label>
                <div className="text-slate-900 dark:text-white font-medium text-sm">
                  {new Date(contract.target_start_date).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    },
                  )}
                </div>
              </div>
              <div>
                <label className="block text-[10px] xs:text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Duration
                </label>
                <div className="text-slate-900 dark:text-white font-medium text-sm">
                  {contract.expected_duration_months} months
                </div>
              </div>
            </div>
          </div>

          {/* Required Positions - Responsive */}
          {contract.positions && contract.positions.length > 0 && (
            <div className="bg-white dark:bg-[#1A2235] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
              <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 text-base sm:text-lg">
                  <span className="material-symbols-outlined text-slate-400 text-base">
                    groups
                  </span>
                  Required Positions
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[500px]">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                      <th className="px-3 py-2 sm:px-6 sm:py-3 text-[10px] xs:text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                        Rank
                      </th>
                      <th className="px-3 py-2 sm:px-6 sm:py-3 text-[10px] xs:text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                        Quantity
                      </th>
                      <th className="px-3 py-2 sm:px-6 sm:py-3 text-[10px] xs:text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                        Min Experience
                      </th>
                      <th className="px-3 py-2 sm:px-6 sm:py-3 text-[10px] xs:text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                        Nationality Preference
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {contract.positions.map((position, idx) => (
                      <tr
                        key={idx}
                        className="hover:bg-slate-50 dark:hover:bg-slate-800/50"
                      >
                        <td className="px-3 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">
                          {position.rank_id}
                        </td>
                        <td className="px-3 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                          {position.quantity}
                        </td>
                        <td className="px-3 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                          {position.min_experience_years} years
                        </td>
                        <td className="px-3 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                          {position.nationality_preference || "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Assigned Seafarers - Responsive */}
          {contract.status?.toLowerCase() === "approved" && (
            <div className="bg-white dark:bg-[#1A2235] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
              <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 text-base sm:text-lg">
                  <span className="material-symbols-outlined text-slate-400 text-base">
                    person_check
                  </span>
                  Assigned Seafarers
                </h3>
              </div>
              {loadingSeafarers ? (
                <div className="p-4 sm:p-6 text-center text-slate-500 text-sm">
                  Loading seafarers...
                </div>
              ) : seafarers.length === 0 ? (
                <div className="p-4 sm:p-6 text-center text-slate-500 text-sm">
                  No assigned seafarers yet
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[600px]">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                        <th className="px-3 py-2 sm:px-6 sm:py-3 text-[10px] xs:text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                          Name
                        </th>
                        <th className="px-3 py-2 sm:px-6 sm:py-3 text-[10px] xs:text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                          Email
                        </th>
                        <th className="px-3 py-2 sm:px-6 sm:py-3 text-[10px] xs:text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                          Rank
                        </th>
                        <th className="px-3 py-2 sm:px-6 sm:py-3 text-[10px] xs:text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                          Status
                        </th>
                        <th className="px-3 py-2 sm:px-6 sm:py-3 text-[10px] xs:text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                          Duration
                        </th>
                        <th className="px-3 py-2 sm:px-6 sm:py-3 text-[10px] xs:text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                          Monthly Rate
                        </th>
                        <th className="px-3 py-2 sm:px-6 sm:py-3 text-[10px] xs:text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                          Assigned Date
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {seafarers.map((seafarer, idx) => (
                        <tr
                          key={idx}
                          className="hover:bg-slate-50 dark:hover:bg-slate-800/50"
                        >
                          <td className="px-3 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">
                            {seafarer.first_name} {seafarer.last_name}
                          </td>
                          <td className="px-3 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm">
                            <a
                              href={`mailto:${seafarer.email}`}
                              className="text-primary hover:underline text-xs sm:text-sm"
                            >
                              {seafarer.email}
                            </a>
                          </td>
                          <td className="px-3 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                            {seafarer.rank}
                          </td>
                          <td className="px-3 py-2 sm:px-6 sm:py-3">
                            <span
                              className={`inline-flex items-center px-1.5 py-0.5 sm:px-2.5 sm:py-0.5 rounded-full text-[10px] xs:text-xs font-medium ${
                                seafarer.assignment_status?.toLowerCase() ===
                                "confirmed"
                                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                  : "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                              }`}
                            >
                              {seafarer.assignment_status
                                ?.charAt(0)
                                .toUpperCase() +
                                seafarer.assignment_status?.slice(1)}
                            </span>
                          </td>
                          <td className="px-3 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                            {seafarer.duration_months} months
                          </td>
                          <td className="px-3 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm font-medium text-slate-900 dark:text-white">
                            ${seafarer.monthly_rate_usd.toLocaleString()}
                          </td>
                          <td className="px-3 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                            {new Date(seafarer.assigned_at).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              },
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="xl:col-span-1 space-y-6">
          {/* Duration Timeline - Responsive */}
          <div className="bg-white dark:bg-[#1A2235] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 sm:p-6">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-3 sm:mb-4">
              Contract Duration
            </h3>
            <div className="flex flex-col gap-4 sm:gap-6 relative pl-2">
              <div className="absolute left-2.5 top-2 bottom-2 w-0.5 bg-slate-200 dark:bg-slate-700"></div>
              <div className="relative flex items-start gap-3 sm:gap-4">
                <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-primary border-2 sm:border-4 border-white dark:border-[#1A2235] shrink-0 z-10"></div>
                <div>
                  <p className="text-[10px] xs:text-xs font-semibold text-slate-500 uppercase">
                    Start Date
                  </p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    {startDate.toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
              <div className="relative flex items-start gap-3 sm:gap-4">
                <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-slate-200 dark:bg-slate-600 border-2 sm:border-4 border-white dark:border-[#1A2235] shrink-0 z-10"></div>
                <div>
                  <p className="text-[10px] xs:text-xs font-semibold text-slate-500 uppercase">
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
            </div>
          </div>

          {/* Contract Info - Responsive */}
          <div className="bg-white dark:bg-[#1A2235] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 sm:p-6">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-3 sm:mb-4">
              Contract Info
            </h3>
            <div className="space-y-3 sm:space-y-4">
              <div>
                <label className="text-[10px] xs:text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Contract Number
                </label>
                <p className="text-sm font-medium text-slate-900 dark:text-white break-all">
                  {contract.contract_number}
                </p>
              </div>
              <div>
                <label className="text-[10px] xs:text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Status
                </label>
                <p
                  className={`text-xs sm:text-sm font-medium px-2 py-0.5 sm:px-2 sm:py-1 rounded inline-block ${statusColor[contract.status] || statusColor.submitted}`}
                >
                  {statusLabel}
                </p>
              </div>
              {contract.admin_notes && (
                <div>
                  <label className="text-[10px] xs:text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Admin Notes
                  </label>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 break-words">
                    {contract.admin_notes}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function ContractDetail() {
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

  return (
    <div className="flex h-screen overflow-hidden font-display text-slate-900 dark:text-white bg-background-light dark:bg-background-dark">
      {/* Desktop Sidebar - Hidden on mobile */}
      <aside className="hidden md:block">
        <Sidebar active="contract" />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex" ref={sidebarRef}>
          {/* Sidebar Panel */}
          <div className="relative w-64 bg-white dark:bg-[#1A2235] h-full shadow-xl border-r border-slate-200 dark:border-slate-800">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
              <div className="flex items-center gap-2 text-primary font-bold text-lg tracking-tight">
                <span className="material-symbols-outlined text-2xl icon-fill">
                  anchor
                </span>
                MaritimeOps
              </div>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                aria-label="Close menu"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>
            <Sidebar active="contract" />
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
          <div className="max-w-7xl mx-auto">
            <Suspense
              fallback={
                <div className="flex justify-center items-center py-12">
                  <p className="text-slate-500 text-sm">Loading contract...</p>
                </div>
              }
            >
              <ContractDetailContent />
            </Suspense>
          </div>
        </div>
      </main>
    </div>
  );
}
