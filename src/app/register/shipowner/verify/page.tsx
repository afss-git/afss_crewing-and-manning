"use client";

import { useState } from "react";
import Link from "next/link";

export default function ShipOwnerVerifyPage() {
  const [token, setToken] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState("");
  const email = "agent@shipping-co.com"; // TODO: Replace with dynamic value

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setError("");
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1000));
    if (token.length !== 6) {
      setError("Please enter a valid 6-digit code.");
      setIsVerifying(false);
      return;
    }
    // TODO: Add real verification logic
    setIsVerifying(false);
    alert("Email verified!");
  };

  const handleResend = async () => {
    setIsResending(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1000));
    setIsResending(false);
    alert("Verification code resent!");
  };

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display min-h-screen flex flex-col">
      {/* Top Navigation Bar */}
      <header className="w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Branding */}
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center size-8 rounded bg-primary/10 text-primary">
                <span className="material-symbols-outlined text-[24px]">
                  anchor
                </span>
              </div>
              <div>
                <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-tight">
                  Maritime Operations
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-normal">
                  Crewing &amp; Manning Platform
                </p>
              </div>
            </div>
            {/* Right Side Actions */}
            <div className="flex items-center gap-6">
              <a
                className="hidden sm:flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary transition-colors"
                href="#"
              >
                <span className="material-symbols-outlined text-[20px]">
                  help
                </span>
                Support
              </a>
              <div className="h-8 w-px bg-gray-200 dark:bg-gray-700 mx-2 hidden sm:block"></div>
              <button className="text-sm font-bold text-slate-700 dark:text-slate-200 hover:text-primary transition-colors">
                Log out
              </button>
            </div>
          </div>
        </div>
      </header>
      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-[520px] flex flex-col gap-6">
          {/* Email Verification Card */}
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-8 sm:p-10 flex flex-col items-center text-center">
            {/* Icon Visual */}
            <div className="mb-6 rounded-full bg-primary/10 p-4 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-[40px]">
                mark_email_unread
              </span>
            </div>
            {/* Header Text */}
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight">
              Check your inbox
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-base font-normal leading-relaxed max-w-sm mb-8">
              We have sent a verification token to{" "}
              <strong className="text-slate-900 dark:text-slate-200 font-semibold">
                {email}
              </strong>
              .<br className="hidden sm:block" />
              Please enter the code below to complete your registration.
            </p>
            {/* Input Form */}
            <form
              className="w-full flex flex-col gap-5"
              onSubmit={handleVerify}
            >
              <div className="flex flex-col items-start w-full">
                <label
                  className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2"
                  htmlFor="token-input"
                >
                  Verification Token
                </label>
                <div className="relative w-full">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-slate-400 text-[20px]">
                      key
                    </span>
                  </div>
                  <input
                    className="form-input block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-base transition-shadow"
                    id="token-input"
                    placeholder="Enter 6-digit code"
                    type="text"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    maxLength={6}
                  />
                </div>
                {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
              </div>
              <button
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary hover:bg-primary-hover text-white h-12 px-6 font-bold text-base transition-colors shadow-sm focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
                type="submit"
                disabled={isVerifying}
              >
                {isVerifying ? (
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <>
                    <span>Verify Email</span>
                    <span className="material-symbols-outlined text-[20px]">
                      arrow_forward
                    </span>
                  </>
                )}
              </button>
            </form>
            {/* Divider */}
            <div className="w-full flex items-center gap-4 my-8">
              <div className="h-px bg-gray-200 dark:bg-gray-700 flex-1"></div>
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                Or
              </span>
              <div className="h-px bg-gray-200 dark:bg-gray-700 flex-1"></div>
            </div>
            {/* Secondary Actions Panel */}
            <div className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 rounded-lg p-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-slate-400 mt-0.5 text-[20px]">
                  mail
                </span>
                <div>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    Didn&apos;t receive the email?
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Check your spam folder or wait a few minutes.
                  </p>
                </div>
              </div>
              <button
                className="text-sm font-bold text-primary hover:text-primary-hover whitespace-nowrap flex items-center gap-1 group disabled:opacity-50"
                type="button"
                onClick={handleResend}
                disabled={isResending}
              >
                {isResending ? (
                  <span className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <>
                    Resend Code
                    <span className="material-symbols-outlined text-[18px] group-hover:translate-x-0.5 transition-transform">
                      refresh
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>
          {/* Footer Links */}
          <div className="flex justify-center gap-6 text-sm">
            <Link
              className="text-slate-500 hover:text-primary dark:text-slate-400 transition-colors"
              href="#"
            >
              Privacy Policy
            </Link>
            <Link
              className="text-slate-500 hover:text-primary dark:text-slate-400 transition-colors"
              href="#"
            >
              Terms of Service
            </Link>
            <Link
              className="text-slate-500 hover:text-primary dark:text-slate-400 transition-colors"
              href="#"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
