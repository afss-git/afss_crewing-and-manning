"use client";
import Link from "next/link";
import React from "react";

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
        <Link href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors font-medium group">
          <span className="material-symbols-outlined">settings</span>
          Settings
        </Link>
        <Link href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors font-medium group">
          <span className="material-symbols-outlined">help</span>
          Help & Support
        </Link>
      </nav>
      <div className="p-4 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 bg-cover bg-center" style={{backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuBNKCR1y2af8Dd4Jsz6y0ROyAcFljibHqZCYegjlJykI6Tm15YRmNQSeIksCr01Ta4eXkHmHLro7MSeAby7QdxiYhXvDVkHi_PpMHOEvHOQMtLp_F4oeEDWzd-V96YXdIkiivaQi668PVxCua4EWRkREjcVp53CqWMVDx7CkdsBwJ5XSKcejM_fEMxE7slsHHGxAGImCv0YJ-5mg1ITMIvHuVW79k9y5OPi91t51ZpO_A9ckHA4s5181naijohW99nUj6est8LYcMtX')`}}></div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-slate-900 dark:text-white">Agent Smith</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">Senior Agent</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
