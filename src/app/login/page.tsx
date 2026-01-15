"use client";
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    }
  };

  return (
    <div className="bg-background-light dark:bg-background-dark font-display antialiased min-h-screen flex flex-col">
      <div className="flex flex-1 w-full overflow-hidden">
        {/* Left Side: Image / Brand Context */}
        <div className="hidden lg:flex w-1/2 relative bg-primary/10">
          <div className="absolute inset-0 bg-primary/20 z-10 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
          <div
            className="w-full h-full bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage:
                "url(https://lh3.googleusercontent.com/aida-public/AB6AXuB6OJbZveWBLcynq-MZ9MEjlbt0Sr4IvQ9MLCpRNH3UatWqGCDlLNVgYGdEp-S899Gfa3H4vT6oiPtZXBRCuo-2d48n7wDfvucWQO4TTJqzQ8LAKbatYuzz1c2juN_yRFSAPa8PJY1C3g-aCPZ_npIPLGCHLrcMg7xsf1CaNYBCGUXda44z8NOp5N9pi-K-HewF-0vCGF4Uj_2X6DbqMX1y19Vq4j9CHLz9blCaKe8JHhbwXStiHXzuR_i4i16Z3P6tngumypT6GeRc)",
            }}
          ></div>
          <div className="absolute bottom-0 left-0 p-12 z-20 text-white w-full max-w-2xl">
            <div className="flex items-center gap-3 mb-6">
              <span className="material-symbols-outlined text-4xl">anchor</span>
              <h1 className="text-3xl font-bold tracking-tight">CrewManager</h1>
            </div>
            <blockquote className="text-xl font-medium leading-relaxed opacity-90">
              &quot;Streamlining maritime operations and crew management for
              efficient global logistics.&quot;
            </blockquote>
            <div className="mt-8 flex gap-2">
              <div className="h-1 w-12 bg-white rounded-full"></div>
              <div className="h-1 w-3 bg-white/40 rounded-full"></div>
              <div className="h-1 w-3 bg-white/40 rounded-full"></div>
            </div>
          </div>
        </div>
        {/* Right Side: Login Form */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 lg:p-24 relative bg-background-light dark:bg-background-dark">
          <div className="w-full max-w-md space-y-8">
            {/* Mobile Logo (visible only on small screens) */}
            <div className="lg:hidden flex justify-center mb-8">
              <div className="flex items-center gap-2 text-primary">
                <span className="material-symbols-outlined text-3xl">
                  anchor
                </span>
                <span className="text-2xl font-bold">CrewManager</span>
              </div>
            </div>
            {/* Header Text */}
            <div className="text-center lg:text-left space-y-2">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                Welcome Back
              </h2>
              <p className="text-gray-500 dark:text-gray-400">
                Sign in to access your account.
              </p>
            </div>

            {error && (
              <div className="mt-4 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">error</span>
                {error}
              </div>
            )}

            {/* Login Form */}
            <form
              className="mt-8 space-y-6"
              method="POST"
              onSubmit={handleSubmit}
            >
              <div className="space-y-5">
                {/* Email Input */}
                <div>
                  <label
                    className="block text-sm font-medium leading-6 text-gray-900 dark:text-white"
                    htmlFor="email"
                  >
                    Email Address
                  </label>
                  <div className="mt-2 relative rounded-lg shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <span className="material-symbols-outlined text-gray-400 text-[20px]">
                        mail
                      </span>
                    </div>
                    <input
                      autoComplete="email"
                      className="block w-full rounded-lg border-0 py-3 pl-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary dark:bg-zinc-800 dark:ring-zinc-700 dark:text-white sm:text-sm sm:leading-6"
                      id="email"
                      name="email"
                      placeholder="name@company.com"
                      required
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
                {/* Password Input */}
                <div>
                  <div className="flex items-center justify-between">
                    <label
                      className="block text-sm font-medium leading-6 text-gray-900 dark:text-white"
                      htmlFor="password"
                    >
                      Password
                    </label>
                  </div>
                  <div className="mt-2 relative rounded-lg shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <span className="material-symbols-outlined text-gray-400 text-[20px]">
                        lock
                      </span>
                    </div>
                    <input
                      autoComplete="current-password"
                      className="block w-full rounded-lg border-0 py-3 pl-10 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary dark:bg-zinc-800 dark:ring-zinc-700 dark:text-white sm:text-sm sm:leading-6"
                      id="password"
                      name="password"
                      placeholder="••••••••"
                      required
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <div
                      className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                      onClick={() => setShowPassword((v) => !v)}
                    >
                      <span className="material-symbols-outlined text-gray-400 text-[20px] hover:text-gray-600 dark:hover:text-gray-300">
                        visibility
                      </span>
                    </div>
                  </div>
                </div>
                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary dark:border-zinc-600 dark:bg-zinc-800"
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                    />
                    <label
                      className="ml-2 block text-sm text-gray-900 dark:text-gray-300"
                      htmlFor="remember-me"
                    >
                      Remember me
                    </label>
                  </div>
                  <div className="text-sm">
                    <Link
                      href="/forgot/password"
                      className="font-semibold text-primary hover:text-primary/80 focus:outline-none"
                    >
                      Forgot password?
                    </Link>
                  </div>
                </div>
                {/* Submit Button */}
                <div>
                  <button
                    className="flex w-full justify-center rounded-lg bg-primary px-3 py-3 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                        Signing in...
                      </>
                    ) : (
                      "Log in"
                    )}
                  </button>
                </div>
              </div>
            </form>
            <div className="mt-6 text-center text-xs text-gray-500 dark:text-gray-400">
              <p>© 2024 CrewManager Platform. All rights reserved.</p>
              <p className="mt-1">
                Need help?{" "}
                <a className="text-primary hover:underline" href="#">
                  Contact IT Support
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
