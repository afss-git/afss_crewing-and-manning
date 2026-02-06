// src/app/shipowner/contract-type/full/success/page.tsx
"use client";
import React from "react";
import { useRouter } from "next/navigation";

export default function FullCrewManagementSuccess() {
  const router = useRouter();

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-white dark:bg-[#1A2235] border-r border-slate-200 dark:border-slate-800 flex flex-col transition-colors duration-300">
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
          <button
            onClick={() => router.push("/shipowner/dashboard")}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors font-medium group w-full text-left"
          >
            <span className="material-symbols-outlined">grid_view</span>
            Dashboard
          </button>
          <button
            disabled
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors font-medium group w-full text-left cursor-not-allowed opacity-60"
          >
            <span className="material-symbols-outlined icon-fill">
              description
            </span>
            Contracts
          </button>
          <button
            disabled
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors font-medium group w-full text-left cursor-not-allowed opacity-60"
          >
            <span className="material-symbols-outlined">toc</span>
            Contract List
          </button>
          <button
            disabled
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary/10 text-primary font-medium group w-full text-left cursor-not-allowed opacity-60"
          >
            <span className="material-symbols-outlined">groups</span>
            Crew Management
          </button>
          <button
            disabled
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors font-medium group w-full text-left cursor-not-allowed opacity-60"
          >
            <span className="material-symbols-outlined">sailing</span>
            Vessels
          </button>
          <div className="px-3 mt-6 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            System
          </div>
          <button
            disabled
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors font-medium group w-full text-left cursor-not-allowed opacity-60"
          >
            <span className="material-symbols-outlined">settings</span>
            Settings
          </button>
          <button
            disabled
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors font-medium group w-full text-left cursor-not-allowed opacity-60"
          >
            <span className="material-symbols-outlined">help</span>
            Help & Support
          </button>
        </nav>
        <div className="p-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 bg-cover bg-center"
              style={{
                backgroundImage: `url('/images/default-shipowner-avatar.jpg')`,
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
                placeholder="Search contracts..."
                type="text"
                disabled
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              className="relative p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
              disabled
            >
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-[#1A2235]"></span>
            </button>
            <button
              className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
              disabled
            >
              <span className="material-symbols-outlined">apps</span>
            </button>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto bg-slate-50 dark:bg-background-dark p-6 lg:p-10 flex flex-col items-center justify-center">
          <div className="max-w-2xl w-full mx-auto">
            <div className="bg-white dark:bg-[#1A2235] rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-black/20 border border-slate-200 dark:border-slate-800 p-8 md:p-12 text-center">
              <div className="mb-8 flex justify-center">
                <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center animate-check">
                  <span className="material-symbols-outlined text-6xl text-primary icon-fill">
                    check_circle
                  </span>
                </div>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">
                Full Crew Management
                <br />
                Application Submitted!
              </h1>
              <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 leading-relaxed max-w-lg mx-auto">
                Your application for comprehensive crew management services{" "}
                <span className="font-mono font-medium text-slate-700 dark:text-slate-300">
                  #FCM-2023-9942
                </span>{" "}
                has been successfully received.
              </p>
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-6 mb-8 text-left border border-slate-100 dark:border-slate-700">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">
                    info
                  </span>
                  Next Steps
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="mt-1 w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center shrink-0 text-xs font-bold text-slate-600 dark:text-slate-400">
                      1
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      Our compliance team will review the vessel details and
                      mandatory certification requirements.
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="mt-1 w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center shrink-0 text-xs font-bold text-slate-600 dark:text-slate-400">
                      2
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      A customized manning strategy and budget proposal will be
                      generated for your review (approx. 3-5 business days).
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="mt-1 w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center shrink-0 text-xs font-bold text-slate-600 dark:text-slate-400">
                      3
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      Once approved, we will initiate the crew selection and
                      rotation planning via the dashboard.
                    </div>
                  </li>
                </ul>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  className="px-6 py-3 rounded-lg bg-primary hover:bg-primary-hover text-white font-semibold shadow-lg shadow-primary/30 transition-all flex items-center justify-center gap-2 w-full sm:w-auto"
                  onClick={() => router.push("/shipowner/application-status")}
                >
                  <span className="material-symbols-outlined">visibility</span>
                  View Application Status
                </button>
                <button
                  className="px-6 py-3 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium transition-colors flex items-center justify-center gap-2 w-full sm:w-auto"
                  onClick={() => router.push("/shipowner/dashboard")}
                >
                  <span className="material-symbols-outlined">home</span>
                  Return to Dashboard
                </button>
              </div>
              <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  Need to make changes?{" "}
                  <a
                    className="text-primary hover:underline font-medium"
                    href="#"
                  >
                    Contact Support
                  </a>{" "}
                  or retract application within 1 hour.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
