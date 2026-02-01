"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Contract {
  id: string;
  contractNumber?: string;
  type: "full-crew" | "one-off";
  vesselName: string;
  ownerName: string;
  seafarerName: string;
  seafarerRank: string;
  seafarerAvatar: string;
  startDate: string;
  endDate: string;
  progress: number;
  status: "active" | "pending" | "completed" | "suspended" | "expired";
  statusNote?: string;
  isDraft?: boolean;
  isArchived?: boolean;
  numericId?: number;
}

interface PendingContractApi {
  id: number;
  contract_number: string;
  status: string;
  admin_notes: string | null;
  vessel_type: string;
  operational_zone: string;
  target_start_date: string;
  expected_duration_months: number;
  port_of_embarkation: string;
  port_of_disembarkation: string;
  positions: Array<{
    rank_id: string;
    quantity: number;
    min_experience_years: number;
    nationality_preference: string;
  }>;
}

interface ApprovedContractApi {
  id: number;
  reference_number: string;
  status: string;
  admin_notes: string | null;
  details?: {
    vessel_type?: string;
    vessel_name?: string;
    owner_name?: string;
    operational_zone?: string;
    operational_routes?: string;
    target_start_date?: string;
    commencement_date?: string;
    expected_duration_months?: number;
    duration?: string;
    port_of_embarkation?: string;
    port_of_disembarkation?: string;
    positions?: unknown[];
    seafarer_name?: string;
    seafarer_rank?: string;
    [key: string]: unknown;
  };
}

export default function AdminContractsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [activeTab, setActiveTab] = useState<
    "all" | "pending-review" | "approved" | "rejected" | "drafts" | "archived"
  >("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [pendingContracts, setPendingContracts] = useState<Contract[]>([]);
  const [approvedContracts, setApprovedContracts] = useState<Contract[]>([]);
  const [rejectedContracts, setRejectedContracts] = useState<Contract[]>([]);

  // Transform pending contracts from API format to frontend format
  const transformPendingContracts = async (
    apiData: PendingContractApi[],
  ): Promise<Contract[]> => {
    return apiData.map((item) => {
      const totalPositions =
        item.positions?.reduce(
          (sum: number, pos: PendingContractApi["positions"][0]) =>
            sum + (pos.quantity || 0),
          0,
        ) || 0;

      return {
        id:
          item.contract_number ||
          item.id?.toString() ||
          `contract-${Math.random()}`,
        contractNumber: item.contract_number,
        type:
          totalPositions > 3 ? ("full-crew" as const) : ("one-off" as const),
        vesselName: item.vessel_type || "Unknown Vessel",
        ownerName: item.operational_zone || "Unknown Zone",
        seafarerName:
          item.positions?.[0]?.rank_id?.replace(/_/g, " ") || "Multiple Roles",
        seafarerRank:
          item.positions?.[0]?.rank_id?.replace(/_/g, " ") || "Various",
        seafarerAvatar: "",
        startDate: item.target_start_date
          ? item.target_start_date.split("T")[0]
          : "TBD",
        endDate: calculateEndDate(
          item.target_start_date,
          item.expected_duration_months || 12,
        ),
        progress: 0,
        status: (() => {
          switch (item.status.toLowerCase()) {
            case "submitted":
              return "pending";
            case "approved":
              return "active";
            case "rejected":
              return "suspended";
            case "completed":
              return "completed";
            case "expired":
              return "expired";
            default:
              return "pending";
          }
        })(),
        statusNote: item.admin_notes || undefined,
        isDraft: false,
        isArchived: false,
        numericId: item.id,
      };
    });
  };

  // Transform approved/rejected contracts from API format to frontend format
  const transformApprovedContracts = async (
    apiData: ApprovedContractApi[],
  ): Promise<Contract[]> => {
    return apiData.map((item) => {
      const details = item.details || {};
      const totalPositions = Array.isArray(details.positions)
        ? details.positions.length
        : 0;

      return {
        id:
          item.reference_number ||
          item.id?.toString() ||
          `contract-${Math.random()}`,
        contractNumber: item.reference_number,
        type:
          totalPositions > 3 ? ("full-crew" as const) : ("one-off" as const),
        vesselName:
          details.vessel_name || details.vessel_type || "Unknown Vessel",
        ownerName:
          details.owner_name ||
          details.operational_zone ||
          details.operational_routes ||
          "Unknown Owner",
        seafarerName: details.seafarer_name || "Multiple Roles",
        seafarerRank: details.seafarer_rank || "Various",
        seafarerAvatar: "",
        startDate:
          details.target_start_date || details.commencement_date
            ? (details.target_start_date || details.commencement_date)!.split(
                "T",
              )[0]
            : "TBD",
        endDate: calculateEndDate(
          details.target_start_date || details.commencement_date,
          details.expected_duration_months ||
            (details.duration?.includes("Year") ? 12 : 6),
        ),
        progress:
          item.status.toLowerCase() === "completed"
            ? 100
            : item.status.toLowerCase() === "approved"
              ? 50
              : 0,
        status: (() => {
          switch (item.status.toLowerCase()) {
            case "submitted":
              return "pending";
            case "approved":
              return "active";
            case "rejected":
              return "suspended";
            case "completed":
              return "completed";
            case "expired":
              return "expired";
            default:
              return "pending";
          }
        })(),
        statusNote: item.admin_notes || undefined,
        isDraft: false,
        isArchived: false,
        numericId: item.id,
      };
    });
  };

  const calculateEndDate = (
    startDate: string | undefined,
    months: number,
  ): string => {
    if (!startDate) return "TBD";
    try {
      const start = new Date(startDate);
      start.setMonth(start.getMonth() + months);
      return start.toISOString().split("T")[0];
    } catch {
      return "TBD";
    }
  };

  // Fetch contracts from backend
  useEffect(() => {
    async function fetchContracts() {
      // Get authentication token from localStorage
      const token = localStorage.getItem("crew-manning-token");
      if (!token) {
        setContracts([]);
        setPendingContracts([]);
        return;
      }

      const allContractsPromise = fetch("/api/v1/admin/contracts", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }).then(async (res) => {
        if (!res.ok) throw new Error(`Contracts API error: ${res.status}`);
        const data = await res.json();
        return Array.isArray(data) ? data : [];
      });

      const pendingContractsPromise = fetch("/api/v1/admin/contracts/pending", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }).then(async (res) => {
        if (!res.ok)
          throw new Error(`Pending Contracts API error: ${res.status}`);
        const data = await res.json();
        return Array.isArray(data) ? data : [];
      });

      const approvedContractsPromise = fetch(
        "/api/v1/admin/contracts/status/approved",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      ).then(async (res) => {
        if (!res.ok)
          throw new Error(`Approved Contracts API error: ${res.status}`);
        const data = await res.json();
        return Array.isArray(data) ? data : [];
      });

      const rejectedContractsPromise = fetch(
        "/api/v1/admin/contracts/status/rejected",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      ).then(async (res) => {
        if (!res.ok)
          throw new Error(`Rejected Contracts API error: ${res.status}`);
        const data = await res.json();
        return Array.isArray(data) ? data : [];
      });

      try {
        const rejectedContractsPromise = fetch(
          "/api/v1/admin/contracts/status/rejected",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
        ).then(async (res) => {
          if (!res.ok)
            throw new Error(`Rejected Contracts API error: ${res.status}`);
          const data = await res.json();
          return Array.isArray(data) ? data : [];
        });

        const [allContracts, pendingData, approvedData, rejectedData] =
          await Promise.allSettled([
            allContractsPromise,
            pendingContractsPromise,
            approvedContractsPromise,
            rejectedContractsPromise,
          ]);

        setContracts(
          allContracts.status === "fulfilled"
            ? await transformPendingContracts(allContracts.value)
            : [],
        );
        setPendingContracts(
          pendingData.status === "fulfilled"
            ? await transformPendingContracts(pendingData.value)
            : [],
        );
        setApprovedContracts(
          approvedData.status === "fulfilled"
            ? await transformApprovedContracts(approvedData.value)
            : [],
        );
        setRejectedContracts(
          rejectedData.status === "fulfilled"
            ? await transformApprovedContracts(rejectedData.value)
            : [],
        );
      } catch (error) {
        // Individual promise errors handled above
        console.error("Failed to fetch contracts:", error);
        setContracts([]);
        setPendingContracts([]);
      }
    }

    fetchContracts();
  }, []);

  // Filter contracts based on active tab
  const filteredContracts =
    activeTab === "pending-review"
      ? pendingContracts.filter((contract) => {
          const matchesSearch =
            String(contract.id)
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            String(contract.vesselName)
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            String(contract.seafarerName)
              .toLowerCase()
              .includes(searchQuery.toLowerCase());
          const matchesType = !typeFilter || contract.type === typeFilter;
          const matchesStatus =
            !statusFilter || contract.status === statusFilter;
          return matchesSearch && matchesType && matchesStatus;
        })
      : activeTab === "approved"
        ? approvedContracts.filter((contract) => {
            const matchesSearch =
              String(contract.id)
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
              String(contract.vesselName)
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
              String(contract.seafarerName)
                .toLowerCase()
                .includes(searchQuery.toLowerCase());
            const matchesType = !typeFilter || contract.type === typeFilter;
            const matchesStatus =
              !statusFilter || contract.status === statusFilter;
            return matchesSearch && matchesType && matchesStatus;
          })
        : activeTab === "rejected"
          ? rejectedContracts.filter((contract) => {
              const matchesSearch =
                String(contract.id)
                  .toLowerCase()
                  .includes(searchQuery.toLowerCase()) ||
                String(contract.vesselName)
                  .toLowerCase()
                  .includes(searchQuery.toLowerCase()) ||
                String(contract.seafarerName)
                  .toLowerCase()
                  .includes(searchQuery.toLowerCase());
              const matchesType = !typeFilter || contract.type === typeFilter;
              const matchesStatus =
                !statusFilter || contract.status === statusFilter;
              return matchesSearch && matchesType && matchesStatus;
            })
          : contracts.filter((contract) => {
              const matchesSearch =
                String(contract.id)
                  .toLowerCase()
                  .includes(searchQuery.toLowerCase()) ||
                String(contract.vesselName)
                  .toLowerCase()
                  .includes(searchQuery.toLowerCase()) ||
                String(contract.seafarerName)
                  .toLowerCase()
                  .includes(searchQuery.toLowerCase());
              const matchesType = !typeFilter || contract.type === typeFilter;
              const matchesStatus =
                !statusFilter || contract.status === statusFilter;

              // Tab filtering
              if (activeTab === "drafts")
                return (
                  contract.isDraft &&
                  matchesSearch &&
                  matchesType &&
                  matchesStatus
                );
              if (activeTab === "archived")
                return (
                  contract.isArchived &&
                  matchesSearch &&
                  matchesType &&
                  matchesStatus
                );
              return (
                !contract.isDraft &&
                !contract.isArchived &&
                matchesSearch &&
                matchesType &&
                matchesStatus
              );
            });

  // Calculate expiring soon contracts (within 30 days)
  const calculateExpiringSoon = (contracts: Contract[]): number => {
    const now = new Date();
    const thirtyDaysFromNow = new Date(
      now.getTime() + 30 * 24 * 60 * 60 * 1000,
    );

    return contracts.filter((contract) => {
      if (!contract.endDate || contract.endDate === "TBD") return false;
      if (contract.status !== "active") return false;

      try {
        const endDate = new Date(contract.endDate);
        return endDate >= now && endDate <= thirtyDaysFromNow;
      } catch {
        return false;
      }
    }).length;
  };

  // Stats
  const stats = {
    total: contracts.length,
    active: contracts.filter((c) => c.status === "active").length,
    expiringSoon: calculateExpiringSoon(contracts),
    pending: contracts.filter((c) => c.status === "pending").length,
  };

  const draftsCount = contracts.filter((c) => c.isDraft).length;

  const refreshContractData = async () => {
    const token = localStorage.getItem("crew-manning-token");
    if (!token) return;

    console.log("🔄 Refreshing contract data...");

    try {
      const results = await Promise.allSettled([
        fetch("/api/v1/admin/contracts", {
          headers: { Authorization: `Bearer ${token}` },
        }).then(async (res) => {
          if (!res.ok) throw new Error(`Contracts API error: ${res.status}`);
          const data = await res.json();
          return Array.isArray(data) ? data : [];
        }),
        fetch("/api/v1/admin/contracts/pending", {
          headers: { Authorization: `Bearer ${token}` },
        }).then(async (res) => {
          if (!res.ok)
            throw new Error(`Pending Contracts API error: ${res.status}`);
          const data = await res.json();
          return Array.isArray(data) ? data : [];
        }),
        fetch("/api/v1/admin/contracts/status/approved", {
          headers: { Authorization: `Bearer ${token}` },
        }).then(async (res) => {
          if (!res.ok)
            throw new Error(`Approved Contracts API error: ${res.status}`);
          const data = await res.json();
          return Array.isArray(data) ? data : [];
        }),
        fetch("/api/v1/admin/contracts/status/rejected", {
          headers: { Authorization: `Bearer ${token}` },
        }).then(async (res) => {
          if (!res.ok)
            throw new Error(`Rejected Contracts API error: ${res.status}`);
          const data = await res.json();
          return Array.isArray(data) ? data : [];
        }),
      ]);

      console.log("📊 API call results:", {
        allContracts:
          results[0].status === "fulfilled"
            ? `${results[0].value.length} contracts`
            : "failed",
        pendingContracts:
          results[1].status === "fulfilled"
            ? `${results[1].value.length} pending`
            : "failed",
        approvedContracts:
          results[2].status === "fulfilled"
            ? `${results[2].value.length} approved`
            : "failed",
        rejectedContracts:
          results[3].status === "fulfilled"
            ? `${results[3].value.length} rejected`
            : "failed",
      });

      const newContracts =
        results[0].status === "fulfilled"
          ? await transformPendingContracts(results[0].value)
          : [];
      const newPendingContracts =
        results[1].status === "fulfilled"
          ? await transformPendingContracts(results[1].value)
          : [];
      const newApprovedContracts =
        results[2].status === "fulfilled"
          ? await transformApprovedContracts(results[2].value)
          : [];
      const newRejectedContracts =
        results[3].status === "fulfilled"
          ? await transformApprovedContracts(results[3].value)
          : [];

      console.log("📋 Transformed contract counts:", {
        all: newContracts.length,
        pending: newPendingContracts.length,
        approved: newApprovedContracts.length,
        rejected: newRejectedContracts.length,
      });

      setContracts(newContracts);
      setPendingContracts(newPendingContracts);
      setApprovedContracts(newApprovedContracts);
      setRejectedContracts(newRejectedContracts);

      console.log("✅ Contract data refreshed successfully");
    } catch (error) {
      console.error("Failed to refresh contract data:", error);
    }
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

  const handleCreateContract = () => {
    alert("Opening create contract modal...");
  };

  const handleEditContract = (contract: Contract) => {
    alert(`Editing contract ${contract.id}`);
  };

  const handleDownloadContract = (contract: Contract) => {
    alert(`Downloading contract ${contract.id}`);
  };

  const handleViewContract = (contract: Contract) => {
    // Use contract reference number (contractNumber) for routing, fall back to numericId or id
    const contractId =
      contract.contractNumber || contract.numericId?.toString() || contract.id;
    router.push(`/admin/contracts/${contractId}`);
  };

  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    action: "approve" | "reject";
    contract: Contract | null;
  }>({ isOpen: false, action: "approve", contract: null });

  const handleConfirmAction = (
    contract: Contract,
    action: "approve" | "reject",
  ) => {
    setConfirmModal({ isOpen: true, action, contract });
  };

  const executeContractAction = async () => {
    if (!confirmModal.contract) return;

    const contract = confirmModal.contract;
    const action = confirmModal.action;

    console.log(`Contract data for ${action}:`, {
      contractNumber: contract.contractNumber,
      numericId: contract.numericId,
      numericIdType: typeof contract.numericId,
      id: contract.id,
      idType: typeof contract.id,
    });

    // CRITICAL FIX: Use numeric ID for external API calls (external API requires integers)
    // Map the contract reference to correct numeric ID to avoid ID conflicts
    let contractId: string;

    if (contract.numericId && typeof contract.numericId === "number") {
      contractId = contract.numericId.toString();
      console.log(`🎯 Using numericId: ${contractId} for contract: ${contract.contractNumber}`);
    } else {
      console.error(`❌ Numeric ID not available for contract ${contract.contractNumber}:`, {
        contractNumber: contract.contractNumber,
        numericId: contract.numericId,
        numericIdType: typeof contract.numericId,
        id: contract.id
      });
      alert(
        `Cannot ${action} contract "${contract.contractNumber}": Missing numeric ID. The external API requires database IDs for operations.`,
      );
      return;
    }

    const token = localStorage.getItem("crew-manning-token");

    try {
      const response = await fetch(
        `/api/v1/admin/contracts/${contractId}/${action}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        let errorMessage = `${action} failed: ${response.statusText}`;
        try {
          const errorData = await response.json();
          console.error("API Error Response:", errorData);

          if (typeof errorData.detail === "string") {
            errorMessage = errorData.detail;
          } else if (typeof errorData.detail === "object") {
            errorMessage = JSON.stringify(errorData.detail, null, 2);
          } else if (errorData.message) {
            errorMessage = errorData.message;
          } else if (typeof errorData === "string") {
            errorMessage = errorData;
          } else {
            errorMessage = `${action} failed: ${response.status} - ${JSON.stringify(errorData)}`;
          }
        } catch (parseError) {
          console.error("Failed to parse error response:", parseError);
          errorMessage = `${action} failed: ${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      console.log(`✅ Contract ${action}d successfully! Refreshing data...`);

      // Add a small delay to ensure external API has processed the change
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Refresh all contract data to show updated status
      await refreshContractData();

      setConfirmModal({ isOpen: false, action: "approve", contract: null });

      // Show success message
      alert(`Contract ${action}d successfully! Status updated.`);
    } catch (error) {
      console.error(`${action} contract error:`, error);

      let errorMessage;
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === "object" && error !== null) {
        errorMessage = JSON.stringify(error, null, 2);
      } else if (typeof error === "string") {
        errorMessage = error;
      } else {
        errorMessage = `Failed to ${action} contract. Please try again.`;
      }

      console.error(`Final error message:`, errorMessage);
      alert(errorMessage);
    }
  };

  const getStatusBadge = (status: Contract["status"]) => {
    switch (status) {
      case "active":
        return "bg-[#e6f3e6] text-[#134e13] dark:bg-green-900/40 dark:text-green-300";
      case "pending":
        return "bg-orange-50 text-orange-800 dark:bg-orange-900/40 dark:text-orange-200";
      case "completed":
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
      case "suspended":
        return "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300";
      case "expired":
        return "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: Contract["status"]) => {
    switch (status) {
      case "active":
        return "Active";
      case "pending":
        return "Pending Review";
      case "completed":
        return "Completed";
      case "suspended":
        return "Rejected";
      case "expired":
        return "Expired";
      default:
        return "Unknown";
    }
  };

  const getTypeBadge = (type: Contract["type"]) => {
    if (type === "full-crew") {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#f3e6e6] text-primary dark:bg-primary/20 dark:text-red-200 border border-[#e2cccc] dark:border-primary/40">
          <span className="size-1.5 rounded-full bg-primary"></span>
          Full Crew
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#f3edf8] text-[#552e69] dark:bg-purple-900/30 dark:text-purple-300 border border-[#e1d5eb] dark:border-purple-800">
        <span className="size-1.5 rounded-full bg-[#7a4891]"></span>
        One-Off
      </span>
    );
  };

  return (
    <div className="font-display bg-background-light dark:bg-background-dark text-[#111418] dark:text-white antialiased min-h-screen flex flex-col overflow-x-hidden">
      {/* Header */}
      <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-[#e8ebf3] dark:border-[#2a2e3b] px-10 py-3 bg-white dark:bg-[#1a202c] shadow-sm">
        <div className="flex items-center gap-8">
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-4 text-[#0e121b] dark:text-white"
          >
            <div className="size-8 text-primary">
              <span className="material-symbols-outlined !text-[32px]">
                anchor
              </span>
            </div>
            <h2 className="text-[#0e121b] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">
              CrewManning Admin
            </h2>
          </Link>
          <label className="hidden lg:flex flex-col min-w-40 !h-10 max-w-64">
            <div className="flex w-full flex-1 items-stretch rounded-lg h-full">
              <div className="text-[#506795] flex border-none bg-[#e8ebf3] dark:bg-[#2a2e3b] items-center justify-center pl-4 rounded-l-lg border-r-0">
                <span className="material-symbols-outlined text-[20px]">
                  search
                </span>
              </div>
              <input
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#0e121b] dark:text-white focus:outline-0 focus:ring-0 border-none bg-[#e8ebf3] dark:bg-[#2a2e3b] focus:border-none h-full placeholder:text-[#506795] px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal"
                placeholder="Global Search"
                value=""
                readOnly
              />
            </div>
          </label>
        </div>
        <div className="flex flex-1 justify-end gap-8">
          <nav className="hidden md:flex items-center gap-9">
            <Link
              href="/admin/dashboard"
              className="text-[#506795] hover:text-primary dark:text-gray-300 dark:hover:text-primary text-sm font-medium leading-normal transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/admin/seafarers"
              className="text-[#506795] hover:text-primary dark:text-gray-300 dark:hover:text-primary text-sm font-medium leading-normal transition-colors"
            >
              Seafarers
            </Link>
            <Link
              href="/admin/shipowners"
              className="text-[#506795] hover:text-primary dark:text-gray-300 dark:hover:text-primary text-sm font-medium leading-normal transition-colors"
            >
              Ship Owners
            </Link>
            <Link
              href="/admin/contracts"
              className="text-primary text-sm font-bold leading-normal border-b-2 border-primary pb-0.5"
            >
              Contracts
            </Link>
            <Link
              href="/admin/interviews"
              className="text-[#506795] hover:text-primary dark:text-gray-300 dark:hover:text-primary text-sm font-medium leading-normal transition-colors"
            >
              Interviews
            </Link>
            <Link
              href="/admin/crew-management"
              className="text-[#506795] hover:text-primary dark:text-gray-300 dark:hover:text-primary text-sm font-medium leading-normal transition-colors"
            >
              Full Crew Mgmt
            </Link>
            <Link
              href="/admin/one-off-crew"
              className="text-[#506795] hover:text-primary dark:text-gray-300 dark:hover:text-primary text-sm font-medium leading-normal transition-colors"
            >
              One-Off Crew
            </Link>
          </nav>
          <div className="flex gap-3 items-center">
            <button className="flex size-10 cursor-pointer items-center justify-center overflow-hidden rounded-full hover:bg-[#e8ebf3] dark:hover:bg-[#2a2e3b] text-[#506795] transition-colors">
              <span className="material-symbols-outlined text-[24px]">
                notifications
              </span>
            </button>
            <button className="flex size-10 cursor-pointer items-center justify-center overflow-hidden rounded-full hover:bg-[#e8ebf3] dark:hover:bg-[#2a2e3b] text-[#506795] transition-colors">
              <span className="material-symbols-outlined text-[24px]">
                settings
              </span>
            </button>
            <button
              onClick={handleLogout}
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border-2 border-white dark:border-[#2a2e3b] shadow-sm ml-2 cursor-pointer"
              style={{
                backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuBGoffDj5B9GBsDnJ_D_Rsfv1y7Lsuk8QkncvfM0uwUYvGiywaaG496AwfbMvJEuB29X5Orp3xQ_E61BfFaqTY8sYgYrHsJobUZrPn2TlpgB-TU6ijJajRGE3S7wcWGkz0GRpniNykO_iFj3YpPUlv9H8K6T4VusqJjFl9umRJlx6aciaCITfWiYtgJqPZEXlKIfu6ABIvoZxJpfDMog9QqFFKexwR7STZbBiPI-ykWmkU_idDAMUcsje1_6mFBcTka6cuPkenJsYDY")`,
              }}
              title="Click to logout"
            ></button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark">
        <div className="flex flex-col max-w-[1440px] mx-auto px-6 py-8 h-full">
          {/* Page Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 text-sm text-[#506795] dark:text-gray-400 mb-1">
                <Link href="/admin/dashboard" className="hover:text-primary">
                  Admin
                </Link>
                <span className="material-symbols-outlined text-[16px]">
                  chevron_right
                </span>
                <span className="text-[#0e121b] dark:text-white font-medium">
                  Contracts
                </span>
              </div>
              <h1 className="text-[#0e121b] dark:text-white text-3xl font-black leading-tight tracking-[-0.033em]">
                Contract Management
              </h1>
              <p className="text-[#506795] dark:text-gray-400 text-base font-normal">
                Manage crew supply and full management agreements across the
                fleet.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleExportReport}
                className="flex items-center justify-center gap-2 rounded-lg h-10 px-4 bg-white dark:bg-[#1a202c] border border-[#d1d8e6] dark:border-[#2a2e3b] text-[#0e121b] dark:text-white text-sm font-bold hover:bg-gray-50 dark:hover:bg-[#2a2e3b]/80 transition-colors shadow-sm ring-1 ring-inset ring-transparent hover:ring-primary/20"
              >
                <span className="material-symbols-outlined text-[20px]">
                  file_download
                </span>
                <span>Export Report</span>
              </button>
              <button
                onClick={handleCreateContract}
                className="flex items-center justify-center gap-2 rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-colors shadow-sm"
              >
                <span className="material-symbols-outlined text-[20px]">
                  add
                </span>
                <span>Create New Contract</span>
              </button>
            </div>
          </div>

          {/* Stats and Filters Grid */}
          <div className="grid grid-cols-12 gap-6 mb-6">
            {/* Stats Cards */}
            <div className="col-span-12 lg:col-span-8 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="flex flex-col justify-between p-4 rounded-xl bg-white dark:bg-[#1a202c] border border-[#e8ebf3] dark:border-[#2a2e3b] shadow-sm">
                <p className="text-[#506795] dark:text-gray-400 text-xs font-bold uppercase tracking-wider">
                  Total Contracts
                </p>
                <div className="flex items-end justify-between mt-2">
                  <h3 className="text-2xl font-bold text-[#0e121b] dark:text-white">
                    {stats.total}
                  </h3>
                  <span className="text-xs font-medium text-emerald-700 bg-emerald-50 dark:bg-emerald-900/20 px-1.5 py-0.5 rounded flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">
                      trending_up
                    </span>{" "}
                    +{((stats.pending / stats.total) * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
              <div className="flex flex-col justify-between p-4 rounded-xl bg-white dark:bg-[#1a202c] border border-[#e8ebf3] dark:border-[#2a2e3b] shadow-sm">
                <p className="text-[#506795] dark:text-gray-400 text-xs font-bold uppercase tracking-wider">
                  Active
                </p>
                <div className="flex items-end justify-between mt-2">
                  <h3 className="text-2xl font-bold text-primary">
                    {stats.active}
                  </h3>
                  <div className="h-1.5 w-16 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary"
                      style={{
                        width: `${(stats.active / stats.total) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col justify-between p-4 rounded-xl bg-white dark:bg-[#1a202c] border border-[#e8ebf3] dark:border-[#2a2e3b] shadow-sm">
                <p className="text-[#506795] dark:text-gray-400 text-xs font-bold uppercase tracking-wider">
                  Expiring Soon
                </p>
                <div className="flex items-end justify-between mt-2">
                  <h3 className="text-2xl font-bold text-[#9d3c3e]">
                    {stats.expiringSoon}
                  </h3>
                  <span className="text-xs text-[#506795]">Next 30 days</span>
                </div>
              </div>
              <div className="flex flex-col justify-between p-4 rounded-xl bg-white dark:bg-[#1a202c] border border-[#e8ebf3] dark:border-[#2a2e3b] shadow-sm">
                <p className="text-[#506795] dark:text-gray-400 text-xs font-bold uppercase tracking-wider">
                  Pending
                </p>
                <div className="flex items-end justify-between mt-2">
                  <h3 className="text-2xl font-bold text-gray-600 dark:text-gray-300">
                    {stats.pending}
                  </h3>
                  <span className="material-symbols-outlined text-[20px] text-gray-400">
                    hourglass_top
                  </span>
                </div>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="col-span-12 lg:col-span-4 flex flex-col gap-3">
              <div className="flex items-center gap-2 bg-white dark:bg-[#1a202c] border border-[#d1d8e6] dark:border-[#2a2e3b] rounded-lg px-3 h-12 shadow-sm focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
                <span className="material-symbols-outlined text-[#506795] text-[20px]">
                  search
                </span>
                <input
                  className="w-full bg-transparent border-none p-0 text-sm text-[#0e121b] dark:text-white placeholder-[#506795] focus:ring-0 focus:outline-none"
                  placeholder="Search by Contract ID, Vessel, or Seafarer..."
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <select
                    className="w-full h-10 pl-3 pr-8 text-sm bg-white dark:bg-[#1a202c] border border-[#d1d8e6] dark:border-[#2a2e3b] rounded-lg appearance-none focus:ring-primary focus:border-primary text-[#0e121b] dark:text-white"
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                  >
                    <option value="">All Contract Types</option>
                    <option value="full-crew">Full Crew Management</option>
                    <option value="one-off">One-Off Supply</option>
                  </select>
                  <span className="absolute right-2 top-2.5 pointer-events-none text-[#506795]">
                    <span className="material-symbols-outlined text-[20px]">
                      expand_more
                    </span>
                  </span>
                </div>
                <div className="relative flex-1">
                  <select
                    className="w-full h-10 pl-3 pr-8 text-sm bg-white dark:bg-[#1a202c] border border-[#d1d8e6] dark:border-[#2a2e3b] rounded-lg appearance-none focus:ring-primary focus:border-primary text-[#0e121b] dark:text-white"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="expired">Expired</option>
                    <option value="suspended">Suspended</option>
                  </select>
                  <span className="absolute right-2 top-2.5 pointer-events-none text-[#506795]">
                    <span className="material-symbols-outlined text-[20px]">
                      expand_more
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Contracts Table */}
          <div className="bg-white dark:bg-[#1a202c] rounded-xl border border-[#d1d8e6] dark:border-[#2a2e3b] shadow-sm flex-1 flex flex-col overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-[#e8ebf3] dark:border-[#2a2e3b] px-4">
              <button
                onClick={() => setActiveTab("all")}
                className={`px-4 py-3 text-sm font-medium ${
                  activeTab === "all"
                    ? "text-primary border-b-2 border-primary"
                    : "text-[#506795] hover:text-[#0e121b] dark:text-gray-400 dark:hover:text-white"
                } transition-colors`}
              >
                All Contracts
              </button>
              <button
                onClick={() => setActiveTab("pending-review")}
                className={`px-4 py-3 text-sm font-medium ${
                  activeTab === "pending-review"
                    ? "text-primary border-b-2 border-primary"
                    : "text-[#506795] hover:text-[#0e121b] dark:text-gray-400 dark:hover:text-white"
                } transition-colors`}
              >
                Pending Review ({pendingContracts.length})
              </button>
              <button
                onClick={() => setActiveTab("approved")}
                className={`px-4 py-3 text-sm font-medium ${
                  activeTab === "approved"
                    ? "text-primary border-b-2 border-primary"
                    : "text-[#506795] hover:text-[#0e121b] dark:text-gray-400 dark:hover:text-white"
                } transition-colors`}
              >
                Approved ({approvedContracts.length})
              </button>
              <button
                onClick={() => setActiveTab("rejected")}
                className={`px-4 py-3 text-sm font-medium ${
                  activeTab === "rejected"
                    ? "text-primary border-b-2 border-primary"
                    : "text-[#506795] hover:text-[#0e121b] dark:text-gray-400 dark:hover:text-white"
                } transition-colors`}
              >
                Rejected ({rejectedContracts.length})
              </button>
              <button
                onClick={() => setActiveTab("drafts")}
                className={`px-4 py-3 text-sm font-medium ${
                  activeTab === "drafts"
                    ? "text-primary border-b-2 border-primary"
                    : "text-[#506795] hover:text-[#0e121b] dark:text-gray-400 dark:hover:text-white"
                } transition-colors`}
              >
                Drafts ({draftsCount})
              </button>
              <button
                onClick={() => setActiveTab("archived")}
                className={`px-4 py-3 text-sm font-medium ${
                  activeTab === "archived"
                    ? "text-primary border-b-2 border-primary"
                    : "text-[#506795] hover:text-[#0e121b] dark:text-gray-400 dark:hover:text-white"
                } transition-colors`}
              >
                Archived
              </button>
            </div>

            {/* Table */}
            <div className="flex-1 overflow-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-[#f8f9fb] dark:bg-[#1e2532] sticky top-0 z-10">
                  <tr>
                    <th className="px-6 py-4 text-xs font-semibold text-[#506795] uppercase tracking-wider w-[140px]">
                      Contract ID
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold text-[#506795] uppercase tracking-wider w-[200px]">
                      Type
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold text-[#506795] uppercase tracking-wider">
                      Vessel / Owner
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold text-[#506795] uppercase tracking-wider">
                      Seafarer / Rank
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold text-[#506795] uppercase tracking-wider">
                      Duration
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold text-[#506795] uppercase tracking-wider w-[120px]">
                      Status
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold text-[#506795] uppercase tracking-wider text-right w-[100px]">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e8ebf3] dark:divide-[#2a2e3b]">
                  {filteredContracts.map((contract, index) => (
                    <tr
                      key={`${contract.id}-${index}`}
                      className="group hover:bg-[#fcf8f8] dark:hover:bg-[#201c1c] transition-colors"
                    >
                      <td className="px-6 py-4">
                        <a
                          onClick={() => handleViewContract(contract)}
                          className="text-primary font-medium hover:underline decoration-primary cursor-pointer"
                          role="button"
                          tabIndex={0}
                        >
                          {contract.contractNumber || contract.id}
                        </a>
                      </td>
                      <td className="px-6 py-4">
                        {getTypeBadge(contract.type)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-[#0e121b] dark:text-white">
                            {contract.vesselName}
                          </span>
                          <span className="text-xs text-[#506795]">
                            {contract.ownerName}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="bg-center bg-no-repeat bg-cover rounded-full size-8 shrink-0 bg-gray-200"
                            style={{
                              backgroundImage: `url("${contract.seafarerAvatar}")`,
                            }}
                          ></div>
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-[#0e121b] dark:text-white">
                              {contract.seafarerName}
                            </span>
                            <span className="text-xs text-[#506795]">
                              {contract.seafarerRank}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <span className="text-sm text-[#0e121b] dark:text-white">
                            {contract.startDate} - {contract.endDate}
                          </span>
                          {contract.status === "active" && (
                            <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-1.5 max-w-[120px]">
                              <div
                                className="bg-[#5a0d0e] h-1.5 rounded-full"
                                style={{ width: `${contract.progress}%` }}
                              ></div>
                            </div>
                          )}
                          {contract.status === "completed" && (
                            <span className="text-xs text-gray-500">
                              Completed
                            </span>
                          )}
                          {contract.statusNote && (
                            <span
                              className={`text-xs font-medium ${
                                contract.status === "pending"
                                  ? "text-orange-700"
                                  : "text-red-700"
                              }`}
                            >
                              {contract.statusNote}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium ${getStatusBadge(
                            contract.status,
                          )}`}
                        >
                          {getStatusLabel(contract.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right relative">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          {contract.status === "pending" ? (
                            <>
                              <button
                                onClick={() =>
                                  handleConfirmAction(contract, "approve")
                                }
                                className="text-green-600 hover:text-green-800 hover:bg-green-50 dark:hover:bg-green-900/20 p-1 rounded"
                                title="Approve"
                              >
                                <span className="material-symbols-outlined text-[20px]">
                                  check_circle
                                </span>
                              </button>
                              <button
                                onClick={() =>
                                  handleConfirmAction(contract, "reject")
                                }
                                className="text-red-600 hover:text-red-800 hover:bg-red-50 dark:hover:bg-red-900/20 p-1 rounded"
                                title="Reject"
                              >
                                <span className="material-symbols-outlined text-[20px]">
                                  cancel
                                </span>
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => handleViewContract(contract)}
                                className="p-1 rounded text-[#506795] hover:text-primary hover:bg-[#f3e6e6] dark:hover:bg-primary/20"
                                title="View Details"
                              >
                                <span className="material-symbols-outlined text-[20px]">
                                  visibility
                                </span>
                              </button>
                              <button
                                onClick={() => handleDownloadContract(contract)}
                                className="p-1 rounded text-[#506795] hover:text-primary hover:bg-[#f3e6e6] dark:hover:bg-primary/20"
                                title="Download"
                              >
                                <span className="material-symbols-outlined text-[20px]">
                                  download
                                </span>
                              </button>
                              <button
                                onClick={() => handleEditContract(contract)}
                                className="p-1 rounded text-[#506795] hover:text-primary hover:bg-[#f3e6e6] dark:hover:bg-primary/20"
                                title="Edit"
                              >
                                <span className="material-symbols-outlined text-[20px]">
                                  edit
                                </span>
                              </button>
                              <button
                                className="p-1 rounded text-[#506795] hover:text-primary hover:bg-[#f3e6e6] dark:hover:bg-primary/20"
                                title="More"
                              >
                                <span className="material-symbols-outlined text-[20px]">
                                  more_vert
                                </span>
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredContracts.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-[#506795]">
                  <span className="material-symbols-outlined text-[48px] mb-4">
                    description
                  </span>
                  <p className="text-lg font-medium">No contracts found</p>
                  <p className="text-sm">
                    Try adjusting your search or filters
                  </p>
                </div>
              )}
            </div>

            {/* Pagination */}
            <div className="border-t border-[#e8ebf3] dark:border-[#2a2e3b] px-6 py-4 flex items-center justify-between">
              <p className="text-sm text-[#506795] dark:text-gray-400">
                Showing{" "}
                <span className="font-medium text-[#0e121b] dark:text-white">
                  1
                </span>{" "}
                to{" "}
                <span className="font-medium text-[#0e121b] dark:text-white">
                  {filteredContracts.length}
                </span>{" "}
                of{" "}
                <span className="font-medium text-[#0e121b] dark:text-white">
                  {stats.total}
                </span>{" "}
                results
              </p>
              <div className="flex gap-2">
                <button
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded border border-[#d1d8e6] dark:border-[#2a2e3b] text-sm text-[#506795] dark:text-gray-400 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(1)}
                  className={`px-3 py-1 rounded text-sm font-medium shadow-sm ${
                    currentPage === 1
                      ? "bg-primary text-white"
                      : "border border-[#d1d8e6] dark:border-[#2a2e3b] text-[#0e121b] dark:text-white hover:bg-gray-50 dark:hover:bg-[#2a2e3b]"
                  }`}
                >
                  1
                </button>
                <button
                  onClick={() => setCurrentPage(2)}
                  className={`px-3 py-1 rounded text-sm font-medium ${
                    currentPage === 2
                      ? "bg-primary text-white shadow-sm"
                      : "border border-[#d1d8e6] dark:border-[#2a2e3b] text-[#0e121b] dark:text-white hover:bg-gray-50 dark:hover:bg-[#2a2e3b]"
                  }`}
                >
                  2
                </button>
                <button
                  onClick={() => setCurrentPage(3)}
                  className={`px-3 py-1 rounded text-sm font-medium ${
                    currentPage === 3
                      ? "bg-primary text-white shadow-sm"
                      : "border border-[#d1d8e6] dark:border-[#2a2e3b] text-[#0e121b] dark:text-white hover:bg-gray-50 dark:hover:bg-[#2a2e3b]"
                  }`}
                >
                  3
                </button>
                <span className="px-2 text-[#506795]">...</span>
                <button className="px-3 py-1 rounded border border-[#d1d8e6] dark:border-[#2a2e3b] text-sm text-[#0e121b] dark:text-white hover:bg-gray-50 dark:hover:bg-[#2a2e3b]">
                  12
                </button>
                <button className="px-3 py-1 rounded border border-[#d1d8e6] dark:border-[#2a2e3b] text-sm text-[#0e121b] dark:text-white hover:bg-gray-50 dark:hover:bg-[#2a2e3b]">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Confirmation Modal */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-[#1a202c] rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    confirmModal.action === "approve"
                      ? "bg-green-100 dark:bg-green-900/30"
                      : "bg-red-100 dark:bg-red-900/30"
                  }`}
                >
                  <span
                    className={`material-symbols-outlined text-2xl ${
                      confirmModal.action === "approve"
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {confirmModal.action === "approve"
                      ? "check_circle"
                      : "cancel"}
                  </span>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-[#0e121b] dark:text-white">
                    {confirmModal.action === "approve" ? "Approve" : "Reject"}{" "}
                    Contract
                  </h3>
                  <p className="text-sm text-[#506795]">
                    Contract:{" "}
                    {confirmModal.contract?.contractNumber ||
                      confirmModal.contract?.id}
                  </p>
                </div>
              </div>
              <p className="text-sm text-[#506795] mb-6">
                Are you sure you want to {confirmModal.action} this contract?
                {confirmModal.action === "reject" &&
                  " This action will mark it as rejected with admin notes."}
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() =>
                    setConfirmModal({
                      isOpen: false,
                      action: "approve",
                      contract: null,
                    })
                  }
                  className="px-4 py-2 text-[#506795] bg-gray-100 dark:bg-[#2a2e3b] rounded-lg hover:bg-gray-200 dark:hover:bg-[#3a3f4b] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={executeContractAction}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    confirmModal.action === "approve"
                      ? "bg-green-600 text-white hover:bg-green-700"
                      : "bg-red-600 text-white hover:bg-red-700"
                  }`}
                >
                  {confirmModal.action === "approve" ? "Approve" : "Reject"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
