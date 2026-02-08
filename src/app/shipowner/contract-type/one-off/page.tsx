"use client";

import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

interface CrewPosition {
  id: string;
  rank: string;
  quantity: number;
  experience: string;
  nationality: string;
}

export default function OneOffContractPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    vessel_id: "",
    operational_zone: "",
    target_start_date: "",
    duration_value: "6",
    duration_unit: "Months",
    port_of_embarkation: "",
    port_of_disembarkation: "",
  });

  const [positions, setPositions] = useState<CrewPosition[]>([
    {
      id: "1",
      rank: "Master / Captain",
      quantity: 1,
      experience: "5+ Years",
      nationality: "Any",
    },
    {
      id: "2",
      rank: "2nd Engineer",
      quantity: 2,
      experience: "3-5 Years",
      nationality: "Any",
    },
  ]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePositionChange = (
    id: string,
    field: keyof CrewPosition,
    value: string | number
  ) => {
    setPositions((prev) =>
      prev.map((pos) =>
        pos.id === id
          ? { ...pos, [field]: field === "quantity" ? parseInt(value as string) : value }
          : pos
      )
    );
  };

  const addPosition = () => {
    const newId = (Math.max(...positions.map((p) => parseInt(p.id)), 0) + 1).toString();
    setPositions((prev) => [
      ...prev,
      {
        id: newId,
        rank: "Chief Officer",
        quantity: 1,
        experience: "5+ Years",
        nationality: "Any",
      },
    ]);
  };

  const deletePosition = (id: string) => {
    if (positions.length > 1) {
      setPositions((prev) => prev.filter((pos) => pos.id !== id));
    } else {
      setError("Contract must have at least one position");
    }
  };

  const calculateSummary = () => {
    const totalQuantity = positions.reduce((sum, pos) => sum + pos.quantity, 0);
    return {
      totalPositions: positions.length,
      totalCrew: totalQuantity,
      duration: `${formData.duration_value} ${formData.duration_unit}`,
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    if (!user?.accessToken) {
      setError("You must be logged in to create a contract");
      setIsSubmitting(false);
      return;
    }

    if (!formData.vessel_id || !formData.target_start_date || !formData.port_of_embarkation) {
      setError("Please fill in all required fields");
      setIsSubmitting(false);
      return;
    }

    try {
      // Build positions array - for one-off contracts, use first position as primary
      const primaryPosition = positions[0];
      
      // Map vessel selection to name and type
      // Options: "1" = MV Atlantic Star (Bulk Carrier), "2" = SS Pacific Voyager (Container Ship), "3" = MV Northern Light (Oil Tanker)
      const vesselMap: Record<string, { name: string; type: string }> = {
        "1": { name: "MV Atlantic Star", type: "Bulk Carrier" },
        "2": { name: "SS Pacific Voyager", type: "Container Ship" },
        "3": { name: "MV Northern Light", type: "Oil Tanker" },
      };
      const selectedVessel = vesselMap[formData.vessel_id] || { name: "New Vessel", type: "General" };
      
      // Calculate end date based on target_start_date and duration
      const targetStartDate = new Date(formData.target_start_date);
      const endDate = new Date(targetStartDate);
      const durationNum = parseInt(formData.duration_value);
      if (formData.duration_unit === "Months") {
        endDate.setMonth(endDate.getMonth() + durationNum);
      } else if (formData.duration_unit === "Weeks") {
        endDate.setDate(endDate.getDate() + durationNum * 7);
      } else if (formData.duration_unit === "Days") {
        endDate.setDate(endDate.getDate() + durationNum);
      }
      
      const contractData = {
        vessel_name: selectedVessel.name,
        vessel_type: selectedVessel.type,
        position: primaryPosition.rank, // Primary position
        position_type: "spot", // One-off contracts are spot contracts
        target_start_date: formData.target_start_date, // YYYY-MM-DD format from input
        end_date: endDate.toISOString().split("T")[0], // YYYY-MM-DD format
        expected_duration_months: durationNum, // Convert to number
        operational_zone: formData.operational_zone || "Global", // Required field
        port_of_embarkation: formData.port_of_embarkation,
        port_of_disembarkation: formData.port_of_disembarkation || "",
        positions: positions.map((pos) => {
          // Map position names to rank IDs
          const rankIdMap: Record<string, string> = {
            "Master / Captain": "master",
            "Chief Officer": "chief-officer",
            "2nd Officer": "second-officer",
            "3rd Officer": "third-officer",
            "Chief Engineer": "chief-engineer",
            "2nd Engineer": "second-engineer",
            "3rd Engineer": "third-engineer",
            "Junior Engineer": "junior-engineer",
          };
          return {
            position: pos.rank,
            rank_id: rankIdMap[pos.rank] || pos.rank.toLowerCase().replace(/ /g, "-"),
            quantity: pos.quantity,
            min_experience_years: parseInt(pos.experience.split("+")[0]) || 0,
            nationality: pos.nationality,
          };
        }),
      };

      console.log("Submitting contract:", contractData);

      const response = await fetch("/api/v1/contracts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.accessToken}`,
        },
        body: JSON.stringify(contractData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("API Error Response:", {
          status: response.status,
          statusText: response.statusText,
          data: errorData,
        });
        const errorMsg =
          errorData.detail ||
          errorData.message ||
          errorData.error ||
          JSON.stringify(errorData) ||
          `HTTP ${response.status}`;
        throw new Error(errorMsg);
      }

      const result = await response.json();
      console.log("Contract created:", result);

      // Redirect to success page with contract ID
      router.push(`/shipowner/contract-type/one-off/success?contract_id=${result.id}`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create contract";
      setError(errorMessage);
      console.error("Contract creation error:", err);
      console.error("Error details:", { errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  const summary = calculateSummary();

  return (
    <div className="flex h-screen overflow-hidden font-display text-slate-900 dark:text-white bg-background-light dark:bg-background-dark">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-white dark:bg-[#1A2235] border-r border-slate-200 dark:border-slate-800 flex flex-col transition-colors duration-300">
        <div className="h-16 flex items-center px-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 text-primary font-bold text-xl tracking-tight">
            <span className="material-symbols-outlined text-3xl icon-fill">
              anchor
            </span>
            MaritimeOps
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          <div className="px-3 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Menu
          </div>
          <Link
            href="/shipowner/dashboard"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors font-medium group"
          >
            <span className="material-symbols-outlined">grid_view</span>
            Dashboard
          </Link>
          <Link
            href="#"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary/10 text-primary font-medium group"
          >
            <span className="material-symbols-outlined icon-fill">
              description
            </span>
            Contracts
          </Link>
          <Link
            href="#"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors font-medium group"
          >
            <span className="material-symbols-outlined">toc</span>
            Contract List
          </Link>
          <Link
            href="#"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors font-medium group"
          >
            <span className="material-symbols-outlined">groups</span>
            Crew Management
          </Link>
          <Link
            href="#"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors font-medium group"
          >
            <span className="material-symbols-outlined">sailing</span>
            Vessels
          </Link>
          <div className="px-3 mt-6 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            System
          </div>
          <Link
            href="#"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors font-medium group"
          >
            <span className="material-symbols-outlined">settings</span>
            Settings
          </Link>
          <Link
            href="#"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors font-medium group"
          >
            <span className="material-symbols-outlined">help</span>
            Help & Support
          </Link>
        </nav>
        <div className="p-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 bg-cover bg-center"
              style={{
                backgroundImage: "url('/images/default-shipowner-avatar.jpg')",
              }}
            ></div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-slate-900 dark:text-white">
                {user?.name || "Agent"}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Shipowner
              </span>
            </div>
          </div>
        </div>
      </aside>
      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <header className="h-16 flex items-center justify-between px-6 bg-white dark:bg-[#1A2235] border-b border-slate-200 dark:border-slate-800 shrink-0">
          <div className="flex items-center flex-1 max-w-lg">
            <div className="relative w-full">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                search
              </span>
              <input
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border-none focus:ring-2 focus:ring-primary text-sm text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400"
                placeholder="Search contracts..."
                type="text"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-[#1A2235]"></span>
            </button>
            <button className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
              <span className="material-symbols-outlined">apps</span>
            </button>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto bg-slate-50 dark:bg-background-dark p-6 lg:p-10">
          <div className="max-w-6xl mx-auto">
            {/* Breadcrumbs and Title */}
            <div className="flex flex-col gap-1 mb-8">
              <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <Link href="/shipowner/dashboard" className="hover:text-primary transition-colors">
                  Dashboard
                </Link>
                <span className="material-symbols-outlined text-[12px]">
                  chevron_right
                </span>
                <span className="text-slate-900 dark:text-white font-medium">
                  New One-Off Contract
                </span>
              </div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                Create One-Off Supply Contract
              </h1>
              <p className="text-slate-500 dark:text-slate-400">
                Define the vessel, duration, and crew composition for a new
                deployment.
              </p>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-red-600 dark:text-red-400">
                    error
                  </span>
                  <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                </div>
              </div>
            )}

            {/* Progress Steps */}
            <div className="mb-10">
              <div className="flex items-center justify-between w-full relative">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-200 dark:bg-slate-800 -z-10 rounded-full"></div>
                <div className="flex flex-col items-center gap-2 bg-slate-50 dark:bg-background-dark px-4">
                  <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold shadow-lg shadow-primary/30 ring-4 ring-white dark:ring-background-dark">
                    1
                  </div>
                  <span className="text-sm font-bold text-primary">
                    Contract Details
                  </span>
                </div>
                <div className="flex flex-col items-center gap-2 bg-slate-50 dark:bg-background-dark px-4">
                  <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 text-slate-500 dark:text-slate-400 flex items-center justify-center font-bold ring-4 ring-white dark:ring-background-dark">
                    2
                  </div>
                  <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    Crew Requirements
                  </span>
                </div>
                <div className="flex flex-col items-center gap-2 bg-slate-50 dark:bg-background-dark px-4">
                  <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 text-slate-500 dark:text-slate-400 flex items-center justify-center font-bold ring-4 ring-white dark:ring-background-dark">
                    3
                  </div>
                  <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    Review & Submit
                  </span>
                </div>
              </div>
            </div>

            {/* Main Form Grid */}
            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                {/* Vessel & Operation */}
                <div className="bg-white dark:bg-[#1A2235] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
                  <div className="flex items-center gap-3 mb-6 border-b border-slate-100 dark:border-slate-700 pb-4">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary">
                      <span className="material-symbols-outlined text-lg">
                        sailing
                      </span>
                    </span>
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                      Vessel & Operation
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                        Select Vessel <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <select
                          name="vessel_id"
                          value={formData.vessel_id}
                          onChange={handleInputChange}
                          required
                          className="w-full rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary"
                        >
                          <option value="">
                            Choose a vessel from your fleet...
                          </option>
                          <option value="1">
                            MV Atlantic Star (Bulk Carrier)
                          </option>
                          <option value="2">
                            SS Pacific Voyager (Container Ship)
                          </option>
                          <option value="3">
                            MV Northern Light (Oil Tanker)
                          </option>
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                          <span className="material-symbols-outlined text-slate-500">
                            expand_more
                          </span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                        Contract Reference ID
                      </label>
                      <input
                        className="w-full rounded-lg bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-500 cursor-not-allowed font-mono text-sm"
                        readOnly
                        type="text"
                        value="C-AUTO-GENERATED"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                        Operational Zone
                      </label>
                      <input
                        name="operational_zone"
                        value={formData.operational_zone}
                        onChange={handleInputChange}
                        className="w-full rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary placeholder-slate-400"
                        placeholder="e.g. North Sea"
                        type="text"
                      />
                    </div>
                  </div>
                </div>

                {/* Duration & Logistics */}
                <div className="bg-white dark:bg-[#1A2235] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
                  <div className="flex items-center gap-3 mb-6 border-b border-slate-100 dark:border-slate-700 pb-4">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary">
                      <span className="material-symbols-outlined text-lg">
                        calendar_month
                      </span>
                    </span>
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                      Duration & Logistics
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                        Target Start Date{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          name="target_start_date"
                          value={formData.target_start_date}
                          onChange={handleInputChange}
                          required
                          className="w-full rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary"
                          type="date"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                        Expected Duration
                      </label>
                      <div className="flex">
                        <input
                          name="duration_value"
                          value={formData.duration_value}
                          onChange={handleInputChange}
                          className="w-full rounded-l-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary"
                          placeholder="6"
                          type="number"
                        />
                        <select
                          name="duration_unit"
                          value={formData.duration_unit}
                          onChange={handleInputChange}
                          className="rounded-r-lg border-l-0 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary px-4"
                        >
                          <option>Months</option>
                          <option>Weeks</option>
                          <option>Days</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                        Port of Embarkation <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                          location_on
                        </span>
                        <input
                          name="port_of_embarkation"
                          value={formData.port_of_embarkation}
                          onChange={handleInputChange}
                          required
                          className="w-full pl-10 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary"
                          placeholder="Search port..."
                          type="text"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                        Port of Disembarkation (Optional)
                      </label>
                      <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                          location_on
                        </span>
                        <input
                          name="port_of_disembarkation"
                          value={formData.port_of_disembarkation}
                          onChange={handleInputChange}
                          className="w-full pl-10 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary"
                          placeholder="Search port..."
                          type="text"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Crew Composition */}
                <div className="bg-white dark:bg-[#1A2235] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
                  <div className="flex items-center justify-between mb-6 border-b border-slate-100 dark:border-slate-700 pb-4">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary">
                        <span className="material-symbols-outlined text-lg">
                          groups
                        </span>
                      </span>
                      <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                        Crew Composition
                      </h3>
                    </div>
                    <button
                      type="button"
                      className="text-sm text-primary font-semibold hover:underline"
                    >
                      Bulk Upload CSV
                    </button>
                  </div>
                  <div className="space-y-4">
                    {/* Column Headers */}
                    <div className="hidden md:grid grid-cols-12 gap-4 text-xs font-semibold text-slate-500 uppercase tracking-wider px-2">
                      <div className="col-span-4">Position / Rank</div>
                      <div className="col-span-2">Quantity</div>
                      <div className="col-span-3">Min. Experience</div>
                      <div className="col-span-2">Nationality Pref.</div>
                      <div className="col-span-1"></div>
                    </div>

                    {/* Crew Position Rows */}
                    {positions.map((position) => (
                      <div
                        key={position.id}
                        className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-200 dark:border-slate-700"
                      >
                        <div className="col-span-12 md:col-span-4">
                          <label className="md:hidden text-xs text-slate-500 font-bold mb-1 block">
                            Position
                          </label>
                          <select
                            value={position.rank}
                            onChange={(e) =>
                              handlePositionChange(position.id, "rank", e.target.value)
                            }
                            className="w-full rounded-md bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                          >
                            <option>Master / Captain</option>
                            <option>Chief Officer</option>
                            <option>2nd Officer</option>
                            <option>Chief Engineer</option>
                            <option>2nd Engineer</option>
                            <option>Boatswain</option>
                            <option>Able Seaman</option>
                          </select>
                        </div>
                        <div className="col-span-6 md:col-span-2">
                          <label className="md:hidden text-xs text-slate-500 font-bold mb-1 block">
                            Qty
                          </label>
                          <input
                            type="number"
                            min="1"
                            value={position.quantity}
                            onChange={(e) =>
                              handlePositionChange(position.id, "quantity", e.target.value)
                            }
                            className="w-full rounded-md bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                          />
                        </div>
                        <div className="col-span-6 md:col-span-3">
                          <label className="md:hidden text-xs text-slate-500 font-bold mb-1 block">
                            Experience
                          </label>
                          <select
                            value={position.experience}
                            onChange={(e) =>
                              handlePositionChange(position.id, "experience", e.target.value)
                            }
                            className="w-full rounded-md bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                          >
                            <option>5+ Years</option>
                            <option>3-5 Years</option>
                            <option>1-3 Years</option>
                            <option>No Experience</option>
                          </select>
                        </div>
                        <div className="col-span-12 md:col-span-2">
                          <label className="md:hidden text-xs text-slate-500 font-bold mb-1 block">
                            Nationality
                          </label>
                          <select
                            value={position.nationality}
                            onChange={(e) =>
                              handlePositionChange(position.id, "nationality", e.target.value)
                            }
                            className="w-full rounded-md bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                          >
                            <option>Any</option>
                            <option>Filipino</option>
                            <option>Indian</option>
                            <option>Ukrainian</option>
                            <option>Polish</option>
                          </select>
                        </div>
                        <div className="col-span-12 md:col-span-1 flex justify-end md:justify-center md:pt-2">
                          <button
                            type="button"
                            onClick={() => deletePosition(position.id)}
                            className="text-slate-400 hover:text-red-500 transition-colors disabled:opacity-50"
                            disabled={positions.length === 1}
                          >
                            <span className="material-symbols-outlined">
                              delete
                            </span>
                          </button>
                        </div>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={addPosition}
                      className="w-full py-3 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-700 text-slate-500 hover:text-primary hover:border-primary transition-colors flex items-center justify-center gap-2 font-medium bg-slate-50/50 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                    >
                      <span className="material-symbols-outlined">
                        add_circle
                      </span>
                      Add Another Position
                    </button>
                  </div>
                </div>
              </div>

              {/* Sidebar: Pro Tip & Summary */}
              <div className="space-y-6">
                <div className="bg-primary text-white rounded-xl shadow-lg shadow-primary/20 p-6 relative overflow-hidden">
                  <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-white/10"></div>
                  <div className="absolute -right-2 -bottom-6 w-20 h-20 rounded-full bg-white/10"></div>
                  <h4 className="font-bold text-lg mb-2 flex items-center gap-2">
                    <span className="material-symbols-outlined text-xl">
                      lightbulb
                    </span>
                    Pro Tip
                  </h4>
                  <p className="text-sm text-white/90 leading-relaxed">
                    Contracts with durations longer than 6 months require
                    specific insurance verification. Ensure the vessel's P&amp;I
                    club coverage is up to date before proceeding.
                  </p>
                </div>
                <div className="bg-white dark:bg-[#1A2235] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 sticky top-6">
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-4">
                    Request Summary
                  </h3>
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500 dark:text-slate-400">
                        Total Positions
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {summary.totalPositions}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500 dark:text-slate-400">
                        Total Crew Count
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {summary.totalCrew}
                      </span>
                    </div>
                    <div className="h-px bg-slate-100 dark:bg-slate-700 my-2"></div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500 dark:text-slate-400">
                        Est. Duration
                      </span>
                      <span className="font-mono text-slate-900 dark:text-white">
                        {summary.duration}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3 px-4 bg-primary hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-lg shadow-lg shadow-primary/30 transition-all flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Creating...
                        </>
                      ) : (
                        <>
                          Submit Contract
                          <span className="material-symbols-outlined">
                            arrow_forward
                          </span>
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      className="w-full py-3 px-4 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-medium rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
                      disabled={isSubmitting}
                    >
                      Save Draft
                    </button>
                  </div>
                  <div className="mt-4 text-center">
                    <Link
                      href="/shipowner/dashboard"
                      className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 underline"
                    >
                      Cancel and return to dashboard
                    </Link>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
