"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Pre-fill email from URL params if available
  useEffect(() => {
    if (searchParams) {
      const emailParam = searchParams.get("email");
      if (emailParam) {
        setEmail(emailParam);
      }
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate passwords match
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Validate password length
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/password-reset-confirm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          code,
          new_password: newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.detail || "Failed to reset password. Please try again.");
        return;
      }

      setSuccess(true);
    } catch (err) {
      console.error("Password reset error:", err);
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden font-display antialiased text-slate-900 bg-background-light dark:bg-background-dark dark:text-white">
      {/* Background overlays */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[#701012]/10 dark:bg-[#000000]/60 mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-background-light via-transparent to-transparent dark:from-background-dark"></div>
        <div
          className="h-full w-full bg-cover bg-center opacity-20 dark:opacity-10"
          style={{
            backgroundImage:
              "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDuTf7xDXz7EYUie5hlNWsYgGstcytrzX93VoO0FpPixnaLA99xQaBG6ZP7pNdnWlyRlmVzgUZN-J65ma9K2zxCDb1I3sK5ZnOLgkXox8pPZjpowVSXyQoWGqTQ7yJs2zpb5iXN_zxl3DyMmFPTgLVQBn8XQZE-Wg72PIUTOFoLeV-lwliG5Ltm_qrU1F-VRU_fQZA_1n7dhQTIxyVJHiOojzAscMB2LxB9wLGBUHhOeCp9zqsY564mDikdS5xJPbI43dk1D1PRnAmg')",
          }}
        ></div>
      </div>

      {/* Central Card */}
      <div className="relative z-10 w-full max-w-[480px] p-4">
        <div className="flex flex-col overflow-hidden rounded-2xl bg-surface-light shadow-2xl ring-1 ring-slate-900/5 dark:bg-surface-dark dark:ring-white/10">
          {/* Logo & Header */}
          <div className="flex flex-col items-center px-8 pt-10 pb-6 text-center">
            <div className="mb-6 flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary dark:bg-primary/20 dark:text-red-400">
              <span className="material-symbols-outlined text-4xl">
                password
              </span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Reset Password
            </h1>
            <p className="mt-3 text-base font-normal leading-relaxed text-slate-500 dark:text-slate-400">
              Enter the code sent to your email and choose a new password.
            </p>
          </div>

          {/* Form Section */}
          <div className="px-8 pb-10">
            {success ? (
              <div className="flex flex-col items-center gap-4 py-8">
                <span className="material-symbols-outlined text-5xl text-green-500">
                  check_circle
                </span>
                <div className="text-lg font-semibold text-slate-900 dark:text-white">
                  Password Reset Successful!
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400 text-center">
                  Your password has been reset successfully. You can now log in
                  with your new password.
                </div>
                <button
                  className="mt-6 flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-primary-hover"
                  onClick={() => router.push("/login")}
                  type="button"
                >
                  <span>Go to Log In</span>
                  <span className="material-symbols-outlined text-[20px]">
                    arrow_forward
                  </span>
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                {error && (
                  <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
                    <span className="material-symbols-outlined text-red-600">
                      error
                    </span>
                    <p className="text-sm text-red-700 dark:text-red-300">
                      {error}
                    </p>
                  </div>
                )}

                {/* Email */}
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="email"
                    className="text-sm font-semibold leading-normal text-slate-900 dark:text-slate-200"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                      <span className="material-symbols-outlined text-[20px]">
                        mail
                      </span>
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="name@company.com"
                      className="block h-12 w-full rounded-lg border-slate-200 bg-slate-50 pl-10 text-base text-slate-900 placeholder:text-slate-400 focus:border-primary focus:ring-primary dark:border-slate-700 dark:bg-[#362929] dark:text-white dark:placeholder:text-slate-500 dark:focus:border-red-400 dark:focus:ring-red-400"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Reset Code */}
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="code"
                    className="text-sm font-semibold leading-normal text-slate-900 dark:text-slate-200"
                  >
                    Reset Code
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                      <span className="material-symbols-outlined text-[20px]">
                        pin
                      </span>
                    </div>
                    <input
                      id="code"
                      name="code"
                      type="text"
                      required
                      placeholder="Enter the code from your email"
                      className="block h-12 w-full rounded-lg border-slate-200 bg-slate-50 pl-10 text-base text-slate-900 placeholder:text-slate-400 focus:border-primary focus:ring-primary dark:border-slate-700 dark:bg-[#362929] dark:text-white dark:placeholder:text-slate-500 dark:focus:border-red-400 dark:focus:ring-red-400"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* New Password */}
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="newPassword"
                    className="text-sm font-semibold leading-normal text-slate-900 dark:text-slate-200"
                  >
                    New Password
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                      <span className="material-symbols-outlined text-[20px]">
                        lock
                      </span>
                    </div>
                    <input
                      id="newPassword"
                      name="newPassword"
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="Minimum 8 characters"
                      className="block h-12 w-full rounded-lg border-slate-200 bg-slate-50 pl-10 pr-12 text-base text-slate-900 placeholder:text-slate-400 focus:border-primary focus:ring-primary dark:border-slate-700 dark:bg-[#362929] dark:text-white dark:placeholder:text-slate-500 dark:focus:border-red-400 dark:focus:ring-red-400"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        {showPassword ? "visibility_off" : "visibility"}
                      </span>
                    </button>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Must be at least 8 characters
                  </p>
                </div>

                {/* Confirm Password */}
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="confirmPassword"
                    className="text-sm font-semibold leading-normal text-slate-900 dark:text-slate-200"
                  >
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                      <span className="material-symbols-outlined text-[20px]">
                        lock
                      </span>
                    </div>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="Re-enter your new password"
                      className="block h-12 w-full rounded-lg border-slate-200 bg-slate-50 pl-10 text-base text-slate-900 placeholder:text-slate-400 focus:border-primary focus:ring-primary dark:border-slate-700 dark:bg-[#362929] dark:text-white dark:placeholder:text-slate-500 dark:focus:border-red-400 dark:focus:ring-red-400"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="group mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 text-base font-bold text-white transition-all hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-[#2a1d1d] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <span className="material-symbols-outlined text-lg animate-spin">
                        sync
                      </span>
                      <span>Resetting...</span>
                    </>
                  ) : (
                    <>
                      <span>Reset Password</span>
                      <span className="material-symbols-outlined text-lg transition-transform group-hover:translate-x-1">
                        arrow_forward
                      </span>
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Back to Login (only show if not success) */}
            {!success && (
              <div className="mt-6 flex justify-center">
                <button
                  className="group flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-bold text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
                  type="button"
                  onClick={() => router.push("/login")}
                >
                  <span className="material-symbols-outlined text-[20px] transition-transform group-hover:-translate-x-1">
                    arrow_back
                  </span>
                  <span>Back to Log In</span>
                </button>
              </div>
            )}
          </div>

          {/* Footer / Trust Indicator */}
          <div className="border-t border-slate-100 bg-slate-50 px-8 py-4 dark:border-slate-700 dark:bg-[#2f2222]">
            <div className="flex items-center justify-center gap-2 text-xs font-medium text-slate-400 dark:text-slate-500">
              <span className="material-symbols-outlined text-sm">shield</span>
              <span>Secure CrewManning Platform</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
