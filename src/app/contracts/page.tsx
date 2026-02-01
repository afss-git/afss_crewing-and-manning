"use client";

export default function ContractsPage() {
  return (
    <div className="bg-background-light dark:bg-background-dark text-[#0e121b] font-display overflow-hidden">
      <div className="flex h-screen w-full">
        {/* Sidebar */}
        <aside className="w-[280px] bg-white border-r border-[#e8ebf3] flex-col justify-between hidden md:flex shrink-0 z-20">
          <div className="flex flex-col h-full p-4">
            {/* Logo Area */}
            <div className="flex items-center gap-3 px-3 py-4 mb-6">
              <div className="size-10 bg-primary rounded-lg flex items-center justify-center text-white">
                <span className="material-symbols-outlined text-2xl">
                  anchor
                </span>
              </div>
              <div className="flex flex-col">
                <h1 className="text-[#0e121b] text-base font-bold leading-tight">
                  Maritime Ops
                </h1>
                <p className="text-[#506795] text-xs font-medium uppercase tracking-wide">
                  Crew Portal
                </p>
              </div>
            </div>
            {/* Navigation */}
            <nav className="flex flex-col gap-2 flex-1">
              <a
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#506795] hover:bg-[#f8f9fb] transition-colors group"
                href="/dashboard"
              >
                <span className="material-symbols-outlined text-[24px]">
                  grid_view
                </span>
                <span className="text-sm font-medium">Dashboard</span>
              </a>
              <a
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#506795] hover:bg-[#f8f9fb] transition-colors group"
                href="/documents"
              >
                <span className="material-symbols-outlined text-[24px]">
                  description
                </span>
                <span className="text-sm font-medium">Documents</span>
              </a>
              <a
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#506795] hover:bg-[#f8f9fb] transition-colors group"
                href="/interview"
              >
                <span className="material-symbols-outlined text-[24px]">
                  groups
                </span>
                <span className="text-sm font-medium">Interview</span>
              </a>
              <a
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary/10 text-primary transition-colors"
                href="/contracts"
              >
                <span className="material-symbols-outlined text-[24px] fill-1">
                  history_edu
                </span>
                <span className="text-sm font-bold">Contracts</span>
              </a>
              <a
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#506795] hover:bg-[#f8f9fb] transition-colors group"
                href="#"
              >
                <span className="material-symbols-outlined text-[24px]">
                  sailing
                </span>
                <span className="text-sm font-medium">Voyages</span>
              </a>
              <a
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#506795] hover:bg-[#f8f9fb] transition-colors group"
                href="#"
              >
                <span className="material-symbols-outlined text-[24px]">
                  monitoring
                </span>
                <span className="text-sm font-medium">Reports</span>
              </a>
              <div className="my-2 border-t border-[#e8ebf3]"></div>
              <a
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#506795] hover:bg-[#f8f9fb] transition-colors group"
                href="#"
              >
                <span className="material-symbols-outlined text-[24px]">
                  settings
                </span>
                <span className="text-sm font-medium">Settings</span>
              </a>
            </nav>
            {/* User Profile */}
            <div className="flex items-center gap-3 px-3 py-3 mt-auto rounded-lg bg-[#f8f9fb] border border-[#e8ebf3]">
              <div
                className="bg-center bg-no-repeat bg-cover rounded-full size-10 shrink-0"
                style={{
                  backgroundImage:
                    "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBHSstHu3ySCe2R4o3FdOBapgFMb_lB6V65xcccXaRvBvPNF-INh0EKm4q3qNEiiflcCLKcfoBIMajJRNfYer5xT2_pr-qejpu3vUCihOTFp52y3OqQwDtyfeVxeqkKFClEhtOJrbVWbEyzXg0PlFGtTNX-yrA1IqBLCPylqP7k-uK7hKnC5ONDP7-YSzfyP0XrWzXC2GW959JYLe0iycEbUSY2c3mKFpjlYm3HM8MlzfCT05o2UpVkFXHapZPIBRp8I2A7zlAeQ7sV')",
                }}
                data-alt="Portrait of a smiling user"
              ></div>
              <div className="flex flex-col overflow-hidden">
                <p className="text-[#0e121b] text-sm font-bold truncate">
                  Capt. James T.
                </p>
                <p className="text-[#506795] text-xs truncate">Crew Manager</p>
              </div>
              <button className="ml-auto text-[#506795] hover:text-primary">
                <span className="material-symbols-outlined text-[20px]">
                  logout
                </span>
              </button>
            </div>
          </div>
        </aside>
        {/* Main Content */}
        <main className="flex-1 flex flex-col h-full relative overflow-hidden bg-background-light">
          {/* Top Header */}
          <header className="h-16 bg-white border-b border-[#e8ebf3] flex items-center justify-between px-6 shrink-0">
            <div className="flex items-center gap-4 lg:hidden">
              <button className="text-[#0e121b]">
                <span className="material-symbols-outlined">menu</span>
              </button>
              <span className="text-lg font-bold">CrewManning</span>
            </div>
            {/* Breadcrumbs / Context */}
            <div className="hidden lg:flex items-center text-sm text-[#506795]">
              <a
                href="/dashboard"
                className="hover:text-primary cursor-pointer"
              >
                Home
              </a>
              <span className="material-symbols-outlined text-base mx-2">
                chevron_right
              </span>
              <span className="hover:text-primary cursor-pointer">
                Operations
              </span>
              <span className="material-symbols-outlined text-base mx-2">
                chevron_right
              </span>
              <span className="font-medium text-[#0e121b]">
                Contract Management
              </span>
            </div>
            <div className="flex items-center gap-4 ml-auto">
              <button className="relative p-2 text-[#506795] hover:bg-[#f8f9fb] rounded-full transition-colors">
                <span className="material-symbols-outlined">notifications</span>
                <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
              <button className="p-2 text-[#506795] hover:bg-[#f8f9fb] rounded-full transition-colors">
                <span className="material-symbols-outlined">help</span>
              </button>
            </div>
          </header>
          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-6 md:p-8">
            <div className="max-w-[1200px] mx-auto flex flex-col gap-6">
              {/* Page Heading & Actions */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="flex flex-col gap-1">
                  <h1 className="text-3xl font-bold tracking-tight text-[#0e121b]">
                    Seafarer Contracts
                  </h1>
                  <p className="text-[#506795]">
                    Manage active agreements, renewals, and print official
                    documents.
                  </p>
                </div>
                <div className="flex gap-3">
                  <button className="flex items-center justify-center gap-2 px-4 h-10 bg-white border border-[#d1d8e6] rounded-lg text-[#0e121b] font-medium text-sm hover:bg-[#f8f9fb] transition-colors">
                    <span className="material-symbols-outlined text-[20px]">
                      upload_file
                    </span>
                    Bulk Upload
                  </button>
                  <button className="flex items-center justify-center gap-2 px-5 h-10 bg-primary text-white rounded-lg font-bold text-sm shadow-sm hover:bg-primary-light transition-colors">
                    <span className="material-symbols-outlined text-[20px]">
                      add
                    </span>
                    Create New Contract
                  </button>
                </div>
              </div>
              {/* Stats Overview */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-xl border border-[#e8ebf3] shadow-sm flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <p className="text-[#506795] text-sm font-medium">
                      Active Contracts
                    </p>
                    <div className="size-8 rounded-full bg-green-50 text-green-600 flex items-center justify-center">
                      <span className="material-symbols-outlined text-[20px]">
                        check_circle
                      </span>
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-[#0e121b] mt-2">142</p>
                  <p className="text-xs font-medium text-green-600 mt-1 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">
                      trending_up
                    </span>{" "}
                    +12% from last month
                  </p>
                </div>
                <div className="bg-white p-5 rounded-xl border border-[#e8ebf3] shadow-sm flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <p className="text-[#506795] text-sm font-medium">
                      Expiring Soon
                    </p>
                    <div className="size-8 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center">
                      <span className="material-symbols-outlined text-[20px]">
                        warning
                      </span>
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-[#0e121b] mt-2">8</p>
                  <p className="text-xs font-medium text-[#506795] mt-1">
                    Within next 30 days
                  </p>
                </div>
                <div className="bg-white p-5 rounded-xl border border-[#e8ebf3] shadow-sm flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <p className="text-[#506795] text-sm font-medium">
                      Pending Signature
                    </p>
                    <div className="size-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                      <span className="material-symbols-outlined text-[20px]">
                        signature
                      </span>
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-[#0e121b] mt-2">15</p>
                  <p className="text-xs font-medium text-[#506795] mt-1">
                    Awaiting crew action
                  </p>
                </div>
                <div className="bg-white p-5 rounded-xl border border-[#e8ebf3] shadow-sm flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <p className="text-[#506795] text-sm font-medium">
                      Total Processed
                    </p>
                    <div className="size-8 rounded-full bg-gray-50 text-gray-600 flex items-center justify-center">
                      <span className="material-symbols-outlined text-[20px]">
                        folder
                      </span>
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-[#0e121b] mt-2">
                    1,204
                  </p>
                  <p className="text-xs font-medium text-[#506795] mt-1">
                    Year to date
                  </p>
                </div>
              </div>
              {/* Filters & Search */}
              <div className="bg-white p-4 rounded-xl border border-[#e8ebf3] shadow-sm flex flex-col lg:flex-row gap-4 items-center">
                <div className="relative w-full lg:w-[320px]">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-[#506795]">
                      search
                    </span>
                  </div>
                  <input
                    className="block w-full pl-10 pr-3 py-2.5 border border-[#d1d8e6] rounded-lg leading-5 bg-[#f8f9fb] placeholder-[#506795] focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm"
                    placeholder="Search by name, rank, or vessel..."
                    type="text"
                  />
                </div>
                <div className="flex flex-1 gap-3 w-full overflow-x-auto pb-1 lg:pb-0">
                  <div className="min-w-[140px]">
                    <select className="block w-full pl-3 pr-10 py-2.5 text-sm border-gray-300 border focus:outline-none focus:ring-primary focus:border-primary rounded-lg bg-white">
                      <option>All Statuses</option>
                      <option>Active</option>
                      <option>Expired</option>
                      <option>Pending</option>
                    </select>
                  </div>
                  <div className="min-w-[140px]">
                    <select className="block w-full pl-3 pr-10 py-2.5 text-sm border-gray-300 border focus:outline-none focus:ring-primary focus:border-primary rounded-lg bg-white">
                      <option>All Employers</option>
                      <option>Maersk Line</option>
                      <option>MSC</option>
                      <option>CMA CGM</option>
                    </select>
                  </div>
                  <div className="min-w-[140px]">
                    <select className="block w-full pl-3 pr-10 py-2.5 text-sm border-gray-300 border focus:outline-none focus:ring-primary focus:border-primary rounded-lg bg-white">
                      <option>All Ranks</option>
                      <option>Master</option>
                      <option>Chief Engineer</option>
                      <option>Able Seaman</option>
                    </select>
                  </div>
                </div>
                <div className="hidden lg:block w-px h-8 bg-[#e8ebf3]"></div>
                <button className="text-[#506795] hover:text-primary whitespace-nowrap text-sm font-medium flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px]">
                    filter_list
                  </span>
                  More Filters
                </button>
              </div>
              {/* Contracts Table */}
              <div className="bg-white border border-[#e8ebf3] rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-[#e8ebf3]">
                    <thead className="bg-[#f8f9fb]">
                      <tr>
                        <th
                          className="px-6 py-4 text-left text-xs font-semibold text-[#506795] uppercase tracking-wider"
                          scope="col"
                        >
                          Seafarer / Role
                        </th>
                        <th
                          className="px-6 py-4 text-left text-xs font-semibold text-[#506795] uppercase tracking-wider"
                          scope="col"
                        >
                          Employer &amp; Type
                        </th>
                        <th
                          className="px-6 py-4 text-left text-xs font-semibold text-[#506795] uppercase tracking-wider"
                          scope="col"
                        >
                          Duration
                        </th>
                        <th
                          className="px-6 py-4 text-left text-xs font-semibold text-[#506795] uppercase tracking-wider"
                          scope="col"
                        >
                          Validity Period
                        </th>
                        <th
                          className="px-6 py-4 text-left text-xs font-semibold text-[#506795] uppercase tracking-wider"
                          scope="col"
                        >
                          Status
                        </th>
                        <th
                          className="px-6 py-4 text-right text-xs font-semibold text-[#506795] uppercase tracking-wider"
                          scope="col"
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-[#e8ebf3]">
                      {/* Row 1 */}
                      <tr className="hover:bg-[#f8f9fb] transition-colors group">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div
                              className="size-10 rounded-full bg-cover bg-center shrink-0"
                              style={{
                                backgroundImage:
                                  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDXUiV-S-Fat6IXi0f750tkEQGmwPe2ITrQVGT827ApCwyAIzVY3BDmetqsnk-F8Q6L3LMa5v_EoXFeTdSnuDcOzj8vB78VGgmpjTVGZsC8gCguWqRNUYsV7fPsVC7YPn4SvSPzQ22-2wQnntBoNs48mJGbDV5wsGt_o2VxigKXWU6yNviwv04w914_VTukJe3eXoXCS0Bowrg3HbBXAL-l4xgGEtznA_z70oVZ4wusbLlGn4fFSwXxDivHwpnBasKZaL382JHIfR-_')",
                              }}
                              data-alt="Portrait of John D."
                            ></div>
                            <div className="ml-4">
                              <div className="text-sm font-bold text-[#0e121b]">
                                Contract Holder
                              </div>
                              <div className="text-xs text-[#506795]">
                                Chief Engineer
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-[#0e121b]">
                            Maersk Line
                          </div>
                          <div className="text-xs text-[#506795]">
                            Full Management
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-800">
                            6 Months
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-[#0e121b]">
                            01 Jan 2024
                          </div>
                          <div className="text-xs text-[#506795]">
                            to 30 Jun 2024
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                            <span className="size-1.5 rounded-full bg-green-600"></span>
                            Active
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              className="text-[#506795] hover:text-primary p-2 hover:bg-[#f8f9fb] rounded-lg"
                              title="Print"
                            >
                              <span className="material-symbols-outlined text-[20px]">
                                print
                              </span>
                            </button>
                            <button className="text-primary hover:text-primary-light flex items-center gap-1 text-xs font-bold bg-primary/10 hover:bg-primary/20 px-3 py-1.5 rounded-lg transition-colors">
                              <span className="material-symbols-outlined text-[16px]">
                                download
                              </span>
                              PDF
                            </button>
                          </div>
                        </td>
                      </tr>
                      {/* Row 2 */}
                      <tr className="hover:bg-[#f8f9fb] transition-colors group">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div
                              className="size-10 rounded-full bg-cover bg-center shrink-0"
                              style={{
                                backgroundImage:
                                  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBHDPCx95drGmBjrzU11o_RiTrR134q-YDOuHF4-kmSadSvMbALhWZDEKjgi3uWQ7FWG1F62kzPpBV64fdTvHnsv3foWDxaWTAZjWEOBu4KbwD5oMRVfcEmNWguUzZm-kGvNfHLFbhjf-BBmS2lekh0TmF-rh49aE2jgV4iocruq7upHLR9Eg5kNHNMHBuFkAFPzud_YTpQNuBN1PZsZZBhqYSminfgS7e1RGAY7ypW0hWJd7XTJJbqinklL3AHVxOdxZ7lCQYipApy')",
                              }}
                              data-alt="Portrait of Sarah C."
                            ></div>
                            <div className="ml-4">
                              <div className="text-sm font-bold text-[#0e121b]">
                                Contract Holder
                              </div>
                              <div className="text-xs text-[#506795]">
                                2nd Officer
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-[#0e121b]">
                            MSC Mediterranean
                          </div>
                          <div className="text-xs text-[#506795]">
                            One-Off Contract
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-50 text-purple-800">
                            4 Months
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-[#0e121b]">
                            15 Feb 2024
                          </div>
                          <div className="text-xs text-[#506795]">
                            to 15 Jun 2024
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-orange-50 text-orange-700 border border-orange-200">
                            <span className="size-1.5 rounded-full bg-orange-600"></span>
                            Expiring Soon
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              className="text-[#506795] hover:text-primary p-2 hover:bg-[#f8f9fb] rounded-lg"
                              title="Print"
                            >
                              <span className="material-symbols-outlined text-[20px]">
                                print
                              </span>
                            </button>
                            <button className="text-primary hover:text-primary-light flex items-center gap-1 text-xs font-bold bg-primary/10 hover:bg-primary/20 px-3 py-1.5 rounded-lg transition-colors">
                              <span className="material-symbols-outlined text-[16px]">
                                download
                              </span>
                              PDF
                            </button>
                          </div>
                        </td>
                      </tr>
                      {/* Row 3 */}
                      <tr className="hover:bg-[#f8f9fb] transition-colors group">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="size-10 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold shrink-0">
                              MK
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-bold text-[#0e121b]">
                                Contract Holder
                              </div>
                              <div className="text-xs text-[#506795]">
                                Master
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-[#0e121b]">CMA CGM</div>
                          <div className="text-xs text-[#506795]">
                            Full Management
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-800">
                            6 Months
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-[#0e121b]">
                            01 Mar 2024
                          </div>
                          <div className="text-xs text-[#506795]">
                            to 31 Aug 2024
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
                            <span className="size-1.5 rounded-full bg-gray-400"></span>
                            Pending Signature
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              className="text-[#506795] hover:text-primary p-2 hover:bg-[#f8f9fb] rounded-lg"
                              title="Print"
                            >
                              <span className="material-symbols-outlined text-[20px]">
                                print
                              </span>
                            </button>
                            <button className="text-[#506795] hover:text-[#0e121b] flex items-center gap-1 text-xs font-bold bg-[#e8ebf3] hover:bg-[#d1d8e6] px-3 py-1.5 rounded-lg transition-colors">
                              <span className="material-symbols-outlined text-[16px]">
                                visibility
                              </span>
                              View
                            </button>
                          </div>
                        </td>
                      </tr>
                      {/* Row 4 */}
                      <tr className="hover:bg-[#f8f9fb] transition-colors group">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div
                              className="size-10 rounded-full bg-cover bg-center shrink-0"
                              style={{
                                backgroundImage:
                                  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCqyq3Byzh9rMKND8e1aFlMrgajlawEF4h54l3hdlSKcHG0iBIy-uZWXbs8fE_ZbZZuCemVaToupAhs869e3DbCTz5wCHfMn71eLy4rvVlwSD7ac-D1Dxa4UvXLDRNfXJIp575FQ32wVXL9x9d_OsPdTg4Bq5d1UN1Y6dvvfgdg0ZVpX6NUOV2OkY8ZtIDHuKzKumSmSQbi_SnTbZ5JhiqlIzrPYnI_REpIzEVDrNmXvd60Y_GUkGfNzVRVRun2I1axHSgve5fZfxYr')",
                              }}
                              data-alt="Portrait of David R."
                            ></div>
                            <div className="ml-4">
                              <div className="text-sm font-bold text-[#0e121b]">
                                David Ross
                              </div>
                              <div className="text-xs text-[#506795]">
                                Able Seaman
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-[#0e121b]">
                            Hapag-Lloyd
                          </div>
                          <div className="text-xs text-[#506795]">
                            One-Off Contract
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-50 text-purple-800">
                            9 Months
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-[#0e121b]">
                            10 Dec 2023
                          </div>
                          <div className="text-xs text-[#506795]">
                            to 10 Sep 2024
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                            <span className="size-1.5 rounded-full bg-green-600"></span>
                            Active
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              className="text-[#506795] hover:text-primary p-2 hover:bg-[#f8f9fb] rounded-lg"
                              title="Print"
                            >
                              <span className="material-symbols-outlined text-[20px]">
                                print
                              </span>
                            </button>
                            <button className="text-primary hover:text-primary-light flex items-center gap-1 text-xs font-bold bg-primary/10 hover:bg-primary/20 px-3 py-1.5 rounded-lg transition-colors">
                              <span className="material-symbols-outlined text-[16px]">
                                download
                              </span>
                              PDF
                            </button>
                          </div>
                        </td>
                      </tr>
                      {/* Row 5 */}
                      <tr className="hover:bg-[#f8f9fb] transition-colors group opacity-60">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div
                              className="size-10 rounded-full bg-cover bg-center shrink-0 grayscale"
                              style={{
                                backgroundImage:
                                  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAKl9VchUnclbqq9flspuGTfAcJod-VFBYkMwT9eNbZCCzUUPucMaPG-nNb-U_f9ypu3yWmDXDl-bFhh1OOSHPeDB-u8zI87TZacauDMzx7w8V0Xu9DceWh98KrklGbY4yM82V7QFdEER5KPRAiDQlhydW4mDoaoyNUjQusO9C1SxSdRO_CvDSuEweDCl24grX7dXXkMV5s8QTmEgQc306_Gram8uTYEjNuo40iG7K9iSsIbgro_wjaLEgwFH_OXEzvl2iyzuc5TOsg')",
                              }}
                              data-alt="Portrait of Emily W."
                            ></div>
                            <div className="ml-4">
                              <div className="text-sm font-bold text-[#0e121b]">
                                Emily Wong
                              </div>
                              <div className="text-xs text-[#506795]">
                                3rd Engineer
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-[#0e121b]">
                            Maersk Line
                          </div>
                          <div className="text-xs text-[#506795]">
                            Full Management
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            6 Months
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-[#0e121b]">
                            01 Jul 2023
                          </div>
                          <div className="text-xs text-[#506795]">
                            to 31 Dec 2023
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
                            <span className="size-1.5 rounded-full bg-gray-500"></span>
                            Expired
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              className="text-[#506795] hover:text-primary p-2 hover:bg-[#f8f9fb] rounded-lg"
                              title="Print"
                            >
                              <span className="material-symbols-outlined text-[20px]">
                                print
                              </span>
                            </button>
                            <button className="text-[#506795] hover:text-[#0e121b] flex items-center gap-1 text-xs font-bold bg-[#e8ebf3] hover:bg-[#d1d8e6] px-3 py-1.5 rounded-lg transition-colors">
                              <span className="material-symbols-outlined text-[16px]">
                                history
                              </span>
                              Archive
                            </button>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                {/* Pagination */}
                <div className="px-6 py-4 flex items-center justify-between border-t border-[#e8ebf3] bg-white">
                  <div className="text-sm text-[#506795]">
                    Showing{" "}
                    <span className="font-bold text-[#0e121b]">1-5</span> of{" "}
                    <span className="font-bold text-[#0e121b]">142</span>{" "}
                    contracts
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="px-3 py-1.5 border border-[#e8ebf3] rounded-lg text-sm font-medium text-[#506795] hover:bg-[#f8f9fb] disabled:opacity-50"
                      disabled
                    >
                      Previous
                    </button>
                    <button className="px-3 py-1.5 border border-[#e8ebf3] rounded-lg text-sm font-medium text-[#506795] hover:bg-[#f8f9fb]">
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
