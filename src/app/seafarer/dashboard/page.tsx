"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { logout, user, profile, isProfileLoading, fetchProfile, isHydrated } =
    useAuth();
  const router = useRouter();

  // Mobile sidebar state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Notifications dropdown state
  const [showNotifications, setShowNotifications] = useState(false);

  // Document status state
  const [documentStatus, setDocumentStatus] = useState<{
    total_documents: number;
    approved_count: number;
    rejected_count: number;
    pending_count: number;
    not_submitted_count: number;
    submitted_documents: string[];
    approved_documents: string[];
    rejected_documents: string[];
    not_submitted_documents: string[];
  } | null>(null);
  const [documentStatusLoading, setDocumentStatusLoading] = useState(false);

  // Document list state for the table
  const [documents, setDocuments] = useState<Array<{
    id: string;
    document_type: string;
    status: string;
    file_size?: string;
    expiry_date?: string;
    created_at: string;
  }>>([]);
  const [documentsLoading, setDocumentsLoading] = useState(false);

  // Meetings state for Upcoming Schedule
  const [meetings, setMeetings] = useState<Array<{
    id: string;
    title: string;
    scheduled_date: string;
    type: string;
    location: string;
    host?: string;
    status: string;
  }>>([]);
  const [meetingsLoading, setMeetingsLoading] = useState(false);

  // Document preview modal state
  const [previewDocument, setPreviewDocument] = useState<{
    id: string;
    document_type: string;
    status: string;
    file_size?: string;
    expiry_date?: string;
    file_url?: string;
    file_name?: string;
  } | null>(null);

  // Pre-compute dates to avoid impure function calls during render
  const currentDate = new Date();
  const applicationReviewDate = new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000);
  const interviewDate = new Date(currentDate.getTime() + 5 * 24 * 60 * 60 * 1000);
  const medicalExamDate = new Date(currentDate.getTime() + 10 * 24 * 60 * 60 * 1000);
  const deploymentDate = new Date(currentDate.getTime() + 18 * 24 * 60 * 60 * 1000);

  // Human-readable document names mapping
  const DOCUMENT_NAMES: Record<string, string> = {
    'medical_fitness': 'Medical Certificate',
    'sea_service': 'Sea Service Record',
    'seaman_book': 'Seaman\'s Book',
    'psc_lifeboat': 'PSC Lifeboat Certificate',
    'stcw_basic_safety': 'STCW Basic Training',
    'coc_or_rating': 'Certificate of Competency'
  };

  // Fetch document status on component mount
  useEffect(() => {
    async function fetchDocumentStatus() {
      if (!isHydrated || user?.role !== 'seafarer') return;

      const token = localStorage.getItem('crew-manning-token');
      if (!token) return;

      setDocumentStatusLoading(true);
      try {
        const response = await fetch('/api/v1/seafarers/documents/status', {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setDocumentStatus(data);
        } else {
          console.log('Failed to fetch document status:', response.status);
        }
      } catch (error) {
        console.log('Error fetching document status:', error);
      } finally {
        setDocumentStatusLoading(false);
      }
    }

    fetchDocumentStatus();
  }, [isHydrated, user?.role]);

  // Fetch documents for the table
  useEffect(() => {
    async function fetchDocuments() {
      if (!isHydrated || user?.role !== 'seafarer') return;

      const token = localStorage.getItem('crew-manning-token');
      if (!token) return;

      setDocumentsLoading(true);
      try {
        const response = await fetch('/api/v1/seafarers/documents', {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setDocuments(data.documents || []);
        } else {
          console.log('Failed to fetch documents:', response.status);
        }
      } catch (error) {
        console.log('Error fetching documents:', error);
      } finally {
        setDocumentsLoading(false);
      }
    }

    fetchDocuments();
  }, [isHydrated, user?.role]);

  // Fetch meetings for Upcoming Schedule
  useEffect(() => {
    async function fetchMeetings() {
      if (!isHydrated || user?.role !== 'seafarer') return;

      setMeetingsLoading(true);
      try {
        const response = await fetch('/api/v1/seafarers/meetings?skip=0&limit=10');
        if (response.ok) {
          const data = await response.json();
          setMeetings(data.meetings || []);
        } else {
          console.log('Failed to fetch meetings:', response.status);
        }
      } catch (error) {
        console.log('Error fetching meetings:', error);
      } finally {
        setMeetingsLoading(false);
      }
    }

    fetchMeetings();
  }, [isHydrated, user?.role]);

  // Ensure profile is loaded for seafarer dashboard (but avoid infinite loops)
  useEffect(() => {
    // Only fetch profile if: user is seafarer, no profile loaded, not already loading
    if (
      isHydrated &&
      user?.role === "seafarer" &&
      !profile &&
      !isProfileLoading
    ) {
      console.log("Dashboard: Fetching profile for seafarer user...");
      fetchProfile().catch((error) => {
        console.log("Dashboard: Profile fetch failed:", error);
        // Don't crash on error, just log it
      });
    }
  }, [
    isHydrated,
    user?.role,
    profile,
    isProfileLoading,
    fetchProfile,
  ]);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const sidebar = document.getElementById("mobile-sidebar");
      const menuButton = document.getElementById("menu-button");
      if (
        isSidebarOpen &&
        sidebar &&
        !sidebar.contains(e.target as Node) &&
        !menuButton?.contains(e.target as Node)
      ) {
        setIsSidebarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isSidebarOpen]);

  // Helper to get display name
  const displayName = profile
    ? `${profile.first_name} ${profile.last_name}`
    : user?.name || "Seafarer";

  // Helper to get first name for welcome message
  const firstName =
    profile?.first_name || user?.name?.split(" ")[0] || "Seafarer";

  // Helper to get rank/title
  const rankTitle = profile?.rank
    ? profile.rank.charAt(0).toUpperCase() + profile.rank.slice(1)
    : user?.title || "Seafarer";

  // Helper to get profile photo
  const profilePhoto =
    profile?.profile_photo_url ||
    user?.avatar ||
    "https://ui-avatars.com/api/?name=" +
      encodeURIComponent(displayName) +
      "&background=701012&color=fff";

  // Calculate application progress
  const calculateProgress = () => {
    const applicationStatus = profile?.application_status;

    // Step 1: Profile - Complete if profile exists
    const step1Complete = !!profile?.id;

    // Step 2: Documents - Complete if all required documents submitted
    const step2Complete = documentStatus?.not_submitted_count === 0;

    // Step 3: Review - Complete if approved or contract signed, active if under review
    const step3Complete = ['approved', 'contract_signed'].includes(applicationStatus || '');
    const step3Active = ['pending', 'under_review'].includes(applicationStatus || '');

    // Step 4: Contract - Complete if contract signed
    const step4Complete = applicationStatus === 'contract_signed';

    // Determine current step and status
    const currentStep = !step2Complete ? 2 : !step4Complete ? 3 : 4;
    const isRejected = applicationStatus === 'rejected';

    // Status header text
    const statusHeader =
      isRejected ? 'Application Rejected' :
      step4Complete ? 'Congratulations!' :
      step3Active ? 'Under Review' :
      step1Complete && step2Complete ? 'Ready for Review' :
      'Pending';

    return {
      step1Complete,
      step2Complete,
      step3Complete,
      step3Active,
      step4Complete,
      currentStep,
      statusHeader,
      isRejected
    };
  };

  const progress = calculateProgress();

  // Show loading state until hydrated
  if (!isHydrated) {
    return (
      <div className="bg-background-light dark:bg-background-dark min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-white animate-pulse">
            <span className="material-symbols-outlined">anchor</span>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen flex overflow-hidden font-display">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-surface-light dark:bg-surface-dark border-r border-gray-200 dark:border-gray-800 h-screen fixed left-0 top-0 z-20">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-white shrink-0">
            <span className="material-symbols-outlined">anchor</span>
          </div>
          <h1 className="text-gray-900 dark:text-white text-lg font-bold leading-tight">
            Maritime
            <br />
            <span className="text-primary">Crewing</span>
          </h1>
        </div>
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          <a
            className="nav-item active flex items-center gap-3 px-3 py-3 rounded-lg bg-primary text-white group transition-colors"
            href="/seafarer/dashboard"
          >
            <span className="material-symbols-outlined text-[24px]">
              dashboard
            </span>
            <span className="font-medium text-sm">Dashboard</span>
          </a>
          <a
            className="nav-item flex items-center gap-3 px-3 py-3 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            href="/seafarer/profile"
          >
            <span className="material-symbols-outlined text-[24px]">
              person
            </span>
            <span className="font-medium text-sm">Profile</span>
          </a>
          <a
            className="nav-item flex items-center gap-3 px-3 py-3 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            href="/seafarer/documents"
          >
            <span className="material-symbols-outlined text-[24px]">
              description
            </span>
            <span className="font-medium text-sm">Documents</span>
            {(documentStatus?.not_submitted_count ?? 0) > 0 && (
              <span className="ml-auto bg-red-100 text-red-800 text-xs font-bold px-2 py-0.5 rounded-full">
                {documentStatus?.not_submitted_count ?? 0}
              </span>
            )}
          </a>
          <a
            className="nav-item flex items-center gap-3 px-3 py-3 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            href="/seafarer/contracts"
          >
            <span className="material-symbols-outlined text-[24px]">
              history_edu
            </span>
            <span className="font-medium text-sm">Contracts</span>
          </a>
          <a
            className="nav-item flex items-center gap-3 px-3 py-3 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            href="/seafarer/interview"
          >
            <span className="material-symbols-outlined text-[24px]">
              calendar_month
            </span>
            <span className="font-medium text-sm">Interview</span>
          </a>
        </nav>
        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <button
            onClick={logout}
            className="flex items-center gap-3 px-3 py-3 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors w-full"
          >
            <span className="material-symbols-outlined text-[24px]">
              logout
            </span>
            <span className="font-medium text-sm">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Sidebar - Mobile */}
      <aside
        id="mobile-sidebar"
        className={`lg:hidden flex flex-col w-64 bg-surface-light dark:bg-surface-dark border-r border-gray-200 dark:border-gray-800 h-screen fixed left-0 top-0 z-40 transform transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-white shrink-0">
              <span className="material-symbols-outlined">anchor</span>
            </div>
            <h1 className="text-gray-900 dark:text-white text-lg font-bold leading-tight">
              Maritime
              <br />
              <span className="text-primary">Crewing</span>
            </h1>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          <a
            className="nav-item active flex items-center gap-3 px-3 py-3 rounded-lg bg-primary text-white group transition-colors"
            href="/seafarer/dashboard"
            onClick={() => setIsSidebarOpen(false)}
          >
            <span className="material-symbols-outlined text-[24px]">
              dashboard
            </span>
            <span className="font-medium text-sm">Dashboard</span>
          </a>
          <a
            className="nav-item flex items-center gap-3 px-3 py-3 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            href="/seafarer/profile"
            onClick={() => setIsSidebarOpen(false)}
          >
            <span className="material-symbols-outlined text-[24px]">
              person
            </span>
            <span className="font-medium text-sm">Profile</span>
          </a>
          <a
            className="nav-item flex items-center gap-3 px-3 py-3 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            href="/seafarer/documents"
            onClick={() => setIsSidebarOpen(false)}
          >
            <span className="material-symbols-outlined text-[24px]">
              description
            </span>
            <span className="font-medium text-sm">Documents</span>
            {(documentStatus?.not_submitted_count ?? 0) > 0 && (
              <span className="ml-auto bg-red-100 text-red-800 text-xs font-bold px-2 py-0.5 rounded-full">
                {documentStatus?.not_submitted_count ?? 0}
              </span>
            )}
          </a>
          <a
            className="nav-item flex items-center gap-3 px-3 py-3 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            href="/seafarer/contracts"
            onClick={() => setIsSidebarOpen(false)}
          >
            <span className="material-symbols-outlined text-[24px]">
              history_edu
            </span>
            <span className="font-medium text-sm">Contracts</span>
          </a>
          <a
            className="nav-item flex items-center gap-3 px-3 py-3 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            href="/seafarer/interview"
            onClick={() => setIsSidebarOpen(false)}
          >
            <span className="material-symbols-outlined text-[24px]">
              calendar_month
            </span>
            <span className="font-medium text-sm">Interview</span>
          </a>
        </nav>
        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <button
            onClick={() => {
              setIsSidebarOpen(false);
              logout();
            }}
            className="flex items-center gap-3 px-3 py-3 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors w-full"
          >
            <span className="material-symbols-outlined text-[24px]">
              logout
            </span>
            <span className="font-medium text-sm">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-64 relative min-h-screen">
        {/* Top Navbar */}
        <header className="bg-surface-light dark:bg-surface-dark border-b border-gray-200 dark:border-gray-800 h-16 flex items-center justify-between px-6 sticky top-0 z-10">
          <button
            id="menu-button"
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden p-2 -ml-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <span className="material-symbols-outlined">menu</span>
          </button>
          <div className="hidden md:flex text-sm text-gray-500">
            <span>Dashboard</span>
            <span className="mx-2">/</span>
            <span className="font-medium text-gray-900 dark:text-white">
              Overview
            </span>
          </div>
          <div className="flex items-center gap-4 ml-auto">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <span className="material-symbols-outlined">notifications</span>
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-surface-dark"></span>
              </button>
              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 top-12 w-80 bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-50">
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                    <h4 className="font-bold text-gray-900 dark:text-white">
                      Notifications
                    </h4>
                    <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded-full">
                      1 new
                    </span>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    <div className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer border-l-4 border-red-500 bg-red-50 dark:bg-red-900/10">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Document Required
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Please upload your Seaman's Book to continue.
                      </p>
                      <p className="text-xs text-gray-400 mt-2">2 hours ago</p>
                    </div>
                    <div className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Profile Updated
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Your profile information has been saved.
                      </p>
                      <p className="text-xs text-gray-400 mt-2">1 day ago</p>
                    </div>
                  </div>
                  <div className="p-3 border-t border-gray-200 dark:border-gray-700">
                    <button className="w-full text-center text-sm text-primary hover:text-primary-hover font-medium">
                      View All Notifications
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div className="h-8 w-[1px] bg-gray-200 dark:bg-gray-700 mx-1"></div>
            <div
              className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => router.push("/seafarer/profile")}
            >
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-gray-900 dark:text-white">
                  {displayName}
                </p>
                <p className="text-xs text-gray-500">{rankTitle}</p>
              </div>
              <div
                className="h-10 w-10 rounded-full bg-gray-200 bg-cover bg-center border-2 border-white dark:border-gray-700 shadow-sm"
                style={{
                  backgroundImage: `url('${profilePhoto}')`,
                }}
                data-alt={`Profile picture of ${displayName}`}
              ></div>
            </div>
          </div>
        </header>
        {/* Main Content Area */}
        <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
          <div className="max-w-7xl mx-auto flex flex-col gap-8">
            {/* Welcome Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
              <div>
                <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                  Welcome back, {firstName}
                </h2>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                  Here is what's happening with your applications today.
                </p>
              </div>

            </div>
            {/* Status & Action Required (Hero Section) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Progress Card */}
              <div className="lg:col-span-2 bg-surface-light dark:bg-surface-dark rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-800 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-primary"></div>
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      Application Status
                    </h3>
                    <p className="text-primary font-medium mt-1">
                      {progress.statusHeader}
                    </p>
                  </div>
                  <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                    Step {progress.currentStep} of 4
                  </span>
                </div>
                {/* Stepper Visual */}
                <div className="relative mb-8 px-2">
                  <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 dark:bg-gray-700 -translate-y-1/2 rounded-full z-0"></div>
                  <div
                    className="absolute top-1/2 left-0 h-1 bg-primary -translate-y-1/2 rounded-full z-0 transition-all duration-500"
                    style={{ width: `${(progress.currentStep - 1) * 33.33}%` }}
                  ></div>
                  <div className="relative z-10 flex justify-between w-full items-center">
                    {/* Step 1: Profile */}
                    <div className="flex flex-col items-center gap-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-colors relative z-20 ${
                        progress.step1Complete
                          ? 'bg-primary text-white'
                          : 'bg-gray-300 text-gray-600'
                      }`}>
                        <span className="material-symbols-outlined text-[16px]">
                          {progress.step1Complete ? 'check' : 'person'}
                        </span>
                      </div>
                      <span className={`text-xs font-medium hidden sm:block ${
                        progress.step1Complete
                          ? 'text-gray-900 dark:text-white'
                          : 'text-gray-400'
                      }`}>
                        Profile
                      </span>
                    </div>

                    {/* Step 2: Documents */}
                    <div className="flex flex-col items-center gap-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-colors relative z-20 ${
                        progress.step2Complete
                          ? 'bg-primary text-white'
                          : progress.step1Complete
                          ? 'bg-primary text-white shadow-[0_0_0_4px_rgba(112,16,18,0.2)]'
                          : 'bg-gray-300 text-gray-600'
                      }`}>
                        <span className="material-symbols-outlined text-[16px]">
                          {progress.step2Complete ? 'check' : 'description'}
                        </span>
                      </div>
                      <span className={`text-xs font-medium hidden sm:block ${
                        progress.step2Complete
                          ? 'text-gray-900 dark:text-white'
                          : progress.step1Complete
                          ? 'text-primary font-bold'
                          : 'text-gray-400'
                      }`}>
                        Documents
                      </span>
                    </div>

                    {/* Step 3: Review */}
                    <div className="flex flex-col items-center gap-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-colors relative z-20 ${
                        progress.step3Complete
                          ? 'bg-primary text-white'
                          : progress.isRejected
                          ? 'bg-red-500 text-white'
                          : progress.step3Active
                          ? 'bg-primary text-white shadow-[0_0_0_4px_rgba(112,16,18,0.2)]'
                          : progress.step2Complete
                          ? 'bg-orange-500 text-white'
                          : 'bg-gray-300 text-gray-600'
                      }`}>
                        <span className="material-symbols-outlined text-[16px]">
                          {progress.step3Complete
                            ? 'check'
                            : progress.step3Active
                            ? 'sync'
                            : progress.isRejected
                            ? 'cancel'
                            : 'visibility'
                          }
                        </span>
                      </div>
                      <span className={`text-xs font-medium hidden sm:block ${
                        progress.step3Complete
                          ? 'text-gray-900 dark:text-white'
                          : progress.step3Active
                          ? 'text-primary font-bold'
                          : progress.isRejected
                          ? 'text-red-500 font-bold'
                          : progress.step2Complete
                          ? 'text-orange-500'
                          : 'text-gray-400'
                      }`}>
                        Review
                      </span>
                    </div>

                    {/* Step 4: Contract */}
                    <div className="flex flex-col items-center gap-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-colors relative z-20 ${
                        progress.step4Complete
                          ? 'bg-primary text-white'
                          : progress.step3Complete
                          ? 'bg-primary text-white shadow-[0_0_0_4px_rgba(112,16,18,0.2)]'
                          : progress.isRejected
                          ? 'bg-gray-300 text-gray-600'
                          : 'bg-gray-300 text-gray-600'
                      }`}>
                        <span className="material-symbols-outlined text-[16px]">
                          {progress.step4Complete ? 'check' : 'handshake'}
                        </span>
                      </div>
                      <span className={`text-xs font-medium hidden sm:block ${
                        progress.step4Complete
                          ? 'text-gray-900 dark:text-white'
                          : progress.step3Complete && !progress.isRejected
                          ? 'text-primary font-bold'
                          : 'text-gray-400'
                      }`}>
                        Contract
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-100 dark:border-gray-700/50">
                  {(() => {
                    // Get application status from profile data
                    const status = profile?.application_status;
                    let statusMessage = "";
                    let statusDate = null;
                    let iconType = "info";
                    let statusColor = "blue";

                    switch (status) {
                      case 'pending':
                        statusMessage = "Your application is currently being reviewed by the crewing manager. Expected completion by";
                        statusDate = applicationReviewDate;
                        break;
                      case 'approved':
                        statusMessage = "Congratulations! Your application has been approved and is now being processed.";
                        iconType = "check_circle";
                        statusColor = "green";
                        break;
                      case 'rejected':
                        statusMessage = "Unfortunately, your application has been rejected. Please contact support for more information.";
                        iconType = "cancel";
                        statusColor = "red";
                        break;
                      case 'under_review':
                        statusMessage = "Your application is currently under detailed review. We'll update you soon.";
                        break;
                      case 'contract_signed':
                        statusMessage = "Your contract has been signed! Welcome aboard our maritime community!";
                        iconType = "celebration";
                        statusColor = "green";
                        break;
                      default:
                        statusMessage = "Your application is being processed. Please check back later.";
                        break;
                    }

                    return (
                      <>
                        <div className={`p-2 rounded-lg shrink-0 ${
                          statusColor === 'green' ? 'bg-green-100 text-green-700' :
                          statusColor === 'red' ? 'bg-red-100 text-red-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          <span className="material-symbols-outlined">{iconType}</span>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {statusMessage}
                            {statusDate && (
                              <>
                                {" "}
                                <span className="font-bold text-gray-900 dark:text-white">
                                  {statusDate.toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  })}
                                </span>
                                .
                              </>
                            )}
                          </p>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>
              {/* Dynamic Action Required Card */}
              {(documentStatus?.not_submitted_count ?? 0) > 0 && (
                <div className="bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-red-100 dark:border-red-900/30 overflow-hidden flex flex-col">
                  <div
                    className="h-32 bg-cover bg-center relative"
                    style={{
                      backgroundImage:
                        "url('/images/default-seafarer-avatar.jpg')",
                    }}
                    data-alt="Ship deck view with ocean background"
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent p-4 flex items-end">
                      <h3 className="text-white font-bold text-lg flex items-center gap-2">
                        <span className="material-symbols-outlined text-red-400">
                          warning
                        </span>{" "}
                        Action Required
                      </h3>
                    </div>
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                        {(() => {
                          const firstMissing = documentStatus?.not_submitted_documents?.[0];
                          const docName = firstMissing ? DOCUMENT_NAMES[firstMissing] || firstMissing : 'Document';
                          const remainingCount = (documentStatus?.not_submitted_count ?? 0) - 1;
                          const message = remainingCount > 0
                            ? `Your <strong>${docName}</strong> and ${remainingCount} other document${remainingCount > 1 ? 's' : ''} ${remainingCount > 1 ? 'are' : 'is'} missing or illegible. Please upload high-quality scans to proceed with the contract drafting.`
                            : `Your <strong>${docName}</strong> is missing or illegible. Please upload a high-quality scan to proceed with the contract drafting.`;
                          return <span dangerouslySetInnerHTML={{ __html: message }} />;
                        })()}
                      </p>
                    </div>
                    <button
                      onClick={() => router.push("/seafarer/documents")}
                      className="w-full bg-primary hover:bg-primary-hover text-white py-2.5 px-4 rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        upload_file
                      </span>
                      Upload {(documentStatus?.not_submitted_count ?? 0) > 1 ? 'Documents' : 'Document'}
                    </button>
                  </div>
                </div>
              )}
            </div>
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Stat 1 */}
              <div className="bg-surface-light dark:bg-surface-dark p-4 rounded-xl border border-gray-200 dark:border-gray-800 flex flex-col gap-3 hover:border-primary/50 transition-colors cursor-pointer group">
                <div className="flex justify-between items-start">
                  <div className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 p-2 rounded-lg">
                    <span className="material-symbols-outlined">verified</span>
                  </div>
                  <span className="text-xs font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">
                    Valid
                  </span>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                    Medical Certificate
                  </p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">
                    Valid until 2024
                  </p>
                </div>
              </div>
              {/* Stat 2 */}
              <div className="bg-surface-light dark:bg-surface-dark p-4 rounded-xl border border-gray-200 dark:border-gray-800 flex flex-col gap-3 hover:border-primary/50 transition-colors cursor-pointer group">
                <div className="flex justify-between items-start">
                  <div className="bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 p-2 rounded-lg">
                    <span className="material-symbols-outlined">
                      history_edu
                    </span>
                  </div>
                  <span className="text-xs font-medium text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 px-2 py-1 rounded-full">
                    Pending
                  </span>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                    Upcoming Contract
                  </p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">
                    Reviewing
                  </p>
                </div>
              </div>
              {/* Stat 3 */}
              <div className="bg-surface-light dark:bg-surface-dark p-4 rounded-xl border border-gray-200 dark:border-gray-800 flex flex-col gap-3 hover:border-primary/50 transition-colors cursor-pointer group">
                <div className="flex justify-between items-start">
                  <div className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 p-2 rounded-lg">
                    <span className="material-symbols-outlined">
                      calendar_clock
                    </span>
                  </div>
                  <span className="text-xs font-medium text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 px-2 py-1 rounded-full">
                    Upcoming
                  </span>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                    Next Interview
                  </p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">
                    {interviewDate.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                    , 14:00
                  </p>
                </div>
              </div>
              {/* Stat 4 */}
              <div className="bg-surface-light dark:bg-surface-dark p-4 rounded-xl border border-gray-200 dark:border-gray-800 flex flex-col gap-3 hover:border-primary/50 transition-colors cursor-pointer group">
                <div className="flex justify-between items-start">
                  <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 p-2 rounded-lg">
                    <span className="material-symbols-outlined">sailing</span>
                  </div>
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    Total
                  </span>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                    Sea Service
                  </p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">
                    4 Yrs 2 Mos
                  </p>
                </div>
              </div>
            </div>
            {/* Bottom Section: Documents & Calendar */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
              {/* Documents List */}
              <div className="lg:col-span-2 bg-surface-light dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-gray-800 flex flex-col">
                <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    Recent Documents
                  </h3>
                  <a
                    className="text-sm font-medium text-primary hover:text-primary-hover"
                    href="/seafarer/documents"
                  >
                    View All
                  </a>
                </div>
                <div className="flex-1 overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-gray-800/50 text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        <th className="px-6 py-3 font-medium">Document Name</th>
                        <th className="px-6 py-3 font-medium">Status</th>
                        <th className="px-6 py-3 font-medium">Expiry Date</th>
                        <th className="px-6 py-3 font-medium text-right">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-800 text-sm">
                      {/* Show loading state while fetching documents */}
                      {documentsLoading ? (
                        <tr>
                          <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                            Loading documents...
                          </td>
                        </tr>
                      ) : (() => {
                        // Create combined list: approved documents first, then missing documents
                        let displayDocuments = [];

                        // Add approved documents (limit to 2)
                        const approvedDocs = documents.filter(doc =>
                          doc.status === 'approved' || doc.status === 'verified'
                        ).slice(0, 2);

                        // Add pending/rejected documents (limit to 1)
                        const pendingDocs = documents.filter(doc =>
                          doc.status === 'pending' || doc.status === 'rejected'
                        ).slice(0, 1);

                        // Combine arrays
                        displayDocuments = [...approvedDocs, ...pendingDocs];

                        // If we don't have enough real documents, add missing ones
                        if (displayDocuments.length < 3 && documentStatus && (documentStatus.not_submitted_count ?? 0) > 0) {
                          const missingCount = 3 - displayDocuments.length;
                          const missingDocs = documentStatus.not_submitted_documents?.slice(0, missingCount) || [];

                          missingDocs.forEach(missingDocType => {
                            displayDocuments.push({
                              id: `missing-${missingDocType}`,
                              document_type: missingDocType,
                              status: 'missing',
                              file_size: '',
                              expiry_date: ''
                            });
                          });
                        }

                        // If still no documents, show first 3 missing documents
                        if (displayDocuments.length === 0 && documentStatus && (documentStatus.not_submitted_count ?? 0) > 0) {
                          const missingDocs = documentStatus.not_submitted_documents?.slice(0, 3) || [];
                          displayDocuments = missingDocs.map(missingDocType => ({
                            id: `missing-${missingDocType}`,
                            document_type: missingDocType,
                            status: 'missing',
                            file_size: '',
                            expiry_date: ''
                          }));
                        }

                        return displayDocuments.length > 0 ? (
                          // Display combined documents
                          displayDocuments.map((doc) => (
                            <tr key={doc.id} className="group hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                              <td className="px-6 py-4 flex items-center gap-3">
                                <div className={`p-1.5 rounded ${
                                  doc.status === 'approved' ? 'bg-green-50 text-green-700' :
                                  doc.status === 'rejected' ? 'bg-red-50 text-red-700' :
                                  doc.status === 'pending' ? 'bg-yellow-50 text-yellow-700' :
                                  'bg-blue-50 text-blue-700'
                                }`}>
                                  <span className="material-symbols-outlined text-[20px]">
                                    picture_as_pdf
                                  </span>
                                </div>
                                <div className="flex flex-col">
                                  <span className="font-medium text-gray-900 dark:text-white">
                                    {DOCUMENT_NAMES[doc.document_type] || doc.document_type}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    {doc.file_size || 'File uploaded'}
                                  </span>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  doc.status === 'approved' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                                  doc.status === 'rejected' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
                                  doc.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                                  'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
                                }`}>
                                  <span className={`w-1.5 h-1.5 rounded-full ${
                                    doc.status === 'approved' ? 'bg-green-600' :
                                    doc.status === 'rejected' ? 'bg-red-600' :
                                    doc.status === 'pending' ? 'bg-yellow-600' :
                                    'bg-blue-600'
                                  }`}></span>
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                {doc.expiry_date || 'N/A'}
                              </td>
                              <td className="px-6 py-4 text-right">
                                <button
                                  onClick={() => {
                                    setPreviewDocument({
                                      id: doc.id,
                                      document_type: doc.document_type,
                                      status: doc.status,
                                      file_size: doc.file_size,
                                      expiry_date: doc.expiry_date,
                                      file_url: doc.id.startsWith('missing-') ? undefined : `/api/v1/seafarers/documents/${doc.id}/download`,
                                      file_name: DOCUMENT_NAMES[doc.document_type] || doc.document_type
                                    });
                                  }}
                                  className="text-primary hover:text-primary-hover text-sm font-medium"
                                >
                                  {doc.id.startsWith('missing-') ? 'Upload' : 'View'}
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                              No documents found.
                            </td>
                          </tr>
                        );
                      })()}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Upcoming Schedule (Meetings) */}
              <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-gray-800 flex flex-col">
                <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    Upcoming Schedule
                  </h3>
                  <a
                    className="text-sm font-medium text-primary hover:text-primary-hover"
                    href="/seafarer/interview"
                  >
                    View All
                  </a>
                </div>
                <div className="flex-1 overflow-y-auto">
                  {meetingsLoading ? (
                    <div className="p-6 text-center text-gray-500">
                      Loading meetings...
                    </div>
                  ) : meetings.length > 0 ? (
                    <div className="space-y-3 p-6">
                      {meetings.slice(0, 5).map((meeting) => (
                        <div
                          key={meeting.id}
                          className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                        >
                          <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                            <span className="material-symbols-outlined text-primary">
                              {meeting.type === 'interview' ? 'person_search' :
                               meeting.type === 'medical' ? 'medical_services' :
                               meeting.type === 'training' ? 'school' :
                               'event_available'}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-gray-900 dark:text-white text-sm">
                              {meeting.title}
                            </h4>
                            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                              {meeting.location} • {new Date(meeting.scheduled_date).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                              {meeting.host && ` • Hosted by ${meeting.host}`}
                            </p>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mt-2 ${
                              meeting.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                              meeting.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              meeting.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {meeting.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-6 text-center text-gray-500">
                      No upcoming meetings scheduled.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Document Preview Modal */}
        {previewDocument && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-surface-dark rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {previewDocument.document_type ? DOCUMENT_NAMES[previewDocument.document_type] || previewDocument.document_type : 'Document Preview'}
                </h3>
                <button
                  onClick={() => setPreviewDocument(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              <div className="p-6">
                {previewDocument.id.startsWith('missing-') ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="material-symbols-outlined text-blue-600 text-3xl">
                        upload_file
                      </span>
                    </div>
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                      Document Required
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      This document is required for your application. Please upload it to continue.
                    </p>
                    <button
                      onClick={() => {
                        setPreviewDocument(null);
                        router.push("/seafarer/documents");
                      }}
                      className="bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-lg font-medium transition-colors"
                    >
                      Upload Document
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Document Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                          Document Type
                        </label>
                        <p className="text-gray-900 dark:text-white font-medium">
                          {DOCUMENT_NAMES[previewDocument.document_type] || previewDocument.document_type}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                          Status
                        </label>
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          previewDocument.status === 'approved' ? 'bg-green-100 text-green-800' :
                          previewDocument.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          previewDocument.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            previewDocument.status === 'approved' ? 'bg-green-600' :
                            previewDocument.status === 'rejected' ? 'bg-red-600' :
                            previewDocument.status === 'pending' ? 'bg-yellow-600' :
                            'bg-blue-600'
                          }`}></span>
                          {previewDocument.status}
                        </span>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                          File Size
                        </label>
                        <p className="text-gray-900 dark:text-white font-medium">
                          {previewDocument.file_size || 'Unknown'}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                          Expiry Date
                        </label>
                        <p className="text-gray-900 dark:text-white font-medium">
                          {previewDocument.expiry_date ? new Date(previewDocument.expiry_date).toLocaleDateString() : 'N/A'}
                        </p>
                      </div>
                    </div>

                    {/* Document Preview Area */}
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-bold text-gray-900 dark:text-white">
                          Document Preview
                        </h4>
                        {previewDocument.file_url && (
                          <a
                            href={previewDocument.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:text-primary-hover font-medium text-sm flex items-center gap-1"
                          >
                            <span className="material-symbols-outlined text-[18px]">
                              download
                            </span>
                            Download
                          </a>
                        )}
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-8 text-center min-h-[300px] flex items-center justify-center">
                        <div className="flex flex-col items-center gap-4">
                          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                            <span className="material-symbols-outlined text-blue-600 text-3xl">
                              picture_as_pdf
                            </span>
                          </div>
                          <h5 className="text-lg font-bold text-gray-900 dark:text-white">
                            {previewDocument.file_name}
                          </h5>
                          <p className="text-gray-600 dark:text-gray-400">
                            Preview not available. Click download to view the document.
                          </p>
                          {previewDocument.file_url && (
                            <a
                              href={previewDocument.file_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors"
                            >
                              Open Document
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
