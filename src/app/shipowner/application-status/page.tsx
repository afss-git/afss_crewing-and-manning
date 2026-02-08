import React, { Suspense } from "react";
import Link from "next/link";
import Sidebar from "../components/Sidebar";
import ClientApplicationStatus from "./ClientApplicationStatus";

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

            {/* Content */}
            <Suspense
              fallback={
                <div className="flex justify-center items-center py-12">
                  <p className="text-slate-500">Loading applications...</p>
                </div>
              }
            >
              <ClientApplicationStatus />
            </Suspense>
          </div>
        </div>
      </main>
    </div>
  );
}
