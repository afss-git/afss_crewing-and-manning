"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Use the correct local admin API endpoint
      const response = await fetch(`/api/v1/admin/login/admin?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.detail || "Invalid email or password");
        setIsLoading(false);
        return;
      }

      const { access_token } = data;

      // Store auth data
      const adminUser = {
        id: email,
        name: email.split("@")[0],
        email: email,
        role: "admin",
        accessToken: access_token,
      };

      localStorage.setItem("crew-manning-user", JSON.stringify(adminUser));
      localStorage.setItem("crew-manning-token", access_token);

      // Redirect to admin dashboard
      router.push("/admin/dashboard");
    } catch (err) {
      console.error("Admin login error:", err);
      setError("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="font-display bg-background-light dark:bg-background-dark text-text-main dark:text-white overflow-hidden">
      <div className="flex min-h-screen w-full">
        {/* Left Side: Visual/Branding Panel (Hidden on Mobile) */}
        <div className="hidden lg:flex w-1/2 xl:w-[60%] relative flex-col justify-end bg-gray-900 overflow-hidden">
          {/* Background Image */}
          <div
            className="absolute inset-0 w-full h-full bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBr_IgQV-YUfkjxzrJiZjtpdU_de3vvnHb4qN0JEXrEBvj8yq5D_QTV3tQfUfDhNd36E3ydDkvjUB_4X7I8H88XE4I5yBiYFVtA4Yxm5rfcEnuErs-tk7oi2tT6XgYqqMJ0qodWodn9xogzfBjCL5JOfn9xLR51qEDiuKHOD5injFVpa_35N1ecQ8vDFHt1AjXtgcWVXmFi0bckAQybi5NmpBj38mj2uhuOQuz6v4kmtjwEwGZZ0or5IefPP1urKxLj4mLy4yvTcIWu')",
              filter: "grayscale(30%)",
            }}
          ></div>
          {/* Dark Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0e121b] via-[#0e121b]/40 to-transparent"></div>
          {/* Content */}
          <div className="relative z-10 p-12 xl:p-20 max-w-3xl">
            <div className="mb-6 inline-flex items-center justify-center w-12 h-12 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white">
              <span className="material-symbols-outlined text-2xl">anchor</span>
            </div>
            <h2 className="text-white text-3xl font-bold leading-tight mb-4 tracking-tight">
              Efficient Manning for Global Operations
            </h2>
            <p className="text-gray-300 text-lg leading-relaxed max-w-xl">
              Streamlining stevedoring and maritime logistics with our advanced
              crew management system. Secure, reliable, and built for the seas.
            </p>
            <div className="mt-8 flex gap-4">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-black/30 border border-white/10 text-xs text-gray-300">
                <span className="material-symbols-outlined text-base">
                  verified_user
                </span>
                <span>Secure Access</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-black/30 border border-white/10 text-xs text-gray-300">
                <span className="material-symbols-outlined text-base">
                  admin_panel_settings
                </span>
                <span>Admin Only</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="w-full lg:w-1/2 xl:w-[40%] flex flex-col items-center justify-center p-6 sm:p-12 lg:p-16 bg-white dark:bg-background-dark overflow-y-auto">
          <div className="w-full max-w-[440px] flex flex-col">
            {/* Logo & Header */}
            <div className="mb-10">
              <div className="flex items-center gap-2 mb-8 text-primary">
                <span className="material-symbols-outlined text-4xl">
                  sailing
                </span>
                <span className="text-xl font-bold text-text-main dark:text-white tracking-tight">
                  MaritimeOps
                </span>
              </div>
              <h1 className="text-text-main dark:text-white tracking-tight text-[32px] font-bold leading-tight text-left mb-2">
                Admin Portal
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-base font-normal leading-normal">
                Please enter your credentials to access the dashboard.
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">error</span>
                {error}
              </div>
            )}

            {/* Login Form */}
            <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
              {/* Email Field */}
              <label className="flex flex-col gap-1.5">
                <span className="text-text-main dark:text-gray-200 text-sm font-medium leading-normal">
                  Email Address
                </span>
                <div className="relative">
                  <input
                    className="flex w-full rounded-lg text-text-main dark:text-white border border-gray-300 dark:border-gray-700 bg-background-light dark:bg-[#1a202e] h-12 px-4 pr-12 text-base font-normal placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    placeholder="admin@company.com"
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                  />
                  <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-[20px]">
                    mail
                  </span>
                </div>
              </label>

              {/* Password Field */}
              <label className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-text-main dark:text-gray-200 text-sm font-medium leading-normal">
                    Password
                  </span>
                </div>
                <div className="relative">
                  <input
                    className="flex w-full rounded-lg text-text-main dark:text-white border border-gray-300 dark:border-gray-700 bg-background-light dark:bg-[#1a202e] h-12 px-4 pr-12 text-base font-normal placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    placeholder="••••••••"
                    required
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                  />
                  <span
                    className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer hover:text-gray-600 dark:hover:text-gray-300 text-[20px]"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "visibility" : "visibility_off"}
                  </span>
                </div>
              </label>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    className="rounded border-gray-300 text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors">
                    Remember me
                  </span>
                </label>
                <Link
                  className="text-sm font-medium text-primary hover:text-primary/80 hover:underline"
                  href="/forgot/password"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                className="mt-2 w-full h-12 rounded-lg bg-primary hover:bg-primary/90 text-white font-medium text-base transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:ring-offset-background-dark disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Signing In...
                  </>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            {/* Back to regular login */}
            <div className="mt-6 text-center">
              <Link
                href="/login"
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary transition-colors"
              >
                ← Back to regular login
              </Link>
            </div>

            {/* Footer / Legal */}
            <div className="mt-12 pt-6 border-t border-gray-100 dark:border-gray-800">
              <div className="flex flex-col gap-4 text-center sm:text-left">
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  © {new Date().getFullYear()} MaritimeOps Stevedoring. All rights reserved.
                </p>
                <div className="flex gap-4 text-xs text-gray-500 dark:text-gray-500 justify-center sm:justify-start">
                  <a className="hover:text-primary transition-colors" href="#">
                    Privacy Policy
                  </a>
                  <span className="text-gray-300">•</span>
                  <a className="hover:text-primary transition-colors" href="#">
                    Terms of Service
                  </a>
                  <span className="text-gray-300">•</span>
                  <a className="hover:text-primary transition-colors" href="#">
                    Support
                  </a>
                </div>
              </div>
            </div>

            {/* Security Note */}
            <div className="mt-6 flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-sm mt-0.5">
                info
              </span>
              <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
                This system is monitored. Unauthorized access is prohibited and
                will be prosecuted to the fullest extent of the law.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
