"use client";

import { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";

interface Contract {
  id: string;
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

function AdminContractDetailPage() {
  const router = useRouter();
  const params = useParams();
  const contractId = params?.contract_id as string;
  const [contract, setContract] = useState<Contract | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles(files);
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      alert("Please select files to upload");
      return;
    }

    setUploading(true);
    const token = localStorage.getItem("crew-manning-token");

    try {
      const formData = new FormData();
      selectedFiles.forEach((file) => {
        formData.append("files", file);
      });

      const response = await fetch(
        `/api/v1/admin/contracts/${contractId}/documents`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        },
      );

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status}`);
      }

      await response.json();
      alert("Documents uploaded successfully!");
      setSelectedFiles([]); // Clear selected files

      // Reset the file input
      const fileInput = document.getElementById(
        "file-upload",
      ) as HTMLInputElement;
      if (fileInput) {
        fileInput.value = "";
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload documents. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    async function fetchContract() {
      // Validate params
      if (!contractId) {
        setError("Contract ID not found");
        setLoading(false);
        return;
      }

      // Check authentication
      const token = localStorage.getItem("crew-manning-token");
      if (!token) {
        setError("No authentication token found");
        setLoading(false);
        return;
      }

      try {
        // Fetch individual contract details using the specific endpoint
        const response = await fetch(`/api/v1/admin/contracts/${contractId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          if (response.status === 404) {
            setError("Contract not found");
            return;
          }
          setError(`HTTP ${response.status}: ${response.statusText}`);
          return;
        }

        const contractData: Contract = await response.json();
        setContract(contractData);
      } catch (error) {
        console.error("Failed to fetch contract:", error);
        setError("Failed to load contract details");
      } finally {
        setLoading(false);
      }
    }

    fetchContract();
  }, [contractId]);

  const handleLogout = () => {
    localStorage.removeItem("crew-manning-user");
    localStorage.removeItem("crew-manning-token");
    localStorage.removeItem("crew-manning-profile");
    router.push("/admin/login");
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "submitted":
        return "bg-orange-100 text-orange-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="font-display bg-background-light dark:bg-background-dark text-[#111418] dark:text-white antialiased min-h-screen flex flex-col overflow-x-hidden">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-[#506795]">Loading contract details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="font-display bg-background-light dark:bg-background-dark text-[#111418] dark:text-white antialiased min-h-screen flex flex-col overflow-x-hidden">
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
              <h2 className="text-[#0e121b] dark:text-white text-lg font-bold">
                CrewManning Admin
              </h2>
            </Link>
          </div>
        </header>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <span className="material-symbols-outlined text-[48px] text-red-500 mb-4">
              error
            </span>
            <h3 className="text-xl font-semibold mb-2">
              Error Loading Contract
            </h3>
            <p className="text-[#506795] mb-4">{error}</p>
            <button
              onClick={() => router.push("/admin/contracts")}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Back to Contracts
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!contract) return null;

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
            <h2 className="text-[#0e121b] dark:text-white text-lg font-bold">
              CrewManning Admin
            </h2>
          </Link>
        </div>
        <div className="flex gap-3 items-center">
          <button className="flex size-10 cursor-pointer items-center justify-center overflow-hidden rounded-full hover:bg-[#e8ebf3] dark:hover:bg-[#2a2e3b] text-[#506795] transition-colors">
            <span className="material-symbols-outlined text-[24px]">
              settings
            </span>
          </button>
          <button
            onClick={handleLogout}
            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border-2 border-white dark:border-[#2a2e3b] shadow-sm ml-2 cursor-pointer"
            style={{
              backgroundImage: `url("https://ui-avatars.com/api/?name=Admin&background=1F2937&color=fff&size=36")`,
            }}
            title="Click to logout"
          ></button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark">
        <div className="container mx-auto px-6 py-8 max-w-4xl">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-[#506795] dark:text-gray-400 mb-6">
            <Link href="/admin/dashboard" className="hover:text-primary">
              Admin
            </Link>
            <span className="material-symbols-outlined text-[16px]">
              chevron_right
            </span>
            <Link href="/admin/contracts" className="hover:text-primary">
              Contracts
            </Link>
            <span className="material-symbols-outlined text-[16px]">
              chevron_right
            </span>
            <span className="text-[#0e121b] dark:text-white font-medium">
              Contract {contract.contract_number}
            </span>
          </div>

          {/* Contract Header */}
          <div className="bg-white dark:bg-[#1a202c] rounded-xl border border-[#d1d8e6] dark:border-[#2a2e3b] shadow-sm p-6 mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
              <div>
                <h1 className="text-3xl font-black text-[#0e121b] dark:text-white mb-2">
                  Contract {contract.contract_number}
                </h1>
                <div className="flex flex-wrap items-center gap-4">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(contract.status)}`}
                  >
                    {contract.status}
                  </span>
                  <div className="flex items-center gap-2 text-[#506795]">
                    <span className="material-symbols-outlined text-[18px]">
                      directions_boat
                    </span>
                    <span>{contract.vessel_type}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#506795]">
                    <span className="material-symbols-outlined text-[18px}">
                      location_on
                    </span>
                    <span>{contract.operational_zone}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <button className="px-4 py-2 border border-[#d1d8e6] dark:border-[#2a2e3b] text-[#0e121b] dark:text-white rounded-lg hover:bg-gray-50 dark:hover:bg-[#2a2e3b] transition-colors">
                  Download PDF
                </button>
                <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
                  Edit Contract
                </button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-[#f8f9fb] dark:bg-[#1e2532] rounded-lg">
              <div className="text-center">
                <p className="text-xs text-[#506795] uppercase tracking-wider">
                  Duration
                </p>
                <p className="text-lg font-semibold text-[#0e121b] dark:text-white">
                  {contract.expected_duration_months} months
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-[#506795] uppercase tracking-wider">
                  Positions
                </p>
                <p className="text-lg font-semibold text-[#0e121b] dark:text-white">
                  {contract.positions.reduce(
                    (sum, pos) => sum + pos.quantity,
                    0,
                  )}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-[#506795] uppercase tracking-wider">
                  Embarkation
                </p>
                <p className="text-sm font-semibold text-[#0e121b] dark:text-white">
                  {contract.port_of_embarkation}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-[#506795] uppercase tracking-wider">
                  Disembarkation
                </p>
                <p className="text-sm font-semibold text-[#0e121b] dark:text-white">
                  {contract.port_of_disembarkation}
                </p>
              </div>
            </div>
          </div>

          {/* Contract Details Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Basic Information */}
            <div className="bg-white dark:bg-[#1a202c] rounded-xl border border-[#d1d8e6] dark:border-[#2a2e3b] shadow-sm p-6">
              <h3 className="text-xl font-semibold text-[#0e121b] dark:text-white mb-4">
                Basic Information
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-[#506795]">Contract Number:</span>
                  <span className="font-medium text-[#0e121b] dark:text-white">
                    {contract.contract_number}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#506795]">Status:</span>
                  <span
                    className={`font-medium capitalize ${getStatusColor(contract.status)} px-2 py-1 rounded text-xs`}
                  >
                    {contract.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#506795]">Vessel Type:</span>
                  <span className="font-medium text-[#0e121b] dark:text-white">
                    {contract.vessel_type}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#506795]">Operational Zone:</span>
                  <span className="font-medium text-[#0e121b] dark:text-white">
                    {contract.operational_zone}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#506795]">Start Date:</span>
                  <span className="font-medium text-[#0e121b] dark:text-white">
                    {contract.target_start_date}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#506795]">Duration:</span>
                  <span className="font-medium text-[#0e121b] dark:text-white">
                    {contract.expected_duration_months} months
                  </span>
                </div>
              </div>
            </div>

            {/* Port Information */}
            <div className="bg-white dark:bg-[#1a202c] rounded-xl border border-[#d1d8e6] dark:border-[#2a2e3b] shadow-sm p-6">
              <h3 className="text-xl font-semibold text-[#0e121b] dark:text-white mb-4">
                Port Information
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-[#506795] mb-1">
                    Port of Embarkation
                  </label>
                  <p className="font-medium text-[#0e121b] dark:text-white">
                    {contract.port_of_embarkation}
                  </p>
                </div>
                <div>
                  <label className="block text-sm text-[#506795] mb-1">
                    Port of Disembarkation
                  </label>
                  <p className="font-medium text-[#0e121b] dark:text-white">
                    {contract.port_of_disembarkation}
                  </p>
                </div>
                {contract.admin_notes && (
                  <div className="pt-4 border-t border-[#e8ebf3] dark:border-[#2a2e3b]">
                    <label className="block text-sm text-[#506795] mb-2">
                      Admin Notes
                    </label>
                    <p className="text-[#0e121b] dark:text-white italic">
                      {contract.admin_notes}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Positions Required */}
          <div className="bg-white dark:bg-[#1a202c] rounded-xl border border-[#d1d8e6] dark:border-[#2a2e3b] shadow-sm p-6">
            <h3 className="text-xl font-semibold text-[#0e121b] dark:text-white mb-6">
              Positions Required
            </h3>
            <div className="space-y-4">
              {contract.positions.map((position, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-[#f8f9fb] dark:bg-[#1e2532] rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary">
                        person
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#0e121b] dark:text-white capitalize">
                        {position.rank_id.replace(/_/g, " ").toLowerCase()}
                      </h4>
                      <p className="text-sm text-[#506795]">
                        {position.min_experience_years} years experience •{" "}
                        {position.nationality_preference}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">
                      {position.quantity}
                    </div>
                    <div className="text-xs text-[#506795]">positions</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Document Upload */}
          <div className="bg-white dark:bg-[#1a202c] rounded-xl border border-[#d1d8e6] dark:border-[#2a2e3b] shadow-sm p-6">
            <h3 className="text-xl font-semibold text-[#0e121b] dark:text-white mb-4">
              Upload Documents
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-[#506795] mb-2">
                  Select Files
                </label>
                <input
                  id="file-upload"
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  className="w-full p-3 border border-[#d1d8e6] dark:border-[#2a2e3b] rounded-lg bg-background-light dark:bg-[#1a202c] text-[#0e121b] dark:text-white"
                  onChange={handleFileChange}
                  disabled={uploading}
                />
                {selectedFiles.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm text-[#0e121b] dark:text-white">
                      Selected files: {selectedFiles.length}
                    </p>
                    <ul className="mt-1 text-xs text-[#506795]">
                      {selectedFiles.map((file, index) => (
                        <li key={index}>
                          {file.name} ({(file.size / 1024).toFixed(1)} KB)
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <p className="text-xs text-[#506795] mt-1">
                  Supported formats: PDF, DOC, DOCX, JPG, PNG (max 10MB per
                  file)
                </p>
              </div>
              <button
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                onClick={handleUpload}
                disabled={uploading || selectedFiles.length === 0}
              >
                {uploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Uploading...
                  </>
                ) : (
                  "Upload Documents"
                )}
              </button>
            </div>
          </div>

          {/* Back Button */}
          <div className="mt-8 text-center">
            <Link
              href="/admin/contracts"
              className="px-6 py-3 bg-gray-100 dark:bg-[#2a2e3b] text-[#0e121b] dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-[#1e2532] transition-colors inline-flex items-center gap-2"
            >
              <span className="material-symbols-outlined">arrow_back</span>
              Back to Contracts
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AdminContractDetailPage />
    </Suspense>
  );
}
