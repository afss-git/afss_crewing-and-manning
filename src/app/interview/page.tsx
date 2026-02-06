"use client";

export default function InterviewPage() {
  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-text-main antialiased min-h-screen flex flex-col">
      {/* Top Navigation Bar */}
      <nav className="bg-card-light dark:bg-card-dark border-b border-border-color sticky top-0 z-50">
        <div className="px-6 md:px-12 lg:px-20 py-3 mx-auto max-w-[1440px]">
          <div className="flex items-center justify-between">
            {/* Logo & Brand */}
            <div className="flex items-center gap-4 text-text-main">
              <div className="size-8 text-primary flex items-center justify-center bg-primary/10 rounded-lg">
                <span className="material-symbols-outlined text-[24px]">
                  anchor
                </span>
              </div>
              <h2 className="text-text-main dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">
                Maritime Crewing
              </h2>
            </div>
            {/* Nav Links (Desktop) */}
            <div className="hidden md:flex flex-1 justify-center gap-8">
              <a
                className="text-text-main dark:text-gray-200 text-sm font-medium hover:text-primary transition-colors"
                href="/dashboard"
              >
                Dashboard
              </a>
              <a
                className="text-primary text-sm font-bold border-b-2 border-primary pb-0.5"
                href="#"
              >
                Applications
              </a>
              <a
                className="text-text-main dark:text-gray-200 text-sm font-medium hover:text-primary transition-colors"
                href="/documents"
              >
                Documents
              </a>
              <a
                className="text-text-main dark:text-gray-200 text-sm font-medium hover:text-primary transition-colors"
                href="#"
              >
                Messages
              </a>
            </div>
            {/* User Profile & Actions */}
            <div className="flex items-center gap-4">
              <div className="flex gap-2">
                <button className="flex items-center justify-center size-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-text-main dark:text-white transition-colors">
                  <span className="material-symbols-outlined">
                    notifications
                  </span>
                </button>
                <button className="flex items-center justify-center size-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-text-main dark:text-white transition-colors">
                  <span className="material-symbols-outlined">settings</span>
                </button>
              </div>
              <div
                className="bg-center bg-no-repeat bg-cover rounded-full size-10 ring-2 ring-primary/20 cursor-pointer"
                style={{
                  backgroundImage: "url('/images/default-user-avatar.jpg')",
                }}
                data-alt="Profile picture of a seafarer"
              ></div>
            </div>
          </div>
        </div>
      </nav>
      {/* Main Content Area */}
      <main className="flex-1 px-6 md:px-12 lg:px-20 py-8 mx-auto w-full max-w-[1440px]">
        {/* Breadcrumbs */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <a
            className="text-text-muted hover:text-primary text-sm font-medium"
            href="/dashboard"
          >
            Dashboard
          </a>
          <span className="material-symbols-outlined text-text-muted text-sm">
            chevron_right
          </span>
          <a
            className="text-text-muted hover:text-primary text-sm font-medium"
            href="#"
          >
            Applications
          </a>
          <span className="material-symbols-outlined text-text-muted text-sm">
            chevron_right
          </span>
          <span className="text-primary text-sm font-semibold">
            Interview Details
          </span>
        </div>
        {/* Page Heading */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
          <div className="flex flex-col gap-2">
            <h1 className="text-text-main dark:text-white text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em]">
              Chief Officer Interview - MV Ocean Giant
            </h1>
            <p className="text-text-muted dark:text-gray-400 text-base font-normal flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">tag</span>
              Interview ID: #INT-2023-8492
              <span className="mx-1">•</span>
              <span className="material-symbols-outlined text-lg">
                calendar_today
              </span>
              October 24, 2023
            </p>
          </div>
          <div className="flex gap-3">
            <button className="text-text-muted hover:text-primary text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              Reschedule Request
            </button>
          </div>
        </div>
        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Primary Info (2/3 width) */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            {/* Status Card */}
            <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-sm border border-border-color dark:border-gray-800 overflow-hidden">
              <div className="flex flex-col md:flex-row items-stretch">
                <div className="flex-1 p-6 md:p-8 flex flex-col justify-between gap-6">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 text-xs font-bold tracking-wider mb-4 uppercase">
                      <span className="material-symbols-outlined text-sm">
                        schedule
                      </span>
                      Upcoming
                    </div>
                    <h3 className="text-2xl font-bold text-text-main dark:text-white mb-2">
                      Interview Status: Scheduled
                    </h3>
                    <p className="text-text-muted dark:text-gray-400">
                      Your interview has been confirmed by the crewing manager.
                      Please review the details and confirm your attendance
                      below.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3 mt-2">
                    <button className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-lg font-bold transition-all shadow-md hover:shadow-lg w-full sm:w-auto">
                      <span className="material-symbols-outlined">
                        check_circle
                      </span>
                      Confirm Attendance
                    </button>
                    <button
                      className="flex items-center justify-center gap-2 bg-white dark:bg-gray-700 border border-border-color dark:border-gray-600 text-text-main dark:text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors w-full sm:w-auto opacity-50 cursor-not-allowed"
                      title="Link active 15 mins prior"
                    >
                      <span className="material-symbols-outlined">
                        videocam
                      </span>
                      Join Meeting
                    </button>
                    <a
                      href="/contracts"
                      className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-bold transition-all shadow-md hover:shadow-lg w-full sm:w-auto"
                    >
                      <span className="material-symbols-outlined">
                        history_edu
                      </span>
                      View Contracts
                    </a>
                  </div>
                </div>
                {/* Decorative Image Side */}
                <div
                  className="w-full md:w-1/3 min-h-[200px] bg-cover bg-center relative"
                  style={{
                    backgroundImage: "url('/images/default-user-avatar.jpg')",
                  }}
                  data-alt="Abstract view of a ship's bridge window looking out to sea"
                >
                  <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-l from-black/60 to-transparent flex items-end justify-end p-4">
                    <div className="text-white text-xs font-medium opacity-80 bg-black/30 backdrop-blur-sm px-2 py-1 rounded">
                      MV Ocean Giant
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Logistics / Description List */}
            <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-sm border border-border-color dark:border-gray-800 p-6 md:p-8">
              <h3 className="text-lg font-bold text-text-main dark:text-white mb-6 border-b border-border-color dark:border-gray-700 pb-4">
                Logistics & Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
                {/* Date & Time */}
                <div className="flex items-start gap-4">
                  <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <span className="material-symbols-outlined">
                      calendar_month
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs uppercase tracking-wide text-text-muted font-bold mb-1">
                      Date & Time
                    </span>
                    <p className="text-text-main dark:text-white font-semibold">
                      October 24, 2023
                    </p>
                    <p className="text-text-main dark:text-white">
                      14:00 - 15:00 (GMT+8)
                    </p>
                  </div>
                </div>
                {/* Location */}
                <div className="flex items-start gap-4">
                  <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <span className="material-symbols-outlined">
                      location_on
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs uppercase tracking-wide text-text-muted font-bold mb-1">
                      Location
                    </span>
                    <p className="text-text-main dark:text-white font-semibold">
                      Virtual Meeting Room
                    </p>
                    <p className="text-text-muted text-sm">Zoom Platform</p>
                  </div>
                </div>
                {/* Interviewer */}
                <div className="flex items-start gap-4">
                  <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <span className="material-symbols-outlined">person</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs uppercase tracking-wide text-text-muted font-bold mb-1">
                      Interviewer
                    </span>
                    <p className="text-text-main dark:text-white font-semibold">
                      Capt. James Anderson
                    </p>
                    <p className="text-text-muted text-sm">Crewing Manager</p>
                  </div>
                </div>
                {/* Platform Info */}
                <div className="flex items-start gap-4">
                  <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <span className="material-symbols-outlined">
                      laptop_mac
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs uppercase tracking-wide text-text-muted font-bold mb-1">
                      Platform Details
                    </span>
                    <p className="text-text-main dark:text-white font-semibold">
                      Video Call
                    </p>
                    <p className="text-text-muted text-sm">
                      Link will be active 15 mins prior.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Right Column: Preparation (1/3 width) */}
          <div className="lg:col-span-1 flex flex-col gap-8">
            {/* Requirements Card */}
            <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-sm border border-border-color dark:border-gray-800 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-primary/10 p-2 rounded-lg text-primary">
                  <span className="material-symbols-outlined">assignment</span>
                </div>
                <h3 className="text-lg font-bold text-text-main dark:text-white">
                  Requirements
                </h3>
              </div>
              <p className="text-sm text-text-muted mb-4">
                Please have the following original documents ready for
                verification during the call.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 p-3 bg-background-light dark:bg-gray-800/50 rounded-lg">
                  <span className="material-symbols-outlined text-green-600 text-[20px] mt-0.5">
                    check_circle
                  </span>
                  <span className="text-sm font-medium text-text-main dark:text-gray-200">
                    Valid Passport
                  </span>
                </li>
                <li className="flex items-start gap-3 p-3 bg-background-light dark:bg-gray-800/50 rounded-lg">
                  <span className="material-symbols-outlined text-green-600 text-[20px] mt-0.5">
                    check_circle
                  </span>
                  <span className="text-sm font-medium text-text-main dark:text-gray-200">
                    Seaman&apos;s Book (SIRB)
                  </span>
                </li>
                <li className="flex items-start gap-3 p-3 bg-background-light dark:bg-gray-800/50 rounded-lg">
                  <span className="material-symbols-outlined text-gray-400 text-[20px] mt-0.5">
                    radio_button_unchecked
                  </span>
                  <span className="text-sm font-medium text-text-main dark:text-gray-200">
                    STCW Certificates
                  </span>
                </li>
                <li className="flex items-start gap-3 p-3 bg-background-light dark:bg-gray-800/50 rounded-lg">
                  <span className="material-symbols-outlined text-gray-400 text-[20px] mt-0.5">
                    radio_button_unchecked
                  </span>
                  <span className="text-sm font-medium text-text-main dark:text-gray-200">
                    Latest Medical (Fit to Work)
                  </span>
                </li>
              </ul>
            </div>
            {/* Instructions Card */}
            <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-sm border border-border-color dark:border-gray-800 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded-lg text-blue-700 dark:text-blue-400">
                  <span className="material-symbols-outlined">info</span>
                </div>
                <h3 className="text-lg font-bold text-text-main dark:text-white">
                  Instructions
                </h3>
              </div>
              <div className="space-y-4 text-sm text-text-main dark:text-gray-300 leading-relaxed">
                <p>
                  <span className="font-bold text-text-main dark:text-white">
                    Dress Code:
                  </span>{" "}
                  <br />
                  Smart Casual or Uniform. Please ensure a professional
                  appearance.
                </p>
                <hr className="border-border-color dark:border-gray-700" />
                <p>
                  <span className="font-bold text-text-main dark:text-white">
                    Environment:
                  </span>{" "}
                  <br />
                  Ensure you are in a quiet room with good lighting. Test your
                  microphone and camera 10 minutes before the scheduled time.
                </p>
                <hr className="border-border-color dark:border-gray-700" />
                <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800 p-3 rounded text-yellow-800 dark:text-yellow-200 text-xs">
                  <strong>Note:</strong> Late attendance beyond 15 minutes may
                  result in cancellation.
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      {/* Simple Footer */}
      <footer className="border-t border-border-color dark:border-gray-800 bg-card-light dark:bg-card-dark py-6 mt-auto">
        <div className="px-6 md:px-12 lg:px-20 mx-auto max-w-[1440px] text-center md:text-left flex flex-col md:flex-row justify-between items-center text-sm text-text-muted">
          <p>
            © {new Date().getFullYear()} Maritime Crewing Management. All rights
            reserved.
          </p>
          <div className="flex gap-4 mt-2 md:mt-0">
            <a className="hover:text-primary" href="#">
              Help Center
            </a>
            <a className="hover:text-primary" href="#">
              Privacy Policy
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
