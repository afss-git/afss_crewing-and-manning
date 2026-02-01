"use client";
import Link from "next/link";
import React from "react";
import ShipOwnerSidebarProfile from "../../../components/ShipOwnerSidebarProfile";

export default function Sidebar({ active }: { active?: string }) {
  return (
    <aside className="w-64 flex-shrink-0 bg-white dark:bg-[#1A2235] border-r border-slate-200 dark:border-slate-800 flex flex-col transition-colors duration-300">
      <div className="h-16 flex items-center px-6 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2 text-primary font-bold text-xl tracking-tight">
          <span className="material-symbols-outlined text-3xl icon-fill">anchor</span>
          MaritimeOps
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        <div className="px-3 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">Menu</div>
        <Link href="/shipowner/dashboard" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium group ${active === 'dashboard' ? 'bg-primary/10 text-primary' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors'}`}>
          <span className="material-symbols-outlined">grid_view</span>
          Dashboard
        </Link>
        <Link href="/shipowner/application-status" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium group ${active === 'application-status' ? 'bg-primary/10 text-primary' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors'}`}>
          <span className="material-symbols-outlined icon-fill">description</span>
          Contracts & Apps
        </Link>
        <Link href="/shipowner/contract" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium group ${active === 'contract' ? 'bg-primary/10 text-primary' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors'}`}>
          <span className="material-symbols-outlined">toc</span>
          Contract
        </Link>
        <Link href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors font-medium group">
          <span className="material-symbols-outlined">groups</span>
          Crew Management
        </Link>
        <Link href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors font-medium group">
          <span className="material-symbols-outlined">sailing</span>
          Vessels
        </Link>
        <div className="px-3 mt-6 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">System</div>
        <Link href="/shipowner/fleet-details" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium group ${active === 'profile' ? 'bg-primary/10 text-primary' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors'}`}>
          <span className="material-symbols-outlined">business</span>
          Company Profile
        </Link>
        <Link href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors font-medium group">
          <span className="material-symbols-outlined">settings</span>
          Settings
        </Link>
        <Link href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors font-medium group">
          <span className="material-symbols-outlined">help</span>
          Help & Support
        </Link>
      </nav>
      <ShipOwnerSidebarProfile />
    </aside>
  );
}
