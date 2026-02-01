"use client";
import Link from "next/link";
import React from "react";
import Sidebar from "../components/Sidebar";

export default function ContractDetail() {
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
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Page Header */}
            <div className="flex flex-col gap-6">
              <div>
                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-2">
                  <Link
                    href="#"
                    className="hover:text-primary transition-colors"
                  >
                    Dashboard
                  </Link>
                  <span>/</span>
                  <Link
                    href="#"
                    className="hover:text-primary transition-colors"
                  >
                    Contracts
                  </Link>
                  <span>/</span>
                  <span className="text-slate-900 dark:text-white font-medium">
                    C-2023-09
                  </span>
                </div>
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                      Contract #C-2023-09
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800">
                        Active
                      </span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 flex items-center gap-2">
                      <span className="material-symbols-outlined text-lg">
                        directions_boat
                      </span>
                      MV Atlantic Star • Bulk Carrier
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              {/* Left Column */}
              <div className="xl:col-span-2 space-y-6">
                {/* Operational Details */}
                <div className="bg-white dark:bg-[#1A2235] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
                    <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <span className="material-symbols-outlined text-slate-400">
                        info
                      </span>
                      Operational Details
                    </h3>
                  </div>
                  <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-10">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                        Vessel Name
                      </label>
                      <div className="text-slate-900 dark:text-white font-medium text-lg">
                        MV Atlantic Star
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                        IMO Number
                      </label>
                      <div className="text-slate-900 dark:text-white font-medium text-lg">
                        9123456
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                        Port of Registry
                      </label>
                      <div className="text-slate-900 dark:text-white font-medium">
                        Panama City, PA
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                        Vessel Type
                      </label>
                      <div className="text-slate-900 dark:text-white font-medium">
                        Bulk Carrier (Handymax)
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                        Current Location
                      </label>
                      <div className="text-slate-900 dark:text-white font-medium flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm text-primary">
                          location_on
                        </span>
                        Port of Rotterdam (ETA 2 days)
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                        Agent in Charge
                      </label>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 bg-cover bg-center"
                          style={{
                            backgroundImage:
                              "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBNKCR1y2af8Dd4Jsz6y0ROyAcFljibHqZCYegjlJykI6Tm15YRmNQSeIksCr01Ta4eXkHmHLro7MSeAby7QdxiYhXvDVkHi_PpMHOEvHOQMtLp_F4oeEDWzd-V96YXdIkiivaQi668PVxCua4EWRkREjcVp53CqWMVDx7CkdsBwJ5XSKcejM_fEMxE7slsHHGxAGImCv0YJ-5mg1ITMIvHuVW79k9y5OPi91t51ZpO_A9ckHA4s5181naijohW99nUj6est8LYcMtX')",
                          }}
                        ></div>
                        <span className="text-slate-900 dark:text-white font-medium">
                          Agent Smith
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contract Terms */}
                <div className="bg-white dark:bg-[#1A2235] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
                    <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <span className="material-symbols-outlined text-slate-400">
                        gavel
                      </span>
                      Contract Terms
                    </h3>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                      <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
                        <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">
                          Contract Type
                        </div>
                        <div className="font-bold text-slate-900 dark:text-white">
                          Time Charter
                        </div>
                      </div>
                      <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
                        <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">
                          Daily Rate
                        </div>
                        <div className="font-bold text-slate-900 dark:text-white">
                          $12,500 USD
                        </div>
                      </div>
                      <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
                        <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">
                          Payment Terms
                        </div>
                        <div className="font-bold text-slate-900 dark:text-white">
                          Net 30 Days
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-2">
                          Scope of Services
                        </h4>
                        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                          The Agent agrees to provide full crewing management
                          services including recruitment, vetting, payroll
                          administration, and travel logistics for a crew
                          complement of 22 seafarers. The Ship Owner ensures the
                          vessel meets all SOLAS and MARPOL regulations.
                        </p>
                      </div>
                      <div className="h-px bg-slate-100 dark:bg-slate-800"></div>
                      <div className="flex gap-8">
                        <div>
                          <span className="text-xs text-slate-500 uppercase font-semibold">
                            Insurance
                          </span>
                          <p className="text-sm font-medium text-slate-900 dark:text-white">
                            P&amp;I Club Coverage (Full)
                          </p>
                        </div>
                        <div>
                          <span className="text-xs text-slate-500 uppercase font-semibold">
                            Jurisdiction
                          </span>
                          <p className="text-sm font-medium text-slate-900 dark:text-white">
                            London, UK
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Involved Seafarers */}
                <div className="bg-white dark:bg-[#1A2235] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                  <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                      <span className="material-symbols-outlined text-slate-400">
                        groups
                      </span>
                      Involved Seafarers
                    </h3>
                    <button className="text-sm font-bold text-primary hover:text-primary-hover flex items-center gap-1">
                      View All Seafarers
                      <span className="material-symbols-outlined text-base">
                        arrow_forward
                      </span>
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                          <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                            Name
                          </th>
                          <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                            Rank
                          </th>
                          <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                            Nationality
                          </th>
                          <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                          <td className="px-6 py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-500">
                                JD
                              </div>
                              <span className="text-sm font-semibold text-slate-900 dark:text-white">
                                Contract Signatory
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-3 text-sm text-slate-600 dark:text-slate-400">
                            Master
                          </td>
                          <td className="px-6 py-3 text-sm text-slate-600 dark:text-slate-400">
                            USA
                          </td>
                          <td className="px-6 py-3">
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                              Onboard
                            </span>
                          </td>
                          <td className="px-6 py-3 text-right">
                            <button className="text-slate-400 hover:text-primary transition-colors">
                              <span className="material-symbols-outlined text-lg">
                                visibility
                              </span>
                            </button>
                          </td>
                        </tr>
                        <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                          <td className="px-6 py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-500">
                                AS
                              </div>
                              <span className="text-sm font-semibold text-slate-900 dark:text-white">
                                Alejandro Silva
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-3 text-sm text-slate-600 dark:text-slate-400">
                            Chief Officer
                          </td>
                          <td className="px-6 py-3 text-sm text-slate-600 dark:text-slate-400">
                            Philippines
                          </td>
                          <td className="px-6 py-3">
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                              Onboard
                            </span>
                          </td>
                          <td className="px-6 py-3 text-right">
                            <button className="text-slate-400 hover:text-primary transition-colors">
                              <span className="material-symbols-outlined text-lg">
                                visibility
                              </span>
                            </button>
                          </td>
                        </tr>
                        <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                          <td className="px-6 py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-500">
                                MK
                              </div>
                              <span className="text-sm font-semibold text-slate-900 dark:text-white">
                                Marek Kowalski
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-3 text-sm text-slate-600 dark:text-slate-400">
                            Chief Engineer
                          </td>
                          <td className="px-6 py-3 text-sm text-slate-600 dark:text-slate-400">
                            Poland
                          </td>
                          <td className="px-6 py-3">
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                              Leave
                            </span>
                          </td>
                          <td className="px-6 py-3 text-right">
                            <button className="text-slate-400 hover:text-primary transition-colors">
                              <span className="material-symbols-outlined text-lg">
                                visibility
                              </span>
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800/30 px-6 py-3 border-t border-slate-200 dark:border-slate-800 text-center">
                    <span className="text-xs text-slate-500">
                      Showing 3 of 22 assigned seafarers
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="xl:col-span-1 space-y-6">
                {/* Contract Duration */}
                <div className="bg-white dark:bg-[#1A2235] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-4">
                    Contract Duration
                  </h3>
                  <div className="flex flex-col gap-6 relative pl-2">
                    <div className="absolute left-2.5 top-2 bottom-2 w-0.5 bg-slate-200 dark:bg-slate-700"></div>
                    <div className="relative flex items-start gap-4">
                      <div className="w-5 h-5 rounded-full bg-primary border-4 border-white dark:border-[#1A2235] shrink-0 z-10"></div>
                      <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase">
                          Start Date
                        </p>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">
                          Oct 12, 2023
                        </p>
                      </div>
                    </div>
                    <div className="relative flex items-start gap-4">
                      <div className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-600 border-4 border-white dark:border-[#1A2235] shrink-0 z-10"></div>
                      <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase">
                          Current Date
                        </p>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">
                          Nov 28, 2023
                        </p>
                        <div className="mt-1 text-xs text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded inline-block font-medium">
                          47 days elapsed
                        </div>
                      </div>
                    </div>
                    <div className="relative flex items-start gap-4">
                      <div className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-600 border-4 border-white dark:border-[#1A2235] shrink-0 z-10"></div>
                      <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase">
                          End Date
                        </p>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">
                          Apr 12, 2024
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                          136 days remaining
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Documents */}
                <div className="bg-white dark:bg-[#1A2235] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                      Documents
                    </h3>
                    <button className="text-primary hover:text-primary-hover">
                      <span className="material-symbols-outlined">
                        add_circle
                      </span>
                    </button>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-primary/50 transition-colors group bg-slate-50 dark:bg-slate-800/20">
                      <div className="p-2 rounded bg-red-100 text-red-600 mr-3">
                        <span className="material-symbols-outlined text-xl">
                          picture_as_pdf
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                          Signed_Contract_Main.pdf
                        </p>
                        <p className="text-xs text-slate-500">
                          2.4 MB • Oct 10, 2023
                        </p>
                      </div>
                      <button className="text-slate-400 hover:text-primary transition-colors">
                        <span className="material-symbols-outlined">
                          download
                        </span>
                      </button>
                    </div>
                    <div className="flex items-center p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-primary/50 transition-colors group bg-slate-50 dark:bg-slate-800/20">
                      <div className="p-2 rounded bg-blue-100 text-blue-600 mr-3">
                        <span className="material-symbols-outlined text-xl">
                          description
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                          Insurance_Policy_2023.docx
                        </p>
                        <p className="text-xs text-slate-500">
                          1.1 MB • Oct 11, 2023
                        </p>
                      </div>
                      <button className="text-slate-400 hover:text-primary transition-colors">
                        <span className="material-symbols-outlined">
                          download
                        </span>
                      </button>
                    </div>
                    <div className="flex items-center p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-primary/50 transition-colors group bg-slate-50 dark:bg-slate-800/20">
                      <div className="p-2 rounded bg-green-100 text-green-600 mr-3">
                        <span className="material-symbols-outlined text-xl">
                          table_chart
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                          Crew_Manifest_v2.xlsx
                        </p>
                        <p className="text-xs text-slate-500">
                          856 KB • Nov 01, 2023
                        </p>
                      </div>
                      <button className="text-slate-400 hover:text-primary transition-colors">
                        <span className="material-symbols-outlined">
                          download
                        </span>
                      </button>
                    </div>
                  </div>
                  <button className="w-full mt-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-primary hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg border border-dashed border-slate-300 dark:border-slate-700 transition-colors">
                    View All Documents
                  </button>
                </div>

                {/* Internal Notes */}
                <div className="bg-white dark:bg-[#1A2235] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-3">
                    Internal Notes
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 italic mb-4">
                    &quot;Vessel inspection scheduled for arrival in Rotterdam.
                    Crew change expected for 3 ratings.&quot;
                  </p>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 bg-cover bg-center"
                      style={{
                        backgroundImage:
                          "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBNKCR1y2af8Dd4Jsz6y0ROyAcFljibHqZCYegjlJykI6Tm15YRmNQSeIksCr01Ta4eXkHmHLro7MSeAby7QdxiYhXvDVkHi_PpMHOEvHOQMtLp_F4oeEDWzd-V96YXdIkiivaQi668PVxCua4EWRkREjcVp53CqWMVDx7CkdsBwJ5XSKcejM_fEMxE7slsHHGxAGImCv0YJ-5mg1ITMIvHuVW79k9y5OPi91t51ZpO_A9ckHA4s5181naijohW99nUj6est8LYcMtX')",
                      }}
                    ></div>
                    <span className="text-xs font-medium text-slate-500">
                      Updated by Agent Smith, 2h ago
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
