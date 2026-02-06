"use client";

import Link from "next/link";
import React from "react";
import { useRouter } from "next/navigation";

export default function OneOffContractPage() {
  const router = useRouter();
  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    // Here you would normally handle form validation and API submission
    router.push("/shipowner/contract-type/one-off/success");
  };
  return (
    <div className="flex h-screen overflow-hidden font-display text-slate-900 dark:text-white bg-background-light dark:bg-background-dark">
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
          <Link
            href="/shipowner/dashboard"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors font-medium group"
          >
            <span className="material-symbols-outlined">grid_view</span>
            Dashboard
          </Link>
          <Link
            href="#"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary/10 text-primary font-medium group"
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
          <div className="max-w-6xl mx-auto">
            {/* Breadcrumbs and Title */}
            <div className="flex flex-col gap-1 mb-8">
              <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <Link href="#" className="hover:text-primary transition-colors">
                  Dashboard
                </Link>
                <span className="material-symbols-outlined text-[12px]">
                  chevron_right
                </span>
                <Link href="#" className="hover:text-primary transition-colors">
                  Contracts
                </Link>
                <span className="material-symbols-outlined text-[12px]">
                  chevron_right
                </span>
                <span className="text-slate-900 dark:text-white font-medium">
                  New One-Off Contract
                </span>
              </div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                Create One-Off Supply Contract
              </h1>
              <p className="text-slate-500 dark:text-slate-400">
                Define the vessel, duration, and crew composition for a new
                deployment.
              </p>
            </div>
            {/* Progress Steps */}
            <div className="mb-10">
              <div className="flex items-center justify-between w-full relative">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-200 dark:bg-slate-800 -z-10 rounded-full"></div>
                <div className="flex flex-col items-center gap-2 bg-slate-50 dark:bg-background-dark px-4">
                  <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold shadow-lg shadow-primary/30 ring-4 ring-white dark:ring-background-dark">
                    1
                  </div>
                  <span className="text-sm font-bold text-primary">
                    Contract Details
                  </span>
                </div>
                <div className="flex flex-col items-center gap-2 bg-slate-50 dark:bg-background-dark px-4">
                  <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 text-slate-500 dark:text-slate-400 flex items-center justify-center font-bold ring-4 ring-white dark:ring-background-dark">
                    2
                  </div>
                  <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    Crew Requirements
                  </span>
                </div>
                <div className="flex flex-col items-center gap-2 bg-slate-50 dark:bg-background-dark px-4">
                  <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 text-slate-500 dark:text-slate-400 flex items-center justify-center font-bold ring-4 ring-white dark:ring-background-dark">
                    3
                  </div>
                  <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    Review & Submit
                  </span>
                </div>
              </div>
            </div>
            {/* Main Form Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                {/* Vessel & Operation */}
                <div className="bg-white dark:bg-[#1A2235] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
                  <div className="flex items-center gap-3 mb-6 border-b border-slate-100 dark:border-slate-700 pb-4">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary">
                      <span className="material-symbols-outlined text-lg">
                        sailing
                      </span>
                    </span>
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                      Vessel & Operation
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                        Select Vessel <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <select className="w-full rounded-lg bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-primary focus:border-primary">
                          <option disabled selected value="">
                            Choose a vessel from your fleet...
                          </option>
                          <option value="1">
                            MV Atlantic Star (Bulk Carrier)
                          </option>
                          <option value="2">
                            SS Pacific Voyager (Container Ship)
                          </option>
                          <option value="3">
                            MV Northern Light (Oil Tanker)
                          </option>
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                          <span className="material-symbols-outlined text-slate-500">
                            expand_more
                          </span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                        Contract Reference ID
                      </label>
                      <input
                        className="w-full rounded-lg bg-slate-100 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-500 cursor-not-allowed font-mono text-sm"
                        readOnly
                        type="text"
                        value="C-2023-DRAFT-04"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                        Operational Zone
                      </label>
                      <input
                        className="w-full rounded-lg bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-primary focus:border-primary placeholder-slate-400"
                        placeholder="e.g. North Sea"
                        type="text"
                      />
                    </div>
                  </div>
                </div>
                {/* Duration & Logistics */}
                <div className="bg-white dark:bg-[#1A2235] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
                  <div className="flex items-center gap-3 mb-6 border-b border-slate-100 dark:border-slate-700 pb-4">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary">
                      <span className="material-symbols-outlined text-lg">
                        calendar_month
                      </span>
                    </span>
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                      Duration & Logistics
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                        Target Start Date{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          className="w-full rounded-lg bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-primary focus:border-primary"
                          type="date"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                        Expected Duration
                      </label>
                      <div className="flex">
                        <input
                          className="w-full rounded-l-lg bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-primary focus:border-primary"
                          placeholder="6"
                          type="number"
                        />
                        <select className="rounded-r-lg border-l-0 bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-primary focus:border-primary px-4">
                          <option>Months</option>
                          <option>Weeks</option>
                          <option>Days</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                        Port of Embarkation
                      </label>
                      <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                          location_on
                        </span>
                        <input
                          className="w-full pl-10 rounded-lg bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-primary focus:border-primary"
                          placeholder="Search port..."
                          type="text"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                        Port of Disembarkation (Optional)
                      </label>
                      <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                          location_on
                        </span>
                        <input
                          className="w-full pl-10 rounded-lg bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-primary focus:border-primary"
                          placeholder="Search port..."
                          type="text"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                {/* Crew Composition */}
                <div className="bg-white dark:bg-[#1A2235] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
                  <div className="flex items-center justify-between mb-6 border-b border-slate-100 dark:border-slate-700 pb-4">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary">
                        <span className="material-symbols-outlined text-lg">
                          groups
                        </span>
                      </span>
                      <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                        Crew Composition
                      </h3>
                    </div>
                    <button className="text-sm text-primary font-semibold hover:underline">
                      Bulk Upload CSV
                    </button>
                  </div>
                  <div className="space-y-4">
                    {/* Crew Position Row 1 */}
                    <div className="hidden md:grid grid-cols-12 gap-4 text-xs font-semibold text-slate-500 uppercase tracking-wider px-2">
                      <div className="col-span-4">Position / Rank</div>
                      <div className="col-span-2">Quantity</div>
                      <div className="col-span-3">Min. Experience</div>
                      <div className="col-span-2">Nationality Pref.</div>
                      <div className="col-span-1"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                      <div className="col-span-12 md:col-span-4">
                        <label className="md:hidden text-xs text-slate-500 font-bold mb-1 block">
                          Position
                        </label>
                        <select className="w-full rounded-md border-slate-300 text-sm focus:ring-primary focus:border-primary">
                          <option>Master / Captain</option>
                          <option>Chief Officer</option>
                          <option>2nd Officer</option>
                        </select>
                      </div>
                      <div className="col-span-6 md:col-span-2">
                        <label className="md:hidden text-xs text-slate-500 font-bold mb-1 block">
                          Qty
                        </label>
                        <input
                          className="w-full rounded-md border-slate-300 text-sm focus:ring-primary focus:border-primary"
                          type="number"
                          defaultValue={1}
                        />
                      </div>
                      <div className="col-span-6 md:col-span-3">
                        <label className="md:hidden text-xs text-slate-500 font-bold mb-1 block">
                          Experience
                        </label>
                        <select className="w-full rounded-md border-slate-300 text-sm focus:ring-primary focus:border-primary">
                          <option>5+ Years</option>
                          <option>3-5 Years</option>
                          <option>1-3 Years</option>
                        </select>
                      </div>
                      <div className="col-span-12 md:col-span-2">
                        <label className="md:hidden text-xs text-slate-500 font-bold mb-1 block">
                          Nationality
                        </label>
                        <select className="w-full rounded-md border-slate-300 text-sm focus:ring-primary focus:border-primary">
                          <option>Any</option>
                          <option>Filipino</option>
                          <option>Indian</option>
                          <option>Ukrainian</option>
                        </select>
                      </div>
                      <div className="col-span-12 md:col-span-1 flex justify-end md:justify-center md:pt-2">
                        <button className="text-slate-400 hover:text-red-500 transition-colors">
                          <span className="material-symbols-outlined">
                            delete
                          </span>
                        </button>
                      </div>
                    </div>
                    {/* Crew Position Row 2 */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                      <div className="col-span-12 md:col-span-4">
                        <label className="md:hidden text-xs text-slate-500 font-bold mb-1 block">
                          Position
                        </label>
                        <select className="w-full rounded-md border-slate-300 text-sm focus:ring-primary focus:border-primary">
                          <option>Chief Engineer</option>
                          <option selected>2nd Engineer</option>
                        </select>
                      </div>
                      <div className="col-span-6 md:col-span-2">
                        <label className="md:hidden text-xs text-slate-500 font-bold mb-1 block">
                          Qty
                        </label>
                        <input
                          className="w-full rounded-md border-slate-300 text-sm focus:ring-primary focus:border-primary"
                          type="number"
                          defaultValue={2}
                        />
                      </div>
                      <div className="col-span-6 md:col-span-3">
                        <label className="md:hidden text-xs text-slate-500 font-bold mb-1 block">
                          Experience
                        </label>
                        <select className="w-full rounded-md border-slate-300 text-sm focus:ring-primary focus:border-primary">
                          <option>5+ Years</option>
                          <option selected>3-5 Years</option>
                          <option>1-3 Years</option>
                        </select>
                      </div>
                      <div className="col-span-12 md:col-span-2">
                        <label className="md:hidden text-xs text-slate-500 font-bold mb-1 block">
                          Nationality
                        </label>
                        <select className="w-full rounded-md border-slate-300 text-sm focus:ring-primary focus:border-primary">
                          <option>Any</option>
                          <option>Filipino</option>
                          <option>Indian</option>
                        </select>
                      </div>
                      <div className="col-span-12 md:col-span-1 flex justify-end md:justify-center md:pt-2">
                        <button className="text-slate-400 hover:text-red-500 transition-colors">
                          <span className="material-symbols-outlined">
                            delete
                          </span>
                        </button>
                      </div>
                    </div>
                    <button className="w-full py-3 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-700 text-slate-500 hover:text-primary hover:border-primary transition-colors flex items-center justify-center gap-2 font-medium bg-slate-50/50 hover:bg-slate-50">
                      <span className="material-symbols-outlined">
                        add_circle
                      </span>
                      Add Another Position
                    </button>
                  </div>
                </div>
              </div>
              {/* Sidebar: Pro Tip & Summary */}
              <div className="space-y-6">
                <div className="bg-primary text-white rounded-xl shadow-lg shadow-primary/20 p-6 relative overflow-hidden">
                  <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-white/10"></div>
                  <div className="absolute -right-2 -bottom-6 w-20 h-20 rounded-full bg-white/10"></div>
                  <h4 className="font-bold text-lg mb-2 flex items-center gap-2">
                    <span className="material-symbols-outlined text-xl">
                      lightbulb
                    </span>
                    Pro Tip
                  </h4>
                  <p className="text-sm text-white/90 leading-relaxed">
                    Contracts with durations longer than 6 months require
                    specific insurance verification. Ensure the vessel's P&amp;I
                    club coverage is up to date before proceeding.
                  </p>
                </div>
                <div className="bg-white dark:bg-[#1A2235] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 sticky top-6">
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-4">
                    Request Summary
                  </h3>
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500 dark:text-slate-400">
                        Total Positions
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        3
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500 dark:text-slate-400">
                        Total Crew Count
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        3
                      </span>
                    </div>
                    <div className="h-px bg-slate-100 dark:bg-slate-700 my-2"></div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500 dark:text-slate-400">
                        Est. Duration
                      </span>
                      <span className="font-mono text-slate-900 dark:text-white">
                        6 Months
                      </span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <button
                      className="w-full py-3 px-4 bg-primary hover:bg-primary-hover text-white font-bold rounded-lg shadow-lg shadow-primary/30 transition-all flex items-center justify-center gap-2"
                      onClick={handleSubmit}
                    >
                      Next Step
                      <span className="material-symbols-outlined">
                        arrow_forward
                      </span>
                    </button>
                    <button className="w-full py-3 px-4 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-medium rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                      Save Draft
                    </button>
                  </div>
                  <div className="mt-4 text-center">
                    <Link
                      href="#"
                      className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 underline"
                    >
                      Cancel and return to dashboard
                    </Link>
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
