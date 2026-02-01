"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AdminProfile from "../../../components/AdminProfile";

interface CompanyData {
  user_id: number;
  email: string;
  user_type: "ship_owner" | "manning_agent";
  is_verified: boolean;
  is_approved: boolean;
  company: {
    name: string;
    imo_number: string | null;
    website: string | null;
    hq_address: string;
    vessel_types: string[];
    fleet_size: string;
    primary_trading_area: string;
    contact_full_name: string;
    contact_role: string;
    contact_email: string;
    contact_phone: string;
    documents: Array<{
      id: number;
      file_name: string;
      file_url: string;
      doc_index: number;
      uploaded_at: string;
    }>;
  };
}

// Keep the existing Entity interface for UI compatibility
interface Entity {
  id: string;
  name: string;
  website: string;
  type: "owner" | "agent";
  idCode: string;
  location: string;
  country: string;
  activeContracts: number;
  maxContracts: number;
  status: "active" | "suspended" | "pending";
  logo: string;
  email: string;
  phone: string;
  address: string;
}

interface Contract {
  id: string;
  vesselName: string;
  vesselType: string;
  imo: string;
  duration: string;
  status: "active" | "pending" | "completed";
  crewCount: number;
}

export default function AdminShipOwnersPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null);
  const [activeTab, setActiveTab] = useState<
    "overview" | "contracts" | "history"
  >("overview");

  const [entities, setEntities] = useState<Entity[]>([]);

  useEffect(() => {
    let mounted = true;

    // Fetch companies data from the new endpoint
    fetch("/api/v1/admin/companies")
      .then(async (res) => {
        if (!res.ok) return [];
        const companiesData: CompanyData[] = await res.json();

        // Transform to Entity format for UI compatibility
        const transformedEntities: Entity[] = companiesData.map((company) => ({
          id: company.user_id.toString(),
          name: company.company.name,
          website: company.company.website || '',
          type: company.user_type === 'ship_owner' ? 'owner' : 'agent',
          idCode: company.company.imo_number || company.user_id.toString(),
          location: company.company.hq_address.split(',')[0] || 'Unknown',
          country: 'NG', // Default for now
          activeContracts: 0, // We'll need to calculate this from actual contract data
          maxContracts: 10, // Default max
          status: company.is_approved ? 'active' : company.is_verified ? 'pending' : 'pending',
          logo: '', // Could use a default logo
          email: company.email,
          phone: company.company.contact_phone,
          address: company.company.hq_address,
        }));

        return transformedEntities;
      })
      .then((data) => {
        if (!mounted) return;
        setEntities(Array.isArray(data) ? data : []);
      })
      .catch((error) => {
        console.error('Failed to fetch companies:', error);
        if (!mounted) return;
        setEntities([]);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const recentContract: Contract = {
    id: "CON-4921",
    vesselName: "MV Atlantic Star",
    vesselType: "Container Ship",
    imo: "934521",
    duration: "Jan 01 - Jun 01, 2024",
    status: "active",
    crewCount: 4,
  };

  // Filter entities
  const filteredEntities = entities.filter((entity) => {
    const matchesSearch =
      entity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entity.idCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entity.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !statusFilter || entity.status === statusFilter;
    const matchesType = !typeFilter || entity.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  // Stats
  const stats = {
    total: entities.length,
    active: entities.filter((e) => e.status === "active").length,
    activeContracts: entities.reduce((sum, e) => sum + e.activeContracts, 0),
    pendingCrew: 12,
    suspended: entities.filter((e) => e.status === "suspended").length,
  };

  const handleLogout = () => {
    localStorage.removeItem("crew-manning-user");
    localStorage.removeItem("crew-manning-token");
    localStorage.removeItem("crew-manning-profile");
    router.push("/admin/login");
  };

  const handleAddEntity = () => {
    alert("Add New Entity modal would open here");
  };

  const handleEditEntity = (entity: Entity) => {
    alert(`Edit ${entity.name}`);
  };

  const handleSuspendEntity = (entity: Entity) => {
    if (confirm(`Are you sure you want to suspend ${entity.name}?`)) {
      alert(`${entity.name} has been suspended`);
    }
  };

  const handleExport = () => {
    alert("Exporting data...");
  };

  const handleManageCrew = () => {
    alert("Opening crew management...");
  };

  const handleAssignSeafarer = (name: string) => {
    alert(`Assigning ${name} to vessel`);
  };

  return (
    <div className="flex min-h-screen w-full overflow-hidden bg-background-light dark:bg-background-dark text-[#0e121b] dark:text-white">
      {/* Sidebar */}
      <aside className="w-20 lg:w-64 flex-shrink-0 border-r border-[#d1d8e6] dark:border-[#2d3748] bg-white dark:bg-[#1a202c] flex flex-col justify-between transition-all duration-300">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-4 lg:p-6 flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-lg">
              <span className="material-symbols-outlined text-primary dark:text-red-400 text-2xl">
                anchor
              </span>
            </div>
            <div className="hidden lg:flex flex-col">
              <h1 className="text-base font-bold leading-none tracking-tight">
                PortCommand
              </h1>
              <span className="text-xs text-[#506795] dark:text-[#94a3b8] mt-1">
                Admin Portal
              </span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            <Link
              href="/admin/dashboard"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#506795] dark:text-[#94a3b8] hover:bg-[#f6f6f8] dark:hover:bg-[#111621]/50 hover:text-primary dark:hover:text-red-400 transition-colors group"
            >
              <span className="material-symbols-outlined group-hover:text-primary dark:group-hover:text-red-400">
                dashboard
              </span>
              <span className="hidden lg:block text-sm font-medium">
                Dashboard
              </span>
            </Link>
            <Link
              href="/admin/shipowners"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary/10 text-primary dark:text-red-400 transition-colors"
            >
              <span className="material-symbols-outlined">domain</span>
              <span className="hidden lg:block text-sm font-bold">
                Ship Owners / Agents
              </span>
            </Link>
            <Link
              href="/admin/seafarers"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#506795] dark:text-[#94a3b8] hover:bg-[#f6f6f8] dark:hover:bg-[#111621]/50 hover:text-primary dark:hover:text-red-400 transition-colors group"
            >
              <span className="material-symbols-outlined group-hover:text-primary dark:group-hover:text-red-400">
                groups
              </span>
              <span className="hidden lg:block text-sm font-medium">
                Seafarers
              </span>
            </Link>
            <Link
              href="/admin/contracts"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#506795] dark:text-[#94a3b8] hover:bg-[#f6f6f8] dark:hover:bg-[#111621]/50 hover:text-primary dark:hover:text-red-400 transition-colors group"
            >
              <span className="material-symbols-outlined group-hover:text-primary dark:group-hover:text-red-400">
                description
              </span>
              <span className="hidden lg:block text-sm font-medium">
                Contracts
              </span>
            </Link>
            <Link
              href="/admin/interviews"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#506795] dark:text-[#94a3b8] hover:bg-[#f6f6f8] dark:hover:bg-[#111621]/50 hover:text-primary dark:hover:text-red-400 transition-colors group"
            >
              <span className="material-symbols-outlined group-hover:text-primary dark:group-hover:text-red-400">
                event_available
              </span>
              <span className="hidden lg:block text-sm font-medium">
                Interviews
              </span>
            </Link>
            <Link
              href="/admin/crew-management"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#506795] dark:text-[#94a3b8] hover:bg-[#f6f6f8] dark:hover:bg-[#111621]/50 hover:text-primary dark:hover:text-red-400 transition-colors group"
            >
              <span className="material-symbols-outlined group-hover:text-primary dark:group-hover:text-red-400">
                work
              </span>
              <span className="hidden lg:block text-sm font-medium">
                Full Crew Mgmt
              </span>
            </Link>
            <Link
              href="/admin/one-off-crew"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#506795] dark:text-[#94a3b8] hover:bg-[#f6f6f8] dark:hover:bg-[#111621]/50 hover:text-primary dark:hover:text-red-400 transition-colors group"
            >
              <span className="material-symbols-outlined group-hover:text-primary dark:group-hover:text-red-400">
                assignment_ind
              </span>
              <span className="hidden lg:block text-sm font-medium">
                One-Off Crew
              </span>
            </Link>

            <div className="pt-4 mt-4 border-t border-[#d1d8e6] dark:border-[#2d3748]">
              <p className="px-3 text-xs font-semibold text-[#506795] dark:text-[#94a3b8] uppercase tracking-wider hidden lg:block mb-2">
                Settings
              </p>
              <Link
                href="#"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#506795] dark:text-[#94a3b8] hover:bg-[#f6f6f8] dark:hover:bg-[#111621]/50 hover:text-primary dark:hover:text-red-400 transition-colors group"
              >
                <span className="material-symbols-outlined group-hover:text-primary dark:group-hover:text-red-400">
                  settings
                </span>
                <span className="hidden lg:block text-sm font-medium">
                  Configuration
                </span>
              </Link>
            </div>
          </nav>

          {/* User Profile */}
          <AdminProfile />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-6 bg-white dark:bg-[#1a202c] border-b border-[#d1d8e6] dark:border-[#2d3748] shrink-0 z-20">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold tracking-tight">
              Ship Owners &amp; Agents
            </h2>
            <span className="hidden sm:inline-block h-4 w-px bg-[#d1d8e6] dark:border-[#2d3748]"></span>
            <nav className="hidden sm:flex text-sm text-[#506795] dark:text-[#94a3b8]">
              <Link
                href="/admin/dashboard"
                className="hover:text-primary dark:hover:text-red-400 cursor-pointer"
              >
                Admin
              </Link>
              <span className="mx-2">/</span>
              <span className="font-medium text-[#0e121b] dark:text-white">
                Entities
              </span>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 text-[#506795] dark:text-[#94a3b8] hover:bg-[#f6f6f8] dark:hover:bg-[#111621] rounded-full transition-colors relative">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border border-white dark:border-[#1a202c]"></span>
            </button>
            <button
              onClick={handleAddEntity}
              className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-colors"
            >
              <span className="material-symbols-outlined text-lg">add</span>
              <span className="hidden sm:inline">Add New Entity</span>
            </button>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-[1400px] mx-auto flex flex-col gap-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-[#1a202c] p-5 rounded-xl border border-[#d1d8e6] dark:border-[#2d3748] shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-[#506795] dark:text-[#94a3b8]">
                      Total Entities
                    </p>
                    <h3 className="text-2xl font-bold mt-1">{stats.total}</h3>
                  </div>
                  <div className="p-2 bg-primary/10 dark:bg-primary/20 text-primary dark:text-red-400 rounded-lg">
                    <span className="material-symbols-outlined">domain</span>
                  </div>
                </div>
                <p className="text-xs text-green-600 font-medium mt-3 flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">
                    trending_up
                  </span>{" "}
                  +5% from last month
                </p>
              </div>

              <div className="bg-white dark:bg-[#1a202c] p-5 rounded-xl border border-[#d1d8e6] dark:border-[#2d3748] shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-[#506795] dark:text-[#94a3b8]">
                      Active Contracts
                    </p>
                    <h3 className="text-2xl font-bold mt-1">
                      {stats.activeContracts}
                    </h3>
                  </div>
                  <div className="p-2 bg-primary/10 dark:bg-primary/20 text-primary dark:text-red-400 rounded-lg">
                    <span className="material-symbols-outlined">
                      assignment_turned_in
                    </span>
                  </div>
                </div>
                <p className="text-xs text-green-600 font-medium mt-3 flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">
                    trending_up
                  </span>{" "}
                  +12% active growth
                </p>
              </div>

              <div className="bg-white dark:bg-[#1a202c] p-5 rounded-xl border border-[#d1d8e6] dark:border-[#2d3748] shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-[#506795] dark:text-[#94a3b8]">
                      Pending Crew
                    </p>
                    <h3 className="text-2xl font-bold mt-1">
                      {stats.pendingCrew}
                    </h3>
                  </div>
                  <div className="p-2 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 rounded-lg">
                    <span className="material-symbols-outlined">
                      person_search
                    </span>
                  </div>
                </div>
                <p className="text-xs text-red-500 font-medium mt-3 flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">
                    priority_high
                  </span>{" "}
                  Needs attention
                </p>
              </div>

              <div className="bg-white dark:bg-[#1a202c] p-5 rounded-xl border border-[#d1d8e6] dark:border-[#2d3748] shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-[#506795] dark:text-[#94a3b8]">
                      Suspended
                    </p>
                    <h3 className="text-2xl font-bold mt-1">
                      {stats.suspended}
                    </h3>
                  </div>
                  <div className="p-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg">
                    <span className="material-symbols-outlined">block</span>
                  </div>
                </div>
                <p className="text-xs text-[#506795] dark:text-[#94a3b8] mt-3">
                  Requires compliance check
                </p>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white dark:bg-[#1a202c] p-4 rounded-xl border border-[#d1d8e6] dark:border-[#2d3748] shadow-sm">
              <div className="flex flex-1 w-full gap-3">
                <div className="relative flex-1 max-w-md">
                  <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#506795] dark:text-[#94a3b8] text-xl">
                    search
                  </span>
                  <input
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[#d1d8e6] dark:border-[#2d3748] bg-[#f6f6f8] dark:bg-[#111621]/50 text-[#0e121b] dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary placeholder:text-[#506795] dark:placeholder:text-[#94a3b8]"
                    placeholder="Search by Name, ID, or Location..."
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="relative hidden md:block w-48">
                  <select
                    className="w-full pl-3 pr-8 py-2.5 rounded-lg border border-[#d1d8e6] dark:border-[#2d3748] bg-[#f6f6f8] dark:bg-[#111621]/50 text-[#0e121b] dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary appearance-none cursor-pointer"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="suspended">Suspended</option>
                    <option value="pending">Pending</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-2.5 top-2.5 text-[#506795] pointer-events-none">
                    expand_more
                  </span>
                </div>
                <div className="relative hidden md:block w-48">
                  <select
                    className="w-full pl-3 pr-8 py-2.5 rounded-lg border border-[#d1d8e6] dark:border-[#2d3748] bg-[#f6f6f8] dark:bg-[#111621]/50 text-[#0e121b] dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary appearance-none cursor-pointer"
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                  >
                    <option value="">All Types</option>
                    <option value="owner">Ship Owner</option>
                    <option value="agent">Manning Agent</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-2.5 top-2.5 text-[#506795] pointer-events-none">
                    expand_more
                  </span>
                </div>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <button className="md:hidden flex items-center justify-center p-2.5 rounded-lg border border-[#d1d8e6] dark:border-[#2d3748] bg-white dark:bg-[#1a202c] text-[#506795] hover:text-primary dark:hover:text-red-400 transition-colors">
                  <span className="material-symbols-outlined">filter_list</span>
                </button>
                <button
                  onClick={handleExport}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[#d1d8e6] dark:border-[#2d3748] bg-white dark:bg-[#1a202c] text-[#0e121b] dark:text-white text-sm font-medium hover:bg-[#f6f6f8] dark:hover:bg-[#111621] transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">
                    download
                  </span>
                  <span className="hidden sm:inline">Export</span>
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-[#1a202c] rounded-xl border border-[#d1d8e6] dark:border-[#2d3748] shadow-sm overflow-hidden flex flex-col">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#f6f6f8] dark:bg-[#111621]/30 border-b border-[#d1d8e6] dark:border-[#2d3748]">
                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[#506795] dark:text-[#94a3b8] w-[280px]">
                        Entity Name
                      </th>
                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[#506795] dark:text-[#94a3b8] w-[120px]">
                        Type
                      </th>
                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[#506795] dark:text-[#94a3b8] w-[120px]">
                        ID Code
                      </th>
                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[#506795] dark:text-[#94a3b8] w-[180px]">
                        Location
                      </th>
                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[#506795] dark:text-[#94a3b8]">
                        Active Contracts
                      </th>
                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[#506795] dark:text-[#94a3b8] w-[120px]">
                        Status
                      </th>
                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[#506795] dark:text-[#94a3b8] text-right w-[100px]">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#d1d8e6] dark:divide-[#2d3748] text-sm">
                    {filteredEntities.map((entity) => (
                      <tr
                        key={entity.id}
                        onClick={() => setSelectedEntity(entity)}
                        className={`group hover:bg-[#f6f6f8] dark:hover:bg-[#111621]/50 transition-colors cursor-pointer ${
                          selectedEntity?.id === entity.id
                            ? "bg-primary/5 border-l-4 border-l-primary"
                            : ""
                        }`}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className="size-10 rounded-lg bg-gray-200 dark:bg-gray-700 bg-cover bg-center shrink-0"
                              style={{
                                backgroundImage: `url('${entity.logo}')`,
                              }}
                            ></div>
                            <div>
                              <p className="font-semibold">{entity.name}</p>
                              <p className="text-xs text-[#506795] dark:text-[#94a3b8]">
                                {entity.website}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              entity.type === "owner"
                                ? "bg-primary/10 text-primary dark:bg-primary/20 dark:text-red-300"
                                : "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
                            }`}
                          >
                            {entity.type === "owner" ? "Owner" : "Agent"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-[#506795] dark:text-[#94a3b8] font-mono">
                          {entity.idCode}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-base text-[#506795]">
                              location_on
                            </span>
                            {entity.location}, {entity.country}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full w-24 overflow-hidden">
                              <div
                                className="h-full bg-primary rounded-full"
                                style={{
                                  width: `${
                                    (entity.activeContracts /
                                      entity.maxContracts) *
                                    100
                                  }%`,
                                }}
                              ></div>
                            </div>
                            <span className="text-xs font-medium">
                              {entity.activeContracts} Active
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border border-transparent ${
                              entity.status === "active"
                                ? "bg-primary/10 text-primary dark:bg-primary/20 dark:text-red-300"
                                : entity.status === "suspended"
                                ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                                : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                            }`}
                          >
                            <span
                              className={`size-1.5 rounded-full ${
                                entity.status === "active"
                                  ? "bg-primary dark:bg-red-400"
                                  : entity.status === "suspended"
                                  ? "bg-red-600 dark:bg-red-400"
                                  : "bg-yellow-600 dark:bg-yellow-400"
                              }`}
                            ></span>
                            {entity.status.charAt(0).toUpperCase() +
                              entity.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="text-[#506795] hover:text-primary dark:hover:text-red-400 transition-colors p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
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

              {/* Pagination */}
              <div className="flex items-center justify-between px-6 py-4 border-t border-[#d1d8e6] dark:border-[#2d3748] bg-[#f6f6f8] dark:bg-[#111621]/30">
                <p className="text-sm text-[#506795] dark:text-[#94a3b8]">
                  Showing{" "}
                  <span className="font-medium text-[#0e121b] dark:text-white">
                    1
                  </span>{" "}
                  to{" "}
                  <span className="font-medium text-[#0e121b] dark:text-white">
                    {filteredEntities.length}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium text-[#0e121b] dark:text-white">
                    {entities.length}
                  </span>{" "}
                  results
                </p>
                <div className="flex items-center gap-2">
                  <button className="p-2 rounded-md border border-[#d1d8e6] dark:border-[#2d3748] text-[#506795] hover:bg-[#f6f6f8] dark:hover:bg-[#111621]/50 disabled:opacity-50">
                    <span className="material-symbols-outlined text-sm">
                      chevron_left
                    </span>
                  </button>
                  <button className="p-2 rounded-md border border-[#d1d8e6] dark:border-[#2d3748] text-[#506795] hover:bg-[#f6f6f8] dark:hover:bg-[#111621]/50">
                    <span className="material-symbols-outlined text-sm">
                      chevron_right
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Details Panel */}
      {selectedEntity && (
        <div className="hidden xl:flex w-[480px] bg-white dark:bg-[#1a202c] border-l border-[#d1d8e6] dark:border-[#2d3748] flex-col shadow-2xl z-30 shrink-0 h-full">
          {/* Panel Header */}
          <div className="p-6 border-b border-[#d1d8e6] dark:border-[#2d3748] flex flex-col gap-4">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div
                  className="size-14 rounded-xl bg-gray-200 dark:bg-gray-700 bg-cover bg-center shadow-inner"
                  style={{ backgroundImage: `url('${selectedEntity.logo}')` }}
                ></div>
                <div>
                  <h3 className="text-lg font-bold">{selectedEntity.name}</h3>
                  <p className="text-sm text-[#506795] dark:text-[#94a3b8] flex items-center gap-1">
                    <span
                      className={`inline-block size-2 rounded-full ${
                        selectedEntity.status === "active"
                          ? "bg-primary"
                          : "bg-red-500"
                      }`}
                    ></span>
                    {selectedEntity.status === "active"
                      ? "Active Entity"
                      : "Suspended Entity"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedEntity(null)}
                className="text-[#506795] hover:text-primary dark:hover:text-red-400 transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab("overview")}
                className={`flex-1 py-2 text-sm font-medium border-b-2 ${
                  activeTab === "overview"
                    ? "border-primary text-primary dark:text-red-400"
                    : "border-transparent text-[#506795] hover:text-[#0e121b] dark:hover:text-white"
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab("contracts")}
                className={`flex-1 py-2 text-sm font-medium border-b-2 ${
                  activeTab === "contracts"
                    ? "border-primary text-primary dark:text-red-400"
                    : "border-transparent text-[#506795] hover:text-[#0e121b] dark:hover:text-white"
                }`}
              >
                Contracts
              </button>
              <button
                onClick={() => setActiveTab("history")}
                className={`flex-1 py-2 text-sm font-medium border-b-2 ${
                  activeTab === "history"
                    ? "border-primary text-primary dark:text-red-400"
                    : "border-transparent text-[#506795] hover:text-[#0e121b] dark:hover:text-white"
                }`}
              >
                History
              </button>
            </div>
          </div>

          {/* Panel Content */}
          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleEditEntity(selectedEntity)}
                className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg border border-[#d1d8e6] dark:border-[#2d3748] bg-[#f6f6f8] dark:bg-[#111621]/50 text-[#0e121b] dark:text-white text-sm font-medium hover:border-primary hover:text-primary dark:hover:text-red-400 dark:hover:border-red-400 transition-all"
              >
                <span className="material-symbols-outlined text-lg">edit</span>{" "}
                Edit Details
              </button>
              <button
                onClick={() => handleSuspendEntity(selectedEntity)}
                className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg border border-[#d1d8e6] dark:border-[#2d3748] bg-[#f6f6f8] dark:bg-[#111621]/50 text-red-600 dark:text-red-400 text-sm font-medium hover:border-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all"
              >
                <span className="material-symbols-outlined text-lg">block</span>{" "}
                Suspend
              </button>
            </div>

            {/* Recent Contract */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-sm font-bold uppercase tracking-wider text-[#506795]">
                  Recent Contract
                </h4>
                <button className="text-primary dark:text-red-400 text-sm font-medium hover:underline">
                  View All
                </button>
              </div>
              <div className="bg-[#f6f6f8] dark:bg-[#111621]/30 rounded-xl p-4 border border-[#d1d8e6] dark:border-[#2d3748]">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-xs text-[#506795] dark:text-[#94a3b8]">
                      Contract ID
                    </p>
                    <p className="text-sm font-mono font-medium">
                      #{recentContract.id}
                    </p>
                  </div>
                  <span className="px-2 py-1 bg-primary/10 text-primary dark:bg-primary/20 dark:text-red-300 text-xs font-bold rounded">
                    Active
                  </span>
                </div>
                <div className="flex items-center gap-3 mb-4 p-3 bg-white dark:bg-[#1a202c] rounded-lg border border-[#d1d8e6] dark:border-[#2d3748]">
                  <div className="bg-primary/10 dark:bg-primary/20 p-2 rounded text-primary dark:text-red-400">
                    <span className="material-symbols-outlined">
                      directions_boat
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-bold">
                      {recentContract.vesselName}
                    </p>
                    <p className="text-xs text-[#506795] dark:text-[#94a3b8]">
                      {recentContract.vesselType} • IMO {recentContract.imo}
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#506795] dark:text-[#94a3b8]">
                      Duration
                    </span>
                    <span className="font-medium">
                      {recentContract.duration}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm items-center">
                    <span className="text-[#506795] dark:text-[#94a3b8]">
                      Assigned Crew
                    </span>
                    <div className="flex -space-x-2">
                      <div className="size-6 rounded-full border border-white dark:border-[#1a202c] bg-gray-300 dark:bg-gray-600"></div>
                      <div className="size-6 rounded-full border border-white dark:border-[#1a202c] bg-gray-300 dark:bg-gray-600"></div>
                      <div className="size-6 rounded-full border border-white dark:border-[#1a202c] bg-primary text-white flex items-center justify-center text-[10px] font-bold">
                        +{recentContract.crewCount - 2}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-[#d1d8e6] dark:border-[#2d3748] flex gap-2">
                  <button
                    onClick={handleManageCrew}
                    className="flex-1 bg-primary text-white py-2 rounded-lg text-sm font-bold shadow hover:bg-primary/90 transition-colors"
                  >
                    Manage Crew
                  </button>
                  <button className="px-3 py-2 rounded-lg border border-[#d1d8e6] dark:border-[#2d3748] bg-white dark:bg-[#1a202c] hover:bg-[#f6f6f8] transition-colors">
                    <span className="material-symbols-outlined text-lg">
                      edit_calendar
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Assign */}
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-[#506795] mb-3">
                Quick Assign
              </h4>
              <div className="bg-primary/5 rounded-xl p-4 border border-primary/20">
                <p className="text-sm mb-3">
                  Find available seafarer for{" "}
                  <span className="font-bold">{recentContract.vesselName}</span>
                </p>
                <div className="relative mb-3">
                  <input
                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-[#d1d8e6] dark:border-[#2d3748] bg-white dark:bg-[#1a202c] text-sm focus:ring-primary focus:border-primary"
                    placeholder="Search by name or rank..."
                    type="text"
                  />
                  <span className="material-symbols-outlined absolute left-2.5 top-2 text-[#506795] text-lg">
                    search
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-[#1a202c] border border-[#d1d8e6] dark:border-[#2d3748] mb-2">
                  <div className="flex items-center gap-2">
                    <div
                      className="size-8 rounded-full bg-gray-200 dark:bg-gray-700 bg-cover"
                      style={{
                        backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuBepm3Lej9Iq-vI-cn-5_vTOj5LCUfCTCqZUIkeN0F-tWmuGe8u0trMyix4Lm8HULqa5y30qIfgx75W8-dwCQWMmMkLs5jfTVThmwYIyrk7F7okeZJM9FB0WPhT5k5OTeSF9lSOwrX7ByJQ2W6y59WGUYv2T_3UMUBvxWd8HYZ4HHQxlqWIBg-db8kjTZg_sYq7auwuBWvl7rbfSLFX61PQiKNyFRpHVi_tFf65cRaGd11xi8kbw32AuRijEQaOr7rfuRyv_nKK1_5f')`,
                      }}
                    ></div>
                    <div>
                      <p className="text-xs font-bold">John Doe</p>
                      <p className="text-[10px] text-[#506795] dark:text-[#94a3b8]">
                        Chief Mate • Available
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleAssignSeafarer("John Doe")}
                    className="text-xs font-bold text-primary dark:text-red-400 hover:underline"
                  >
                    Assign
                  </button>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-[#506795] mb-3">
                Contact Information
              </h4>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#506795]">
                    mail
                  </span>
                  <a
                    href={`mailto:${selectedEntity.email}`}
                    className="text-primary dark:text-red-400 hover:underline"
                  >
                    {selectedEntity.email}
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#506795]">
                    call
                  </span>
                  <span>{selectedEntity.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#506795]">
                    domain
                  </span>
                  <span>{selectedEntity.address}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Panel Footer */}
          <div className="p-4 border-t border-[#d1d8e6] dark:border-[#2d3748] bg-[#f6f6f8] dark:bg-[#111621]/30">
            <p className="text-xs text-center text-[#506795] dark:text-[#94a3b8]">
              Last updated by Admin on May 12, 2024
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
