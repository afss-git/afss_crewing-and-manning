"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface CrewManagementApi {
  id: number;
  reference_number: string;
  status: string;
  admin_notes: string;
  vessel_name: string;
  imo_number: string;
  vessel_type: string;
  vessel_flag: string;
  operational_routes: string;
  services: string[];
  commencement_date: string;
  duration: string;
  documents: Array<{
    id: number;
    file_name: string;
    file_url: string;
    file_size: string;
    uploaded_at: string;
  }>;
}

// Same structure for detailed API response (extends the base interface)

interface CrewManagementRequest {
  id: string;
  referenceNumber: string;
  refId: string; // Alias for compatibility
  vesselName: string;
  vesselType: string;
  imoNumber: string;
  vesselFlag: string;
  operationalRoutes: string;
  services: string[];
  commencementDate: string;
  duration: string;
  status: "pending" | "approved" | "rejected";
  adminNotes: string;
  scope: string; // computed from services
  client: string; // N/A in this API
  manningAgent: string; // N/A in this API
  crewAssigned: number; // not in API, use documents count as proxy
  crew: Array<{
    id: string;
    name: string;
    role: string;
    avatar: string;
    joinDate: string;
    status: string;
    daysLeft?: number;
  }>; // empty array
  crewTotal: number; // not in API
  vesselImage: string; // not in API
  vesselImo: string; // alias for imoNumber
  startDate: string; // alias for commencementDate
  endDate: string; // computed
  progress: number; // mock value
  documents: Array<{
    id: number;
    file_name: string;
    file_url: string;
    file_size: string;
    uploaded_at: string;
  }>;
}

export default function AdminCrewManagementPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedContract, setSelectedContract] = useState<CrewManagementRequest | null>(
    null
  );
  const [activeTab, setActiveTab] = useState<
    "crew" | "documents" | "financials"
  >("crew");

  // Load crew requests from API
  const [crewManagementRequests, setCrewManagementRequests] = useState<CrewManagementRequest[]>([]);
  const [selectedContractDetails, setSelectedContractDetails] = useState<CrewManagementApi | null>(null);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'approve' | 'reject'>('approve');
  const [rejectionNotes, setRejectionNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function fetchCrewManagement() {
      const token = localStorage.getItem("crew-manning-token");
      if (!token) {
        setCrewManagementRequests([]);
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("/api/v1/admin/crew-management", {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const data: CrewManagementApi[] = await response.json();

        // Transform API data to our UI format
        // NOTE: API doesn't provide actual crew counts, using services-based estimate
        const estimateCrewFromServices = (services: string[]): number => {
          // Estimate crew size based on services - full_crewing typically needs 15-30 crew
          if (services.includes('full_crewing')) return 22; // Average full crew
          return 0; // No specific crew data from API
        };

        const transformedData: CrewManagementRequest[] = data.map((item) => ({
          id: item.id.toString(),
          referenceNumber: item.reference_number,
          refId: item.reference_number, // Alias for compatibility
          vesselName: item.vessel_name,
          vesselType: item.vessel_type,
          imoNumber: item.imo_number || "N/A",
          vesselFlag: item.vessel_flag || "N/A",
          operationalRoutes: item.operational_routes || "",
          services: item.services || [],
          client: "N/A", // Not provided in API
          commencementDate: item.commencement_date || "TBD",
          startDate: item.commencement_date ? new Date(item.commencement_date).toLocaleDateString() : "TBD",
          duration: item.duration || "N/A",
          status: item.status as "pending" | "approved" | "rejected",
          adminNotes: item.admin_notes || "",
          scope: item.services?.join(", ") || "N/A",
          manningAgent: "N/A", // Not in API
          crewAssigned: estimateCrewFromServices(item.services),
          crew: [], // Empty since crew data not in this API
          crewTotal: estimateCrewFromServices(item.services),
          vesselImage: "",
          vesselImo: item.imo_number || "N/A",
          endDate: "TBD", // Not in API
          progress: 0, // Mock value
          documents: item.documents || [],
        }));

        setCrewManagementRequests(transformedData);

        // Auto-select first contract and fetch its details
        if (transformedData.length > 0) {
          const firstContract = transformedData[0];
          setSelectedContract(firstContract);
          fetchContractDetail(firstContract.id);
        }
      } catch (error) {
        console.error("Failed to fetch crew management:", error);
        setCrewManagementRequests([]);
      } finally {
        setLoading(false);
      }
    }

    fetchCrewManagement();
  }, []);

  // Filter crew management requests
  const filteredContracts = crewManagementRequests.filter((contract) => {
    const matchesSearch =
      contract.vesselName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contract.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contract.referenceNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      activeFilter === "all" ||
      (activeFilter === "active" && contract.status === "approved") ||
      (activeFilter === "pending" && contract.status === "pending") ||
      (activeFilter === "renewal" && contract.status === "rejected"); // Mapped renewal to rejected
    return matchesSearch && matchesFilter;
  });

  // Calculate actual statistics based on available API data
  const approvedContracts = crewManagementRequests.filter((c) => c.status === "approved").length;
  const activeRequests = crewManagementRequests.filter((c) =>
    c.status === "approved" || c.status === "pending"
  ).length;

  // Stats - using available data from API only (removing all mock data)
  const stats = {
    totalContracts: crewManagementRequests.length,
    activeContracts: approvedContracts,
    pendingContracts: crewManagementRequests.filter((c) => c.status === "pending").length,
    rejectedContracts: crewManagementRequests.filter((c) => c.status === "rejected").length,
  };

  // Fetch detailed contract data on selection
  const fetchContractDetail = async (contractId: string) => {
    try {
      setDetailLoading(true);
      const token = localStorage.getItem("crew-manning-token");
      if (!token) return;

      const response = await fetch(`/api/v1/admin/crew-management/${contractId}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        console.error("Failed to fetch detailed contract data:", response.status);
        return;
      }

      const detailedData: CrewManagementApi = await response.json();
      setSelectedContractDetails(detailedData);
    } catch (error) {
      console.error("Error fetching contract details:", error);
    } finally {
      setDetailLoading(false);
    }
  };

  // Handle contract selection (fetch details if clicked again)
  const handleContractClick = (contract: CrewManagementRequest) => {
    setSelectedContract(contract);

    // Always fetch fresh details when clicking
    fetchContractDetail(contract.id);
  };

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

  const handleApprove = async (confirmed = false) => {
    if (!selectedContract) return;

    if (!confirmed) {
      // Show confirmation modal
      setModalType('approve');
      setRejectionNotes('');
      setShowModal(true);
      return;
    }

    try {
      setIsSubmitting(true);
      const token = localStorage.getItem("crew-manning-token");
      if (!token) return;

      const response = await fetch(`/api/v1/admin/crew-management/${selectedContract.id}/approve`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: "",
      });

      if (!response.ok) {
        throw new Error(`Failed to approve request`);
      }

      // Close modal
      setShowModal(false);

      // Refresh the contract data or show success message
      alert(`${selectedContract.vesselName} has been approved successfully!`);

      // Refresh the contracts list to show updated status
      window.location.reload();

    } catch (error) {
      console.error("Failed to approve request:", error);
      alert("Failed to approve the request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async (confirmed = false) => {
    if (!selectedContract) return;

    if (!confirmed) {
      // Show rejection modal
      setModalType('reject');
      setRejectionNotes('');
      setShowModal(true);
      return;
    }

    try {
      setIsSubmitting(true);
      const token = localStorage.getItem("crew-manning-token");
      if (!token) return;

      const response = await fetch(`/api/v1/admin/crew-management/${selectedContract.id}/reject`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ notes: rejectionNotes.trim() }),
      });

      if (!response.ok) {
        throw new Error(`Failed to reject request`);
      }

      // Close modal
      setShowModal(false);

      // Refresh the contract data or show success message
      alert(`${selectedContract.vesselName} has been rejected successfully.`);

      // Refresh the contracts list to show updated status
      window.location.reload();

    } catch (error) {
      console.error("Failed to reject request:", error);
      alert("Failed to reject the request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmAction = () => {
    if (modalType === 'approve') {
      handleApprove(true);
    } else {
      handleReject(true);
    }
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

  const getStatusBadge = (status: CrewManagementRequest["status"]) => {
    switch (status) {
      case "approved":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span>{" "}
            Approved
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-yellow-50 text-yellow-700 border border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800">
            <span className="h-1.5 w-1.5 rounded-full bg-yellow-500"></span>{" "}
            Pending Review
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800">
            <span className="h-1.5 w-1.5 rounded-full bg-red-500"></span>{" "}
            Rejected
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

        {/* KPI Stats Cards - All data correlated with actual API response */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-[#1a202c] p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col justify-between h-32 relative overflow-hidden group">
            <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="material-symbols-outlined text-6xl text-primary">
                assignment
              </span>
            </div>
            <p className="text-gray-500 font-medium text-sm uppercase tracking-wider">
              Total Contracts
            </p>
            <div className="flex items-start justify-between mt-2">
              <span className="text-3xl font-bold text-gray-900 dark:text-white">
                {stats.totalContracts}
              </span>
            </div>
          </div>
          <div className="bg-white dark:bg-[#1a202c] p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col justify-between h-32 relative overflow-hidden group">
            <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="material-symbols-outlined text-6xl text-green-600">
                check_circle
              </span>
            </div>
            <p className="text-gray-500 font-medium text-sm uppercase tracking-wider">
              Approved
            </p>
            <div className="flex items-start justify-between mt-2">
              <span className="text-3xl font-bold text-green-600">
                {stats.activeContracts}
              </span>
            </div>
          </div>
          <div className="bg-white dark:bg-[#1a202c] p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col justify-between h-32 relative overflow-hidden group">
            <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="material-symbols-outlined text-6xl text-yellow-500">
                pending
              </span>
            </div>
            <p className="text-gray-500 font-medium text-sm uppercase tracking-wider">
              Pending Review
            </p>
            <div className="flex items-start justify-between mt-2">
              <span className="text-3xl font-bold text-yellow-600">
                {stats.pendingContracts}
              </span>
            </div>
          </div>
          <div className="bg-white dark:bg-[#1a202c] p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col justify-between h-32 relative overflow-hidden group">
            <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="material-symbols-outlined text-6xl text-red-500">
                cancel
              </span>
            </div>
            <p className="text-gray-500 font-medium text-sm uppercase tracking-wider">
              Rejected
            </p>
            <div className="flex items-start justify-between mt-2">
              <span className="text-3xl font-bold text-red-600">
                {stats.rejectedContracts}
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
              Approved ({crewManagementRequests.filter((c) => c.status === "approved").length})
            </button>
            <button
              onClick={() => setActiveFilter("pending")}
              className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-medium ${
                activeFilter === "pending"
                  ? "bg-primary text-white shadow-sm"
                  : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
            >
              Pending Review ({crewManagementRequests.filter((c) => c.status === "pending").length})
            </button>
            <button
              onClick={() => setActiveFilter("renewal")}
              className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-medium ${
                activeFilter === "renewal"
                  ? "bg-primary text-white shadow-sm"
                  : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
            >
              Rejected ({crewManagementRequests.filter((c) => c.status === "rejected").length})
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
                      onClick={() => handleContractClick(contract)}
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
                                contract.status === "approved"
                                  ? "bg-green-500"
                                  : "bg-primary"
                              }`}
                              style={{ width: `${contract.progress}%` }}
                            ></div>
                          </div>
                          <span
                            className={`text-xs ${
                              contract.status === "rejected"
                                ? "text-red-600 font-medium"
                                : "text-gray-400"
                            }`}
                          >
                            {contract.status === "rejected"
                              ? "Rejected"
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
                Showing 1-{filteredContracts.length} of {crewManagementRequests.length}{" "}
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
              {/* Loading indicator for detail fetch */}
              {detailLoading && (
                <div className="absolute inset-0 bg-white/90 dark:bg-[#1a202c]/90 flex items-center justify-center z-10 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Loading contract details...</span>
                  </div>
                </div>
              )}
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
              <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                <div className="grid grid-cols-2 gap-3">
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
                {/* Approve/Reject buttons for contracts */}
                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600 grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleApprove()}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-bold shadow-md transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">check_circle</span>
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject()}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-bold shadow-md transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">cancel</span>
                    Reject
                  </button>
                </div>
                <div className="mt-2 text-center">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Current Status: {selectedContractDetails?.status || 'Loading'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#1a202c] rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  {modalType === 'approve' ? 'Approve Request' : 'Reject Request'}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                >
                  <span className="material-symbols-outlined text-gray-400">close</span>
                </button>
              </div>

              {modalType === 'approve' ? (
                <div className="mb-6">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Are you sure you want to approve this crew management request?
                  </p>
                  <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                    <div className="text-sm">
                      <div className="font-medium text-gray-900 dark:text-white">{selectedContract?.vesselName}</div>
                      <div className="text-gray-500 dark:text-gray-400">
                        Reference: {selectedContract?.refId}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mb-6">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Please provide rejection notes (required):
                  </p>
                  <textarea
                    value={rejectionNotes}
                    onChange={(e) => setRejectionNotes(e.target.value)}
                    placeholder="Enter rejection reason..."
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    rows={4}
                    required
                  />
                  <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                    Note: Rejection requires detailed notes
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-3 p-6 pt-0">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAction}
                disabled={isSubmitting || (modalType === 'reject' && !rejectionNotes.trim())}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                  modalType === 'approve'
                    ? 'bg-green-600 hover:bg-green-700 text-white disabled:opacity-50'
                    : 'bg-red-600 hover:bg-red-700 text-white disabled:opacity-50'
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Processing...
                  </div>
                ) : (
                  modalType === 'approve' ? 'Approve' : 'Reject'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
