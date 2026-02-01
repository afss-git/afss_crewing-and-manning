"use client";

import { useState, useEffect } from "react";
import SeafarerSidebarProfile from "../../../components/SeafarerSidebarProfile";

interface Contract {
  id: string;
  seafarer_name: string;
  position: string;
  company: string;
  contract_type: string;
  duration: string;
  start_date: string;
  end_date: string;
  status: string;
}

export default function ContractsPage() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchContracts();
  }, []);

  const fetchContracts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("crew-manning-token");

      if (!token) {
        setError("Authentication required");
        setLoading(false);
        return;
      }

      // Try to fetch from external API
      const response = await fetch("/api/v1/seafarer/contracts", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          setError("Session expired. Please login again.");
        } else {
          setError("Failed to load contracts");
        }
        setLoading(false);
        return;
      }

      const data = await response.json();
      setContracts(data || []);
    } catch (err) {
      console.error("Error fetching contracts:", err);
      setError("Failed to load contracts");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: "bg-green-50 text-green-700 border-green-200",
      expired: "bg-red-50 text-red-700 border-red-200",
      pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
      completed: "bg-blue-50 text-blue-700 border-blue-200",
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] ||
      "bg-gray-50 text-gray-700 border-gray-200";

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${config}`}
      >
        <span className="size-1.5 rounded-full bg-current"></span>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="bg-background-light dark:bg-background-dark text-[#0e121b] font-display overflow-hidden">
      <div className="flex h-screen w-full">
        {/* Sidebar */}
        <aside className="w-[280px] bg-white border-r border-[#e8ebf3] flex-col justify-between hidden md:flex shrink-0 z-20">
          <div className="flex flex-col h-full p-4">
            {/* Logo Area */}
            <div className="flex items-center gap-3 px-3 py-4 mb-6">
              <div className="size-10 bg-primary rounded-lg flex items-center justify-center text-white">
                <span className="material-symbols-outlined text-2xl">
                  anchor
                </span>
              </div>
              <div className="flex flex-col">
                <h1 className="text-[#0e121b] text-base font-bold leading-tight">
                  Maritime Ops
                </h1>
                <p className="text-[#506795] text-xs font-medium uppercase tracking-wide">
                  Crew Portal
                </p>
              </div>
            </div>
            {/* Navigation */}
            <nav className="flex flex-col gap-2 flex-1">
              <a
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#506795] hover:bg-[#f8f9fb] transition-colors group"
                href="/seafarer/dashboard"
              >
                <span className="material-symbols-outlined text-[24px]">
                  grid_view
                </span>
                <span className="text-sm font-medium">Dashboard</span>
              </a>
              <a
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#506795] hover:bg-[#f8f9fb] transition-colors group"
                href="/seafarer/documents"
              >
                <span className="material-symbols-outlined text-[24px]">
                  description
                </span>
                <span className="text-sm font-medium">Documents</span>
              </a>
              <a
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#506795] hover:bg-[#f8f9fb] transition-colors group"
                href="/seafarer/interview"
              >
                <span className="material-symbols-outlined text-[24px]">
                  groups
                </span>
                <span className="text-sm font-medium">Interview</span>
              </a>
              <a
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary/10 text-primary transition-colors"
                href="/seafarer/contracts"
              >
                <span className="material-symbols-outlined text-[24px] fill-1">
                  history_edu
                </span>
                <span className="text-sm font-bold">Contracts</span>
              </a>
            </nav>
            {/* User Profile */}
            <SeafarerSidebarProfile />
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col h-full relative overflow-hidden bg-background-light">
          {/* Header */}
          <header className="bg-white border-b border-[#e8ebf3] px-6 py-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold text-[#0e121b]">Contracts</h1>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-primary/10 text-primary">
                  Total: {contracts.length}
                </span>
              </div>
            </div>
          </header>

          {/* Content */}
          <div className="flex-1 overflow-auto p-6">
            {/* Contracts Table */}
            <div className="bg-white border border-[#e8ebf3] rounded-xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-[#e8ebf3]">
                  <thead className="bg-[#f8f9fb]">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-[#506795] uppercase tracking-wider">
                        Seafarer / Role
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-[#506795] uppercase tracking-wider">
                        Employer & Type
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-[#506795] uppercase tracking-wider">
                        Duration
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-[#506795] uppercase tracking-wider">
                        Validity Period
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-[#506795] uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-[#506795] uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-[#e8ebf3]">
                    {loading ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center">
                          <div className="flex flex-col items-center gap-3">
                            <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-sm text-[#506795]">
                              Loading contracts...
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : error ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center">
                          <div className="flex flex-col items-center gap-3">
                            <span className="material-symbols-outlined text-4xl text-red-400">
                              error
                            </span>
                            <div>
                              <p className="text-sm font-medium text-[#0e121b] mb-1">
                                Error loading contracts
                              </p>
                              <p className="text-xs text-[#506795]">{error}</p>
                              <button
                                onClick={fetchContracts}
                                className="mt-2 text-primary hover:text-primary-dark text-sm font-medium"
                              >
                                Try again
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ) : contracts.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center">
                          <div className="flex flex-col items-center gap-3">
                            <span className="material-symbols-outlined text-4xl text-[#506795]">
                              contract
                            </span>
                            <div>
                              <p className="text-sm font-medium text-[#0e121b] mb-1">
                                No contracts found
                              </p>
                              <p className="text-xs text-[#506795]">
                                You don&apos;t have any contracts yet.
                              </p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      contracts.map((contract) => (
                        <tr
                          key={contract.id}
                          className="hover:bg-[#f8f9fb] transition-colors group"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="size-10 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold shrink-0">
                                {contract.seafarer_name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .slice(0, 2)
                                  .toUpperCase()}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-bold text-[#0e121b]">
                                  {contract.seafarer_name}
                                </div>
                                <div className="text-xs text-[#506795]">
                                  {contract.position}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-[#0e121b]">
                              {contract.company}
                            </div>
                            <div className="text-xs text-[#506795]">
                              {contract.contract_type}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-800">
                              {contract.duration}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-[#0e121b]">
                              {new Date(
                                contract.start_date,
                              ).toLocaleDateString()}
                            </div>
                            <div className="text-xs text-[#506795]">
                              to{" "}
                              {new Date(contract.end_date).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getStatusBadge(contract.status)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                className="text-[#506795] hover:text-primary p-2 hover:bg-[#f8f9fb] rounded-lg"
                                title="Print"
                              >
                                <span className="material-symbols-outlined text-[20px]">
                                  print
                                </span>
                              </button>
                              <button className="text-primary hover:text-primary-light flex items-center gap-1 text-xs font-bold bg-primary/10 hover:bg-primary/20 px-3 py-1.5 rounded-lg transition-colors">
                                <span className="material-symbols-outlined text-[16px]">
                                  download
                                </span>
                                PDF
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
