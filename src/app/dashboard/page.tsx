"use client";

export default function DashboardPage() {
  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen flex overflow-hidden font-display">
      {/* Sidebar */}
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
            href="/dashboard"
          >
            <span className="material-symbols-outlined text-[24px]">
              dashboard
            </span>
            <span className="font-medium text-sm">Dashboard</span>
          </a>
          <a
            className="nav-item flex items-center gap-3 px-3 py-3 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            href="#"
          >
            <span className="material-symbols-outlined text-[24px]">
              person
            </span>
            <span className="font-medium text-sm">Profile</span>
          </a>
          <a
            className="nav-item flex items-center gap-3 px-3 py-3 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            href="/documents"
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
            href="/contracts"
          >
            <span className="material-symbols-outlined text-[24px]">
              history_edu
            </span>
            <span className="font-medium text-sm">Contracts</span>
          </a>
          <a
            className="nav-item flex items-center gap-3 px-3 py-3 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            href="/interview"
          >
            <span className="material-symbols-outlined text-[24px]">
              calendar_month
            </span>
            <span className="font-medium text-sm">Interview</span>
          </a>
        </nav>
        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <a
            className="flex items-center gap-3 px-3 py-3 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            href="#"
          >
            <span className="material-symbols-outlined text-[24px]">
              logout
            </span>
            <span className="font-medium text-sm">Sign Out</span>
          </a>
        </div>
      </aside>
      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-64 relative min-h-screen">
        {/* Top Navbar */}
        <header className="bg-surface-light dark:bg-surface-dark border-b border-gray-200 dark:border-gray-800 h-16 flex items-center justify-between px-6 sticky top-0 z-10">
          <button className="lg:hidden p-2 -ml-2 text-gray-600 dark:text-gray-300">
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
            <button className="relative p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-surface-dark"></span>
            </button>
            <div className="h-8 w-[1px] bg-gray-200 dark:bg-gray-700 mx-1"></div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-gray-900 dark:text-white">
                  Captain Name
                </p>
                <p className="text-xs text-gray-500">Master Mariner</p>
              </div>
              <div
                className="h-10 w-10 rounded-full bg-gray-200 bg-cover bg-center border-2 border-white dark:border-gray-700 shadow-sm"
                style={{
                  backgroundImage: "url('/images/default-user-avatar.jpg')",
                }}
                data-alt="Profile picture of Captain"
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
                  Welcome back, John
                </h2>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                  Here is what&apos;s happening with your applications today.
                </p>
              </div>
              <div className="flex gap-3">
                <button className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center gap-2">
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
                        Oct 26, 2023
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
                    backgroundImage: "url('/images/default-user-avatar.jpg')",
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
                  <button className="w-full bg-primary hover:bg-primary-hover text-white py-2.5 px-4 rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2 shadow-lg shadow-primary/20">
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
                    Oct 28, 14:00
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
                    href="#"
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
                          <button className="text-primary hover:text-primary-hover font-medium text-sm">
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
                        Oct
                      </span>
                      <span className="text-lg font-bold text-gray-900 dark:text-white">
                        28
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
                              "url('/images/default-user-avatar.jpg')",
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
                        Nov
                      </span>
                      <span className="text-lg font-bold text-gray-900 dark:text-white">
                        02
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
                        Nov
                      </span>
                      <span className="text-lg font-bold text-gray-900 dark:text-white">
                        10
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
                <button className="mt-auto pt-4 text-primary text-sm font-medium hover:text-primary-hover flex items-center gap-1 self-start">
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
