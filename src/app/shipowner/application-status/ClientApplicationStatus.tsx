"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

function ContractDetails({ contractId }: { contractId: string }) {
  const { user } = useAuth();
  const [contract, setContract] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!contractId) return;
    let mounted = true;
    const fetchContract = async () => {
      if (!user?.accessToken) {
        setError("Not authenticated");
        return;
      }
      setLoading(true);
      try {
        const res = await fetch(`/api/v1/contracts/${contractId}`, {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${user.accessToken}`,
          },
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.detail || `HTTP ${res.status}`);
        }
        const data = await res.json();
        if (mounted) setContract(data);
      } catch (err: any) {
        if (mounted) setError(err.message || String(err));
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchContract();
    return () => {
      mounted = false;
    };
  }, [contractId, user]);

  if (loading) return <div className="p-6">Loading contract...</div>;
  if (error) return <div className="p-6 text-red-600">Error: {error}</div>;
  if (!contract) return <div className="p-6">No contract found.</div>;

  return (
    <div className="bg-white dark:bg-[#1A2235] rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
      <h2 className="text-xl font-bold mb-4">Contract #{contract.contract_number || contract.id}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-slate-500">Status</p>
          <p className="font-medium">{contract.status}</p>
        </div>
        <div>
          <p className="text-sm text-slate-500">Vessel Type</p>
          <p className="font-medium">{contract.vessel_type}</p>
        </div>
        <div>
          <p className="text-sm text-slate-500">Operational Zone</p>
          <p className="font-medium">{contract.operational_zone}</p>
        </div>
        <div>
          <p className="text-sm text-slate-500">Target Start</p>
          <p className="font-medium">{contract.target_start_date}</p>
        </div>
        <div>
          <p className="text-sm text-slate-500">Duration (months)</p>
          <p className="font-medium">{contract.expected_duration_months}</p>
        </div>
        <div>
          <p className="text-sm text-slate-500">Ports</p>
          <p className="font-medium">{contract.port_of_embarkation} → {contract.port_of_disembarkation}</p>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="font-semibold mb-2">Positions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {Array.isArray(contract.positions) && contract.positions.map((p: any, i: number) => (
            <div key={i} className="p-3 border rounded">
              <p className="text-sm text-slate-500">Rank</p>
              <p className="font-medium">{p.rank_id || p.position}</p>
              <p className="text-sm text-slate-500">Quantity</p>
              <p className="font-medium">{p.quantity}</p>
              <p className="text-sm text-slate-500">Min Experience Years</p>
              <p className="font-medium">{p.min_experience_years}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ClientApplicationStatus() {
  const searchParams = useSearchParams();
  const contractId = searchParams?.get("contract_id") || null;

  return (
    <>
      {contractId ? (
        <div className="mb-8">
          <ContractDetails contractId={contractId} />
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white dark:bg-[#1A2235] p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Submitted</p>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">24</h3>
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400">
                <span className="material-symbols-outlined">folder</span>
              </div>
            </div>
            <div className="bg-white dark:bg-[#1A2235] p-5 rounded-xl border-l-4 border-yellow-500 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Under Review</p>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">5</h3>
              </div>
              <div className="w-10 h-10 rounded-full bg-yellow-50 dark:bg-yellow-900/20 flex items-center justify-center text-yellow-600 dark:text-yellow-500">
                <span className="material-symbols-outlined">pending_actions</span>
              </div>
            </div>
            <div className="bg-white dark:bg-[#1A2235] p-5 rounded-xl border-l-4 border-blue-500 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Shortlisted</p>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">2</h3>
              </div>
              <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-500">
                <span className="material-symbols-outlined">group</span>
              </div>
            </div>
            <div className="bg-white dark:bg-[#1A2235] p-5 rounded-xl border-l-4 border-green-500 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Approved</p>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">12</h3>
              </div>
              <div className="w-10 h-10 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center text-green-600 dark:text-green-500">
                <span className="material-symbols-outlined">check_circle</span>
              </div>
            </div>
          </div>

          {/* Applications Table */}
          <div className="bg-white dark:bg-[#1A2235] rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold">
                    <th className="px-6 py-4">Application ID</th>
                    <th className="px-6 py-4">Contract Type</th>
                    <th className="px-6 py-4">Vessel / Unit</th>
                    <th className="px-6 py-4">Submission Date</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {/* Row 1 - Under Review */}
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group cursor-pointer">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-primary/10 text-primary flex items-center justify-center"><span className="material-symbols-outlined text-[18px]">description</span></div>
                        <span className="font-mono font-semibold text-slate-900 dark:text-white">#C-2023-8842</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-700 dark:text-slate-300">One-off Crew Supply</td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">MV Pacific Pearl</td>
                    <td className="px-6 py-4 text-sm text-slate-500">Oct 24, 2023</td>
                    <td className="px-6 py-4"><span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800">Under Review</span></td>
                    <td className="px-6 py-4 text-right"><button className="text-primary hover:text-primary-hover font-semibold text-sm inline-flex items-center gap-1 hover:underline">View Details <span className="material-symbols-outlined text-[16px]">arrow_forward</span></button></td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-sm text-slate-500 dark:text-slate-400 text-center sm:text-left">Showing <span className="font-semibold text-slate-900 dark:text-white">1</span> to <span className="font-semibold text-slate-900 dark:text-white">5</span> of <span className="font-semibold text-slate-900 dark:text-white">24</span> applications</span>
              <div className="flex gap-2">
                <button className="px-4 py-2 text-sm font-medium border border-slate-200 dark:border-slate-700 rounded-lg text-slate-400 cursor-not-allowed bg-slate-50 dark:bg-slate-800" disabled>Previous</button>
                <button className="px-4 py-2 text-sm font-medium border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">Next</button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
