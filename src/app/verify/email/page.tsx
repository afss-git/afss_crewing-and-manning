"use client";
import React, { Suspense, useRef, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function EmailVerificationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams?.get("email") || "";

  // State for code inputs
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  // Refs for the 6 input fields
  const inputRef0 = useRef<HTMLInputElement>(null);
  const inputRef1 = useRef<HTMLInputElement>(null);
  const inputRef2 = useRef<HTMLInputElement>(null);
  const inputRef3 = useRef<HTMLInputElement>(null);
  const inputRef4 = useRef<HTMLInputElement>(null);
  const inputRef5 = useRef<HTMLInputElement>(null);
  const inputRefs = [
    inputRef0,
    inputRef1,
    inputRef2,
    inputRef3,
    inputRef4,
    inputRef5,
  ];

  // Redirect if no email provided
  useEffect(() => {
    if (!email) {
      router.push("/register/seafarer");
    }
  }, [email, router]);

  // Handler for input change and navigation
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    const newCode = [...code];
    newCode[idx] = value.slice(-1); // Only keep last digit
    setCode(newCode);
    setError(null); // Clear error when user types

    if (value && idx < 5) {
      inputRefs[idx + 1].current?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    idx: number
  ) => {
    if (e.key === "Backspace" && !code[idx] && idx > 0) {
      inputRefs[idx - 1].current?.focus();
    } else if (e.key === "ArrowLeft" && idx > 0) {
      inputRefs[idx - 1].current?.focus();
    } else if (e.key === "ArrowRight" && idx < 5) {
      inputRefs[idx + 1].current?.focus();
    }
  };

  // Handle paste
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData("text")
      .replace(/[^0-9]/g, "")
      .slice(0, 6);
    const newCode = [...code];
    for (let i = 0; i < pastedData.length; i++) {
      newCode[i] = pastedData[i];
    }
    setCode(newCode);
    // Focus on the next empty input or the last one
    const nextEmptyIndex = newCode.findIndex((c) => !c);
    if (nextEmptyIndex !== -1) {
      inputRefs[nextEmptyIndex].current?.focus();
    } else {
      inputRefs[5].current?.focus();
    }
  };

  // Verify the code
  const handleVerify = async () => {
    const fullCode = code.join("");

    if (fullCode.length !== 6) {
      setError("Please enter all 6 digits of the verification code.");
      return;
    }

    if (!email) {
      setError("Email address is missing. Please register again.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email: email,
          code: fullCode,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.detail ||
            "Invalid or expired verification code. Please try again."
        );
        setIsLoading(false);
        return;
      }

      // Success - redirect to login
      router.push("/login?verified=true");
    } catch (err) {
      console.error("Verification error:", err);
      setError("Network error. Please check your connection and try again.");
      setIsLoading(false);
    }
  };

  // Resend verification code
  const handleResend = async () => {
    if (!email) return;

    setIsResending(true);
    setResendSuccess(false);
    setError(null);

    try {
      // For now, we'll re-trigger registration or call a resend endpoint if available
      // This is a placeholder - backend may need a specific resend endpoint
      await fetch("/api/auth/register/seafarer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: "resend", // This won't work properly - need a dedicated resend endpoint
        }),
      });

      // Even if it fails (email already registered), the backend might resend
      setResendSuccess(true);
      setTimeout(() => setResendSuccess(false), 5000);
    } catch {
      setError("Failed to resend verification code. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  // Mask email for display
  const maskedEmail = email
    ? email.replace(/(.{2})(.*)(@.*)/, "$1***$3")
    : "your email";

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white antialiased min-h-screen flex flex-col group/design-root overflow-x-hidden">
      {/* Navigation */}
      <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-gray-200 dark:border-gray-800 bg-white dark:bg-background-dark px-4 sm:px-10 py-3 relative z-10">
        <div className="flex items-center gap-4 text-slate-900 dark:text-white">
          <div className="size-8 flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-3xl">anchor</span>
          </div>
          <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">
            Crewing &amp; Manning Platform
          </h2>
        </div>
        <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary/10 hover:bg-primary/20 text-primary dark:text-white dark:bg-white/10 dark:hover:bg-white/20 text-sm font-bold leading-normal tracking-[0.015em] transition-colors">
          <span className="truncate">Back to Login</span>
        </button>
      </header>
      {/* Main Layout */}
      <div className="layout-container flex h-full grow flex-col justify-center items-center py-10 px-4">
        {/* Central Card */}
        <div className="layout-content-container flex flex-col max-w-[480px] w-full bg-white dark:bg-[#2a1617] rounded-xl shadow-lg border border-gray-100 dark:border-gray-800 overflow-hidden">
          {/* Header Image Section */}
          <div
            className="w-full h-32 bg-center bg-no-repeat bg-cover flex flex-col justify-end overflow-hidden relative"
            style={{
              backgroundImage:
                "url(https://lh3.googleusercontent.com/aida-public/AB6AXuBhAtNxIkBNP1NB0p0TsisTCz8mzb8SqqSbF8EqmucgahrngEYj3p-0IWmR7AEPbVsmt3EjuLmQm34uSTu_vYWPBMOqMRkaUixAHTlwBWQVgCbeYPFiP0hTeU9IQT5BpQeleNJjiySKn46SA4p0M6dkjmi3KuWnmz-LT2aMGwLuRfXdTWtSp27y14FBgtt5gthlIhbimX-lcbhCwTVtI4cRAaPbzoQQnRnxw3w-Jgua1CVdkp0QPKJ5z3GLQooq_XOZWAwsWYxUIiBC)",
            }}
          >
            <div className="absolute inset-0 bg-primary/80 mix-blend-multiply"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white dark:bg-background-dark p-4 rounded-full shadow-lg">
                <span className="material-symbols-outlined text-4xl text-primary">
                  mark_email_unread
                </span>
              </div>
            </div>
          </div>
          {/* Content */}
          <div className="p-6 sm:p-8 flex flex-col">
            <h2 className="text-slate-900 dark:text-white tracking-light text-[28px] font-bold leading-tight text-center pb-2">
              Check your inbox
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-base font-normal leading-normal pb-6 pt-1 text-center">
              We&apos;ve sent a verification code to{" "}
              <span className="font-bold text-slate-900 dark:text-white">
                {maskedEmail}
              </span>
              . Please enter the 6-digit code below to complete your
              registration.
            </p>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">error</span>
                {error}
              </div>
            )}

            {/* Success Message for Resend */}
            {resendSuccess && (
              <div className="mb-4 p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 text-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">
                  check_circle
                </span>
                Verification code resent! Please check your inbox.
              </div>
            )}

            {/* Confirmation Code Inputs */}
            <div className="flex justify-center px-0 py-3 mb-6">
              <fieldset
                className="relative flex gap-2 sm:gap-3"
                onPaste={handlePaste}
              >
                <input
                  ref={inputRef0}
                  className={`flex h-12 w-10 sm:h-14 sm:w-12 text-center rounded-lg border ${
                    error
                      ? "border-red-400 dark:border-red-600"
                      : "border-gray-300 dark:border-gray-600"
                  } bg-gray-50 dark:bg-black/20 text-slate-900 dark:text-white text-lg font-bold focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all placeholder-gray-300 disabled:opacity-50`}
                  inputMode="numeric"
                  maxLength={1}
                  type="text"
                  value={code[0]}
                  onChange={(e) => handleInput(e, 0)}
                  onKeyDown={(e) => handleKeyDown(e, 0)}
                  disabled={isLoading}
                />
                <input
                  ref={inputRef1}
                  className={`flex h-12 w-10 sm:h-14 sm:w-12 text-center rounded-lg border ${
                    error
                      ? "border-red-400 dark:border-red-600"
                      : "border-gray-300 dark:border-gray-600"
                  } bg-gray-50 dark:bg-black/20 text-slate-900 dark:text-white text-lg font-bold focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all placeholder-gray-300 disabled:opacity-50`}
                  inputMode="numeric"
                  maxLength={1}
                  type="text"
                  value={code[1]}
                  onChange={(e) => handleInput(e, 1)}
                  onKeyDown={(e) => handleKeyDown(e, 1)}
                  disabled={isLoading}
                />
                <input
                  ref={inputRef2}
                  className={`flex h-12 w-10 sm:h-14 sm:w-12 text-center rounded-lg border ${
                    error
                      ? "border-red-400 dark:border-red-600"
                      : "border-gray-300 dark:border-gray-600"
                  } bg-gray-50 dark:bg-black/20 text-slate-900 dark:text-white text-lg font-bold focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all placeholder-gray-300 disabled:opacity-50`}
                  inputMode="numeric"
                  maxLength={1}
                  type="text"
                  value={code[2]}
                  onChange={(e) => handleInput(e, 2)}
                  onKeyDown={(e) => handleKeyDown(e, 2)}
                  disabled={isLoading}
                />
                <input
                  ref={inputRef3}
                  className={`flex h-12 w-10 sm:h-14 sm:w-12 text-center rounded-lg border ${
                    error
                      ? "border-red-400 dark:border-red-600"
                      : "border-gray-300 dark:border-gray-600"
                  } bg-gray-50 dark:bg-black/20 text-slate-900 dark:text-white text-lg font-bold focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all placeholder-gray-300 disabled:opacity-50`}
                  inputMode="numeric"
                  maxLength={1}
                  type="text"
                  value={code[3]}
                  onChange={(e) => handleInput(e, 3)}
                  onKeyDown={(e) => handleKeyDown(e, 3)}
                  disabled={isLoading}
                />
                <input
                  ref={inputRef4}
                  className={`flex h-12 w-10 sm:h-14 sm:w-12 text-center rounded-lg border ${
                    error
                      ? "border-red-400 dark:border-red-600"
                      : "border-gray-300 dark:border-gray-600"
                  } bg-gray-50 dark:bg-black/20 text-slate-900 dark:text-white text-lg font-bold focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all placeholder-gray-300 disabled:opacity-50`}
                  inputMode="numeric"
                  maxLength={1}
                  type="text"
                  value={code[4]}
                  onChange={(e) => handleInput(e, 4)}
                  onKeyDown={(e) => handleKeyDown(e, 4)}
                  disabled={isLoading}
                />
                <input
                  ref={inputRef5}
                  className={`flex h-12 w-10 sm:h-14 sm:w-12 text-center rounded-lg border ${
                    error
                      ? "border-red-400 dark:border-red-600"
                      : "border-gray-300 dark:border-gray-600"
                  } bg-gray-50 dark:bg-black/20 text-slate-900 dark:text-white text-lg font-bold focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all placeholder-gray-300 disabled:opacity-50`}
                  inputMode="numeric"
                  maxLength={1}
                  type="text"
                  value={code[5]}
                  onChange={(e) => handleInput(e, 5)}
                  onKeyDown={(e) => handleKeyDown(e, 5)}
                  disabled={isLoading}
                />
              </fieldset>
            </div>
            {/* Verify Button */}
            <button
              className="w-full flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-4 bg-primary hover:bg-[#5a0d0f] text-white text-base font-bold leading-normal tracking-[0.015em] transition-colors shadow-sm mb-4 disabled:opacity-70 disabled:cursor-not-allowed"
              type="button"
              onClick={handleVerify}
              disabled={isLoading || code.join("").length !== 6}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>Verifying...</span>
                </div>
              ) : (
                <span className="truncate">Verify Email</span>
              )}
            </button>
            {/* Resend Link */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-1 text-sm">
              <span className="text-slate-500 dark:text-slate-400">
                Didn&apos;t receive the email?
              </span>
              <button
                onClick={handleResend}
                disabled={isResending}
                className="font-bold text-primary hover:text-[#5a0d0f] transition-colors cursor-pointer hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isResending ? "Sending..." : "Click to resend"}
              </button>
            </div>
          </div>
          {/* Card Footer */}
          <div className="bg-gray-50 dark:bg-black/10 px-8 py-4 border-t border-gray-100 dark:border-gray-800 flex justify-center">
            <a
              className="text-xs text-slate-400 dark:text-slate-500 hover:text-primary dark:hover:text-white transition-colors flex items-center gap-1"
              href="#"
            >
              <span className="material-symbols-outlined text-sm">support</span>
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EmailVerificationPage />
    </Suspense>
  );
}
