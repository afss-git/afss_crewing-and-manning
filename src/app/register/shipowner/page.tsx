"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ShipOwnerRegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate registration API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Redirect to verification page after registration
    router.push("/verify/email");
  };

  return (
    <div className="flex w-full h-screen">
      {/* Left Panel - Hero Image */}
      <div className="hidden lg:block lg:flex-1 relative bg-slate-900 overflow-hidden order-1">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-[20s] hover:scale-105"
          data-alt="Large commercial cargo ship sailing on open blue sea during the day"
          style={{
            backgroundImage:
              "url('https://lh3.googleusercontent.com/aida-public/AB6AXuC48usSanT7oXOlOX4BluseVWNMd3y0BVAkpyEiVB4FTW0FXN5J05QdgSD_Argc_I0tAIy192fpCa5zIF5wOl0XaNUMBuzBjQNQBnjV3dBryZcA2n3i6eUE2-YUbBgSj-HcfcJ-Yoh7yF6Chis3vF3yHsHIRXguoB6IEA--LNfo4aq4uyK0Y6jmBVg2yr7sST4gn-S-8PNzmHd8P2BoTAYPe2Va1w-XW_djHecyn91paaeZx_6FWTiYTjYbWApvFhj3fXaMAks7qhfY')",
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/90 via-primary/40 to-slate-900/60 mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full p-16 text-white z-20">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-xs font-bold uppercase tracking-wider border border-white/10">
                Crew Management
              </span>
              <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-xs font-bold uppercase tracking-wider border border-white/10">
                Logistics
              </span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold leading-tight mb-6">
              Global Stevedoring &amp; Manning Excellence
            </h2>
            <div className="flex gap-8">
              <div className="flex flex-col">
                <span className="text-3xl font-bold">120+</span>
                <span className="text-sm text-white/70 uppercase tracking-wide">
                  Ports Active
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-bold">4.8k</span>
                <span className="text-sm text-white/70 uppercase tracking-wide">
                  Crew Deployed
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex flex-col justify-center w-full lg:w-1/2 xl:w-[45%] h-full bg-surface-light dark:bg-surface-dark relative z-10 shadow-xl overflow-y-auto order-2">
        <div className="w-full max-w-[520px] mx-auto px-6 py-12 md:px-12 flex flex-col h-full justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3 text-primary mb-10">
            <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-2xl">anchor</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-[#0e121b] dark:text-white">
              Maritime Ops Platform
            </h2>
          </div>

          {/* Form Content */}
          <div className="flex-1 flex flex-col justify-center pb-12">
            <div className="mb-8">
              <h1 className="text-[#0e121b] dark:text-white tracking-tight text-[32px] font-bold leading-tight mb-3">
                Create Account
              </h1>
              <p className="text-[#506795] dark:text-slate-400 text-base font-normal leading-normal">
                Enter your details to register as a new Ship Owner or Agent.
              </p>
            </div>

            <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
              {/* Email Field */}
              <label className="flex flex-col gap-2">
                <span className="text-[#0e121b] dark:text-white text-sm font-semibold leading-normal">
                  Email Address
                </span>
                <div className="relative">
                  <input
                    className="form-input flex w-full rounded-lg border border-[#d1d8e6] dark:border-slate-600 bg-[#f8f9fb] dark:bg-slate-800 text-[#0e121b] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/20 focus:border-primary h-14 placeholder:text-[#9aa2b1] pl-11 pr-4 text-base font-normal leading-normal transition-all"
                    placeholder="name@company.com"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                  />
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9aa2b1]">
                    mail
                  </span>
                </div>
              </label>

              {/* Password Field */}
              <label className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="text-[#0e121b] dark:text-white text-sm font-semibold leading-normal">
                    Password
                  </span>
                </div>
                <div className="relative">
                  <input
                    className="form-input flex w-full rounded-lg border border-[#d1d8e6] dark:border-slate-600 bg-[#f8f9fb] dark:bg-slate-800 text-[#0e121b] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/20 focus:border-primary h-14 placeholder:text-[#9aa2b1] pl-11 pr-12 text-base font-normal leading-normal transition-all"
                    placeholder="Create a strong password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    required
                    minLength={8}
                  />
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9aa2b1]">
                    lock
                  </span>
                  <button
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9aa2b1] hover:text-[#506795] transition-colors p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700"
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <span className="material-symbols-outlined text-[20px] block">
                      {showPassword ? "visibility" : "visibility_off"}
                    </span>
                  </button>
                </div>
                <p className="text-xs text-[#9aa2b1] mt-1">
                  Must be at least 8 characters
                </p>
              </label>

              {/* Submit Button */}
              <button
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-8 py-4 text-base font-bold leading-normal text-white shadow-sm hover:bg-[#5a0d0f] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <span>Sign Up</span>
                    <span className="material-symbols-outlined text-[20px]">
                      person_add
                    </span>
                  </>
                )}
              </button>
            </form>

            {/* Footer Links */}
            <div className="mt-8 flex flex-col gap-4 text-center">
              <p className="text-sm text-[#506795] dark:text-slate-400">
                Already have an account?{" "}
                <Link
                  className="font-bold text-primary hover:underline"
                  href="/login"
                >
                  Log In
                </Link>
              </p>
              <div className="flex items-center gap-4 justify-center w-full">
                <div className="h-px bg-[#e8ebf3] flex-1 dark:bg-slate-700"></div>
                <span className="text-xs font-medium text-[#9aa2b1] uppercase tracking-wider">
                  Help
                </span>
                <div className="h-px bg-[#e8ebf3] flex-1 dark:bg-slate-700"></div>
              </div>
              <a
                className="inline-flex items-center justify-center gap-2 text-sm font-medium text-[#506795] hover:text-primary transition-colors"
                href="#"
              >
                <span className="material-symbols-outlined text-[18px]">
                  headset_mic
                </span>
                Contact Operations Support
              </a>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-center md:text-left pt-6">
            <p className="text-xs text-[#9aa2b1]">
              © 2024 Maritime Ops Platform. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
