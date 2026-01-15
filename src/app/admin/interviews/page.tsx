"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Interview {
  id: string;
  date: string;
  timeStart: string;
  timeEnd: string;
  candidateName: string;
  candidateId: string;
  candidateAvatar: string;
  position: string;
  interviewers: string[];
  interviewerAvatars?: string[];
  mode: "video" | "in-person" | "phone";
  status: "scheduled" | "pending" | "completed" | "cancelled";
  department: "deck" | "engine" | "galley";
}

export default function AdminInterviewsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [interviews, setInterviews] = useState<Interview[]>([]);

  useEffect(() => {
    let mounted = true;
    fetch("/api/v1/admin/interviews")
      .then(async (res) => (res.ok ? ((await res.json()) as Interview[]) : []))
      .then((data) => {
        if (!mounted) return;
        setInterviews(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (!mounted) return;
        setInterviews([]);
      });
    return () => {
      mounted = false;
    };
  }, []);

  // Filter interviews
  const filteredInterviews = interviews.filter((interview) => {
    const matchesSearch =
      interview.candidateName
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      interview.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
      interview.interviewers.some((i) =>
        i.toLowerCase().includes(searchQuery.toLowerCase())
      );
    const matchesStatus = !statusFilter || interview.status === statusFilter;
    const matchesDepartment =
      !departmentFilter || interview.department === departmentFilter;
    return matchesSearch && matchesStatus && matchesDepartment;
  });

  // Stats
  const stats = {
    upcomingToday: interviews.filter((i) => i.status === "scheduled").length,
    pendingFeedback: interviews.filter((i) => i.status === "pending").length,
    completedThisWeek: interviews.filter((i) => i.status === "completed")
      .length,
    cancelled: interviews.filter((i) => i.status === "cancelled").length,
  };

  const handleLogout = () => {
    localStorage.removeItem("crew-manning-user");
    localStorage.removeItem("crew-manning-token");
    localStorage.removeItem("crew-manning-profile");
    router.push("/admin/login");
  };

  const handleCreateInterview = () => {
    alert("Opening create interview modal...");
  };

  const handleInterviewAction = (interview: Interview) => {
    alert(`Opening actions menu for interview with ${interview.candidateName}`);
  };

  const getStatusBadge = (status: Interview["status"]) => {
    switch (status) {
      case "scheduled":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
            <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
            Scheduled
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-700 border border-orange-200">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-600"></span>
            Pending
          </span>
        );
      case "completed":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200">
            <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span>
            Completed
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 border border-red-200">
            <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
            Cancelled
          </span>
        );
      default:
        return null;
    }
  };

  const getModeIcon = (mode: Interview["mode"]) => {
    switch (mode) {
      case "video":
        return (
          <div className="flex items-center gap-1.5 text-[#506795] bg-[#f6f6f8] px-2.5 py-1 rounded-md w-fit border border-transparent">
            <span className="material-symbols-outlined text-[18px]">
              videocam
            </span>
            <span className="text-xs font-medium">Video</span>
          </div>
        );
      case "in-person":
        return (
          <div className="flex items-center gap-1.5 text-[#506795] bg-[#f6f6f8] px-2.5 py-1 rounded-md w-fit border border-transparent">
            <span className="material-symbols-outlined text-[18px]">
              apartment
            </span>
            <span className="text-xs font-medium">In-Person</span>
          </div>
        );
      case "phone":
        return (
          <div className="flex items-center gap-1.5 text-[#506795] bg-[#f6f6f8] px-2.5 py-1 rounded-md w-fit border border-transparent">
            <span className="material-symbols-outlined text-[18px]">call</span>
            <span className="text-xs font-medium">Phone</span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-[#f6f6f8] dark:bg-[#111621] text-[#0e121b] font-display antialiased min-h-screen flex flex-col overflow-x-hidden">
      {/* Header */}
      <header className="w-full bg-white dark:bg-gray-900 border-b border-[#e5e7eb] sticky top-0 z-50">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <Link href="/admin/dashboard" className="flex items-center gap-3">
                <div className="size-8 text-primary">
                  <span className="material-symbols-outlined text-[32px]">
                    anchor
                  </span>
                </div>
                <h2 className="text-[#0e121b] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">
                  CrewManage
                </h2>
              </Link>
              <nav className="hidden md:flex items-center gap-6">
                <Link
                  href="/admin/dashboard"
                  className="text-[#506795] hover:text-primary text-sm font-medium transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  href="/admin/seafarers"
                  className="text-[#506795] hover:text-primary text-sm font-medium transition-colors"
                >
                  Crew List
                </Link>
                <Link
                  href="/admin/shipowners"
                  className="text-[#506795] hover:text-primary text-sm font-medium transition-colors"
                >
                  Ship Owners
                </Link>
                <Link
                  href="/admin/interviews"
                  className="text-primary text-sm font-bold"
                >
                  Interviews
                </Link>
                <Link
                  href="/admin/contracts"
                  className="text-[#506795] hover:text-primary text-sm font-medium transition-colors"
                >
                  Contracts
                </Link>
                <Link
                  href="/admin/crew-management"
                  className="text-[#506795] hover:text-primary text-sm font-medium transition-colors"
                >
                  Full Crew Mgmt
                </Link>
                <Link
                  href="/admin/one-off-crew"
                  className="text-[#506795] hover:text-primary text-sm font-medium transition-colors"
                >
                  One-Off Crew
                </Link>
              </nav>
            </div>
            <div className="flex items-center gap-6">
              <div className="hidden md:block relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#506795]">
                  <span className="material-symbols-outlined text-[24px]">
                    search
                  </span>
                </span>
                <input
                  className="w-64 pl-10 pr-4 py-2 text-sm bg-[#f6f6f8] border-none rounded-lg focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all placeholder:text-[#506795]"
                  placeholder="Search..."
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-3">
                <button className="relative p-2 text-[#506795] hover:text-primary transition-colors">
                  <span className="material-symbols-outlined text-[24px]">
                    notifications
                  </span>
                  <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border border-white"></span>
                </button>
                <button
                  onClick={handleLogout}
                  className="size-9 rounded-full bg-cover bg-center border border-[#e5e7eb] cursor-pointer"
                  style={{
                    backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuCVx7bpYxBWA_EcRFCfCAWwOKn5thOmEG4ptgVaLipAeXDABkw21OWktI26ZzYimNRQez_FOL6UEwC1eAfEBY-2XKhPShJTueUM8Ils3oLWKXWC15orD-nYawfBGk816J10-Wn7d9xOWEilpp6Pjuuo0BwqfCC-5YWHWc-3bsovya41N7K4D-wMET7vgV3_Tdd3ipQpf-pxK54Cryjzj0ZhQi8uPmPBerLIOzrzRl9kU7ObOsCef4If9ZUxejqNaXpHVWLm4grjzTo1")`,
                  }}
                  title="Click to logout"
                ></button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex flex-col gap-1">
            <h1 className="text-[#0e121b] dark:text-white text-3xl font-black tracking-tight">
              Interview Management
            </h1>
            <p className="text-[#506795] text-base">
              Manage schedules, feedback, and candidate statuses.
            </p>
          </div>
          <button
            onClick={handleCreateInterview}
            className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-lg font-bold text-sm transition-all shadow-sm hover:shadow-md"
          >
            <span className="material-symbols-outlined">add</span>
            <span>Create Interview</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-[#e5e7eb] shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[#506795] text-sm font-medium">
                Upcoming Today
              </p>
              <span className="material-symbols-outlined text-primary">
                calendar_today
              </span>
            </div>
            <p className="text-[#0e121b] dark:text-white text-3xl font-bold">
              {stats.upcomingToday}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-[#e5e7eb] shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[#506795] text-sm font-medium">
                Pending Feedback
              </p>
              <span className="material-symbols-outlined text-orange-500">
                pending_actions
              </span>
            </div>
            <p className="text-[#0e121b] dark:text-white text-3xl font-bold">
              {stats.pendingFeedback}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-[#e5e7eb] shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[#506795] text-sm font-medium">
                Completed This Week
              </p>
              <span className="material-symbols-outlined text-green-500">
                check_circle
              </span>
            </div>
            <p className="text-[#0e121b] dark:text-white text-3xl font-bold">
              {stats.completedThisWeek}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-[#e5e7eb] shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[#506795] text-sm font-medium">Cancelled</p>
              <span className="material-symbols-outlined text-red-500">
                cancel
              </span>
            </div>
            <p className="text-[#0e121b] dark:text-white text-3xl font-bold">
              {stats.cancelled}
            </p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-[#e5e7eb] p-4 mb-6 shadow-sm">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#506795]">
                <span className="material-symbols-outlined">search</span>
              </span>
              <input
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-[#f6f6f8] border border-transparent focus:bg-white focus:border-primary/50 rounded-lg focus:ring-0 transition-colors placeholder:text-[#506795]"
                placeholder="Search by candidate, position or interviewer..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-4 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
              <div className="relative min-w-[160px]">
                <select
                  className="w-full appearance-none bg-[#f6f6f8] border-transparent rounded-lg py-2.5 pl-3 pr-10 text-sm text-[#0e121b] focus:border-primary/50 focus:bg-white focus:ring-0 cursor-pointer"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="">All Statuses</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-[#506795]">
                  <span className="material-symbols-outlined">expand_more</span>
                </span>
              </div>
              <div className="relative min-w-[160px]">
                <select
                  className="w-full appearance-none bg-[#f6f6f8] border-transparent rounded-lg py-2.5 pl-3 pr-10 text-sm text-[#0e121b] focus:border-primary/50 focus:bg-white focus:ring-0 cursor-pointer"
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                >
                  <option value="">All Departments</option>
                  <option value="deck">Deck</option>
                  <option value="engine">Engine</option>
                  <option value="galley">Galley</option>
                </select>
                <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-[#506795]">
                  <span className="material-symbols-outlined">expand_more</span>
                </span>
              </div>
              <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#f6f6f8] hover:bg-gray-200 text-[#0e121b] rounded-lg text-sm font-medium transition-colors border border-transparent">
                <span className="material-symbols-outlined">filter_list</span>
                <span>More</span>
              </button>
            </div>
          </div>
        </div>

        {/* Interviews Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-[#e5e7eb] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f6f6f8] border-b border-[#e5e7eb]">
                  <th className="px-6 py-4 text-xs font-bold text-[#506795] uppercase tracking-wider">
                    Date / Time (UTC)
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-[#506795] uppercase tracking-wider">
                    Candidate
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-[#506795] uppercase tracking-wider">
                    Position
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-[#506795] uppercase tracking-wider hidden lg:table-cell">
                    Interviewers
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-[#506795] uppercase tracking-wider">
                    Mode
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-[#506795] uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-[#506795] uppercase tracking-wider text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e5e7eb]">
                {filteredInterviews.map((interview) => (
                  <tr
                    key={interview.id}
                    className="hover:bg-[#f6f6f8]/50 transition-colors group"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-[#0e121b] dark:text-white">
                          {interview.date}
                        </span>
                        <span className="text-xs text-[#506795]">
                          {interview.timeStart} - {interview.timeEnd}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div
                          className="size-10 rounded-full bg-cover bg-center border border-[#e5e7eb]"
                          style={{
                            backgroundImage: `url("${interview.candidateAvatar}")`,
                          }}
                        ></div>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-[#0e121b] dark:text-white">
                            {interview.candidateName}
                          </span>
                          <span className="text-xs text-[#506795]">
                            ID: {interview.candidateId}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-[#0e121b] dark:text-white">
                        {interview.position}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                      {interview.interviewerAvatars &&
                      interview.interviewerAvatars.length > 0 ? (
                        <div className="flex -space-x-2 overflow-hidden">
                          {interview.interviewerAvatars.map((avatar, index) => (
                            <div
                              key={index}
                              className="size-8 rounded-full border-2 border-white bg-gray-200 bg-cover"
                              style={{ backgroundImage: `url("${avatar}")` }}
                            ></div>
                          ))}
                          {interview.interviewers.length > 1 && (
                            <div className="size-8 rounded-full border-2 border-white bg-gray-300 flex items-center justify-center text-[10px] font-bold text-[#506795] bg-[#f6f6f8]">
                              +{interview.interviewers.length - 1}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-sm text-[#506795]">
                          {interview.interviewers.join(", ")}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getModeIcon(interview.mode)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(interview.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button
                        onClick={() => handleInterviewAction(interview)}
                        className="text-[#506795] hover:text-primary p-1.5 rounded-md hover:bg-primary/10 transition-colors"
                      >
                        <span className="material-symbols-outlined">
                          more_vert
                        </span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredInterviews.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-[#506795]">
                <span className="material-symbols-outlined text-[48px] mb-4">
                  event_busy
                </span>
                <p className="text-lg font-medium">No interviews found</p>
                <p className="text-sm">Try adjusting your search or filters</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-[#e5e7eb] bg-white dark:bg-gray-800">
            <p className="text-sm text-[#506795]">
              Showing{" "}
              <span className="font-bold text-[#0e121b] dark:text-white">
                1
              </span>{" "}
              to{" "}
              <span className="font-bold text-[#0e121b] dark:text-white">
                {filteredInterviews.length}
              </span>{" "}
              of{" "}
              <span className="font-bold text-[#0e121b] dark:text-white">
                24
              </span>{" "}
              results
            </p>
            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm border border-[#e5e7eb] rounded-md text-[#506795] hover:bg-[#f6f6f8] disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(1)}
                className={`px-3 py-1 text-sm rounded-md border ${
                  currentPage === 1
                    ? "bg-primary text-white border-primary"
                    : "border-[#e5e7eb] text-[#506795] hover:bg-[#f6f6f8]"
                }`}
              >
                1
              </button>
              <button
                onClick={() => setCurrentPage(2)}
                className={`px-3 py-1 text-sm rounded-md border ${
                  currentPage === 2
                    ? "bg-primary text-white border-primary"
                    : "border-[#e5e7eb] text-[#506795] hover:bg-[#f6f6f8]"
                }`}
              >
                2
              </button>
              <button
                onClick={() => setCurrentPage(3)}
                className={`px-3 py-1 text-sm rounded-md border ${
                  currentPage === 3
                    ? "bg-primary text-white border-primary"
                    : "border-[#e5e7eb] text-[#506795] hover:bg-[#f6f6f8]"
                }`}
              >
                3
              </button>
              <button className="px-3 py-1 text-sm border border-[#e5e7eb] rounded-md text-[#506795] hover:bg-[#f6f6f8]">
                Next
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
