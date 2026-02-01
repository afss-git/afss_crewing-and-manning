"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AdminProfile from "../../../components/AdminProfile";

// Define TypeScript interfaces for our data
interface Document {
  id: number;
  file_name: string;
  doc_type: string;
  status: "pending" | "approved" | "rejected";
  file_url: string;
  created_at: string;
  admin_notes: string | null;
  verified_at: string | null;
  verified_by: number | null;
}

interface ApiSeafarer {
  user_id: number;
  email: string;
  first_name: string | null;
  last_name: string | null;
  rank: string | null;
  years_of_experience: number | null;
  is_approved: boolean;
}

interface Seafarer {
  id: string;
  name: string;
  email: string;
  position: string;
  date: string;
  status: string;
  rank: string | null;
  years_of_experience: number | null;
  is_approved: boolean;
  avatar?: string;
}

interface Deployment {
  id: string;
  vesselName: string;
  status: string;
  location: string;
  crewCount: number;
}

interface Stats {
  totalSeafarers: number;
  newApplicants: number;
  verifiedSeafarers: number;
  shipOwners: number;
  activeContracts: number;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [allSeafarers, setAllSeafarers] = useState<Seafarer[]>([]);
  const [seafarers, setSeafarers] = useState<Seafarer[]>([]);
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalSeafarers: 0,
    newApplicants: 0,
    verifiedSeafarers: 0,
    shipOwners: 0,
    activeContracts: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");

  // Fetch admin data from API
  const fetchAdminData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get auth token from localStorage
      const token = localStorage.getItem("crew-manning-token");
      if (!token) {
        router.push("/admin/login");
        return;
      }

      // Fetch all seafarers from the new API
      const response = await fetch("/api/v1/admin/seafarers", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Token is invalid or expired - redirect to login
          localStorage.removeItem("crew-manning-token");
          localStorage.removeItem("crew-manning-user");
          router.push("/admin/login");
          return;
        }
        throw new Error(`Failed to fetch data: ${response.status}`);
      }

      const seafarersData = await response.json();
      console.log("Response status:", response.status);
      console.log("Seafarers data:", seafarersData);
      console.log("Number of seafarers returned:", seafarersData?.length || 0);

      // If no seafarers, show empty state
      if (!seafarersData || seafarersData.length === 0) {
        console.log("No seafarers found in API response");
        setAllSeafarers([]);
        setSeafarers([]);
        setStats({
          totalSeafarers: 0,
          newApplicants: 0,
          verifiedSeafarers: 0,
          shipOwners: 0,
          activeContracts: 0,
        });
        setLoading(false);
        return;
      }

      // Map the API response to our dashboard data structure
      const mappedSeafarers: Seafarer[] = seafarersData.map((seafarer: ApiSeafarer) => {
        // Determine status based on is_approved
        let status = "Pending";
        if (seafarer.is_approved === true) {
          status = "Approved";
        } else if (seafarer.is_approved === false) {
          status = "Pending";
        } else {
          status = "Rejected"; // For future when API supports rejected status
        }

        return {
          id: seafarer.user_id.toString(),
          name: `${seafarer.first_name || ""} ${seafarer.last_name || ""}`.trim() || "Unknown Seafarer",
          email: seafarer.email || "",
          position: seafarer.rank || "Not specified",
          date: new Date().toLocaleDateString(), // Since API doesn't provide date, use current date
          status: status,
          rank: seafarer.rank,
          years_of_experience: seafarer.years_of_experience,
          is_approved: seafarer.is_approved,
        };
      });

      // Calculate real stats from the data
      const calculatedStats = {
        totalSeafarers: mappedSeafarers.length,
        newApplicants: mappedSeafarers.filter((s: Seafarer) => s.status === "Pending").length,
        verifiedSeafarers: mappedSeafarers.filter((s: Seafarer) => s.status === "Approved").length,
        shipOwners: 0, // Would come from ship owners data if available
        activeContracts: 0, // Would come from contracts data if available
      };

      // For now, use sample deployments until we have a real deployments endpoint
      const sampleDeployments: Deployment[] = [
        {
          id: "1",
          vesselName: "MV Oceanic Star",
          status: "En Route",
          location: "Rotterdam → Singapore",
          crewCount: 24,
        },
        {
          id: "2",
          vesselName: "SS Pacific Voyager",
          status: "Docked",
          location: "Port of Shanghai",
          crewCount: 18,
        },
        {
          id: "3",
          vesselName: "LNG Titan",
          status: "Maintenance",
          location: "Dubai Drydocks",
          crewCount: 8,
        },
      ];

      console.log("Mapped Seafarers:", mappedSeafarers);
      console.log("Stats:", calculatedStats);

      setAllSeafarers(mappedSeafarers);
      // Initially show all seafarers
      setSeafarers(mappedSeafarers);
      setDeployments(sampleDeployments);
      setStats(calculatedStats);

    } catch (err) {
      console.error("Failed to fetch admin data:", err);
      setError(err instanceof Error ? err.message : "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  // Filter seafarers based on active filter
  const applyFilter = (filter: "all" | "pending" | "approved" | "rejected") => {
    setActiveFilter(filter);
    if (filter === "all") {
      setSeafarers(allSeafarers);
    } else if (filter === "pending") {
      setSeafarers(allSeafarers.filter(s => s.status === "Pending"));
    } else if (filter === "approved") {
      setSeafarers(allSeafarers.filter(s => s.status === "Approved"));
    } else if (filter === "rejected") {
      setSeafarers(allSeafarers.filter(s => s.status === "Rejected"));
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("crew-manning-token");
    localStorage.removeItem("crew-manning-user");
    router.push("/admin/login");
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchAdminData();
  }, [router]);

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem("crew-manning-token");
    if (!token) {
      router.push("/admin/login");
    }
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <span className="text-text-main-light dark:text-text-main-dark">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-md text-center">
          <h2 className="text-xl font-bold text-red-700 dark:text-red-300 mb-3">Error Loading Dashboard</h2>
          <p className="text-red-600 dark:text-red-200 mb-4">{error}</p>
          <button
            onClick={fetchAdminData}
            className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white antialiased">
      {/* Side Navigation */}
      <aside className="w-72 bg-surface-light dark:bg-surface-dark border-r border-slate-200 dark:border-slate-800 flex flex-col h-full hidden lg:flex">
        {/* Logo Area */}
        <div className="px-6 py-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center bg-primary text-white rounded-lg size-10 shadow-lg shadow-primary/30">
              <span className="material-symbols-outlined">anchor</span>
            </div>
            <div className="flex flex-col">
              <h1 className="text-slate-900 dark:text-white text-lg font-bold leading-none tracking-tight">CrewManager</h1>
              <p className="text-slate-500 dark:text-slate-400 text-xs font-medium mt-1">Admin Console</p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary/10 text-primary dark:text-primary-light group transition-colors"
          >
            <span className="material-symbols-outlined fill-1">dashboard</span>
            <span className="text-sm font-semibold">Dashboard</span>
          </Link>

          <div className="pt-4 pb-2 px-4">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Manning</p>
          </div>

          <Link
            href="/admin/seafarers"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <span className="material-symbols-outlined">groups</span>
            <span className="text-sm font-medium">Seafarers</span>
          </Link>

          <Link
            href="/admin/shipowners"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <span className="material-symbols-outlined">directions_boat</span>
            <span className="text-sm font-medium">Ship Owners / Agents</span>
          </Link>

          <Link
            href="/admin/contracts"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <span className="material-symbols-outlined">description</span>
            <span className="text-sm font-medium">Contracts</span>
          </Link>

          <Link
            href="/admin/interviews"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <span className="material-symbols-outlined">event_available</span>
            <span className="text-sm font-medium">Interviews</span>
          </Link>

          <Link
            href="/admin/crew-management"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <span className="material-symbols-outlined">work</span>
            <span className="text-sm font-medium">Full Crew Management</span>
          </Link>
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-1">
          <Link
            href="/admin/settings"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <span className="material-symbols-outlined">settings</span>
            <span className="text-sm font-medium">Settings</span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <span className="material-symbols-outlined">logout</span>
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>

        {/* User Profile Mini */}
        <AdminProfile />
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full bg-background-light dark:bg-background-dark overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-surface-light dark:bg-surface-dark border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-4">
            {/* Mobile Menu Toggle (Visible only on small screens) */}
            <button className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg">
              <span className="material-symbols-outlined">menu</span>
            </button>
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">Dashboard</h2>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-xl px-8 hidden md:block">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-slate-400">search</span>
              </div>
              <input
                className="block w-full pl-10 pr-3 py-2.5 border-none rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 sm:text-sm transition-all"
                placeholder="Search seafarers, vessels, or contracts..."
                type="text"
              />
            </div>
          </div>

          {/* Header Actions */}
          <div className="flex items-center gap-3">
            <button className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 shadow-sm shadow-primary/20 transition-colors">
              <span className="material-symbols-outlined text-[20px]">add</span>
              <span>Add Seafarer</span>
            </button>
            <button className="p-2 text-slate-500 hover:text-primary hover:bg-primary/5 rounded-full transition-colors relative">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
            </button>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-[1400px] mx-auto space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {/* Stat Card 1 - Total Seafarers */}
              <div className="bg-surface-light dark:bg-surface-dark p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between h-32 hover:border-primary/30 transition-colors group">
                <div className="flex justify-between items-start">
                  <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg">
                    <span className="material-symbols-outlined">groups</span>
                  </div>
                  <span className="text-green-600 text-xs font-bold bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">trending_up</span> 2.5%
                  </span>
                </div>
                <div>
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Total Seafarers</p>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{stats.totalSeafarers}</h3>
                </div>
              </div>

              {/* Stat Card 2 - New Applicants */}
              <div className="bg-surface-light dark:bg-surface-dark p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between h-32 hover:border-primary/30 transition-colors group relative overflow-hidden">
                {/* Alert Indicator */}
                <div className="absolute top-0 right-0 size-2 bg-primary rounded-bl-lg"></div>
                <div className="flex justify-between items-start">
                  <div className="p-2 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-lg">
                    <span className="material-symbols-outlined">person_add</span>
                  </div>
                  <span className="text-green-600 text-xs font-bold bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">trending_up</span> 12%
                  </span>
                </div>
                <div>
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">New Applicants</p>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{stats.newApplicants}</h3>
                </div>
              </div>

              {/* Stat Card 3 - Verified Seafarers */}
              <div className="bg-surface-light dark:bg-surface-dark p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between h-32 hover:border-primary/30 transition-colors group">
                <div className="flex justify-between items-start">
                  <div className="p-2 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg">
                    <span className="material-symbols-outlined">verified_user</span>
                  </div>
                  <span className="text-green-600 text-xs font-bold bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">trending_up</span> 1.8%
                  </span>
                </div>
                <div>
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Verified Seafarers</p>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{stats.verifiedSeafarers}</h3>
                </div>
              </div>

              {/* Stat Card 4 - Ship Owners / Agents */}
              <div className="bg-surface-light dark:bg-surface-dark p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between h-32 hover:border-primary/30 transition-colors group">
                <div className="flex justify-between items-start">
                  <div className="p-2 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-lg">
                    <span className="material-symbols-outlined">apartment</span>
                  </div>
                  <span className="text-green-600 text-xs font-bold bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">trending_up</span> 3%
                  </span>
                </div>
                <div>
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Ship Owners / Agents</p>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{stats.shipOwners}</h3>
                </div>
              </div>

              {/* Stat Card 5 - Active Contracts */}
              <div className="bg-surface-light dark:bg-surface-dark p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between h-32 hover:border-primary/30 transition-colors group">
                <div className="flex justify-between items-start">
                  <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-lg">
                    <span className="material-symbols-outlined">description</span>
                  </div>
                  <span className="text-green-600 text-xs font-bold bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">trending_up</span> 5%
                  </span>
                </div>
                <div>
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Active Contracts</p>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{stats.activeContracts}</h3>
                </div>
              </div>
            </div>

            {/* Main Content Split */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              {/* Seafarers Table (Takes 2 columns) */}
              <div className="xl:col-span-2 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">Seafarers</h2>
                  <Link
                    href="/admin/seafarers"
                    className="text-primary hover:text-primary-dark text-sm font-semibold flex items-center gap-1"
                  >
                    View all <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </Link>
                </div>

                {/* Filter Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => applyFilter("all")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeFilter === "all"
                        ? "bg-primary text-white"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                    }`}
                  >
                    All ({allSeafarers.length})
                  </button>
                  <button
                    onClick={() => applyFilter("pending")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeFilter === "pending"
                        ? "bg-yellow-500 text-white"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                    }`}
                  >
                    Pending ({allSeafarers.filter(s => s.status === "Pending").length})
                  </button>
                  <button
                    onClick={() => applyFilter("approved")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeFilter === "approved"
                        ? "bg-green-500 text-white"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                    }`}
                  >
                    Approved ({allSeafarers.filter(s => s.status === "Approved").length})
                  </button>
                  <button
                    onClick={() => applyFilter("rejected")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeFilter === "rejected"
                        ? "bg-red-500 text-white"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                    }`}
                  >
                    Rejected ({allSeafarers.filter(s => s.status === "Rejected").length})
                  </button>
                </div>

                <div className="bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">
                          <th className="px-6 py-4">Seafarer</th>
                          <th className="px-6 py-4">Rank</th>
                          <th className="px-6 py-4">Experience</th>
                          <th className="px-6 py-4">Status</th>
                          <th className="px-6 py-4 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                        {seafarers.length > 0 ? (
                          seafarers.map((seafarer) => (
                            <tr
                              key={seafarer.id}
                              className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                              onClick={() => router.push(`/admin/seafarers/${seafarer.id}`)}
                            >
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="size-9 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-500 text-xs font-bold">
                                    {seafarer.name.split(' ').map(n => n[0]).join('')}
                                  </div>
                                  <div>
                                    <div className="font-medium text-slate-900 dark:text-white">{seafarer.name}</div>
                                    <div className="text-xs text-slate-500">ID: #{seafarer.id}</div>
                                    <div className="text-xs text-slate-500">{seafarer.email}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                                {seafarer.rank || "Not specified"}
                              </td>
                              <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                                {seafarer.years_of_experience ? `${seafarer.years_of_experience} years` : "Not specified"}
                              </td>
                              <td className="px-6 py-4">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  seafarer.status === "Approved"
                                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                                    : seafarer.status === "Pending"
                                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                                    : seafarer.status === "Rejected"
                                    ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                                    : "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300"
                                }`}>
                                  {seafarer.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-right">
                                <button
                                  className="text-primary hover:text-primary-dark font-medium text-sm"
                                  onClick={(e) => {
                                    e.stopPropagation(); // Prevent row click when button is clicked
                                    router.push(`/admin/seafarers/${seafarer.id}`);
                                  }}
                                >
                                  Details
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                              No seafarers found.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Side Panel / Active Deployments (Takes 1 column) */}
              <div className="xl:col-span-1 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">Active Deployments</h2>
                  <button className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded">
                    <span className="material-symbols-outlined text-slate-400">more_horiz</span>
                  </button>
                </div>

                <div className="bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm flex flex-col h-[420px]">
                  {/* Map Placeholder */}
                  <div className="h-48 w-full bg-slate-100 relative overflow-hidden group">
                    <div
                      className="absolute inset-0 bg-cover bg-center opacity-80"
                      style={{ backgroundImage: "url('https://placeholder.pics/svg/300')" }}
                    ></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-3 left-4 text-white">
                      <p className="text-xs font-medium opacity-80">Global Operations</p>
                      <p className="font-bold text-lg">12 Vessels Active</p>
                    </div>
                    <button className="absolute top-3 right-3 bg-white/90 text-slate-800 p-1.5 rounded-lg shadow-sm backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="material-symbols-outlined text-[18px]">open_in_full</span>
                    </button>
                  </div>

                  {/* List of Deployments */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {deployments.map((deployment) => (
                      <div
                        key={deployment.id}
                        className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                      >
                        <div className="size-10 rounded bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                          <span className="material-symbols-outlined">directions_boat</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-baseline mb-0.5">
                            <h4 className="font-semibold text-sm text-slate-900 dark:text-white truncate">{deployment.vesselName}</h4>
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                              deployment.status === "En Route"
                                ? "text-green-600 bg-green-100 dark:bg-green-900/30"
                                : deployment.status === "Docked"
                                ? "text-blue-600 bg-blue-100 dark:bg-blue-900/30"
                                : "text-amber-600 bg-amber-100 dark:bg-amber-900/30"
                            }`}>
                              {deployment.status}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 truncate">{deployment.location} • {deployment.crewCount} Crew</p>
                        </div>
                      </div>
                    ))}
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
