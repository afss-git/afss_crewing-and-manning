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

  // Fetch profile if not already loaded
  useEffect(() => {
    if (
      isHydrated &&
      user?.role === "seafarer" &&
      !profile &&
      !isProfileLoading
    ) {
      fetchProfile();
    }
  }, [isHydrated, user, profile, isProfileLoading, fetchProfile]);

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
            <span className="ml-auto bg-red-100 text-red-800 text-xs font-bold px-2 py-0.5 rounded-full">
              1
            </span>
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
            <span className="ml-auto bg-red-100 text-red-800 text-xs font-bold px-2 py-0.5 rounded-full">
              1
            </span>
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
                        Please upload your Seaman&apos;s Book to continue.
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
                  Here is what&apos;s happening with your applications today.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() =>
                    alert(
                      "Export feature coming soon! This will download a PDF of your application status."
                    )
                  }
                  className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    file_download
                  </span>
                  Export Status
                </button>
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
                      Under Review
                    </p>
                  </div>
                  <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                    Step 3 of 4
                  </span>
                </div>
                {/* Stepper Visual */}
                <div className="relative mb-8 px-2">
                  <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 dark:bg-gray-700 -translate-y-1/2 rounded-full z-0"></div>
                  <div className="absolute top-1/2 left-0 w-[66%] h-1 bg-primary -translate-y-1/2 rounded-full z-0"></div>
                  <div className="relative z-10 flex justify-between w-full">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center shadow-md">
                        <span className="material-symbols-outlined text-[16px]">
                          check
                        </span>
                      </div>
                      <span className="text-xs font-medium text-gray-900 dark:text-white hidden sm:block">
                        Profile
                      </span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center shadow-md">
                        <span className="material-symbols-outlined text-[16px]">
                          check
                        </span>
                      </div>
                      <span className="text-xs font-medium text-gray-900 dark:text-white hidden sm:block">
                        Documents
                      </span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center shadow-[0_0_0_4px_rgba(112,16,18,0.2)]">
                        <span className="material-symbols-outlined text-[16px]">
                          sync
                        </span>
                      </div>
                      <span className="text-xs font-bold text-primary hidden sm:block">
                        Review
                      </span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 text-gray-300 flex items-center justify-center">
                        <span className="text-xs font-bold">4</span>
                      </div>
                      <span className="text-xs font-medium text-gray-400 hidden sm:block">
                        Contract
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-100 dark:border-gray-700/50">
                  <div className="bg-blue-100 text-blue-700 p-2 rounded-lg shrink-0">
                    <span className="material-symbols-outlined">info</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Your application is currently being reviewed by the
                      crewing manager. Expected completion by{" "}
                      <span className="font-bold text-gray-900 dark:text-white">
                        {new Date(
                          Date.now() + 7 * 24 * 60 * 60 * 1000
                        ).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                      .
                    </p>
                  </div>
                </div>
              </div>
              {/* Action Card */}
              <div className="bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-red-100 dark:border-red-900/30 overflow-hidden flex flex-col">
                <div
                  className="h-32 bg-cover bg-center relative"
                  style={{
                    backgroundImage:
                      "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCH37CPsEnfZ0px5lKes-whha7qdNHwSZWmIjmJ1FS7Av5D-S-j0b9rPs3CBuXo4xCNeDXxKB2jXuE1B1HIlTHdF-1spEBcBIv9iypHdJAp6YZLP6nF_Pf3gA5H1JuaWqv2OoxWYJTIZddG58xSuC0Qo2Rcfawxk-yvejfMsapfb9XJ2xXeGE61q4cIIKDDWe71Q0v3WdNEEshwYapNCXAPbBB_j-0JicN-kMyA0-JfJsM5bUfQQaY7Zvw2qWfZJRPqZSH8zhJ49IJy')",
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
                      Your <strong>Seaman&apos;s Book</strong> scan is missing
                      or illegible. Please upload a high-quality scan to proceed
                      with the contract drafting.
                    </p>
                  </div>
                  <button
                    onClick={() => router.push("/seafarer/documents")}
                    className="w-full bg-primary hover:bg-primary-hover text-white py-2.5 px-4 rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      upload_file
                    </span>
                    Upload Document
                  </button>
                </div>
              </div>
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
                    {new Date(
                      Date.now() + 5 * 24 * 60 * 60 * 1000
                    ).toLocaleDateString("en-US", {
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
                      <tr className="group hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                        <td className="px-6 py-4 flex items-center gap-3">
                          <div className="bg-red-50 text-red-700 p-1.5 rounded">
                            <span className="material-symbols-outlined text-[20px]">
                              picture_as_pdf
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="font-medium text-gray-900 dark:text-white">
                              Seaman&apos;s Book
                            </span>
                            <span className="text-xs text-gray-500">
                              PDF, 2.4MB
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>{" "}
                            Missing
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                          -
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => router.push("/seafarer/documents")}
                            className="text-primary hover:text-primary-hover font-medium text-sm"
                          >
                            Upload
                          </button>
                        </td>
                      </tr>
                      <tr className="group hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                        <td className="px-6 py-4 flex items-center gap-3">
                          <div className="bg-blue-50 text-blue-700 p-1.5 rounded">
                            <span className="material-symbols-outlined text-[20px]">
                              picture_as_pdf
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="font-medium text-gray-900 dark:text-white">
                              Passport
                            </span>
                            <span className="text-xs text-gray-500">
                              PDF, 1.1MB
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span>{" "}
                            Verified
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                          12 Aug 2028
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                            <span className="material-symbols-outlined text-[20px]">
                              more_vert
                            </span>
                          </button>
                        </td>
                      </tr>
                      <tr className="group hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                        <td className="px-6 py-4 flex items-center gap-3">
                          <div className="bg-blue-50 text-blue-700 p-1.5 rounded">
                            <span className="material-symbols-outlined text-[20px]">
                              picture_as_pdf
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="font-medium text-gray-900 dark:text-white">
                              STCW Basic Training
                            </span>
                            <span className="text-xs text-gray-500">
                              PDF, 3.2MB
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span>{" "}
                            Verified
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                          05 Jan 2025
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                            <span className="material-symbols-outlined text-[20px]">
                              more_vert
                            </span>
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              {/* Upcoming Schedule */}
              <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-gray-800 p-6 flex flex-col">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                  Upcoming Schedule
                </h3>
                <div className="space-y-4">
                  {/* Event 1 */}
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center min-w-[3rem] bg-gray-100 dark:bg-gray-800 rounded-lg p-2 h-fit">
                      <span className="text-xs font-bold text-gray-500 uppercase">
                        {new Date(
                          Date.now() + 5 * 24 * 60 * 60 * 1000
                        ).toLocaleDateString("en-US", { month: "short" })}
                      </span>
                      <span className="text-lg font-bold text-gray-900 dark:text-white">
                        {new Date(
                          Date.now() + 5 * 24 * 60 * 60 * 1000
                        ).getDate()}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <p className="font-bold text-gray-900 dark:text-white text-sm">
                        Technical Interview
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        14:00 - 15:00 • Video Call
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <div
                          className="h-6 w-6 rounded-full bg-gray-200 bg-cover bg-center"
                          style={{
                            backgroundImage:
                              "url('https://lh3.googleusercontent.com/aida-public/AB6AXuC2IfU-j9IqkwQTCj0US25BMUNk2CqLKx9uRg79mYJB4bha438gllFE-9cL64z57F3bwZilkZ6bihKHleXLSvorY0NZYiQzxd3SFw0kHFq9tLJdWNGkqovnWw69Tyt8hoWF5t8terXR_h3UEqQUe5r_IQs17chkSpW2pk_XJAD-QtOj3pK78l-uRh3ysaqWIPEKMblMx1xoYlM4v92Xocic12jCpdXDe6ohLWfS-NZlZwXy5PLGSiSPUOU5ducmoLhicTalSx39wUtE')",
                          }}
                        ></div>
                        <span className="text-xs text-gray-600 dark:text-gray-300">
                          with Capt. Williams
                        </span>
                      </div>
                    </div>
                  </div>
                  <hr className="border-gray-100 dark:border-gray-800" />
                  {/* Event 2 */}
                  <div className="flex gap-4 opacity-70">
                    <div className="flex flex-col items-center min-w-[3rem] bg-gray-100 dark:bg-gray-800 rounded-lg p-2 h-fit">
                      <span className="text-xs font-bold text-gray-500 uppercase">
                        {new Date(
                          Date.now() + 10 * 24 * 60 * 60 * 1000
                        ).toLocaleDateString("en-US", { month: "short" })}
                      </span>
                      <span className="text-lg font-bold text-gray-900 dark:text-white">
                        {new Date(
                          Date.now() + 10 * 24 * 60 * 60 * 1000
                        ).getDate()}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <p className="font-bold text-gray-900 dark:text-white text-sm">
                        Pre-Embarkation Medical
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        09:00 - 11:30 • Clinic A
                      </p>
                    </div>
                  </div>
                  <hr className="border-gray-100 dark:border-gray-800" />
                  {/* Event 3 */}
                  <div className="flex gap-4 opacity-50">
                    <div className="flex flex-col items-center min-w-[3rem] bg-gray-100 dark:bg-gray-800 rounded-lg p-2 h-fit">
                      <span className="text-xs font-bold text-gray-500 uppercase">
                        {new Date(
                          Date.now() + 18 * 24 * 60 * 60 * 1000
                        ).toLocaleDateString("en-US", { month: "short" })}
                      </span>
                      <span className="text-lg font-bold text-gray-900 dark:text-white">
                        {new Date(
                          Date.now() + 18 * 24 * 60 * 60 * 1000
                        ).getDate()}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <p className="font-bold text-gray-900 dark:text-white text-sm">
                        Potential Deployment
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Port of Rotterdam
                      </p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => router.push("/seafarer/interview")}
                  className="mt-auto pt-4 text-primary text-sm font-medium hover:text-primary-hover flex items-center gap-1 self-start"
                >
                  View Calendar{" "}
                  <span className="material-symbols-outlined text-[16px]">
                    arrow_forward
                  </span>
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
