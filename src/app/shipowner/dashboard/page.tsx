"use client";

import Link from "next/link";
import React from "react";
import Image from "next/image";
import Sidebar from "../components/Sidebar";

export default function ShipownerDashboard() {
  return (
    <div className="flex h-screen overflow-hidden font-display text-slate-900 dark:text-white bg-background-light dark:bg-background-dark">
      {/* Sidebar */}
      <Sidebar active="dashboard" />
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
                placeholder="Search contracts, crew, or vessels..."
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
        <div className="flex-1 overflow-y-auto p-6 lg:p-10">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-1">
                  <Link
                    href="#"
                    className="hover:text-primary transition-colors"
                  >
                    Home
                  </Link>
                  <span>/</span>
                  <span className="text-slate-900 dark:text-white font-medium">
                    Contracts
                  </span>
                </div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                  Contract Management
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1">
                  Manage and track all crew supply and management agreements.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button className="px-4 py-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg">
                    tune
                  </span>
                  Filters
                </button>
                <button className="px-4 py-2.5 rounded-lg bg-primary hover:bg-primary-hover text-white font-bold text-sm shadow-lg shadow-primary/30 transition-all flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg">add</span>
                  Create New Contract
                </button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-[#1A2235] p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    Total Contracts
                  </p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                    128
                  </p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined">folder_open</span>
                </div>
              </div>
              <div className="bg-white dark:bg-[#1A2235] p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    Active
                  </p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                    45
                  </p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-green-50 text-green-600 flex items-center justify-center">
                  <span className="material-symbols-outlined">
                    check_circle
                  </span>
                </div>
              </div>
              <div className="bg-white dark:bg-[#1A2235] p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    Pending
                  </p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                    12
                  </p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                  <span className="material-symbols-outlined">pending</span>
                </div>
              </div>
              <div className="bg-white dark:bg-[#1A2235] p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    Expiring Soon
                  </p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                    5
                  </p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
                  <span className="material-symbols-outlined">
                    history_toggle_off
                  </span>
                </div>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-white dark:bg-[#1A2235] p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-center">
              <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-hide">
                <button className="px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-medium whitespace-nowrap">
                  All Contracts
                </button>
                <button className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700 text-sm font-medium whitespace-nowrap transition-colors">
                  One-Off Supply
                </button>
                <button className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700 text-sm font-medium whitespace-nowrap transition-colors">
                  Full Management
                </button>
                <button className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700 text-sm font-medium whitespace-nowrap transition-colors">
                  Drafts
                </button>
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
                    search
                  </span>
                  <input
                    className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent text-sm focus:ring-1 focus:ring-primary focus:border-primary"
                    placeholder="Search by ID or Vessel..."
                    type="text"
                  />
                </div>
                <button className="p-2 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500">
                  <span className="material-symbols-outlined">sort</span>
                </button>
              </div>
            </div>

            {/* Contracts Table */}
            <div className="bg-white dark:bg-[#1A2235] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-16">
                        <div className="flex items-center">
                          <input
                            className="rounded border-slate-300 text-primary focus:ring-primary h-4 w-4"
                            type="checkbox"
                          />
                        </div>
                      </th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Contract Details
                      </th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Crew
                      </th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Duration
                      </th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {/* Row 1 */}
                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <input
                            className="rounded border-slate-300 text-primary focus:ring-primary h-4 w-4"
                            type="checkbox"
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div
                            className="w-10 h-10 rounded bg-slate-200 dark:bg-slate-700 bg-cover bg-center shrink-0"
                            style={{
                              backgroundImage:
                                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCPyytAUtfoq3PI3lN1QYSqkhSfX2mBd8-9uOKLAU-wAy9yECS_YEw-_oNHw-UKBpdaoUkNkX4DdfJg4mCSbgvxsTuaMzWXVVRKQdfl-vPKRZB2GdfxgkkIOSSEylWcT_Fiyc-qUpqfsIiPpKPhbr8LedNTLoGzs_KZy4l__c1Ob2kC8O0pmtKSfhHF5OiavXMJ-MHp4UQ2DVeoaYGM-E_V_w_vxlnicTKPmedoqJXJW9ifOFYryUOFBsDcFhHqn0Y3ug6KVWniMLlj')",
                            }}
                          ></div>
                          <div>
                            <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">
                              MV Atlantic Star
                            </p>
                            <p className="text-xs text-slate-500 font-mono mt-0.5">
                              #CNT-2023-089
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30">
                          Full Management
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex -space-x-2 overflow-hidden">
                          <Image
                            alt="crew-1"
                            className="inline-block h-6 w-6 rounded-full ring-2 ring-white dark:ring-[#1A2235]"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBCV4FIcrqDwKANRU5coKAfDQOhvlqhFZz927kI5N8r5KPlNQ97Cvpf5_w_420QVz6-eFYPGVUaOYExoYwUmo-eUxe6yo1tSbiG6WmeNMU6_tQyA9ZjL7SqAbXwVEZIPCi4mCgaHnSZIKnldU8F-liPqh3dxSlU9x3Ccj6oIiJpoWre__byLbkGHNXTvgWZ8fFMDe74RzKToTpY-i3dfH2wsw67WwY46p9XJZgJpTEa9O4mizw-Idn8BIcM-FVWIp_PLPOg1Xo9NQrj"
                            width={24}
                            height={24}
                            unoptimized
                          />
                          <Image
                            alt="crew-2"
                            className="inline-block h-6 w-6 rounded-full ring-2 ring-white dark:ring-[#1A2235]"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuD59F9ZVql_WfkmraS9Wse1cGdKWkw0F1PIzT_OuggEsry1SNa_PPsJ09lvRo5RFvJsnYQ0nI2_OioCSD4DOMD4mMlYzfFuK8Thzcz6ODA_NxIG0xAdAnm0dvkG9agl2MW83YAPPyVD3ShccapVbggOFOnRVrsWy2vsSx3kC7KciukEyk86qYsV-ZS_-YP2z7ChP_6FvpkQAFP2tqMi9-XREzSuR1OUBUzU_uGE23AtCqHX5emb3cRcnHzKyOZBdKRj5d2KIGlZqkTo"
                            width={24}
                            height={24}
                            unoptimized
                          />
                          <Image
                            alt="crew-3"
                            className="inline-block h-6 w-6 rounded-full ring-2 ring-white dark:ring-[#1A2235]"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAAJsVFrxou4kPudT9jghJiwc1D4wLSHBOoUbkG0zYPsJ7CXgk4IY_H-wRBdj7Rm0jH9B5f3mjzlMje7-GaTdNa0M73bd93MnwPqkbT-hh6RHL7Kl7d7wXec4pQ9NKkKwPHfG8pzP3j4pWsahzMPwRwflc9mpEomG5UssdXjKN0_yfkRCdvfO9xF6E0AdwAVNkiuw7xT6_kDI3wpCTPeyBKVgPZduJi2vT1CnXGRrQu24BOcBZoy5AMDDUz1ApL4jAvr9wAZVNr6fkd"
                            width={24}
                            height={24}
                            unoptimized
                          />
                          <div className="h-6 w-6 rounded-full ring-2 ring-white dark:ring-[#1A2235] bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500">
                            +18
                          </div>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                          21 Crew Members
                          <Image
                            alt="member-1"
                            className="inline-block h-6 w-6 rounded-full ring-2 ring-white dark:ring-[#1A2235]"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBr5mMZQ8d0b2KDQq6zJ8cx0h3kQY9e8gGk1xYd2x3oH1l9yXg6s7I5e8r0f3aG5fH6kJ7lK8Y9qP0R1S2T3U4V5W6X7Y8Z9a0b1c2d3e4f5g6h7i8j9k0l1m2n3o4p"
                            width={24}
                            height={24}
                            unoptimized
                          />
                          <Image
                            alt="member-2"
                            className="inline-block h-6 w-6 rounded-full ring-2 ring-white dark:ring-[#1A2235]"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCd7nOq7Y8v6p5q4r3s2t1u0v9w8x7y6z5a4b3c2d1e0f9g8h7i6j5k4l3m2n1o0p9q8r7s6t5u4v3w2x1y0z"
                            width={24}
                            height={24}
                            unoptimized
                          />
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-900/50">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-600 mr-1.5"></span>
                          Active
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            className="p-1 text-slate-400 hover:text-primary transition-colors"
                            title="Edit"
                          >
                            <span className="material-symbols-outlined text-lg">
                              edit
                            </span>
                          </button>
                          <button
                            className="p-1 text-slate-400 hover:text-primary transition-colors"
                            title="Download PDF"
                          >
                            <span className="material-symbols-outlined text-lg">
                              picture_as_pdf
                            </span>
                          </button>
                          <button
                            className="p-1 text-slate-400 hover:text-primary transition-colors"
                            title="More"
                          >
                            <span className="material-symbols-outlined text-lg">
                              more_vert
                            </span>
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Row 2 */}
                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <input
                            className="rounded border-slate-300 text-primary focus:ring-primary h-4 w-4"
                            type="checkbox"
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <Image
                            alt="member-a"
                            className="inline-block h-6 w-6 rounded-full ring-2 ring-white dark:ring-[#1A2235]"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBg1xYzQ9u8v7w6x5y4z3a2b1c0d9e8f7g6h5i4j3k2l1m0n9o8p7q6r5s4t3u2v1w0x9y8z7a6b5c4d3e2f1g0h9"
                            width={24}
                            height={24}
                            unoptimized
                          />
                          <Image
                            alt="member-b"
                            className="inline-block h-6 w-6 rounded-full ring-2 ring-white dark:ring-[#1A2235]"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCk2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2f3g4h5i6j7k8l9m0n1o2p3q4r5s6t7u8v9w0x1y2z3a4b5c6"
                            width={24}
                            height={24}
                            unoptimized
                          />
                          <Image
                            alt="member-x"
                            className="inline-block h-6 w-6 rounded-full ring-2 ring-white dark:ring-[#1A2235]"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuD9e8f7g6h5i4j3k2l1m0n9o8p7q6r5s4t3u2v1w0x9y8z7a6b5c4d3e2f1g0h9i8j7k6l5m4n3o2p1q0r9s8t7u6v5w4x3y2z1"
                            width={24}
                            height={24}
                            unoptimized
                          />
                          <Image
                            alt="member-y"
                            className="inline-block h-6 w-6 rounded-full ring-2 ring-white dark:ring-[#1A2235]"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuE0f1g2h3i4j5k6l7m8n9o0p1q2r3s4t5u6v7w8x9y0z1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0"
                            width={24}
                            height={24}
                            unoptimized
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex -space-x-2 overflow-hidden">
                          <Image
                            alt=""
                            className="inline-block h-6 w-6 rounded-full ring-2 ring-white dark:ring-[#1A2235]"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuD6QBrAVmpXDdPFSp1pHpPnnQaWON3B2vzmL9QHZUN2ulvwMTKkjUF5Vr7mL9RD1SIAtxW6KAF0nTX7n2w5bPG-ZEp0M_yAiwjXbVjjDywYan2MgWZ5JVDgjocjFNcIIKTKnW74oqHxE82oUmjGmGJ7g1bBSckIfjBlBcvwOw0aFqCLicMdXHqAeBFLtdtOSRG5Pk6QHVXhQaxxDBrBnt91e1-sX7fjNUWQD9vLzsPxPeWnUUiLCywcLXI7PBy-SM5-O27pGCZAbDvJ"
                            width={24}
                            height={24}
                            unoptimized
                          />
                          <Image
                            alt=""
                            className="inline-block h-6 w-6 rounded-full ring-2 ring-white dark:ring-[#1A2235]"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBS5b--k6j3T9UAgyCjqkjD84NYgHpOGs_dR20YmelfLPZYdtwO8SgD5ciZ76O0NTQscNBAU47JF3SUMJHFpACjS0tyzt9A2DUJ4Hsp0EsNrjt6X5cnd9uMX9rtLFJoMAQXOaE4CkQcNl6C1N-9_lZAX6hpSp0KpQ0iRLzRjWkmcX4Av7UUva6bzGVq4t6QkJpn_4RPPzG4_tS7BTw5FgfK2tKvEw-v0HlCnCr2iEgPIoLtBs-WjNnPf77647RLIWKeDC2Bi8kNJ5bz"
                            width={24}
                            height={24}
                            unoptimized
                          />
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                          4 Crew Members
                        </p>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                        <div className="flex flex-col">
                          <span className="font-medium">
                            Nov 01, 2023 - May 01, 2024
                          </span>
                          <span className="text-xs text-slate-400">
                            6 months
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-900/50">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-600 mr-1.5"></span>
                          Active
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            className="p-1 text-slate-400 hover:text-primary transition-colors"
                            title="Edit"
                          >
                            <span className="material-symbols-outlined text-lg">
                              edit
                            </span>
                          </button>
                          <button
                            className="p-1 text-slate-400 hover:text-primary transition-colors"
                            title="Download PDF"
                          >
                            <span className="material-symbols-outlined text-lg">
                              picture_as_pdf
                            </span>
                          </button>
                          <button
                            className="p-1 text-slate-400 hover:text-primary transition-colors"
                            title="More"
                          >
                            <span className="material-symbols-outlined text-lg">
                              more_vert
                            </span>
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Row 3 */}
                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <input
                            className="rounded border-slate-300 text-primary focus:ring-primary h-4 w-4"
                            type="checkbox"
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div
                            className="w-10 h-10 rounded bg-slate-200 dark:bg-slate-700 bg-cover bg-center shrink-0"
                            style={{
                              backgroundImage:
                                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDeXNAk7fhjFxjdZlG-XnRmgxW-VFuerO0ohAAGd-DIsOrWD3TrMO0Pk1Yc_iOAxS_LRWEWB9S0NY0U7xbq_1O6fo0DtSwB68sbF2NT2pYufq6XvhwW_eLL8ooOTAmsrRSLRfvhPNVWZBQBOO9PBDWnoSAwA7ee71RwMRbt3-JK5WF7bEmmeMwYKO6QYwzxJIJc6hconYrG287Ys0YuoOkhVs3UEuCBrvLvtRSlUz7mWbVWiGMKcEFAhCiWyD7qcUYZQL-I-UCW3Uxi')",
                            }}
                          ></div>
                          <div>
                            <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">
                              MV Northern Light
                            </p>
                            <p className="text-xs text-slate-500 font-mono mt-0.5">
                              #CNT-2023-045
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30">
                          Full Management
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex -space-x-2 overflow-hidden">
                          <Image
                            alt=""
                            className="inline-block h-6 w-6 rounded-full ring-2 ring-white dark:ring-[#1A2235]"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBgwF0TEwnn3jljbIr6a09sS-O-0GDyi2JmF6lpLwRUOHMqV16Wj0EYyUdu8rYPq2ex23GV6tSlt34SYCbrcxt2vFha110gkRm2BdzHuMfHlfe8yETClzir-WpsOjOaiAgrs4mynz4ryvNY5QIE0TGV3Vnk4ePhkgh8GwKgYQ4FUmk89YoSS-Sc2cVUN806lbqlBFD4_7z9PKtq91Fw56ti0tUHMZv4lyZtu3DB5E2hlOTVfUwIH5o9EhmwecfO7Lz4kuYtpN9IvPmj"
                            width={24}
                            height={24}
                            unoptimized
                          />
                          <Image
                            alt=""
                            className="inline-block h-6 w-6 rounded-full ring-2 ring-white dark:ring-[#1A2235]"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAGe_j8gQs6JbIzagRM-4jC08CzujbPDWYzy0M1dZQXk63SJGU0e1RNxn7H4FvRr4yfju1-CvV3dxdduSK-TpDznVPvIk4CbHjill2_VycQlfQZRNEITDeqIZpagiwL5f3kRK8AQMIKLCBRS4whpHLFCUuCwvNNvexL1vMjGE5A58EiQ292f15ObH7i5jZW-cmRhPX6RxZO35E9NCiLxC_UEQg8o5mTbbM1V1SKumkq5RWUTr4NEzLrBaJAqmZDhHbz1M2J64Vd9Mmn"
                            width={24}
                            height={24}
                            unoptimized
                          />
                          <div className="h-6 w-6 rounded-full ring-2 ring-white dark:ring-[#1A2235] bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500">
                            +10
                          </div>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                          12 Crew Members
                          <Image
                            alt=""
                            className="inline-block h-6 w-6 rounded-full ring-2 ring-white dark:ring-[#1A2235]"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuD6QBrAVmpXDdPFSp1pHpPnnQaWON3B2vzmL9QHZUN2ulvwMTKkjUF5Vr7mL9RD1SIAtxW6KAF0nTX7n2w5bPG-ZEp0M_yAiwjXbVjjDywYan2MgWZ5JVDgjocjFNcIIKTKnW74oqHxE82oUmjGmGJ7g1bBSckIfjBlBcvwOw0aFqCLicMdXHqAeBFLtdtOSRG5Pk6QHVXhQaxxDBrBnt91e1-sX7fjNUWQD9vLzsPxPeWnUUiLCywcLXI7PBy-SM5-O27pGCZAbDvJ"
                            width={24}
                            height={24}
                            unoptimized
                          />
                          <Image
                            alt=""
                            className="inline-block h-6 w-6 rounded-full ring-2 ring-white dark:ring-[#1A2235]"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBS5b--k6j3T9UAgyCjqkjD84NYgHpOGs_dR20YmelfLPZYdtwO8SgD5ciZ76O0NTQscNBAU47JF3SUMJHFpACjS0tyzt9A2DUJ4Hsp0EsNrjt6X5cnd9uMX9rtLFJoMAQXOaE4CkQcNl6C1N-9_lZAX6hpSp0KpQ0iRLzRjWkmcX4Av7UUva6bzGVq4t6QkJpn_4RPPzG4_tS7BTw5FgfK2tKvEw-v0HlCnCr2iEgPIoLtBs-WjNnPf77647RLIWKeDC2Bi8kNJ5bz"
                            width={24}
                            height={24}
                            unoptimized
                          />
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-900/50">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mr-1.5"></span>
                          Review
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            className="p-1 text-slate-400 hover:text-primary transition-colors"
                            title="Renew"
                          >
                            <span className="material-symbols-outlined text-lg">
                              autorenew
                            </span>
                          </button>
                          <button
                            className="p-1 text-slate-400 hover:text-primary transition-colors"
                            title="Download PDF"
                          >
                            <span className="material-symbols-outlined text-lg">
                              picture_as_pdf
                            </span>
                          </button>
                          <button
                            className="p-1 text-slate-400 hover:text-primary transition-colors"
                            title="More"
                          >
                            <span className="material-symbols-outlined text-lg">
                              more_vert
                            </span>
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Row 4 */}
                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <input
                            className="rounded border-slate-300 text-primary focus:ring-primary h-4 w-4"
                            type="checkbox"
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <Image
                            alt=""
                            className="inline-block h-6 w-6 rounded-full ring-2 ring-white dark:ring-[#1A2235]"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuD9e8f7g6h5i4j3k2l1m0n9o8p7q6r5s4t3u2v1w0x9y8z7a6b5c4d3e2f1g0h9i8j7k6l5m4n3o2p1q0r9s8t7u6v5w4x3y2z1"
                            width={24}
                            height={24}
                            unoptimized
                          />
                          <Image
                            alt=""
                            className="inline-block h-6 w-6 rounded-full ring-2 ring-white dark:ring-[#1A2235]"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBS5b--k6j3T9UAgyCjqkjD84NYgHpOGs_dR20YmelfLPZYdtwO8SgD5ciZ76O0NTQscNBAU47JF3SUMJHFpACjS0tyzt9A2DUJ4Hsp0EsNrjt6X5cnd9uMX9rtLFJoMAQXOaE4CkQcNl6C1N-9_lZAX6hpSp0KpQ0iRLzRjWkmcX4Av7UUva6bzGVq4t6QkJpn_4RPPzG4_tS7BTw5FgfK2tKvEw-v0HlCnCr2iEgPIoLtBs-WjNnPf77647RLIWKeDC2Bi8kNJ5bz"
                            width={24}
                            height={24}
                            unoptimized
                          />
                          <div>
                            <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">
                              SS Golden Horizon
                            </p>
                            <p className="text-xs text-slate-500 font-mono mt-0.5">
                              #CNT-2024-001
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30">
                          Full Management
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex -space-x-2 overflow-hidden">
                          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 ring-2 ring-white dark:ring-[#1A2235] text-[10px] font-medium text-slate-500">
                            --
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                          Pending Crew
                        </p>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                        <div className="flex flex-col">
                          <span className="font-medium">
                            Jan 10, 2024 - Jul 10, 2024
                          </span>
                          <span className="text-xs text-slate-400">
                            Not Started
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-500 mr-1.5"></span>
                          Draft
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            className="p-1 text-slate-400 hover:text-primary transition-colors"
                            title="Edit"
                          >
                            <span className="material-symbols-outlined text-lg">
                              edit
                            </span>
                          </button>
                          <button
                            className="p-1 text-slate-400 hover:text-primary transition-colors"
                            title="Delete"
                          >
                            <span className="material-symbols-outlined text-lg">
                              delete
                            </span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="bg-white dark:bg-[#1A2235] px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Showing{" "}
                  <span className="font-medium text-slate-900 dark:text-white">
                    1
                  </span>{" "}
                  to{" "}
                  <span className="font-medium text-slate-900 dark:text-white">
                    4
                  </span>{" "}
                  of{" "}
                  <span className="font-medium text-slate-900 dark:text-white">
                    128
                  </span>{" "}
                  results
                </p>
                <nav className="flex items-center gap-2">
                  <button className="px-3 py-1 rounded border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 text-sm disabled:opacity-50">
                    Previous
                  </button>
                  <button className="px-3 py-1 rounded bg-primary text-white text-sm">
                    1
                  </button>
                  <button className="px-3 py-1 rounded border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 text-sm">
                    2
                  </button>
                  <button className="px-3 py-1 rounded border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 text-sm">
                    3
                  </button>
                  <span className="text-slate-400">...</span>
                  <button className="px-3 py-1 rounded border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 text-sm">
                    12
                  </button>
                  <button className="px-3 py-1 rounded border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 text-sm">
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
