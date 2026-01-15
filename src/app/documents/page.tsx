"use client";

export default function DocumentsPage() {
  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-gray-900 dark:text-gray-100 antialiased overflow-hidden flex h-screen w-full">
      {/* Side Navigation */}
      <aside className="flex h-full w-72 flex-col justify-between border-r border-[#e6d1d1] bg-white dark:bg-[#1a0d0e] p-4 hidden lg:flex">
        <div className="flex flex-col gap-4">
          <div className="flex gap-3 px-2 py-2">
            <div
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 shadow-sm"
              style={{
                backgroundImage:
                  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBx8LMZJaipRIr2LPazSAaAZmftlGsUN0ntuvLS56FCsNSouRC12qgxcVFToAoBoNHdL1LJSkIRHTmL3H11UmFVM-TL6EAeFgbjzogrKOPcoSsHbTZgzrGA-C1DIXZF_ILkKizfiaq4wTfF-wt7JpEv7ztUp_hrb6ymrMUzy-wKcDCOmWg_111m4F0pYt0z7bvhK5rbH-tB_Bk3uvU8N6VkjHBhMzLS-91L94BbqK9fNQUadcwpCE3GW1RVEz5uZBKXIL9hlxAOE0bT')",
              }}
              data-alt="Maritime logo abstract ocean wave"
            ></div>
            <div className="flex flex-col">
              <h1 className="text-primary dark:text-red-400 text-lg font-bold leading-normal">
                Maritime Ops
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-normal leading-normal">
                Crewing Platform
              </p>
            </div>
          </div>
          <nav className="flex flex-col gap-2 mt-4">
            <a
              className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors group"
              href="/dashboard"
            >
              <span className="material-symbols-outlined text-gray-600 dark:text-gray-300 group-hover:text-primary">
                dashboard
              </span>
              <p className="text-gray-700 dark:text-gray-200 text-sm font-medium leading-normal group-hover:text-primary">
                Dashboard
              </p>
            </a>
            <a
              className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors group"
              href="#"
            >
              <span className="material-symbols-outlined text-gray-600 dark:text-gray-300 group-hover:text-primary">
                person
              </span>
              <p className="text-gray-700 dark:text-gray-200 text-sm font-medium leading-normal group-hover:text-primary">
                Seafarer Profile
              </p>
            </a>
            <a
              className="flex items-center gap-3 px-3 py-3 rounded-lg bg-primary/10 dark:bg-primary/20 transition-colors"
              href="/documents"
            >
              <span className="material-symbols-outlined text-primary fill">
                description
              </span>
              <p className="text-primary text-sm font-bold leading-normal">
                Documents
              </p>
            </a>
            <a
              className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors group"
              href="#"
            >
              <span className="material-symbols-outlined text-gray-600 dark:text-gray-300 group-hover:text-primary">
                calendar_month
              </span>
              <p className="text-gray-700 dark:text-gray-200 text-sm font-medium leading-normal group-hover:text-primary">
                Schedule
              </p>
            </a>
            <a
              className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors group"
              href="#"
            >
              <span className="material-symbols-outlined text-gray-600 dark:text-gray-300 group-hover:text-primary">
                settings
              </span>
              <p className="text-gray-700 dark:text-gray-200 text-sm font-medium leading-normal group-hover:text-primary">
                Settings
              </p>
            </a>
          </nav>
        </div>
        <div className="flex items-center gap-3 px-3 py-4 border-t border-gray-100 dark:border-white/10 mt-auto">
          <div
            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border border-gray-200"
            style={{
              backgroundImage:
                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBoeTOspl9Ww2Sb2PLl4jAGRBuNVx_KYV8cZp1ti3qLJF2zq_Cnz12fQwpwKC_wvtsoUV-EnfH-kimZO7hWia8WZy4HG_CgWRWSyEbzjRCMzQa3OZvB-MCzV_YT77-lUkzgnmZF7LH3dYmnNKagsBmWo5O8OKYsKCTOpZW7tioVQmiddlijwR-ZHy33ovqfmDlwoZDGJeE4N6vRbxmEQWzAuP260jS9XHUlnLebc0Du4HkU3yEggB5cnnnarFySGgpHSPZ_a2VmJl7K')",
            }}
            data-alt="User profile picture man smiling"
          ></div>
          <div className="flex flex-col">
            <p className="text-sm font-bold text-gray-900 dark:text-white">
              Alex Morgan
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Chief Officer
            </p>
          </div>
          <button className="ml-auto text-gray-400 hover:text-primary">
            <span className="material-symbols-outlined">logout</span>
          </button>
        </div>
      </aside>
      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Top Header */}
        <header className="flex items-center justify-between border-b border-[#e6d1d1] bg-white dark:bg-[#1a0d0e] px-8 py-4 shrink-0">
          <div className="flex items-center gap-4 lg:hidden">
            <button className="text-gray-600">
              <span className="material-symbols-outlined">menu</span>
            </button>
            <h2 className="text-primary text-lg font-bold">Maritime Ops</h2>
          </div>
          <div className="hidden lg:flex items-center gap-4">
            <h2 className="text-gray-900 dark:text-white text-lg font-bold tracking-tight">
              Seafarer Portal
            </h2>
          </div>
          <div className="flex flex-1 justify-end gap-6 items-center">
            <div className="relative hidden md:flex w-64">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 material-symbols-outlined text-[20px]">
                search
              </span>
              <input
                className="w-full h-10 pl-10 pr-4 rounded-lg bg-background-light dark:bg-white/5 border-none focus:ring-2 focus:ring-primary/20 text-sm placeholder:text-gray-400 text-gray-800 dark:text-gray-200"
                placeholder="Search documents..."
                type="text"
              />
            </div>
            <div className="flex gap-2">
              <button className="flex items-center justify-center size-10 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300 transition-colors relative">
                <span className="material-symbols-outlined">notifications</span>
                <span className="absolute top-2 right-2 size-2 bg-primary rounded-full"></span>
              </button>
              <button className="flex items-center justify-center size-10 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300 transition-colors">
                <span className="material-symbols-outlined">chat_bubble</span>
              </button>
            </div>
          </div>
        </header>
        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark p-6 lg:p-10 scroll-smooth">
          <div className="max-w-6xl mx-auto flex flex-col gap-8">
            {/* Breadcrumbs */}
            <nav className="flex text-sm font-medium text-gray-500 dark:text-gray-400">
              <a className="hover:text-primary transition-colors" href="#">
                Home
              </a>
              <span className="mx-2">/</span>
              <a className="hover:text-primary transition-colors" href="#">
                Seafarer
              </a>
              <span className="mx-2">/</span>
              <span className="text-primary font-bold">Documents</span>
            </nav>
            {/* Page Heading & Stats */}
            <div className="flex flex-col lg:flex-row gap-8 justify-between items-start lg:items-end">
              <div className="flex flex-col gap-2 max-w-2xl">
                <h1 className="text-gray-900 dark:text-white text-4xl font-black tracking-tight">
                  Seafarer Documents
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  Manage your certificates, licenses, and identification
                  documents securely.
                </p>
              </div>
            </div>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white dark:bg-[#1a0d0e] rounded-xl p-6 border border-[#e6d1d1] dark:border-white/10 shadow-sm flex flex-col gap-2">
                <div className="flex items-center gap-2 text-primary">
                  <span className="material-symbols-outlined">folder_open</span>
                  <p className="text-base font-bold">Total Documents</p>
                </div>
                <p className="text-gray-900 dark:text-white text-3xl font-bold">
                  14
                </p>
              </div>
              <div className="bg-white dark:bg-[#1a0d0e] rounded-xl p-6 border border-[#e6d1d1] dark:border-white/10 shadow-sm flex flex-col gap-2">
                <div className="flex items-center gap-2 text-green-600">
                  <span className="material-symbols-outlined fill">
                    verified
                  </span>
                  <p className="text-base font-bold">Verified</p>
                </div>
                <p className="text-gray-900 dark:text-white text-3xl font-bold">
                  12
                </p>
              </div>
              <div className="bg-white dark:bg-[#1a0d0e] rounded-xl p-6 border border-[#e6d1d1] dark:border-white/10 shadow-sm flex flex-col gap-2 relative overflow-hidden">
                <div className="absolute right-0 top-0 h-full w-1 bg-red-600"></div>
                <div className="flex items-center gap-2 text-red-600">
                  <span className="material-symbols-outlined fill">
                    warning
                  </span>
                  <p className="text-base font-bold">Expiring Soon</p>
                </div>
                <p className="text-gray-900 dark:text-white text-3xl font-bold">
                  2
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
              {/* Left Col: Upload Widget */}
              <div className="xl:col-span-1 flex flex-col gap-6">
                <div className="bg-white dark:bg-[#1a0d0e] rounded-xl border border-[#e6d1d1] dark:border-white/10 shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-[#e6d1d1] dark:border-white/10 bg-gray-50 dark:bg-white/5">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary">
                        cloud_upload
                      </span>
                      Upload New Document
                    </h3>
                  </div>
                  <div className="p-6 flex flex-col gap-5">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Document Title
                      </label>
                      <input
                        className="rounded-lg bg-background-light dark:bg-white/5 border-gray-200 dark:border-white/10 focus:ring-primary focus:border-primary text-sm w-full py-2.5"
                        placeholder="e.g. Seaman's Book"
                        type="text"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Expiry Date{" "}
                        <span className="text-gray-400 font-normal">
                          (Optional)
                        </span>
                      </label>
                      <input
                        className="rounded-lg bg-background-light dark:bg-white/5 border-gray-200 dark:border-white/10 focus:ring-primary focus:border-primary text-sm w-full py-2.5 text-gray-600 dark:text-gray-300"
                        type="date"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        File Attachment
                      </label>
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors group">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <span className="material-symbols-outlined text-gray-400 mb-2 group-hover:text-primary transition-colors">
                            upload_file
                          </span>
                          <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                            <span className="font-semibold text-primary">
                              Click to upload
                            </span>{" "}
                            or drag and drop
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            PDF, PNG, JPG (MAX. 5MB)
                          </p>
                        </div>
                        <input className="hidden" type="file" />
                      </label>
                    </div>
                    <button className="mt-2 w-full bg-primary hover:bg-[#5a0d0f] text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-md hover:shadow-lg">
                      <span className="material-symbols-outlined text-[20px]">
                        add_circle
                      </span>
                      Upload Document
                    </button>
                  </div>
                </div>
                {/* Helper Card */}
                <div className="bg-primary/5 rounded-xl p-5 border border-primary/10 flex gap-4">
                  <span className="material-symbols-outlined text-primary shrink-0">
                    info
                  </span>
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-bold text-gray-900 dark:text-white">
                      Verification Process
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                      Documents uploaded here will require verification by the
                      crewing manager before they are valid for deployment.
                    </p>
                  </div>
                </div>
              </div>
              {/* Right Col: Document List */}
              <div className="xl:col-span-2 flex flex-col gap-4 h-full">
                <div className="bg-white dark:bg-[#1a0d0e] rounded-xl border border-[#e6d1d1] dark:border-white/10 shadow-sm flex flex-col h-full min-h-[500px]">
                  {/* Interview Navigation Button - show after verification */}
                  <div className="flex justify-end p-6">
                    <a
                      href="/interview"
                      className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white font-bold px-6 py-3 rounded-lg transition-all shadow-md hover:shadow-lg"
                    >
                      <span className="material-symbols-outlined">event</span>
                      Proceed to Interview
                    </a>
                  </div>
                  <div className="p-6 border-b border-[#e6d1d1] dark:border-white/10 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      Uploaded Documents
                    </h3>
                    <div className="flex gap-2">
                      <button
                        className="p-2 text-gray-400 hover:text-primary transition-colors"
                        title="Filter"
                      >
                        <span className="material-symbols-outlined">
                          filter_list
                        </span>
                      </button>
                      <button
                        className="p-2 text-gray-400 hover:text-primary transition-colors"
                        title="Sort"
                      >
                        <span className="material-symbols-outlined">sort</span>
                      </button>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead className="bg-gray-50 dark:bg-white/5 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider font-semibold border-b border-[#e6d1d1] dark:border-white/10">
                        <tr>
                          <th className="px-6 py-4">Document Name</th>
                          <th className="px-6 py-4">Uploaded</th>
                          <th className="px-6 py-4">Expiry Date</th>
                          <th className="px-6 py-4">Status</th>
                          <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#e6d1d1] dark:divide-white/10 text-sm">
                        {/* Example rows, replace with dynamic data as needed */}
                        <tr className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="size-10 rounded bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                                <span className="material-symbols-outlined text-[20px]">
                                  picture_as_pdf
                                </span>
                              </div>
                              <div className="flex flex-col">
                                <p className="font-bold text-gray-900 dark:text-white">
                                  National Passport
                                </p>
                                <p className="text-xs text-gray-500">
                                  PDF • 2.4 MB
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                            Oct 24, 2023
                          </td>
                          <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                            Oct 24, 2028
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                              <span className="size-1.5 rounded-full bg-green-600"></span>{" "}
                              Verified
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button className="size-8 flex items-center justify-center rounded hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500 hover:text-primary transition-colors">
                                <span className="material-symbols-outlined text-[18px]">
                                  download
                                </span>
                              </button>
                              <button className="size-8 flex items-center justify-center rounded hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500 hover:text-red-600 transition-colors">
                                <span className="material-symbols-outlined text-[18px]">
                                  delete
                                </span>
                              </button>
                            </div>
                          </td>
                        </tr>
                        <tr className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="size-10 rounded bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                <span className="material-symbols-outlined text-[20px]">
                                  image
                                </span>
                              </div>
                              <div className="flex flex-col">
                                <p className="font-bold text-gray-900 dark:text-white">
                                  Seaman&apos;s Book
                                </p>
                                <p className="text-xs text-gray-500">
                                  JPG • 1.1 MB
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                            Sep 12, 2023
                          </td>
                          <td className="px-6 py-4 text-red-600 font-bold">
                            Nov 01, 2023
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                              <span className="size-1.5 rounded-full bg-red-600"></span>{" "}
                              Expiring
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button className="size-8 flex items-center justify-center rounded hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500 hover:text-primary transition-colors">
                                <span className="material-symbols-outlined text-[18px]">
                                  download
                                </span>
                              </button>
                              <button className="size-8 flex items-center justify-center rounded hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500 hover:text-red-600 transition-colors">
                                <span className="material-symbols-outlined text-[18px]">
                                  delete
                                </span>
                              </button>
                            </div>
                          </td>
                        </tr>
                        {/* ...other rows... */}
                      </tbody>
                    </table>
                  </div>
                  {/* Pagination */}
                  <div className="p-4 border-t border-[#e6d1d1] dark:border-white/10 flex items-center justify-between mt-auto">
                    <p className="text-sm text-gray-500">Showing 1-5 of 14</p>
                    <div className="flex gap-2">
                      <button className="px-3 py-1 text-sm border border-gray-200 dark:border-white/10 rounded hover:bg-gray-50 dark:hover:bg-white/5 text-gray-600 dark:text-gray-400 disabled:opacity-50">
                        Prev
                      </button>
                      <button className="px-3 py-1 text-sm border border-gray-200 dark:border-white/10 rounded hover:bg-gray-50 dark:hover:bg-white/5 text-gray-600 dark:text-gray-400">
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <footer className="mt-20 py-6 text-center text-sm text-gray-400">
            © 2024 Maritime Ops. All rights reserved.
          </footer>
        </div>
      </main>
    </div>
  );
}
