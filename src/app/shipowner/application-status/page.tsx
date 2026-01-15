"use client";
import Link from "next/link";
import Sidebar from "../components/Sidebar";
import React from "react";

export default function ApplicationStatusOverview() {
  return (
    <div className="flex h-screen overflow-hidden font-display text-slate-900 dark:text-white bg-background-light dark:bg-background-dark">
      {/* Sidebar */}
      <Sidebar active="application-status" />
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
                placeholder="Search ID, Vessel or Type..."
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
        <div className="flex-1 overflow-y-auto bg-slate-50 dark:bg-background-dark p-6 lg:p-10">
          <div className="max-w-7xl mx-auto w-full">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <Link
                  className="inline-flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-primary transition-colors mb-2"
                  href="/shipowner/dashboard"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    arrow_back
                  </span>
                  Back to Dashboard
                </Link>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                  Application Status Overview
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1">
                  Track the progress of your crew requests, contracts, and
                  applications.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-2 shadow-sm">
                  <span className="material-symbols-outlined text-[20px]">
                    filter_list
                  </span>
                  Filter Status
                </button>
                <button className="px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg font-medium shadow-md shadow-primary/20 transition-colors flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px]">
                    add
                  </span>
                  New Application
                </button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-white dark:bg-[#1A2235] p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    Total Submitted
                  </p>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                    24
                  </h3>
                </div>
                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400">
                  <span className="material-symbols-outlined">folder</span>
                </div>
              </div>
              <div className="bg-white dark:bg-[#1A2235] p-5 rounded-xl border-l-4 border-yellow-500 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    Under Review
                  </p>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                    5
                  </h3>
                </div>
                <div className="w-10 h-10 rounded-full bg-yellow-50 dark:bg-yellow-900/20 flex items-center justify-center text-yellow-600 dark:text-yellow-500">
                  <span className="material-symbols-outlined">
                    pending_actions
                  </span>
                </div>
              </div>
              <div className="bg-white dark:bg-[#1A2235] p-5 rounded-xl border-l-4 border-blue-500 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    Shortlisted
                  </p>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                    2
                  </h3>
                </div>
                <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-500">
                  <span className="material-symbols-outlined">group</span>
                </div>
              </div>
              <div className="bg-white dark:bg-[#1A2235] p-5 rounded-xl border-l-4 border-green-500 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    Approved
                  </p>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                    12
                  </h3>
                </div>
                <div className="w-10 h-10 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center text-green-600 dark:text-green-500">
                  <span className="material-symbols-outlined">
                    check_circle
                  </span>
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
                          <div className="w-8 h-8 rounded bg-primary/10 text-primary flex items-center justify-center">
                            <span className="material-symbols-outlined text-[18px]">
                              description
                            </span>
                          </div>
                          <span className="font-mono font-semibold text-slate-900 dark:text-white">
                            #C-2023-8842
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-700 dark:text-slate-300">
                        One-off Crew Supply
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                        MV Pacific Pearl
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">
                        Oct 24, 2023
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800">
                          <span className="w-1.5 h-1.5 rounded-full bg-yellow-500"></span>{" "}
                          Under Review
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-primary hover:text-primary-hover font-semibold text-sm inline-flex items-center gap-1 hover:underline">
                          View Details{" "}
                          <span className="material-symbols-outlined text-[16px]">
                            arrow_forward
                          </span>
                        </button>
                      </td>
                    </tr>

                    {/* Row 2 - Shortlisted */}
                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group cursor-pointer">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded bg-primary/10 text-primary flex items-center justify-center">
                            <span className="material-symbols-outlined text-[18px]">
                              group
                            </span>
                          </div>
                          <span className="font-mono font-semibold text-slate-900 dark:text-white">
                            #C-2023-8801
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-700 dark:text-slate-300">
                        Full Crew Management
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                        SS Northern Star
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">
                        Oct 20, 2023
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>{" "}
                          Shortlisted
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-primary hover:text-primary-hover font-semibold text-sm inline-flex items-center gap-1 hover:underline">
                          View Details{" "}
                          <span className="material-symbols-outlined text-[16px]">
                            arrow_forward
                          </span>
                        </button>
                      </td>
                    </tr>

                    {/* Row 3 - Approved */}
                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group cursor-pointer">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded bg-primary/10 text-primary flex items-center justify-center">
                            <span className="material-symbols-outlined text-[18px]">
                              person
                            </span>
                          </div>
                          <span className="font-mono font-semibold text-slate-900 dark:text-white">
                            #R-2023-1109
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-700 dark:text-slate-300">
                        Bosun Replacement
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                        MV Ocean Giant
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">
                        Oct 15, 2023
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span>{" "}
                          Approved
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-primary hover:text-primary-hover font-semibold text-sm inline-flex items-center gap-1 hover:underline">
                          Timeline{" "}
                          <span className="material-symbols-outlined text-[16px]">
                            schedule
                          </span>
                        </button>
                      </td>
                    </tr>

                    {/* Row 4 - Rejected */}
                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group cursor-pointer">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded bg-primary/10 text-primary flex items-center justify-center">
                            <span className="material-symbols-outlined text-[18px]">
                              person
                            </span>
                          </div>
                          <span className="font-mono font-semibold text-slate-900 dark:text-white">
                            #C-2023-8650
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-700 dark:text-slate-300">
                        Cook Replacement
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                        MV Atlantic Spirit
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">
                        Oct 10, 2023
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>{" "}
                          Rejected
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 font-medium text-sm inline-flex items-center gap-1 hover:underline">
                          View Reason{" "}
                          <span className="material-symbols-outlined text-[16px]">
                            info
                          </span>
                        </button>
                      </td>
                    </tr>

                    {/* Row 5 - Approved */}
                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group cursor-pointer">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded bg-primary/10 text-primary flex items-center justify-center">
                            <span className="material-symbols-outlined text-[18px]">
                              engineering
                            </span>
                          </div>
                          <span className="font-mono font-semibold text-slate-900 dark:text-white">
                            #C-2023-8512
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-700 dark:text-slate-300">
                        Stevedore Contract
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                        Port of Hamburg
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">
                        Sep 28, 2023
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span>{" "}
                          Approved
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-primary hover:text-primary-hover font-semibold text-sm inline-flex items-center gap-1 hover:underline">
                          Timeline{" "}
                          <span className="material-symbols-outlined text-[16px]">
                            schedule
                          </span>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-sm text-slate-500 dark:text-slate-400 text-center sm:text-left">
                  Showing{" "}
                  <span className="font-semibold text-slate-900 dark:text-white">
                    1
                  </span>{" "}
                  to{" "}
                  <span className="font-semibold text-slate-900 dark:text-white">
                    5
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-slate-900 dark:text-white">
                    24
                  </span>{" "}
                  applications
                </span>
                <div className="flex gap-2">
                  <button
                    className="px-4 py-2 text-sm font-medium border border-slate-200 dark:border-slate-700 rounded-lg text-slate-400 cursor-not-allowed bg-slate-50 dark:bg-slate-800"
                    disabled
                  >
                    Previous
                  </button>
                  <button className="px-4 py-2 text-sm font-medium border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
