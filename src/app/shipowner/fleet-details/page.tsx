"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "../../../context/AuthContext";

interface ShipOwnerProfileData {
  id?: string;
  company_name: string;
  imo_number?: string;
  website?: string;
  hq_address: string;
  vessel_types: string;
  fleet_size: string;
  primary_trading_area: string;
  contact_full_name: string;
  contact_role: string;
  contact_email: string;
  contact_phone: string;
  document_1?: string;
  document_2?: string;
  document_3?: string;
  document_4?: string;
  created_at?: string;
  updated_at?: string;
}

function FleetDetailsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const contractType = searchParams?.get('type') || 'full'; // 'full' or 'oneoff'

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  const [formData, setFormData] = useState({
    company_name: "",
    imo_number: "",
    website: "",
    hq_address: "",
    vessel_types: "",
    fleet_size: "",
    primary_trading_area: "",
    contact_full_name: "",
    contact_role: "",
    contact_email: "",
    contact_phone: "",
  });

  const [documents, setDocuments] = useState({
    document_1: null as File | null,
    document_2: null as File | null,
    document_3: null as File | null,
    document_4: null as File | null,
  });

  // Load existing profile data on component mount
  useEffect(() => {
    const fetchExistingProfile = async () => {
      if (!user?.accessToken) return;

      try {
        const response = await fetch("/api/v1/profile", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const profileData: ShipOwnerProfileData = await response.json();
          // Pre-populate form with existing data
          setFormData({
            company_name: profileData.company_name || "",
            imo_number: profileData.imo_number || "",
            website: profileData.website || "",
            hq_address: profileData.hq_address || "",
            vessel_types: profileData.vessel_types || "",
            fleet_size: profileData.fleet_size || "",
            primary_trading_area: profileData.primary_trading_area || "",
            contact_full_name: profileData.contact_full_name || "",
            contact_role: profileData.contact_role || "",
            contact_email: profileData.contact_email || "",
            contact_phone: profileData.contact_phone || "",
          });
        }
        // If 404 (no profile exists), form stays empty which is correct
      } catch (error) {
        console.error("Error fetching existing profile:", error);
        // Form stays empty, user can fill it out
      } finally {
        setIsLoadingProfile(false);
      }
    };

    fetchExistingProfile();
  }, [user?.accessToken]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setDocuments(prev => ({ ...prev, [name]: files[0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Debug: Check authentication state
    console.log("Current user:", user);
    console.log("User role:", user?.role);
    console.log("Access token exists:", !!user?.accessToken);

    if (!user?.accessToken) {
      alert("You must be logged in to submit this form");
      setIsLoading(false);
      return;
    }

    if (user.role !== 'shipowner') {
      alert("Only shipowners can submit this form");
      setIsLoading(false);
      return;
    }

    try {
      const formDataToSend = new FormData();

      // Add form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (value) formDataToSend.append(key, value);
      });

      // Add files
      Object.entries(documents).forEach(([key, file]) => {
        if (file) formDataToSend.append(key, file);
      });

      console.log("Submitting form data:", Object.fromEntries(formDataToSend));

      const response = await fetch("/api/v1/profile", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
        body: formDataToSend,
      });

      console.log("Response status:", response.status);
      console.log("Response headers:", Object.fromEntries(response.headers));

      if (response.ok) {
        const result = await response.json();
        console.log("Success response:", result);

        // Redirect to success page based on contract type
        if (contractType === 'oneoff') {
          router.push("/shipowner/contract-type/one-off/success");
        } else {
          router.push("/shipowner/contract-type/full/success");
        }
      } else {
        const error = await response.json();
        console.error("Error response:", error);
        alert(`Failed to create profile: ${error.detail || response.statusText}`);
      }
    } catch (error) {
      console.error("Profile creation error:", error);
      alert("An error occurred while creating your profile");
    } finally {
      setIsLoading(false);
    }
  };

  const successUrl = contractType === 'oneoff'
    ? "/shipowner/contract-type/one-off/success"
    : "/shipowner/contract-type/full/success";

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background-light dark:bg-background-dark text-text-main font-display antialiased transition-colors duration-200">
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-[#e8ebf3] bg-surface-light dark:bg-surface-dark dark:border-gray-800 px-6 py-4 lg:px-10">
        <div className="flex items-center gap-4 text-text-main dark:text-white">
          <div className="size-8 text-primary">
            <svg
              fill="currentColor"
              viewBox="0 0 48 48"
              xmlns="http://www.w3.org/2000/svg"
              className="w-8 h-8"
            >
              <path d="M13.8261 17.4264C16.7203 18.1174 20.2244 18.5217 24 18.5217C27.7756 18.5217 31.2797 18.1174 34.1739 17.4264C36.9144 16.7722 39.9967 15.2331 41.3563 14.1648L24.8486 40.6391C24.4571 41.267 23.5429 41.267 23.1514 40.6391L6.64374 14.1648C8.00331 15.2331 11.0856 16.7722 13.8261 17.4264Z"></path>
              <path
                d="M39.998 12.236C39.9944 12.2537 39.9875 12.2845 39.9748 12.3294C39.9436 12.4399 39.8949 12.5741 39.8346 12.7175C39.8168 12.7597 39.7989 12.8007 39.7813 12.8398C38.5103 13.7113 35.9788 14.9393 33.7095 15.4811C30.9875 16.131 27.6413 16.5217 24 16.5217C20.3587 16.5217 17.0125 16.131 14.2905 15.4811C12.0012 14.9346 9.44505 13.6897 8.18538 12.8168C8.17384 12.7925 8.16216 12.767 8.15052 12.7408C8.09919 12.6249 8.05721 12.5114 8.02977 12.411C8.00356 12.3152 8.00039 12.2667 8.00004 12.2612C8.00004 12.261 8 12.2607 8.00004 12.2612C8.00004 12.2359 8.0104 11.9233 8.68485 11.3686C9.34546 10.8254 10.4222 10.2469 11.9291 9.72276C14.9242 8.68098 19.1919 8 24 8C28.8081 8 33.0758 8.68098 36.0709 9.72276C37.5778 10.2469 38.6545 10.8254 39.3151 11.3686C39.9006 11.8501 39.9857 12.1489 39.998 12.236ZM4.95178 15.2312L21.4543 41.6973C22.6288 43.5809 25.3712 43.5809 26.5457 41.6973L43.0534 15.223C43.0709 15.1948 43.0878 15.1662 43.104 15.1371L41.3563 14.1648C43.104 15.1371 43.1038 15.1374 43.104 15.1371L43.1051 15.135L43.1065 15.1325L43.1101 15.1261L43.1199 15.1082C43.1276 15.094 43.1377 15.0754 43.1497 15.0527C43.1738 15.0075 43.2062 14.9455 43.244 14.8701C43.319 14.7208 43.4196 14.511 43.5217 14.2683C43.6901 13.8679 44 13.0689 44 12.2609C44 10.5573 43.003 9.22254 41.8558 8.2791C40.6947 7.32427 39.1354 6.55361 37.385 5.94477C33.8654 4.72057 29.133 4 24 4C18.867 4 14.1346 4.72057 10.615 5.94478C8.86463 6.55361 7.30529 7.32428 6.14419 8.27911C4.99695 9.22255 3.99999 10.5573 3.99999 12.2609C3.99999 13.1275 4.29264 13.9078 4.49321 14.3607C4.60375 14.6102 4.71348 14.8196 4.79687 14.9689C4.83898 15.0444 4.87547 15.1065 4.9035 15.1529C4.91754 15.1762 4.92954 15.1957 4.93916 15.2111L4.94662 15.223L4.95178 15.2312ZM35.9868 18.996L24 38.22L12.0131 18.996C12.4661 19.1391 12.9179 19.2658 13.3617 19.3718C16.4281 20.1039 20.0901 20.5217 24 20.5217C27.9099 20.5217 31.5719 20.1039 34.6383 19.3718C35.082 19.2658 35.5339 19.1391 35.9868 18.996Z"
                opacity="0.5"
              ></path>
            </svg>
          </div>
          <h2 className="text-lg font-bold leading-tight tracking-[-0.015em]">
            CrewManage
          </h2>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-text-secondary hidden md:block">
            Welcome, {user?.name || 'Captain'}
          </span>
          <button className="flex size-10 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-text-main hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
            <span className="material-symbols-outlined">person</span>
          </button>
        </div>
      </header>

      <main className="flex flex-1 flex-col items-center justify-start px-4 py-8 md:px-10 lg:py-12">
        <div className="w-full max-w-[1024px] space-y-10">
          {/* Progress Bar */}
          <div className="flex flex-col gap-3">
            <div className="flex gap-6 justify-between items-end">
              <p className="text-text-main dark:text-white text-base font-medium leading-normal">
                Step 3 of 4: Fleet Details
              </p>
              <span className="text-text-secondary text-sm">
                Next: Confirmation
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-[#d1d8e6] dark:bg-slate-700 overflow-hidden">
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: "75%" }}
              ></div>
            </div>
          </div>

          {/* Title & Description */}
          <div className="flex flex-col gap-3 text-center md:text-left">
            <h1 className="text-text-main dark:text-white text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em]">
              Complete Your Company Profile
            </h1>
            <p className="text-text-secondary text-lg max-w-2xl font-normal leading-relaxed">
              Provide your company and fleet information to complete your registration and start managing your crew operations.
            </p>
          </div>

          {/* Loading State */}
          {isLoadingProfile && (
            <div className="bg-surface-light dark:bg-surface-dark p-8 rounded-xl border border-[#e8ebf3] dark:border-gray-800">
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <span className="ml-3 text-text-secondary">Loading existing profile...</span>
              </div>
            </div>
          )}

          {/* Form */}
          {!isLoadingProfile && (
            <form onSubmit={handleSubmit} className="space-y-8">
            {/* Company Information */}
            <div className="bg-surface-light dark:bg-surface-dark p-8 rounded-xl border border-[#e8ebf3] dark:border-gray-800">
              <h2 className="text-xl font-bold text-text-main dark:text-white mb-6">
                Company Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-text-main dark:text-white mb-2">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    name="company_name"
                    value={formData.company_name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-[#d1d8e6] dark:border-slate-600 bg-[#f8f9fb] dark:bg-slate-800 text-text-main dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                    placeholder="Enter your company name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-text-main dark:text-white mb-2">
                    IMO Number
                  </label>
                  <input
                    type="text"
                    name="imo_number"
                    value={formData.imo_number}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-[#d1d8e6] dark:border-slate-600 bg-[#f8f9fb] dark:bg-slate-800 text-text-main dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                    placeholder="IMO number (optional)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-text-main dark:text-white mb-2">
                    Website
                  </label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-[#d1d8e6] dark:border-slate-600 bg-[#f8f9fb] dark:bg-slate-800 text-text-main dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                    placeholder="https://yourcompany.com"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-text-main dark:text-white mb-2">
                    Headquarters Address *
                  </label>
                  <textarea
                    name="hq_address"
                    value={formData.hq_address}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 rounded-lg border border-[#d1d8e6] dark:border-slate-600 bg-[#f8f9fb] dark:bg-slate-800 text-text-main dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                    placeholder="Enter your headquarters address"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Fleet Information */}
            <div className="bg-surface-light dark:bg-surface-dark p-8 rounded-xl border border-[#e8ebf3] dark:border-gray-800">
              <h2 className="text-xl font-bold text-text-main dark:text-white mb-6">
                Fleet Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-text-main dark:text-white mb-2">
                    Vessel Types *
                  </label>
                  <input
                    type="text"
                    name="vessel_types"
                    value={formData.vessel_types}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-[#d1d8e6] dark:border-slate-600 bg-[#f8f9fb] dark:bg-slate-800 text-text-main dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                    placeholder="e.g., Container Ships, Tankers"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-text-main dark:text-white mb-2">
                    Fleet Size *
                  </label>
                  <select
                    name="fleet_size"
                    value={formData.fleet_size}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-[#d1d8e6] dark:border-slate-600 bg-[#f8f9fb] dark:bg-slate-800 text-text-main dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                    required
                  >
                    <option value="">Select fleet size</option>
                    <option value="1-5 vessels">1-5 vessels</option>
                    <option value="6-15 vessels">6-15 vessels</option>
                    <option value="16-30 vessels">16-30 vessels</option>
                    <option value="31+ vessels">31+ vessels</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-text-main dark:text-white mb-2">
                    Primary Trading Area *
                  </label>
                  <input
                    type="text"
                    name="primary_trading_area"
                    value={formData.primary_trading_area}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-[#d1d8e6] dark:border-slate-600 bg-[#f8f9fb] dark:bg-slate-800 text-text-main dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                    placeholder="e.g., North Atlantic, Pacific Rim"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-surface-light dark:bg-surface-dark p-8 rounded-xl border border-[#e8ebf3] dark:border-gray-800">
              <h2 className="text-xl font-bold text-text-main dark:text-white mb-6">
                Contact Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-text-main dark:text-white mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="contact_full_name"
                    value={formData.contact_full_name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-[#d1d8e6] dark:border-slate-600 bg-[#f8f9fb] dark:bg-slate-800 text-text-main dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                    placeholder="Contact person's full name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-text-main dark:text-white mb-2">
                    Role/Position *
                  </label>
                  <input
                    type="text"
                    name="contact_role"
                    value={formData.contact_role}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-[#d1d8e6] dark:border-slate-600 bg-[#f8f9fb] dark:bg-slate-800 text-text-main dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                    placeholder="e.g., Fleet Manager, Operations Director"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-text-main dark:text-white mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="contact_email"
                    value={formData.contact_email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-[#d1d8e6] dark:border-slate-600 bg-[#f8f9fb] dark:bg-slate-800 text-text-main dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                    placeholder="contact@yourcompany.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-text-main dark:text-white mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="contact_phone"
                    value={formData.contact_phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-[#d1d8e6] dark:border-slate-600 bg-[#f8f9fb] dark:bg-slate-800 text-text-main dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                    placeholder="+1 (555) 123-4567"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Documents */}
            <div className="bg-surface-light dark:bg-surface-dark p-8 rounded-xl border border-[#e8ebf3] dark:border-gray-800">
              <h2 className="text-xl font-bold text-text-main dark:text-white mb-6">
                Supporting Documents
              </h2>
              <p className="text-text-secondary mb-6">
                Upload relevant company documents (optional but recommended)
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((num) => (
                  <div key={num}>
                    <label className="block text-sm font-semibold text-text-main dark:text-white mb-2">
                      Document {num}
                    </label>
                    <input
                      type="file"
                      name={`document_${num}`}
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      className="w-full px-4 py-3 rounded-lg border border-[#d1d8e6] dark:border-slate-600 bg-[#f8f9fb] dark:bg-slate-800 text-text-main dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-light"
                    />
                    <p className="text-xs text-text-secondary mt-1">
                      PDF, DOC, DOCX, JPG, PNG up to 10MB
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-8 py-3 rounded-lg border border-[#d1d8e6] dark:border-slate-600 bg-surface-light dark:bg-surface-dark text-text-main dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-8 py-3 rounded-lg bg-primary hover:bg-primary-light text-white font-bold shadow-lg shadow-primary/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Creating Profile..." : "Complete Registration"}
              </button>
            </div>
            </form>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto py-8 px-10 text-center text-sm text-text-secondary">
        <p>© {new Date().getFullYear()} CrewManage. All maritime rights reserved.</p>
      </footer>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FleetDetailsPage />
    </Suspense>
  );
}
