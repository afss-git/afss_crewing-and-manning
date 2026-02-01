"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Candidate {
  id: string;
  name: string;
  role: string;
  experience: string;
  avatar: string;
  status: "available" | "on-contract" | "pending";
  location: string;
  matchScore: number;
  matchDetails: {
    experience: boolean;
    certifications: boolean;
    availability: boolean;
    visa: boolean;
  };
}

interface OneOffContract {
  id: string;
  contractId: string;
  client: string;
  position: string;
  positionType: "urgent" | "medical" | "scheduled" | "spot";
  vessel: string;
  vesselImage: string;
  startDate: string;
  endDate: string;
  duration: string;
  status: "open" | "reviewing" | "assigned" | "completed" | "cancelled";
  requiredCerts: string;
  dayRate: string;
  candidates: Candidate[];
}

export default function AdminOneOffCrewPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [candidateSearch, setCandidateSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedContract, setSelectedContract] =
    useState<OneOffContract | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(
    null,
  );
  const [contracts, setContracts] = useState<OneOffContract[]>([]);
  const [, setAssignLoading] = useState(false);

  async function loadContracts() {
    try {
      const res = await fetch("/api/v1/admin/one-off-contracts");
      if (!res.ok) {
        setContracts([]);
        return;
      }
      const data = (await res.json()) as OneOffContract[];
      const list = Array.isArray(data) ? data : [];
      setContracts(list);
      if (list.length > 0) {
        setSelectedContract((prev) => prev ?? list[0]);
        if (list[0].candidates.length > 0) {
          setSelectedCandidate((prev) => prev ?? list[0].candidates[0].id);
        }
      }
    } catch {
      setContracts([]);
    }
  }

  useEffect(() => {
    let mounted = true;
    // call loadContracts; ignore mounted inside since state updates are safe when unmounted in React
    if (mounted) loadContracts();
    return () => {
      mounted = false;
    };
  }, []);

  // Initial selection is handled after fetching contracts

  // Filter contracts
  const filteredContracts = contracts.filter((contract) => {
    const matchesSearch =
      contract.contractId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contract.vessel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contract.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contract.client.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      activeFilter === "all" ||
      (activeFilter === "pending" &&
        (contract.status === "open" || contract.status === "reviewing")) ||
      (activeFilter === "assigned" && contract.status === "assigned") ||
      (activeFilter === "completed" && contract.status === "completed");
    return matchesSearch && matchesFilter;
  });

  // Stats
  const stats = {
    totalContracts: contracts.length,
    openPositions: contracts.filter(
      (c) => c.status === "open" || c.status === "reviewing",
    ).length,
    assignedSeafarers: contracts.filter((c) => c.status === "assigned").length,
  };

  const handleLogout = () => {
    localStorage.removeItem("crew-manning-user");
    localStorage.removeItem("crew-manning-token");
    localStorage.removeItem("crew-manning-profile");
    router.push("/admin/login");
  };

  const handleHistoryLog = () => {
    alert("Opening history log...");
  };

  const handleCreateRequest = () => {
    alert("Opening create one-off request form...");
  };

  const handleSaveDraft = () => {
    if (selectedContract && selectedCandidate) {
      alert(
        `Saving draft for ${selectedContract.contractId} with selected candidate`,
      );
    }
  };

  const handleAssignSeafarer = () => {
    (async () => {
      if (!selectedContract || !selectedCandidate) return;
      setAssignLoading(true);
      try {
        const token = localStorage.getItem("crew-manning-token");
        const res = await fetch(
          `/api/v1/admin/one-off-contracts/${selectedContract.id}/assign`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: token ? `Bearer ${token}` : "",
            },
            body: JSON.stringify({ candidateId: selectedCandidate }),
          },
        );
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          alert(`Failed to assign: ${data?.message || res.statusText}`);
        } else {
          alert("Seafarer assigned successfully.");
          await loadContracts();
        }
      } catch (err) {
        console.error("assign error", err);
        alert("Network error assigning seafarer.");
      } finally {
        setAssignLoading(false);
      }
    })();
  };

  const handleViewProfile = (candidate: Candidate) => {
    alert(`Viewing profile for ${candidate.name}`);
  };

  const handleEditContract = () => {
    if (selectedContract) {
      alert(`Editing contract ${selectedContract.contractId}`);
    }
  };

  const getPositionTypeColor = (type: OneOffContract["positionType"]) => {
    switch (type) {
      case "urgent":
        return "bg-orange-500";
      case "medical":
        return "bg-blue-500";
      case "scheduled":
        return "bg-green-500";
      case "spot":
        return "bg-orange-500";
      default:
        return "bg-gray-500";
    }
  };

  const getPositionTypeLabel = (type: OneOffContract["positionType"]) => {
    switch (type) {
      case "urgent":
        return "Urgent Replacement";
      case "medical":
        return "Medical Leave Cover";
      case "scheduled":
        return "Scheduled Relief";
      case "spot":
        return "Spot Contract";
      default:
        return "";
    }
  };

  const getStatusBadge = (status: OneOffContract["status"]) => {
    switch (status) {
      case "open":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
            Open
          </span>
        );
      case "reviewing":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            Reviewing
          </span>
        );
      case "assigned":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            Assigned
          </span>
        );
      case "completed":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
            Completed
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
            Cancelled
          </span>
        );
      default:
        return null;
    }
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  // Filter candidates in the selected contract
  const filteredCandidates =
    selectedContract?.candidates.filter(
      (candidate) =>
        candidate.name.toLowerCase().includes(candidateSearch.toLowerCase()) ||
        candidate.role.toLowerCase().includes(candidateSearch.toLowerCase()),
    ) || [];

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
              href="/admin/one-off-crew"
              className="text-primary dark:text-white text-sm font-bold border-b-2 border-primary py-5"
            >
              Crew Management
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
              One-Off Assignments
            </span>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
                One-Off Crew Assignment
              </h1>
              <p className="text-gray-500 mt-2 text-lg">
                Manage single-contract crew placements, short-term relief, and
                spot assignments.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleHistoryLog}
                className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 px-4 py-2.5 rounded-lg font-medium shadow-sm transition-all"
              >
                <span className="material-symbols-outlined text-[20px]">
                  history
                </span>
                History Log
              </button>
              <button
                onClick={handleCreateRequest}
                className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-lg font-medium shadow-md transition-all"
              >
                <span className="material-symbols-outlined text-[20px]">
                  add_circle
                </span>
                Create One-Off Request
              </button>
            </div>
          </div>
        </div>

        {/* KPI Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-[#1a202c] p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col justify-between h-32 relative overflow-hidden group">
            <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="material-symbols-outlined text-6xl text-primary">
                assignment_ind
              </span>
            </div>
            <p className="text-gray-500 font-medium text-sm uppercase tracking-wider">
              Total One-Off Contracts
            </p>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-gray-900 dark:text-white">
                {stats.totalContracts}
              </span>
              <span className="text-gray-400 text-sm font-medium mb-1">
                Active
              </span>
            </div>
          </div>
          <div className="bg-white dark:bg-[#1a202c] p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col justify-between h-32 relative overflow-hidden group">
            <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="material-symbols-outlined text-6xl text-orange-500">
                person_search
              </span>
            </div>
            <p className="text-gray-500 font-medium text-sm uppercase tracking-wider">
              Open Positions
            </p>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-gray-900 dark:text-white">
                {stats.openPositions}
              </span>
              <span className="text-orange-600 text-sm font-medium mb-1 flex items-center bg-orange-50 dark:bg-orange-900/30 px-2 py-0.5 rounded-full">
                Urgent
              </span>
            </div>
          </div>
          <div className="bg-white dark:bg-[#1a202c] p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col justify-between h-32 relative overflow-hidden group">
            <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="material-symbols-outlined text-6xl text-green-600">
                how_to_reg
              </span>
            </div>
            <p className="text-gray-500 font-medium text-sm uppercase tracking-wider">
              Assigned Seafarers
            </p>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-gray-900 dark:text-white">
                {stats.assignedSeafarers}
              </span>
              <span className="text-green-600 text-sm font-medium mb-1 flex items-center bg-green-50 dark:bg-green-900/30 px-2 py-0.5 rounded-full">
                <span className="material-symbols-outlined text-[14px] mr-1">
                  trending_up
                </span>{" "}
                +5 today
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
                placeholder="Search by contract ID, vessel or position..."
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
              All Requests
            </button>
            <button
              onClick={() => setActiveFilter("pending")}
              className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-medium ${
                activeFilter === "pending"
                  ? "bg-primary text-white shadow-sm"
                  : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
            >
              Pending (
              {
                contracts.filter(
                  (c) => c.status === "open" || c.status === "reviewing",
                ).length
              }
              )
            </button>
            <button
              onClick={() => setActiveFilter("assigned")}
              className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-medium ${
                activeFilter === "assigned"
                  ? "bg-primary text-white shadow-sm"
                  : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
            >
              Assigned (
              {contracts.filter((c) => c.status === "assigned").length})
            </button>
            <button
              onClick={() => setActiveFilter("completed")}
              className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-medium ${
                activeFilter === "completed"
                  ? "bg-primary text-white shadow-sm"
                  : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
            >
              Completed (
              {contracts.filter((c) => c.status === "completed").length})
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
                      Contract ID / Client
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Position
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Vessel
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Dates
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">
                      Status
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
                  {filteredContracts.map((contract) => (
                    <tr
                      key={contract.id}
                      onClick={() => {
                        setSelectedContract(contract);
                        if (contract.candidates.length > 0) {
                          setSelectedCandidate(contract.candidates[0].id);
                        } else {
                          setSelectedCandidate(null);
                        }
                      }}
                      className={`hover:bg-[#fdf2f2] dark:hover:bg-primary/5 cursor-pointer transition-colors ${
                        selectedContract?.id === contract.id
                          ? "bg-[#fdf2f2]/50 dark:bg-primary/5 border-l-4 border-l-primary"
                          : "border-l-4 border-l-transparent"
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-gray-900 dark:text-white">
                            {contract.contractId}
                          </span>
                          <span className="text-xs text-gray-500">
                            {contract.client}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-800 dark:text-gray-200">
                        <div className="flex items-center gap-2">
                          <span
                            className={`h-2 w-2 rounded-full ${getPositionTypeColor(
                              contract.positionType,
                            )}`}
                          ></span>
                          {contract.position}
                        </div>
                        <span className="text-xs text-gray-500 ml-4">
                          {getPositionTypeLabel(contract.positionType)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div
                            className="h-6 w-6 rounded bg-gray-200 bg-cover bg-center"
                            style={{
                              backgroundImage: `url("${contract.vesselImage}")`,
                            }}
                          ></div>
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {contract.vessel}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col text-xs text-gray-600 dark:text-gray-400">
                          <span className="font-medium">
                            {contract.startDate} - {contract.endDate}
                          </span>
                          <span>{contract.duration}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {getStatusBadge(contract.status)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="material-symbols-outlined text-gray-400 text-sm">
                          chevron_right
                        </span>
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
            <div className="w-full xl:w-[500px] bg-white dark:bg-[#1a202c] rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg flex flex-col overflow-hidden">
              {/* Header */}
              <div className="p-5 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/30">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary mb-2">
                      Contract Details
                    </span>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {selectedContract.position} Needed
                    </h3>
                    <p className="text-sm text-gray-500">
                      One-Off ID: {selectedContract.contractId}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleEditContract}
                      className="p-1.5 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:text-primary shadow-sm"
                      title="Edit details"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        edit
                      </span>
                    </button>
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Vessel</span>
                    <span className="font-semibold text-gray-900 dark:text-white flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm text-gray-400">
                        directions_boat
                      </span>
                      {selectedContract.vessel}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Duration</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {selectedContract.startDate} - {selectedContract.endDate}{" "}
                      ({selectedContract.duration})
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Required Certs</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {selectedContract.requiredCerts}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Day Rate</span>
                    <span className="font-semibold text-green-600 dark:text-green-400">
                      {selectedContract.dayRate}
                    </span>
                  </div>
                </div>
              </div>

              {/* Candidates Section */}
              <div className="flex flex-col flex-1 overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700">
                  <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-3">
                    Available Seafarers
                  </h4>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                      <span className="material-symbols-outlined text-[18px]">
                        person_search
                      </span>
                    </span>
                    <input
                      className="block w-full rounded-md border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50 py-2 pl-9 pr-3 text-sm focus:border-primary focus:ring-primary dark:text-white placeholder-gray-500"
                      placeholder="Search available candidates..."
                      type="text"
                      value={candidateSearch}
                      onChange={(e) => setCandidateSearch(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gray-50/30 dark:bg-gray-900/10">
                  {filteredCandidates.map((candidate) => (
                    <div
                      key={candidate.id}
                      className={`group relative bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm transition-all ${
                        candidate.status === "on-contract"
                          ? "border border-gray-200 dark:border-gray-700 opacity-75"
                          : selectedCandidate === candidate.id
                            ? "border-2 border-primary"
                            : "border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                      }`}
                    >
                      <div className="absolute top-3 right-3">
                        <input
                          type="radio"
                          name="candidate_select"
                          checked={selectedCandidate === candidate.id}
                          disabled={candidate.status === "on-contract"}
                          onChange={() => setSelectedCandidate(candidate.id)}
                          className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded-full"
                        />
                      </div>
                      <div className="flex gap-4">
                        <div
                          className={`h-12 w-12 rounded-full bg-gray-200 bg-center bg-cover border-2 border-white dark:border-gray-700 shadow-sm ${
                            candidate.status === "on-contract"
                              ? "grayscale"
                              : ""
                          }`}
                          style={{
                            backgroundImage: `url("${candidate.avatar}")`,
                          }}
                        ></div>
                        <div>
                          <h5 className="font-bold text-gray-900 dark:text-white text-sm">
                            {candidate.name}
                          </h5>
                          <p className="text-xs text-gray-500">
                            {candidate.role} • {candidate.experience}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            {candidate.status === "available" ? (
                              <>
                                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                  Available
                                </span>
                                <span className="text-[10px] text-gray-400 flex items-center">
                                  <span className="material-symbols-outlined text-[10px] mr-0.5">
                                    location_on
                                  </span>
                                  {candidate.location}
                                </span>
                              </>
                            ) : (
                              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                                On Contract
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      {candidate.status !== "on-contract" ? (
                        <>
                          <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
                            <div className="flex gap-1">
                              <span
                                className={`h-1.5 w-6 rounded-full ${
                                  candidate.matchDetails.experience
                                    ? "bg-green-500"
                                    : "bg-gray-200 dark:bg-gray-600"
                                }`}
                                title="Experience Match"
                              ></span>
                              <span
                                className={`h-1.5 w-6 rounded-full ${
                                  candidate.matchDetails.certifications
                                    ? "bg-green-500"
                                    : "bg-gray-200 dark:bg-gray-600"
                                }`}
                                title="Certifications Match"
                              ></span>
                              <span
                                className={`h-1.5 w-6 rounded-full ${
                                  candidate.matchDetails.availability
                                    ? "bg-green-500"
                                    : "bg-gray-200 dark:bg-gray-600"
                                }`}
                                title="Availability Match"
                              ></span>
                              <span
                                className={`h-1.5 w-6 rounded-full ${
                                  candidate.matchDetails.visa
                                    ? "bg-green-500"
                                    : "bg-gray-200 dark:bg-gray-600"
                                }`}
                                title="Visa Match"
                              ></span>
                            </div>
                            <span
                              className={`text-xs font-bold ${getMatchScoreColor(
                                candidate.matchScore,
                              )}`}
                            >
                              {candidate.matchScore}% Match
                            </span>
                          </div>
                          <button
                            onClick={() => handleViewProfile(candidate)}
                            className="w-full mt-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 rounded border border-gray-200 dark:border-gray-600 transition-colors"
                          >
                            View Full Profile
                          </button>
                        </>
                      ) : (
                        <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                          <span className="text-xs italic text-gray-400">
                            Currently unavailable for these dates
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                  {filteredCandidates.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                      <span className="material-symbols-outlined text-4xl mb-2">
                        person_off
                      </span>
                      <p className="text-sm">No candidates found</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer Actions */}
              <div className="p-5 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a202c] shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-10">
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-500">
                      Selected:{" "}
                      <span className="font-bold text-gray-900 dark:text-white">
                        {selectedCandidate
                          ? selectedContract.candidates.find(
                              (c) => c.id === selectedCandidate,
                            )?.name || "None"
                          : "None"}
                      </span>
                    </span>
                    <a
                      href="#"
                      className="text-xs text-primary font-medium hover:underline"
                    >
                      View contract draft
                    </a>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={handleSaveDraft}
                      className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      Save Draft
                    </button>
                    <button
                      onClick={handleAssignSeafarer}
                      disabled={!selectedCandidate}
                      className="flex items-center justify-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-bold shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Assign Seafarer
                    </button>
                  </div>
                  <button className="w-full text-center text-xs text-gray-400 hover:text-gray-600 mt-1">
                    or Finalize Contract &amp; Send Offer
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
