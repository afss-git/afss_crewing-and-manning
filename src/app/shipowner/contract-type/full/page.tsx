"use client";

import Link from "next/link";
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function FullManagementContractPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [vesselName, setVesselName] = useState("");
  const [imoNumber, setImoNumber] = useState("");
  const [vesselType, setVesselType] = useState("");
  const [vesselFlag, setVesselFlag] = useState("");
  const [operationalRoutes, setOperationalRoutes] = useState("");
  const [commencementDate, setCommencementDate] = useState("");
  const [duration, setDuration] = useState("");
  const [services, setServices] = useState<string[]>([]);
  const [certificateFile, setCertificateFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const toggleService = (value: string) => {
    setServices((prev) => (prev.includes(value) ? prev.filter((s) => s !== value) : [...prev, value]));
  };

  const validate = () => {
    if (!vesselName.trim()) return "Vessel name is required";
    if (!vesselType) return "Vessel type is required";
    if (!vesselFlag.trim()) return "Vessel flag is required";
    if (!duration) return "Agreement duration is required";
    if (!commencementDate.match(/^\d{4}-\d{2}-\d{2}$/)) return "Commencement date must be in YYYY-MM-DD format";
    if (!imoNumber.match(/^\d{7}$/)) return "IMO number must be 7 digits";
    if (services.length === 0) return "Select at least one service";
    return null;
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setFormError(null);
    const err = validate();
    if (err) {
      setFormError(err);
      return;
    }
    if (!user?.accessToken) {
      setFormError("Not authenticated. Please log in.");
      return;
    }

    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("vessel_type", vesselType);
      if (certificateFile) fd.append("vessel_certificates", certificateFile, certificateFile.name);
      fd.append("duration", duration);
      fd.append("vessel_name", vesselName);
      fd.append("vessel_flag", vesselFlag);
      fd.append("operational_routes", operationalRoutes);
      fd.append("commencement_date", commencementDate);
      fd.append("imo_number", imoNumber);
      // append each selected service as separate field entries
      services.forEach((s) => fd.append("services", s));

      const res = await fetch("/api/v1/crew-management", {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${user.accessToken}`,
        },
        body: fd,
      });

      if (!res.ok) {
        const json = await res.json().catch(() => null);
        throw new Error(json?.message || `HTTP ${res.status}`);
      }

      router.push("/shipowner/contract-type/full/success");
    } catch (err: any) {
      setFormError(err?.message || "Submission failed");
    } finally {
      setSubmitting(false);
    }
  };
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
                Agent Smith
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Senior Agent
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
                <Link
                  href="/shipowner/dashboard"
                  className="hover:text-primary transition-colors"
                >
                  Dashboard
                </Link>
                <span className="material-symbols-outlined text-[12px]">
                  chevron_right
                </span>
                <Link href="#" className="hover:text-primary transition-colors">
                  Contracts
                </Link>
                <span className="material-symbols-outlined text-[12px]">
                  chevron_right
                </span>
                <span className="text-slate-900 dark:text-white font-medium">
                  Full Crew Management
                </span>
              </div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                Create Full Crew Management Contract
              </h1>
              <p className="text-slate-500 dark:text-slate-400">
                Establish a comprehensive management agreement including
                technical, crew, and operational oversight.
              </p>
            </div>
            {/* Progress Steps */}
            <div className="mb-10">
              <div className="flex items-center justify-between w-full relative">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-200 dark:bg-slate-800 -z-10 rounded-full"></div>
                <div className="flex flex-col items-center gap-2 bg-slate-50 dark:bg-background-dark px-4">
                  <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold shadow-lg shadow-primary/30 ring-4 ring-white dark:ring-background-dark">
                    1
                  </div>
                  <span className="text-sm font-bold text-primary">
                    Vessel & Scope
                  </span>
                </div>
                <div className="flex flex-col items-center gap-2 bg-slate-50 dark:bg-background-dark px-4">
                  <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 text-slate-500 dark:text-slate-400 flex items-center justify-center font-bold ring-4 ring-white dark:ring-background-dark">
                    2
                  </div>
                  <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    Compliance & Budget
                  </span>
                </div>
                <div className="flex flex-col items-center gap-2 bg-slate-50 dark:bg-background-dark px-4">
                  <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 text-slate-500 dark:text-slate-400 flex items-center justify-center font-bold ring-4 ring-white dark:ring-background-dark">
                    3
                  </div>
                  <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    Final Review
                  </span>
                </div>
              </div>
            </div>
            {/* Main Form Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                {/* Vessel Information */}
                <div className="bg-white dark:bg-[#1A2235] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
                  <div className="flex items-center gap-3 mb-6 border-b border-slate-100 dark:border-slate-700 pb-4">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary">
                      <span className="material-symbols-outlined text-lg">
                        directions_boat
                      </span>
                    </span>
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                      Vessel Information
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                        Vessel Name <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          value={vesselName}
                          onChange={(e) => setVesselName(e.target.value)}
                          className="w-full rounded-lg bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-primary focus:border-primary placeholder-slate-400"
                          placeholder="e.g. MV Global Trader"
                          type="text"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                        IMO Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        value={imoNumber}
                        onChange={(e) => setImoNumber(e.target.value)}
                        className="w-full rounded-lg bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-primary focus:border-primary placeholder-slate-400"
                        placeholder="e.g. 9876543"
                        type="text"
                        inputMode="numeric"
                        maxLength={7}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                        Vessel Type
                      </label>
                      <select value={vesselType} onChange={(e) => setVesselType(e.target.value)} className="w-full rounded-lg bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-primary focus:border-primary">
                        <option value="">Select type...</option>
                        <option value="Bulk Carrier">Bulk Carrier</option>
                        <option value="Container Ship">Container Ship</option>
                        <option value="Oil Tanker">Oil Tanker</option>
                        <option value="LNG Carrier">LNG Carrier</option>
                        <option value="Ro-Ro">Ro-Ro</option>
                      </select>
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                        Primary Operational Routes
                      </label>
                      <input
                        value={operationalRoutes}
                        onChange={(e) => setOperationalRoutes(e.target.value)}
                        className="w-full rounded-lg bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-primary focus:border-primary placeholder-slate-400"
                        placeholder="e.g. Trans-Pacific, Mediterranean, North Sea"
                        type="text"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                        Vessel Flag <span className="text-red-500">*</span>
                      </label>
                      <input
                        value={vesselFlag}
                        onChange={(e) => setVesselFlag(e.target.value)}
                        className="w-full rounded-lg bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-primary focus:border-primary placeholder-slate-400"
                        placeholder="e.g. Panama, Liberia, North Sea"
                        type="text"
                      />
                    </div>
                  </div>
                </div>
                {/* Management Scope & Duration */}
                <div className="bg-white dark:bg-[#1A2235] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
                  <div className="flex items-center gap-3 mb-6 border-b border-slate-100 dark:border-slate-700 pb-4">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary">
                      <span className="material-symbols-outlined text-lg">
                        engineering
                      </span>
                    </span>
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                      Management Scope & Duration
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                        Included Services{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <label className="flex items-start p-3 border border-slate-200 dark:border-slate-700 rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                          <input value="full_crewing" checked={services.includes("full_crewing")} onChange={() => toggleService("full_crewing")} className="mt-1 w-4 h-4 text-primary border-slate-300 focus:ring-primary rounded" type="checkbox" />
                          <div className="ml-3">
                            <span className="block text-sm font-medium text-slate-900 dark:text-white">Full Crewing</span>
                            <span className="block text-xs text-slate-500">Recruitment, deployment, payroll</span>
                          </div>
                        </label>
                        <label className="flex items-start p-3 border border-slate-200 dark:border-slate-700 rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                          <input value="technical_mgmt" checked={services.includes("technical_mgmt")} onChange={() => toggleService("technical_mgmt")} className="mt-1 w-4 h-4 text-primary border-slate-300 focus:ring-primary rounded" type="checkbox" />
                          <div className="ml-3">
                            <span className="block text-sm font-medium text-slate-900 dark:text-white">Technical Mgmt</span>
                            <span className="block text-xs text-slate-500">Maintenance, repairs, dry-docking</span>
                          </div>
                        </label>
                        <label className="flex items-start p-3 border border-slate-200 dark:border-slate-700 rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                          <input value="insurance_legal" checked={services.includes("insurance_legal")} onChange={() => toggleService("insurance_legal")} className="mt-1 w-4 h-4 text-primary border-slate-300 focus:ring-primary rounded" type="checkbox" />
                          <div className="ml-3">
                            <span className="block text-sm font-medium text-slate-900 dark:text-white">Insurance & Legal</span>
                            <span className="block text-xs text-slate-500">P&I claims, legal representation</span>
                          </div>
                        </label>
                        <label className="flex items-start p-3 border border-slate-200 dark:border-slate-700 rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                          <input value="procurement" checked={services.includes("procurement")} onChange={() => toggleService("procurement")} className="mt-1 w-4 h-4 text-primary border-slate-300 focus:ring-primary rounded" type="checkbox" />
                          <div className="ml-3">
                            <span className="block text-sm font-medium text-slate-900 dark:text-white">Procurement</span>
                            <span className="block text-xs text-slate-500">Stores, spares, and provisions</span>
                          </div>
                        </label>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                        Contract Commencement Date
                      </label>
                      <div className="relative">
                        <input
                          value={commencementDate}
                          onChange={(e) => setCommencementDate(e.target.value)}
                          className="w-full rounded-lg bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-primary focus:border-primary"
                          type="date"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                        Agreement Duration
                      </label>
                      <select value={duration} onChange={(e) => setDuration(e.target.value)} className="w-full rounded-lg bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-primary focus:border-primary">
                        <option value="">Select duration...</option>
                        <option value="1 Year">1 Year</option>
                        <option value="2 Years">2 Years</option>
                        <option value="3 Years">3 Years</option>
                        <option value="5 Years">5 Years</option>
                        <option value="Indefinite">Indefinite</option>
                      </select>
                    </div>
                  </div>
                </div>
                {/* Supporting Documents */}
                <div className="bg-white dark:bg-[#1A2235] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
                  <div className="flex items-center justify-between mb-6 border-b border-slate-100 dark:border-slate-700 pb-4">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary">
                        <span className="material-symbols-outlined text-lg">
                          description
                        </span>
                      </span>
                      <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                        Supporting Documents
                      </h3>
                    </div>
                  </div>
                  <div className="space-y-4">
                      <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <label className="w-full flex flex-col items-center cursor-pointer">
                          <span className="material-symbols-outlined text-4xl text-slate-400 mb-2">
                            cloud_upload
                          </span>
                          <p className="text-sm font-medium text-slate-900 dark:text-white">
                            Drag & drop vessel certificates here
                          </p>
                          <p className="text-xs text-slate-500 mt-1">
                            or click to browse (PDF, JPG up to 10MB)
                          </p>
                          <input
                            type="file"
                            accept="application/pdf,image/*"
                            className="hidden"
                            onChange={(e) => setCertificateFile(e.target.files?.[0] || null)}
                          />
                        </label>
                      </div>
                      {certificateFile && (
                        <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                          <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-slate-400">picture_as_pdf</span>
                            <div className="flex flex-col">
                              <span className="text-sm font-medium text-slate-900 dark:text-white">{certificateFile.name}</span>
                              <span className="text-xs text-slate-500">{(certificateFile.size / 1024 / 1024).toFixed(2)} MB</span>
                            </div>
                          </div>
                          <button type="button" onClick={() => setCertificateFile(null)} className="text-slate-400 hover:text-red-500 transition-colors">
                            <span className="material-symbols-outlined">close</span>
                          </button>
                        </div>
                      )}
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
                    For full management contracts, including technical scope can
                    reduce overall operational costs by up to 15% through
                    consolidated vendor agreements.
                  </p>
                </div>
                <div className="bg-white dark:bg-[#1A2235] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 sticky top-6">
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-4">
                    Contract Summary
                  </h3>
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500 dark:text-slate-400">
                        Mgmt Type
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        Full Management
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500 dark:text-slate-400">
                        Vessel Type
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        -
                      </span>
                    </div>
                    <div className="h-px bg-slate-100 dark:bg-slate-700 my-2"></div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500 dark:text-slate-400">
                        Term
                      </span>
                      <span className="font-mono text-slate-900 dark:text-white">
                        -
                      </span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <button
                      className="w-full py-3 px-4 bg-primary hover:bg-primary-hover text-white font-bold rounded-lg shadow-lg shadow-primary/30 transition-all flex items-center justify-center gap-2"
                      onClick={handleSubmit}
                    >
                      Next Step
                      <span className="material-symbols-outlined">
                        arrow_forward
                      </span>
                    </button>
                    <button className="w-full py-3 px-4 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-medium rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
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
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
