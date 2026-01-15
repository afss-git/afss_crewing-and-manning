"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface CrewMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  joinDate: string;
  status: "onboard" | "rotation-due" | "leave";
  daysLeft?: number;
}

interface Contract {
  id: string;
  refId: string;
  vesselName: string;
  vesselType: string;
  vesselImo: string;
  vesselImage: string;
  client: string;
  startDate: string;
  endDate: string;
  progress: number;
  crewAssigned: number;
  crewTotal: number;
  status: "active" | "renewal-due" | "pending" | "expired";
  scope: string;
  manningAgent: string;
  crew: CrewMember[];
}

export default function AdminCrewManagementPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedContract, setSelectedContract] = useState<Contract | null>(
    null
  );
  const [activeTab, setActiveTab] = useState<
    "crew" | "documents" | "financials"
  >("crew");

  // Mock data removed — load crew contracts from API
  const [contracts, setContracts] = useState<Contract[]>([]);

  useEffect(() => {
    let mounted = true;
    fetch("/api/v1/admin/crew-contracts")
      .then(async (res) => (res.ok ? ((await res.json()) as Contract[]) : []))
      .then((data) => {
        if (!mounted) return;
        const list = Array.isArray(data) ? data : [];
        setContracts(list);
        if (list.length > 0) {
          setSelectedContract((prev) => prev ?? list[0]);
        }
      })
      .catch(() => {
        if (!mounted) return;
        setContracts([]);
      });
    return () => {
      mounted = false;
    };
  }, []);

  // Filter contracts
  const filteredContracts = contracts.filter((contract) => {
    const matchesSearch =
      contract.vesselName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contract.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contract.refId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      activeFilter === "all" ||
      (activeFilter === "active" && contract.status === "active") ||
      (activeFilter === "pending" && contract.status === "pending") ||
      (activeFilter === "renewal" && contract.status === "renewal-due") ||
      (activeFilter === "expired" && contract.status === "expired");
    return matchesSearch && matchesFilter;
  });

  // Stats
  const stats = {
    activeContracts: contracts.filter((c) => c.status === "active").length,
    totalCrewDeployed: contracts.reduce((sum, c) => sum + c.crewAssigned, 0),
    complianceRate: 98.5,
    upcomingExpirations: contracts.filter((c) => c.status === "renewal-due")
      .length,
  };

  // Initial selection handled after fetching contracts

  const handleLogout = () => {
    localStorage.removeItem("crew-manning-user");
    localStorage.removeItem("crew-manning-token");
    localStorage.removeItem("crew-manning-profile");
    router.push("/admin/login");
  };

  const handleExportReport = () => {
    alert("Exporting report...");
  };

  const handleNewContract = () => {
    alert("Opening new contract form...");
  };

  const handleManageRoster = () => {
    alert("Opening roster management...");
  };

  const handleDemobilize = () => {
    if (selectedContract) {
      alert(`Demobilizing crew from ${selectedContract.vesselName}`);
    }
  };

  const handleReassign = () => {
    if (selectedContract) {
      alert(`Reassigning crew for ${selectedContract.vesselName}`);
    }
  };

  const getStatusBadge = (status: Contract["status"]) => {
    switch (status) {
      case "active":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span>{" "}
            Active
          </span>
        );
      case "renewal-due":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-orange-50 text-orange-700 border border-orange-200 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-800">
            <span className="h-1.5 w-1.5 rounded-full bg-orange-500"></span>{" "}
            Renewal Due
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-gray-50 text-gray-700 border border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600">
            <span className="h-1.5 w-1.5 rounded-full bg-gray-400"></span>{" "}
            Pending
          </span>
        );
      case "expired":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800">
            <span className="h-1.5 w-1.5 rounded-full bg-red-500"></span>{" "}
            Expired
          </span>
        );
      default:
        return null;
    }
  };

  const getCrewBadge = (assigned: number, total: number) => {
    const ratio = assigned / total;
    let bgClass =
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    if (ratio < 1)
      bgClass =
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    if (ratio === 0)
      bgClass = "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgClass}`}
      >
        {assigned}/{total}
      </span>
    );
  };

  return (
    <div className="bg-[#f8f9fb] dark:bg-[#111621] text-[#0e121b] dark:text-gray-100 flex flex-col min-h-screen overflow-x-hidden">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#e8ebf3] bg-white dark:bg-[#1a202c] dark:border-gray-700 px-6 py-3 shadow-sm">
        <div className="flex items-center gap-8">
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-3 text-primary"
          >
            <div className="size-8 flex items-center justify-center bg-primary/10 rounded-lg">
              <span className="material-symbols-outlined text-primary text-2xl">
                anchor
              </span>
            </div>
            <h2 className="text-primary dark:text-white text-xl font-bold leading-tight tracking-[-0.015em]">
              CrewMarine
            </h2>
          </Link>
          <div className="hidden md:flex items-center gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
            <button className="px-4 py-1.5 text-sm font-medium rounded-md bg-white dark:bg-gray-700 shadow-sm text-primary dark:text-white">
              Admin
            </button>
            <button className="px-4 py-1.5 text-sm font-medium rounded-md text-gray-500 hover:text-gray-900 dark:hover:text-gray-300">
              Operations
            </button>
          </div>
        </div>
        <div className="flex flex-1 justify-end gap-6 items-center">
          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8 mr-4">
            <Link
              href="/admin/dashboard"
              className="text-gray-600 dark:text-gray-300 hover:text-primary text-sm font-medium transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/admin/crew-management"
              className="text-primary dark:text-white text-sm font-bold border-b-2 border-primary py-5"
            >
              Full Crew Mgmt
            </Link>
            <Link
              href="/admin/one-off-crew"
              className="text-gray-600 dark:text-gray-300 hover:text-primary text-sm font-medium transition-colors"
            >
              One-Off Crew
            </Link>
            <Link
              href="/admin/contracts"
              className="text-gray-600 dark:text-gray-300 hover:text-primary text-sm font-medium transition-colors"
            >
              Contracts
            </Link>
            <Link
              href="/admin/interviews"
              className="text-gray-600 dark:text-gray-300 hover:text-primary text-sm font-medium transition-colors"
            >
              Interviews
            </Link>
          </nav>
          {/* Actions */}
          <div className="flex gap-3 items-center border-l border-gray-200 dark:border-gray-700 pl-6">
            <label className="hidden xl:flex relative group">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 group-focus-within:text-primary">
                <span className="material-symbols-outlined text-[20px]">
                  search
                </span>
              </span>
              <input
                className="block w-64 rounded-lg border-none bg-gray-100 dark:bg-gray-800 py-2 pl-10 pr-3 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="Quick search..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </label>
            <button className="relative p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <button
              onClick={handleLogout}
              className="h-9 w-9 bg-center bg-no-repeat bg-cover rounded-full ring-2 ring-white dark:ring-gray-800 shadow-sm cursor-pointer"
              style={{
                backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuDpil0_WWVLxw1boPz22vYb9wmAZmO3aHZi2R2YogmsoEqf43Ag5Rtf2-BR_RFHkQF7RU4XGikliw2TfN1eozwIDzGIGDlY36OyEkGc6BMBkrWR-uYXAkJX1aNaveZHRqmQGnHsYGClq-9BMs5GapXgonx-d_Y6Uly5QEvRY8e6ej-H01_0tMe4Wyt0f3qEKlcDR5sXjiHOLV5ktcgNquyMpleZdHRmoD1mSZfA-mMcfE5e2Vpb1YAdSSImQRYwlLCLsdsKh17JBRnU")`,
              }}
              title="Click to logout"
            ></button>
          </div>
        </div>
      </header>

      {/* Main Content Layout */}
      <div className="flex-1 w-full max-w-[1600px] mx-auto p-6 lg:p-10 flex flex-col gap-8">
        {/* Breadcrumbs & Header */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link
              href="/admin/dashboard"
              className="hover:text-primary transition-colors"
            >
              Home
            </Link>
            <span className="material-symbols-outlined text-[16px]">
              chevron_right
            </span>
            <Link
              href="/admin/contracts"
              className="hover:text-primary transition-colors"
            >
              Contracts
            </Link>
            <span className="material-symbols-outlined text-[16px]">
              chevron_right
            </span>
            <span className="text-gray-900 dark:text-white font-medium">
              Full Crew Management
            </span>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
                Full Crew Management
              </h1>
              <p className="text-gray-500 mt-2 text-lg">
                Oversee active contracts, crew assignments, and operational
                compliance.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleExportReport}
                className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 px-4 py-2.5 rounded-lg font-medium shadow-sm transition-all"
              >
                <span className="material-symbols-outlined text-[20px]">
                  download
                </span>
                Export Report
              </button>
              <button
                onClick={handleNewContract}
                className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-lg font-medium shadow-md transition-all"
              >
                <span className="material-symbols-outlined text-[20px]">
                  add
                </span>
                New Contract
              </button>
            </div>
          </div>
        </div>

        {/* KPI Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-[#1a202c] p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col justify-between h-32 relative overflow-hidden group">
            <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="material-symbols-outlined text-6xl text-primary">
                assignment
              </span>
            </div>
            <p className="text-gray-500 font-medium text-sm uppercase tracking-wider">
              Active Contracts
            </p>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-gray-900 dark:text-white">
                {stats.activeContracts}
              </span>
              <span className="text-green-600 text-sm font-medium mb-1 flex items-center bg-green-50 dark:bg-green-900/30 px-2 py-0.5 rounded-full">
                <span className="material-symbols-outlined text-[14px] mr-1">
                  trending_up
                </span>{" "}
                +2%
              </span>
            </div>
          </div>
          <div className="bg-white dark:bg-[#1a202c] p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col justify-between h-32 relative overflow-hidden group">
            <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="material-symbols-outlined text-6xl text-blue-600">
                groups
              </span>
            </div>
            <p className="text-gray-500 font-medium text-sm uppercase tracking-wider">
              Total Crew Deployed
            </p>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-gray-900 dark:text-white">
                {stats.totalCrewDeployed}
              </span>
              <span className="text-green-600 text-sm font-medium mb-1 flex items-center bg-green-50 dark:bg-green-900/30 px-2 py-0.5 rounded-full">
                <span className="material-symbols-outlined text-[14px] mr-1">
                  trending_up
                </span>{" "}
                +12%
              </span>
            </div>
          </div>
          <div className="bg-white dark:bg-[#1a202c] p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col justify-between h-32 relative overflow-hidden group">
            <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="material-symbols-outlined text-6xl text-green-600">
                verified_user
              </span>
            </div>
            <p className="text-gray-500 font-medium text-sm uppercase tracking-wider">
              Compliance Rate
            </p>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-gray-900 dark:text-white">
                {stats.complianceRate}%
              </span>
              <span className="text-gray-400 text-sm font-medium mb-1">
                Target: 98%
              </span>
            </div>
          </div>
          <div className="bg-white dark:bg-[#1a202c] p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col justify-between h-32 relative overflow-hidden group">
            <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="material-symbols-outlined text-6xl text-orange-500">
                warning
              </span>
            </div>
            <p className="text-gray-500 font-medium text-sm uppercase tracking-wider">
              Upcoming Expirations
            </p>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-gray-900 dark:text-white">
                {stats.upcomingExpirations}
              </span>
              <span className="text-orange-600 text-sm font-medium mb-1 flex items-center bg-orange-50 dark:bg-orange-900/30 px-2 py-0.5 rounded-full">
                Next 30 days
              </span>
            </div>
          </div>
        </div>

        {/* Filters & Search Toolbar */}
        <div className="bg-white dark:bg-[#1a202c] p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col xl:flex-row gap-4 items-center justify-between">
          <div className="flex flex-1 w-full xl:w-auto gap-4 items-center">
            <div className="relative w-full max-w-md">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <span className="material-symbols-outlined text-[20px]">
                  search
                </span>
              </span>
              <input
                className="block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 py-2.5 pl-10 pr-4 text-sm focus:border-primary focus:ring-primary dark:text-white"
                placeholder="Search by vessel, client, or contract ID..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="hidden md:flex items-center gap-2 border-l border-gray-200 dark:border-gray-600 pl-4">
              <button className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">
                  filter_list
                </span>
                Filter
              </button>
              <button className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">
                  sort
                </span>
                Sort
              </button>
            </div>
          </div>
          <div className="flex gap-2 w-full xl:w-auto overflow-x-auto pb-2 xl:pb-0">
            <button
              onClick={() => setActiveFilter("all")}
              className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-medium shadow-sm ${
                activeFilter === "all"
                  ? "bg-primary text-white"
                  : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
            >
              All Contracts
            </button>
            <button
              onClick={() => setActiveFilter("active")}
              className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-medium ${
                activeFilter === "active"
                  ? "bg-primary text-white shadow-sm"
                  : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
            >
              Active ({contracts.filter((c) => c.status === "active").length})
            </button>
            <button
              onClick={() => setActiveFilter("pending")}
              className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-medium ${
                activeFilter === "pending"
                  ? "bg-primary text-white shadow-sm"
                  : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
            >
              Pending Review (
              {contracts.filter((c) => c.status === "pending").length})
            </button>
            <button
              onClick={() => setActiveFilter("renewal")}
              className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-medium ${
                activeFilter === "renewal"
                  ? "bg-primary text-white shadow-sm"
                  : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
            >
              Renewal Due (
              {contracts.filter((c) => c.status === "renewal-due").length})
            </button>
          </div>
        </div>

        {/* Split View: Contract Table and Detail View */}
        <div className="flex flex-col xl:flex-row gap-6 min-h-[600px]">
          {/* Left Panel: Contracts Table */}
          <div className="flex-1 bg-white dark:bg-[#1a202c] rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col overflow-hidden">
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 dark:bg-gray-800/50 sticky top-0 z-10 border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Vessel / Operation
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Client
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Duration
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">
                      Crew
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
                  {filteredContracts.map((contract) => (
                    <tr
                      key={contract.id}
                      onClick={() => setSelectedContract(contract)}
                      className={`hover:bg-[#fdf2f2] dark:hover:bg-primary/5 cursor-pointer transition-colors ${
                        selectedContract?.id === contract.id
                          ? "bg-[#fdf2f2]/50 dark:bg-primary/5 border-l-4 border-l-primary"
                          : "border-l-4 border-l-transparent"
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="h-10 w-10 rounded-lg bg-gray-200 bg-cover bg-center"
                            style={{
                              backgroundImage: `url("${contract.vesselImage}")`,
                            }}
                          ></div>
                          <div>
                            <p className="text-sm font-bold text-gray-900 dark:text-white">
                              {contract.vesselName}
                            </p>
                            <p className="text-xs text-gray-500">
                              {contract.vesselType} • {contract.vesselImo}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                        {contract.client}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1 w-32">
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>{contract.startDate}</span>
                            <span>{contract.progress}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                contract.status === "renewal-due"
                                  ? "bg-orange-500"
                                  : "bg-primary"
                              }`}
                              style={{ width: `${contract.progress}%` }}
                            ></div>
                          </div>
                          <span
                            className={`text-xs ${
                              contract.status === "renewal-due"
                                ? "text-orange-600 font-medium"
                                : "text-gray-400"
                            }`}
                          >
                            {contract.status === "renewal-due"
                              ? "Expiring Soon"
                              : `Ends ${contract.endDate}`}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {getCrewBadge(
                          contract.crewAssigned,
                          contract.crewTotal
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(contract.status)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-gray-400 hover:text-primary p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
                          <span className="material-symbols-outlined">
                            more_vert
                          </span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex justify-between items-center">
              <span className="text-xs text-gray-500">
                Showing 1-{filteredContracts.length} of {contracts.length}{" "}
                contracts
              </span>
              <div className="flex gap-2">
                <button
                  className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 disabled:opacity-50"
                  disabled
                >
                  <span className="material-symbols-outlined text-[18px]">
                    chevron_left
                  </span>
                </button>
                <button className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500">
                  <span className="material-symbols-outlined text-[18px]">
                    chevron_right
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Panel: Contract Details */}
          {selectedContract && (
            <div className="w-full xl:w-[480px] bg-white dark:bg-[#1a202c] rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg flex flex-col overflow-hidden">
              {/* Header */}
              <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/30">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary mb-2">
                      Selected Contract
                    </span>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {selectedContract.vesselName}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Ref: {selectedContract.refId}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:text-primary shadow-sm">
                      <span className="material-symbols-outlined text-[20px]">
                        edit_document
                      </span>
                    </button>
                    <button
                      onClick={() => setSelectedContract(null)}
                      className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:text-primary shadow-sm"
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        close
                      </span>
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                    <p className="text-gray-500 text-xs mb-1">Scope</p>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">
                      {selectedContract.scope}
                    </p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                    <p className="text-gray-500 text-xs mb-1">Manning Agent</p>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">
                      {selectedContract.manningAgent}
                    </p>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-gray-200 dark:border-gray-700 px-6">
                <button
                  onClick={() => setActiveTab("crew")}
                  className={`px-4 py-3 text-sm font-medium ${
                    activeTab === "crew"
                      ? "text-primary border-b-2 border-primary"
                      : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  }`}
                >
                  Crew Roster ({selectedContract.crewAssigned})
                </button>
                <button
                  onClick={() => setActiveTab("documents")}
                  className={`px-4 py-3 text-sm font-medium ${
                    activeTab === "documents"
                      ? "text-primary border-b-2 border-primary"
                      : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  }`}
                >
                  Documents
                </button>
                <button
                  onClick={() => setActiveTab("financials")}
                  className={`px-4 py-3 text-sm font-medium ${
                    activeTab === "financials"
                      ? "text-primary border-b-2 border-primary"
                      : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  }`}
                >
                  Financials
                </button>
              </div>

              {/* Crew List */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-bold text-gray-900 dark:text-white text-sm">
                    Onboard Crew
                  </h4>
                  <button
                    onClick={handleManageRoster}
                    className="text-xs text-primary font-bold hover:underline"
                  >
                    Manage Roster
                  </button>
                </div>
                <div className="space-y-4">
                  {selectedContract.crew.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div
                            className="h-10 w-10 rounded-full bg-gray-200 bg-center bg-cover"
                            style={{
                              backgroundImage: `url("${member.avatar}")`,
                            }}
                          ></div>
                          {member.status === "onboard" && (
                            <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900 dark:text-white">
                            {member.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {member.role} • Since {member.joinDate}
                          </p>
                        </div>
                      </div>
                      {member.status === "rotation-due" ? (
                        <div className="text-right">
                          <span className="block text-xs font-semibold text-orange-600 bg-orange-50 dark:bg-orange-900/20 px-2 py-0.5 rounded">
                            Rotation Due
                          </span>
                          <span className="text-[10px] text-gray-400">
                            {member.daysLeft} days left
                          </span>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <button
                            className="p-1.5 text-gray-400 hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                            title="View Profile"
                          >
                            <span className="material-symbols-outlined text-[18px]">
                              visibility
                            </span>
                          </button>
                          <button
                            className="p-1.5 text-gray-400 hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                            title="Message"
                          >
                            <span className="material-symbols-outlined text-[18px]">
                              chat
                            </span>
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                  {selectedContract.crew.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                      <span className="material-symbols-outlined text-4xl mb-2">
                        group_off
                      </span>
                      <p className="text-sm">No crew assigned yet</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer Actions */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 grid grid-cols-2 gap-3">
                <button
                  onClick={handleDemobilize}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Demobilize Crew
                </button>
                <button
                  onClick={handleReassign}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-bold shadow-md transition-colors"
                >
                  Reassign Crew
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
