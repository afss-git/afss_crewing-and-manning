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
    </div>
  );
}
