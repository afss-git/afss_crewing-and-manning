"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ContractTypePage() {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = (type: string) => {
    setSelected(type);
    if (type === "oneoff") {
      router.push("/shipowner/fleet-details?type=oneoff");
    } else if (type === "full") {
      router.push("/shipowner/fleet-details?type=full");
    }
  };

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
            Welcome, Captain Anderson
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
                Step 2 of 4: Service Selection
              </p>
              <span className="text-text-secondary text-sm">
                Next: Fleet Details
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-[#d1d8e6] dark:bg-slate-700 overflow-hidden">
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: "50%" }}
              ></div>
            </div>
          </div>
          {/* Title & Description */}
          <div className="flex flex-col gap-3 text-center md:text-left">
            <h1 className="text-text-main dark:text-white text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em]">
              Choose Your Service Model
            </h1>
            <p className="text-text-secondary text-lg max-w-2xl font-normal leading-relaxed">
              Select the contract type that best fits your current operational
              needs. You can switch plans or add additional services at any
              time.
            </p>
          </div>
          {/* Contract Type Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {/* One-Off Crew Supply */}
            <div
              className={`group flex flex-col rounded-xl border border-[#e8ebf3] dark:border-gray-700 bg-surface-light dark:bg-surface-dark p-8 shadow-sm transition-all hover:border-primary hover:shadow-lg dark:hover:border-primary ${
                selected === "oneoff" ? "ring-2 ring-primary" : ""
              }`}
              onClick={() => handleSelect("oneoff")}
              style={{ cursor: "pointer" }}
              tabIndex={0}
              role="button"
              aria-label="Start One-Off Crew Supply Contract"
            >
              <div className="mb-6 flex size-14 items-center justify-center rounded-full bg-primary-subtle text-primary">
                <span className="material-symbols-outlined text-3xl">
                  assignment_ind
                </span>
              </div>
              <div className="mb-2 flex items-center justify-between">
                <h2 className="text-xl font-bold text-text-main dark:text-white">
                  One-Off Crew Supply
                </h2>
                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                  Popular
                </span>
              </div>
              <p className="mb-8 text-text-secondary h-12">
                Quickly fill specific vacancies for a single voyage or
                short-term requirement.
              </p>
              <ul className="mb-8 flex flex-col gap-4 flex-1">
                <li className="flex items-center gap-3 text-sm font-medium text-text-main dark:text-gray-300">
                  <span
                    className="material-symbols-outlined text-green-600"
                    style={{ fontSize: 20 }}
                  >
                    check_circle
                  </span>
                  Pay-as-you-go per placement
                </li>
                <li className="flex items-center gap-3 text-sm font-medium text-text-main dark:text-gray-300">
                  <span
                    className="material-symbols-outlined text-green-600"
                    style={{ fontSize: 20 }}
                  >
                    check_circle
                  </span>
                  Immediate placement assistance
                </li>
                <li className="flex items-center gap-3 text-sm font-medium text-text-main dark:text-gray-300">
                  <span
                    className="material-symbols-outlined text-green-600"
                    style={{ fontSize: 20 }}
                  >
                    check_circle
                  </span>
                  Best for spot charters
                </li>
                <li className="flex items-center gap-3 text-sm font-medium text-text-main dark:text-gray-300">
                  <span
                    className="material-symbols-outlined text-green-600"
                    style={{ fontSize: 20 }}
                  >
                    check_circle
                  </span>
                  No long-term commitment
                </li>
              </ul>
              <button
                className="w-full rounded-lg bg-background-light dark:bg-slate-800 border border-transparent py-3 text-sm font-bold text-text-main dark:text-white transition-colors hover:border-primary hover:text-primary active:bg-slate-200 dark:active:bg-slate-700 group-hover:bg-primary group-hover:text-white dark:group-hover:bg-primary"
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelect("oneoff");
                }}
              >
                Start One-Off Contract
              </button>
            </div>
            {/* Full Crew Management */}
            <div
              className={`group flex flex-col rounded-xl border border-[#e8ebf3] dark:border-gray-700 bg-surface-light dark:bg-surface-dark p-8 shadow-sm transition-all hover:border-primary hover:shadow-lg dark:hover:border-primary relative overflow-hidden ${
                selected === "full" ? "ring-2 ring-primary" : ""
              }`}
              onClick={() => handleSelect("full")}
              style={{ cursor: "pointer" }}
              tabIndex={0}
              role="button"
              aria-label="Start Full Crew Management Contract"
            >
              <div className="absolute -right-12 top-6 rotate-45 bg-primary px-12 py-1 text-xs font-bold text-white shadow-sm">
                Recommended
              </div>
              <div className="mb-6 flex size-14 items-center justify-center rounded-full bg-primary-subtle text-primary">
                <span className="material-symbols-outlined text-3xl">
                  anchor
                </span>
              </div>
              <div className="mb-2 flex items-center justify-between">
                <h2 className="text-xl font-bold text-text-main dark:text-white">
                  Full Crew Management
                </h2>
              </div>
              <p className="mb-8 text-text-secondary h-12">
                Comprehensive HR and technical management for your entire fleet
                operations.
              </p>
              <ul className="mb-8 flex flex-col gap-4 flex-1">
                <li className="flex items-center gap-3 text-sm font-medium text-text-main dark:text-gray-300">
                  <span
                    className="material-symbols-outlined text-green-600"
                    style={{ fontSize: 20 }}
                  >
                    check_circle
                  </span>
                  Dedicated Fleet Manager
                </li>
                <li className="flex items-center gap-3 text-sm font-medium text-text-main dark:text-gray-300">
                  <span
                    className="material-symbols-outlined text-green-600"
                    style={{ fontSize: 20 }}
                  >
                    check_circle
                  </span>
                  End-to-end HR & Payroll
                </li>
                <li className="flex items-center gap-3 text-sm font-medium text-text-main dark:text-gray-300">
                  <span
                    className="material-symbols-outlined text-green-600"
                    style={{ fontSize: 20 }}
                  >
                    check_circle
                  </span>
                  Training & Certification tracking
                </li>
                <li className="flex items-center gap-3 text-sm font-medium text-text-main dark:text-gray-300">
                  <span
                    className="material-symbols-outlined text-green-600"
                    style={{ fontSize: 20 }}
                  >
                    check_circle
                  </span>
                  Long-term strategic partnership
                </li>
              </ul>
              <button
                className="w-full rounded-lg bg-primary py-3 text-sm font-bold text-white shadow-md transition-all hover:bg-primary-light active:scale-[0.98]"
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelect("full");
                }}
              >
                Start Full Management
              </button>
            </div>
          </div>
          {/* Help Card */}
          <div className="rounded-2xl bg-surface-light dark:bg-surface-dark p-6 md:p-10 border border-[#e8ebf3] dark:border-gray-800">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex flex-col gap-2 max-w-xl">
                <h3 className="text-xl font-bold text-text-main dark:text-white">
                  Need help deciding?
                </h3>
                <p className="text-text-secondary">
                  Our maritime specialists are available 24/7 to discuss your
                  fleet's specific requirements and create a custom proposal.
                </p>
              </div>
              <div className="flex flex-wrap gap-4 justify-center md:justify-end">
                <button className="flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-bold text-primary bg-primary-subtle border border-primary/20 hover:bg-primary/10 transition-colors">
                  <span className="material-symbols-outlined text-[20px]">
                    call
                  </span>
                  Contact Sales
                </button>
                <a
                  className="flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-bold text-text-secondary hover:text-primary transition-colors"
                  href="#"
                >
                  Compare Plans
                  <span className="material-symbols-outlined text-[18px]">
                    arrow_forward
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
      {/* Footer */}
      <footer className="mt-auto py-8 px-10 text-center text-sm text-text-secondary">
        <p>© {new Date().getFullYear()} CrewManage. All maritime rights reserved.</p>
        <div className="mt-2 flex justify-center gap-4">
          <a className="hover:text-primary" href="#">
            Privacy Policy
          </a>
          <a className="hover:text-primary" href="#">
            Terms of Service
          </a>
          <a className="hover:text-primary" href="#">
            Contact Support
          </a>
        </div>
      </footer>
    </div>
  );
}
