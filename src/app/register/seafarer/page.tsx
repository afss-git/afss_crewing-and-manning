"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function SeafarerRegistration() {
  const router = useRouter();

  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Password strength calculation
  const getPasswordStrength = (pwd: string): number => {
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (/[A-Z]/.test(pwd)) strength++;
    if (/[0-9]/.test(pwd)) strength++;
    if (/[^A-Za-z0-9]/.test(pwd)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (!agreeToTerms) {
      setError("Please agree to the Terms of Service and Privacy Policy.");
      return;
    }

    setIsLoading(true);

    try {
      // Use local API route to avoid CORS issues
      const response = await fetch("/api/auth/register/seafarer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const data = await response.json();

      // Debug: Log the full response to console
      console.log("Registration API Response:", {
        status: response.status,
        ok: response.ok,
        data: data,
      });

      if (!response.ok) {
        // Handle different error responses
        if (response.status === 400) {
          setError(data.detail || "Registration failed. Please try again.");
        } else if (response.status === 422) {
          // Validation error
          const validationErrors = data.detail;
          if (Array.isArray(validationErrors) && validationErrors.length > 0) {
            setError(
              validationErrors[0].msg ||
                "Validation error. Please check your input.",
            );
          } else {
            setError("Validation error. Please check your input.");
          }
        } else {
          setError("An unexpected error occurred. Please try again.");
        }
        return;
      }

      // Success - redirect to email verification page with email param
      router.push(`/verify/email?email=${encodeURIComponent(email)}`);
    } catch (err) {
      console.error("Registration error:", err);
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-text-main antialiased min-h-screen flex flex-col">
      {/* Top Navigation */}
      <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-border-color bg-white dark:bg-[#2a1516] dark:border-[#3a1d1e] px-10 py-3 relative z-20">
        <div className="flex items-center gap-4 text-text-main dark:text-white">
          <div className="size-8 text-primary">
            {/* SVG Logo */}
            <svg
              fill="currentColor"
              viewBox="0 0 48 48"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                clipRule="evenodd"
                d="M39.475 21.6262C40.358 21.4363 40.6863 21.5589 40.7581 21.5934C40.7876 21.655 40.8547 21.857 40.8082 22.3336C40.7408 23.0255 40.4502 24.0046 39.8572 25.2301C38.6799 27.6631 36.5085 30.6631 33.5858 33.5858C30.6631 36.5085 27.6632 38.6799 25.2301 39.8572C24.0046 40.4502 23.0255 40.7407 22.3336 40.8082C21.8571 40.8547 21.6551 40.7875 21.5934 40.7581C21.5589 40.6863 21.4363 40.358 21.6262 39.475C21.8562 38.4054 22.4689 36.9657 23.5038 35.2817C24.7575 33.2417 26.5497 30.9744 28.7621 28.762C30.9744 26.5497 33.2417 24.7574 35.2817 23.5037C36.9657 22.4689 38.4054 21.8562 39.475 21.6262ZM4.41189 29.2403L18.7597 43.5881C19.8813 44.7097 21.4027 44.9179 22.7217 44.7893C24.0585 44.659 25.5148 44.1631 26.9723 43.4579C29.9052 42.0387 33.2618 39.5667 36.4142 36.4142C39.5667 33.2618 42.0387 29.9052 43.4579 26.9723C44.1631 25.5148 44.659 24.0585 44.7893 22.7217C44.9179 21.4027 44.7097 19.8813 43.5881 18.7597L29.2403 4.41187C27.8527 3.02428 25.8765 3.02573 24.2861 3.36776C22.6081 3.72863 20.7334 4.58419 18.8396 5.74801C16.4978 7.18716 13.9881 9.18353 11.5858 11.5858C9.18354 13.988 7.18717 16.4978 5.74802 18.8396C4.58421 20.7334 3.72865 22.6081 3.36778 24.2861C3.02574 25.8765 3.02429 27.8527 4.41189 29.2403Z"
                fill="currentColor"
                fillRule="evenodd"
              ></path>
            </svg>
          </div>
          <h2 className="text-text-main dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">
            CrewManagement
          </h2>
        </div>
        <div className="flex flex-1 justify-end gap-8">
          <div className="hidden md:flex items-center gap-9">
            <a
              className="text-text-main dark:text-gray-200 text-sm font-medium hover:text-primary transition-colors"
              href="#"
            >
              Home
            </a>
            <a
              className="text-text-main dark:text-gray-200 text-sm font-medium hover:text-primary transition-colors"
              href="#"
            >
              About Us
            </a>
            <a
              className="text-text-main dark:text-gray-200 text-sm font-medium hover:text-primary transition-colors"
              href="#"
            >
              Contact
            </a>
          </div>
          <button
            onClick={() => router.push("/login")}
            className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-6 border border-primary text-primary hover:bg-primary/5 transition-colors text-sm font-bold"
          >
            <span className="truncate">Log In</span>
          </button>
        </div>
      </header>
      {/* Split Screen Content */}
      <div className="flex flex-1 flex-col lg:flex-row h-[calc(100vh-65px)]">
        {/* Left Panel: Hero Image */}
        <div className="relative hidden lg:flex w-1/2 flex-col justify-end bg-background-dark overflow-hidden">
          {/* Background Image */}
          <div
            className="absolute inset-0 z-0 h-full w-full bg-cover bg-center"
            style={{
              backgroundImage:
                'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCRjM4DgRHmX1DKZjjl6IiBAk12lu7hf1617BGzKxIZQeLnOwFHljOcSPwy2Xo8K5_Bo-Ly3Cwa3qigWXKSImZ3WWzruBeY5VLXDP8Q6U6hJB4fHQtMRaWfDpfG5kDAhCua7erLugHgG5Z82WxLLAHbOL-HugJlyIOxvrim8tcmPBqsUZie8YTz7wWYZNgj-Unyq07UWKMpflFmF9yMCcoSyrBa64BtCG14cteiZfiL7PoPp6z6TngPRGgzuFwiW8cabOdaD_DFLbFb")',
            }}
            data-alt="Aerial view of a large container ship sailing in the open sea"
          ></div>
          {/* Overlay */}
          <div className="absolute inset-0 z-10 bg-primary/80 mix-blend-multiply"></div>
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
          {/* Content */}
          <div className="relative z-20 p-16 text-white max-w-2xl">
            <div className="mb-6 size-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-3xl">
                anchor
              </span>
            </div>
            <h1 className="text-4xl font-bold mb-4 tracking-tight">
              Join the world&apos;s leading maritime crew.
            </h1>
            <p className="text-lg text-white/90 leading-relaxed">
              Manage your credentials, track your voyages, and connect with
              top-tier stevedoring operations globally.
            </p>
            <div className="mt-8 flex gap-4">
              <div className="flex -space-x-3">
                <Image
                  alt="Avatar of a crew member"
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full border-2 border-primary"
                  src="/images/default-seafarer-avatar.jpg"
                  unoptimized
                />
                <Image
                  alt="Avatar of a crew member"
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full border-2 border-primary"
                  src="/images/default-seafarer-avatar.jpg"
                  unoptimized
                />
                <Image
                  alt="Avatar of a crew member"
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full border-2 border-primary"
                  src="/images/default-seafarer-avatar.jpg"
                  unoptimized
                />
              </div>
              <div className="flex items-center text-sm font-medium text-white">
                <span>Join 10,000+ Seafarers</span>
              </div>
            </div>
          </div>
        </div>
        {/* Right Panel: Registration Form */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 sm:p-12 overflow-y-auto bg-background-light dark:bg-background-dark">
          <div className="w-full max-w-md flex flex-col gap-6">
            {/* Header */}
            <div className="flex flex-col gap-2 mb-2">
              <h1 className="text-text-main dark:text-white text-3xl font-bold leading-tight tracking-tight">
                Create Seafarer Account
              </h1>
              <p className="text-text-sub text-base font-normal">
                Please enter your details to register.
              </p>
            </div>
            {/* Form */}
            <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
              {/* Error Message */}
              {error && (
                <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg">
                    error
                  </span>
                  {error}
                </div>
              )}

              {/* Email Field */}
              <label className="flex flex-col w-full">
                <span className="text-text-main dark:text-gray-200 text-sm font-semibold leading-normal pb-2">
                  Email Address
                </span>
                <div className="relative flex w-full items-center">
                  <input
                    className="w-full rounded-lg border border-border-color bg-white dark:bg-[#2a1516] dark:border-[#3a1d1e] dark:text-white h-12 pl-4 pr-12 text-base focus:border-primary focus:ring-1 focus:ring-primary placeholder:text-text-sub/60 transition-all"
                    placeholder="captain@example.com"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                  <div className="absolute right-4 text-text-sub pointer-events-none flex items-center">
                    <span className="material-symbols-outlined text-xl">
                      mail
                    </span>
                  </div>
                </div>
              </label>
              {/* Password Field */}
              <label className="flex flex-col w-full">
                <span className="text-text-main dark:text-gray-200 text-sm font-semibold leading-normal pb-2">
                  Password
                </span>
                <div className="relative flex w-full items-center">
                  <input
                    className="w-full rounded-lg border border-border-color bg-white dark:bg-[#2a1516] dark:border-[#3a1d1e] dark:text-white h-12 pl-4 pr-12 text-base focus:border-primary focus:ring-1 focus:ring-primary placeholder:text-text-sub/60 transition-all"
                    placeholder="Minimum 8 characters"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 text-text-sub cursor-pointer flex items-center hover:text-primary transition-colors"
                  >
                    <span className="material-symbols-outlined text-xl">
                      {showPassword ? "visibility" : "visibility_off"}
                    </span>
                  </button>
                </div>
              </label>
              {/* Confirm Password Field */}
              <label className="flex flex-col w-full">
                <span className="text-text-main dark:text-gray-200 text-sm font-semibold leading-normal pb-2">
                  Confirm Password
                </span>
                <div className="relative flex w-full items-center">
                  <input
                    className="w-full rounded-lg border border-border-color bg-white dark:bg-[#2a1516] dark:border-[#3a1d1e] dark:text-white h-12 pl-4 pr-12 text-base focus:border-primary focus:ring-1 focus:ring-primary placeholder:text-text-sub/60 transition-all"
                    placeholder="Re-enter password"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 text-text-sub cursor-pointer flex items-center hover:text-primary transition-colors"
                  >
                    <span className="material-symbols-outlined text-xl">
                      {showConfirmPassword ? "visibility" : "lock"}
                    </span>
                  </button>
                </div>
                {/* Password Strength Indicator */}
                <div className="flex gap-1 mt-2 h-1">
                  <div
                    className={`flex-1 rounded-full transition-colors ${
                      passwordStrength >= 1
                        ? "bg-red-500"
                        : "bg-gray-200 dark:bg-gray-700"
                    }`}
                  ></div>
                  <div
                    className={`flex-1 rounded-full transition-colors ${
                      passwordStrength >= 2
                        ? "bg-orange-500"
                        : "bg-gray-200 dark:bg-gray-700"
                    }`}
                  ></div>
                  <div
                    className={`flex-1 rounded-full transition-colors ${
                      passwordStrength >= 3
                        ? "bg-yellow-500"
                        : "bg-gray-200 dark:bg-gray-700"
                    }`}
                  ></div>
                  <div
                    className={`flex-1 rounded-full transition-colors ${
                      passwordStrength >= 4
                        ? "bg-green-500"
                        : "bg-gray-200 dark:bg-gray-700"
                    }`}
                  ></div>
                </div>
                {password && (
                  <p
                    className={`text-xs mt-1 ${
                      passwordStrength < 2
                        ? "text-red-500"
                        : passwordStrength < 4
                          ? "text-yellow-600"
                          : "text-green-600"
                    }`}
                  >
                    {passwordStrength < 2
                      ? "Weak password"
                      : passwordStrength < 4
                        ? "Medium strength"
                        : "Strong password"}
                  </p>
                )}
              </label>
              {/* Terms Checkbox */}
              <label className="flex items-start gap-3 mt-1 cursor-pointer group">
                <div className="relative flex items-center">
                  <input
                    className="peer h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary dark:border-gray-600 dark:bg-[#2a1516]"
                    type="checkbox"
                    checked={agreeToTerms}
                    onChange={(e) => setAgreeToTerms(e.target.checked)}
                    disabled={isLoading}
                  />
                </div>
                <span className="text-sm text-text-sub leading-tight group-hover:text-text-main dark:group-hover:text-gray-300 transition-colors">
                  I agree to the{" "}
                  <a
                    className="font-medium text-primary hover:text-primary-dark underline underline-offset-2"
                    href="#"
                  >
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a
                    className="font-medium text-primary hover:text-primary-dark underline underline-offset-2"
                    href="#"
                  >
                    Privacy Policy
                  </a>
                  .
                </span>
              </label>
              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-4 bg-primary hover:bg-primary-dark text-white font-bold h-12 rounded-lg shadow-sm hover:shadow-md transition-all active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:active:scale-100"
              >
                {isLoading ? (
                  <>
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
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
                    <span className="material-symbols-outlined text-lg">
                      arrow_forward
                    </span>
                  </>
                )}
              </button>
            </form>
            {/* Footer / Login Link */}
            <div className="flex flex-col items-center gap-4 mt-2">
              <p className="text-sm text-text-main dark:text-gray-300">
                Already have an account?{" "}
                <button
                  onClick={() => router.push("/login")}
                  className="font-bold text-primary hover:text-primary-dark ml-1"
                >
                  Log in
                </button>
              </p>
              <div className="w-full h-px bg-border-color dark:bg-[#3a1d1e]"></div>
              <div className="flex gap-6">
                <a
                  className="text-xs text-text-sub hover:text-primary transition-colors"
                  href="#"
                >
                  Help Center
                </a>
                <a
                  className="text-xs text-text-sub hover:text-primary transition-colors"
                  href="#"
                >
                  Contact Support
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
