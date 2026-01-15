"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

export default function SeafarerProfileCreationPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    gender: "",
    nationality: "",
    phone: "",
    address: "",
    state: "",
    city: "",
    rank: "",
    experience: "",
  });

  // File upload state
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
    setError(null);
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("Please select an image file (JPG, PNG, or GIF)");
        return;
      }
      // Validate file size (2MB max)
      if (file.size > 2 * 1024 * 1024) {
        setError("Image size must be less than 2MB");
        return;
      }
      setProfilePhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
      setError(null);
    }
  };

  // Trigger file input click
  const handleChooseFile = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!form.firstName.trim()) {
      setError("First name is required");
      return;
    }
    if (!form.lastName.trim()) {
      setError("Last name is required");
      return;
    }
    if (!form.phone.trim()) {
      setError("Phone number is required");
      return;
    }
    if (!form.rank) {
      setError("Rank/Position is required");
      return;
    }

    setIsLoading(true);

    try {
      // Get token from localStorage
      const token = localStorage.getItem("crew-manning-token");
      if (!token) {
        setError(
          "You must be logged in to create a profile. Please log in again."
        );
        setIsLoading(false);
        return;
      }

      // Build FormData for multipart/form-data
      const formData = new FormData();
      formData.append("first_name", form.firstName.trim());
      formData.append("last_name", form.lastName.trim());
      formData.append("phone_number", form.phone.trim());
      formData.append("rank", form.rank);

      // Optional fields - only append if they have values
      if (form.dob) {
        formData.append("date_of_birth", form.dob);
      }
      if (form.gender) {
        formData.append("gender", form.gender);
      }
      if (form.nationality) {
        formData.append("nationality", form.nationality);
      }
      if (form.address.trim()) {
        formData.append("address", form.address.trim());
      }
      if (form.state.trim()) {
        formData.append("state_province", form.state.trim());
      }
      if (form.city.trim()) {
        formData.append("city", form.city.trim());
      }
      if (form.experience) {
        formData.append("years_of_experience", form.experience);
      }
      if (profilePhoto) {
        formData.append("profile_photo", profilePhoto);
      }

      const response = await fetch("/api/seafarer/profile/create", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        if (
          response.status === 400 &&
          data.detail === "Profile already exists"
        ) {
          setError(
            "A profile already exists for this account. Redirecting to dashboard..."
          );
          setTimeout(() => router.push("/seafarer/dashboard"), 2000);
          return;
        }
        if (response.status === 422 && Array.isArray(data.detail)) {
          const messages = data.detail
            .map((err: { msg: string }) => err.msg)
            .join(", ");
          setError(messages || "Validation error. Please check your input.");
        } else {
          setError(
            data.detail || "Failed to create profile. Please try again."
          );
        }
        setIsLoading(false);
        return;
      }

      // Success - update local storage with profile data and show modal
      localStorage.setItem("crew-manning-profile", JSON.stringify(data));
      setShowModal(true);
    } catch (err) {
      console.error("Profile creation error:", err);
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="font-display bg-background-light dark:bg-background-dark text-gray-900 dark:text-gray-100 antialiased overflow-x-hidden flex h-screen flex-col overflow-hidden">
        {/* Onboarding Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="relative z-10 w-full max-w-xl mx-auto">
              <div className="bg-white dark:bg-[#1a0b0c] rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-stone-100 dark:border-stone-800 overflow-hidden">
                {/* Status Banner/Image */}
                <div className="relative h-48 w-full bg-slate-100 dark:bg-slate-900 overflow-hidden">
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                      backgroundImage:
                        "url('https://lh3.googleusercontent.com/aida-public/AB6AXuB0yCzRULZdEZIUweUpVQK4r0fY5XGqP_ET31rviT8D74exMXOfPIPTq7ahM9JczWP0QKZtJ5UpPRyS9TSzkbsvdzicaSuzICETwyj9KPr0uLIgEWQte_q8qQYrJQ0GoGVoAX8LWq9Ty0-0BzdqxmXRw7xsnt9rIBQpbIa1EGWmPzLjAE8EJ8HiPjU6_MMrW69wKqqwiTfmGghGkQelCH388g5ZZ2J0DKXSObX8DGk6YwFKzccl3zx4IbCgv5n1u9r5yL9lOIj2EGMD')",
                    }}
                    data-alt="Ship captain viewing the ocean from the bridge"
                  ></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  {/* Success Badge */}
                  <div className="absolute bottom-[-24px] left-1/2 -translate-x-1/2 flex items-center justify-center size-14 bg-white dark:bg-[#2a1718] rounded-full shadow-lg border-4 border-white dark:border-[#1a0b0c]">
                    <span className="material-symbols-outlined text-green-600 text-3xl">
                      check_circle
                    </span>
                  </div>
                </div>
                {/* Card Content */}
                <div className="px-8 pt-10 pb-8 flex flex-col items-center text-center">
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                    Welcome Aboard, Captain!
                  </h1>
                  <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed max-w-sm mb-8">
                    Your seafarer profile is 100% complete. You can now browse
                    job openings, manage your documents, and apply for voyages.
                  </p>
                  <button
                    className="w-full max-w-xs flex items-center justify-center gap-2 bg-primary hover:bg-[#5a0d0f] text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg focus:ring-4 focus:ring-primary/20"
                    onClick={() => router.push("/seafarer/dashboard")}
                  >
                    <span>Go to Seafarer Dashboard</span>
                    <span className="material-symbols-outlined text-[20px]">
                      arrow_forward
                    </span>
                  </button>
                </div>
              </div>
              {/* Support Link */}
              <div className="mt-6 text-center">
                <a
                  className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-primary dark:text-slate-400 dark:hover:text-primary-300 transition-colors"
                  href="#"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    help
                  </span>
                  <span className="underline decoration-slate-300 underline-offset-4 hover:decoration-primary">
                    Need help? Contact Support
                  </span>
                </a>
              </div>
            </div>
          </div>
        )}
        {/* Top Navigation */}
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-gray-200 dark:border-gray-800 bg-white dark:bg-[#2a1718] px-10 py-3 z-20">
          <div className="flex items-center gap-4 text-[#1b0e0e] dark:text-white">
            <div className="size-8 text-primary">
              {/* SVG Logo */}
              <svg
                fill="currentColor"
                viewBox="0 0 48 48"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  clipRule="evenodd"
                  fillRule="evenodd"
                  d="M39.475 21.6262C40.358 21.4363 40.6863 21.5589 40.7581 21.5934C40.7876 21.655 40.8547 21.857 40.8082 22.3336C40.7408 23.0255 40.4502 24.0046 39.8572 25.2301C38.6799 27.6631 36.5085 30.6631 33.5858 33.5858C30.6631 36.5085 27.6632 38.6799 25.2301 39.8572C24.0046 40.4502 23.0255 40.7407 22.3336 40.8082C21.8571 40.8547 21.6551 40.7875 21.5934 40.7581C21.5589 40.6863 21.4363 40.358 21.6262 39.475C21.8562 38.4054 22.4689 36.9657 23.5038 35.2817C24.7575 33.2417 26.5497 30.9744 28.7621 28.762C30.9744 26.5497 33.2417 24.7574 35.2817 23.5037C36.9657 22.4689 38.4054 21.8562 39.475 21.6262ZM4.41189 29.2403L18.7597 43.5881C19.8813 44.7097 21.4027 44.9179 22.7217 44.7893C24.0585 44.659 25.5148 44.1631 26.9723 43.4579C29.9052 42.0387 33.2618 39.5667 36.4142 36.4142C39.5667 33.2618 42.0387 29.9052 43.4579 26.9723C44.1631 25.5148 44.659 24.0585 44.7893 22.7217C44.9179 21.4027 44.7097 19.8813 43.5881 18.7597L29.2403 4.41187C27.8527 3.02428 25.8765 3.02573 24.2861 3.36776C22.6081 3.72863 20.7334 4.58419 18.8396 5.74801C16.4978 7.18716 13.9881 9.18353 11.5858 11.5858C9.18354 13.988 7.18717 16.4978 5.74802 18.8396C4.58421 20.7334 3.72865 22.6081 3.36778 24.2861C3.02574 25.8765 3.02429 27.8527 4.41189 29.2403Z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-bold leading-tight tracking-[-0.015em]">
              Maritime Crewing
            </h2>
          </div>
          <div className="flex flex-1 justify-end gap-8 items-center">
            <label className="hidden md:flex flex-col min-w-40 !h-10 max-w-64">
              <div className="flex w-full flex-1 items-stretch rounded-lg h-full border border-gray-200 dark:border-gray-700 bg-background-light dark:bg-background-dark">
                <div className="text-gray-500 flex items-center justify-center pl-4 rounded-l-lg border-r-0">
                  <span className="material-symbols-outlined text-[20px]">
                    search
                  </span>
                </div>
                <input
                  className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-gray-900 dark:text-gray-100 focus:outline-0 focus:ring-0 border-none bg-transparent h-full placeholder:text-gray-500 px-4 rounded-l-none border-l-0 pl-2 text-sm font-normal leading-normal"
                  placeholder="Search vessels, crew..."
                />
              </div>
            </label>
            <div className="flex items-center gap-3">
              <button className="relative rounded-full p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <span className="material-symbols-outlined">notifications</span>
                <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary"></span>
              </button>
              <div
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border border-gray-200 dark:border-gray-700"
                style={{
                  backgroundImage:
                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCSXSwAv4AoIQjqgrvTD725C7zGy88YuyMDPDMCqNc_VVfuhT6AmDhgHkvojh-Tpok1YHE8hDYhqFYmsVtMWQ8CQI-G31CPYpWncNZCpjpEWmSOag6DamBO0EX4a9TRoZPfGmmIQ7XNFTD36RoGeqkx2hfIkSHnz0RV5uTZPi0T-Fus5gjCy0k_rcNQoBvPCcKlI2fJWEx6vnF9nVZl6i-u9WtA5Jrtji9q8sCrNCjSbNPHpAy0aKRhC-JYUQC5wFl9dL0KaQNXvi31")',
                }}
              ></div>
            </div>
          </div>
        </header>
        <div className="flex h-full overflow-hidden">
          {/* Side Navigation */}
          <nav className="hidden w-64 flex-col justify-between border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-[#2a1718] p-4 lg:flex overflow-y-auto">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col px-3">
                <h1 className="text-gray-900 dark:text-gray-100 text-lg font-bold leading-normal">
                  CrewManager
                </h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-normal leading-normal">
                  Admin Portal
                </p>
              </div>
              <div className="flex flex-col gap-1">
                <a
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
                  href="#"
                >
                  <span className="material-symbols-outlined text-[24px] text-gray-400 group-hover:text-primary dark:text-gray-500 dark:group-hover:text-primary transition-colors">
                    dashboard
                  </span>
                  <span className="text-sm font-medium leading-normal">
                    Dashboard
                  </span>
                </a>
                <a
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary/10 text-primary dark:text-primary-300"
                  href="#"
                >
                  <span className="material-symbols-outlined text-[24px] font-variation-fill">
                    group
                  </span>
                  <span className="text-sm font-medium leading-normal">
                    Seafarers
                  </span>
                </a>
                <a
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
                  href="#"
                >
                  <span className="material-symbols-outlined text-[24px] text-gray-400 group-hover:text-primary dark:text-gray-500 dark:group-hover:text-primary transition-colors">
                    directions_boat
                  </span>
                  <span className="text-sm font-medium leading-normal">
                    Vessels
                  </span>
                </a>
                <a
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
                  href="#"
                >
                  <span className="material-symbols-outlined text-[24px] text-gray-400 group-hover:text-primary dark:text-gray-500 dark:group-hover:text-primary transition-colors">
                    description
                  </span>
                  <span className="text-sm font-medium leading-normal">
                    Reports
                  </span>
                </a>
                <a
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
                  href="#"
                >
                  <span className="material-symbols-outlined text-[24px] text-gray-400 group-hover:text-primary dark:text-gray-500 dark:group-hover:text-primary transition-colors">
                    calendar_month
                  </span>
                  <span className="text-sm font-medium leading-normal">
                    Schedule
                  </span>
                </a>
              </div>
            </div>
            <div className="flex flex-col gap-1 border-t border-gray-100 dark:border-gray-800 pt-4">
              <a
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
                href="#"
              >
                <span className="material-symbols-outlined text-[24px] text-gray-400 group-hover:text-gray-600 dark:text-gray-500 dark:group-hover:text-gray-300 transition-colors">
                  settings
                </span>
                <span className="text-sm font-medium leading-normal">
                  Settings
                </span>
              </a>
              <a
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
                href="#"
              >
                <span className="material-symbols-outlined text-[24px] text-gray-400 group-hover:text-gray-600 dark:text-gray-500 dark:group-hover:text-gray-300 transition-colors">
                  help
                </span>
                <span className="text-sm font-medium leading-normal">
                  Support
                </span>
              </a>
            </div>
          </nav>
          {/* Main Content Area */}
          <main className="flex-1 overflow-auto bg-background-light dark:bg-background-dark p-6 md:p-10 scroll-smooth">
            <div className="mx-auto max-w-5xl">
              {/* Breadcrumbs */}
              <div className="mb-6 flex items-center gap-2 text-sm">
                <a
                  className="text-gray-500 hover:text-primary transition-colors"
                  href="#"
                >
                  Home
                </a>
                <span className="text-gray-400">/</span>
                <a
                  className="text-gray-500 hover:text-primary transition-colors"
                  href="#"
                >
                  Seafarers
                </a>
                <span className="text-gray-400">/</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  Create Profile
                </span>
              </div>
              {/* Page Header */}
              <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="flex flex-col gap-1">
                  <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                    Create Seafarer Profile
                  </h1>
                  <p className="text-gray-500 dark:text-gray-400 text-base">
                    Enter personal details and professional experience below to
                    register a new crew member.
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => router.back()}
                    disabled={isLoading}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary shadow-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    type="submit"
                    form="profile-form"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <svg
                          className="animate-spin h-4 w-4 text-white"
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
                        <span>Creating...</span>
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-[18px]">
                          save
                        </span>
                        <span>Create Profile</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
              {/* Error Message */}
              {error && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
                  <span className="material-symbols-outlined text-red-600 dark:text-red-400">
                    error
                  </span>
                  <p className="text-sm text-red-700 dark:text-red-300">
                    {error}
                  </p>
                </div>
              )}
              {/* Main Form Container */}
              <form
                id="profile-form"
                onSubmit={handleSubmit}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8"
              >
                {/* Left Column: Form Fields */}
                <div className="lg:col-span-8 flex flex-col gap-6">
                  {/* Personal Information Card */}
                  <div className="bg-white dark:bg-[#2a1718] rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2 bg-gray-50/50 dark:bg-white/5">
                      <span className="material-symbols-outlined text-primary text-[20px]">
                        person
                      </span>
                      <h3 className="text-base font-bold text-gray-900 dark:text-white">
                        Personal Information
                      </h3>
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                      <div className="col-span-1">
                        <label
                          htmlFor="first_name"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                          First Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="firstName"
                          value={form.firstName}
                          onChange={handleChange}
                          required
                          placeholder="e.g. Jonathan"
                          type="text"
                          className="w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm py-2.5"
                        />
                      </div>
                      <div className="col-span-1">
                        <label
                          htmlFor="last_name"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                          Last Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="lastName"
                          value={form.lastName}
                          onChange={handleChange}
                          required
                          placeholder="e.g. Doe"
                          type="text"
                          className="w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm py-2.5"
                        />
                      </div>
                      <div className="col-span-1">
                        <label
                          htmlFor="dob"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                          Date of Birth
                        </label>
                        <input
                          id="dob"
                          value={form.dob}
                          onChange={handleChange}
                          type="date"
                          className="w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm py-2.5"
                        />
                      </div>
                      <div className="col-span-1">
                        <label
                          htmlFor="gender"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                          Gender
                        </label>
                        <select
                          id="gender"
                          value={form.gender}
                          onChange={handleChange}
                          className="w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm py-2.5"
                        >
                          <option value="">Select gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div className="col-span-1">
                        <label
                          htmlFor="nationality"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                          Nationality
                        </label>
                        <select
                          id="nationality"
                          value={form.nationality}
                          onChange={handleChange}
                          className="w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm py-2.5"
                        >
                          <option value="">Select nationality</option>
                          <option value="philippines">Filipino</option>
                          <option value="india">Indian</option>
                          <option value="ukraine">Ukrainian</option>
                          <option value="russia">Russian</option>
                          <option value="china">Chinese</option>
                          <option value="usa">American</option>
                          <option value="uk">British</option>
                        </select>
                      </div>
                      <div className="col-span-1">
                        <label
                          htmlFor="phone"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                          Phone Number <span className="text-red-500">*</span>
                        </label>
                        <div className="flex rounded-md shadow-sm">
                          <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-3 text-gray-500 dark:text-gray-300 sm:text-sm">
                            +
                          </span>
                          <input
                            id="phone"
                            value={form.phone}
                            onChange={handleChange}
                            required
                            name="phone"
                            placeholder="1 (555) 987-6543"
                            type="tel"
                            className="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-primary focus:ring-primary sm:text-sm py-2.5"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Residence Card */}
                  <div className="bg-white dark:bg-[#2a1718] rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2 bg-gray-50/50 dark:bg-white/5">
                      <span className="material-symbols-outlined text-primary text-[20px]">
                        home_pin
                      </span>
                      <h3 className="text-base font-bold text-gray-900 dark:text-white">
                        Residence
                      </h3>
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                      <div className="col-span-1 md:col-span-2">
                        <label
                          htmlFor="address"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                          Residential Address
                        </label>
                        <input
                          id="address"
                          value={form.address}
                          onChange={handleChange}
                          placeholder="Street address, Apt, Suite"
                          type="text"
                          className="w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm py-2.5"
                        />
                      </div>
                      <div className="col-span-1">
                        <label
                          htmlFor="state"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                          State / Province
                        </label>
                        <input
                          id="state"
                          value={form.state}
                          onChange={handleChange}
                          placeholder="e.g. California"
                          type="text"
                          className="w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm py-2.5"
                        />
                      </div>
                      <div className="col-span-1">
                        <label
                          htmlFor="city"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                          City
                        </label>
                        <input
                          id="city"
                          value={form.city}
                          onChange={handleChange}
                          placeholder="e.g. San Francisco"
                          type="text"
                          className="w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm py-2.5"
                        />
                      </div>
                    </div>
                  </div>
                  {/* Professional Details Card */}
                  <div className="bg-white dark:bg-[#2a1718] rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2 bg-gray-50/50 dark:bg-white/5">
                      <span className="material-symbols-outlined text-primary text-[20px]">
                        badge
                      </span>
                      <h3 className="text-base font-bold text-gray-900 dark:text-white">
                        Professional Details
                      </h3>
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                      <div className="col-span-1">
                        <label
                          htmlFor="rank"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                          Rank / Position{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <select
                          id="rank"
                          value={form.rank}
                          onChange={handleChange}
                          required
                          className="w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm py-2.5"
                        >
                          <option value="">Select Rank</option>
                          <optgroup label="Deck Department">
                            <option value="master">Master / Captain</option>
                            <option value="chief_officer">Chief Officer</option>
                            <option value="second_officer">2nd Officer</option>
                            <option value="third_officer">3rd Officer</option>
                            <option value="deck_cadet">Deck Cadet</option>
                          </optgroup>
                          <optgroup label="Engine Department">
                            <option value="chief_engineer">
                              Chief Engineer
                            </option>
                            <option value="second_engineer">
                              2nd Engineer
                            </option>
                            <option value="oiler">Oiler</option>
                            <option value="wiper">Wiper</option>
                          </optgroup>
                        </select>
                      </div>
                      <div className="col-span-1">
                        <label
                          htmlFor="experience"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                          Years of Experience
                        </label>
                        <input
                          id="experience"
                          value={form.experience}
                          onChange={handleChange}
                          min="0"
                          placeholder="e.g. 5"
                          step="0.5"
                          type="number"
                          className="w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm py-2.5"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                {/* Right Column: Profile Picture & Helper */}
                <div className="lg:col-span-4 flex flex-col gap-6">
                  {/* Profile Photo Card */}
                  <div className="bg-white dark:bg-[#2a1718] rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-6 flex flex-col items-center text-center">
                    <h3 className="text-base font-bold text-gray-900 dark:text-white self-start mb-4">
                      Profile Photo
                    </h3>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                    />
                    <div
                      className="relative group cursor-pointer"
                      onClick={handleChooseFile}
                    >
                      <div className="w-40 h-40 rounded-full bg-gray-100 dark:bg-gray-700 border-4 border-white dark:border-gray-600 shadow-sm flex items-center justify-center overflow-hidden mb-4 relative">
                        {photoPreview ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={photoPreview}
                            alt="Profile preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="material-symbols-outlined text-gray-400 text-6xl group-hover:hidden">
                            add_a_photo
                          </span>
                        )}
                        <div className="absolute inset-0 bg-black/40 hidden group-hover:flex items-center justify-center transition-all">
                          <span className="material-symbols-outlined text-white text-3xl">
                            upload
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                      {profilePhoto ? (
                        <span className="text-green-600 dark:text-green-400 font-medium">
                          {profilePhoto.name}
                        </span>
                      ) : (
                        <>
                          Drag and drop or click to upload.
                          <br />
                          <span className="text-xs text-gray-400">
                            JPG, PNG or GIF (Max 2MB)
                          </span>
                        </>
                      )}
                    </p>
                    <button
                      className="w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-700 dark:text-white dark:ring-gray-600 dark:hover:bg-gray-600"
                      type="button"
                      onClick={handleChooseFile}
                    >
                      {profilePhoto ? "Change File" : "Choose File"}
                    </button>
                  </div>
                  {/* Helper Card */}
                  <div className="bg-primary/5 rounded-lg border border-primary/20 p-5">
                    <div className="flex items-start gap-3">
                      <span className="material-symbols-outlined text-primary mt-0.5">
                        info
                      </span>
                      <div>
                        <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-1">
                          Documentation Required
                        </h4>
                        <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                          After creating the profile, you will be prompted to
                          upload scanned copies of the seafarer&apos;s passport,
                          seamen&apos;s book, and competency certificates on the
                          next screen.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Bottom Action Bar (Mobile Sticky / Desktop Inline) */}
                <div className="lg:col-span-12 mt-8 pt-6 border-t border-gray-200 dark:border-gray-800 flex justify-end gap-4">
                  <button
                    className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700 disabled:opacity-50"
                    type="button"
                    onClick={() => router.back()}
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-6 py-2.5 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary shadow-lg shadow-primary/30 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <svg
                          className="animate-spin h-4 w-4 text-white"
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
                        <span>Creating Profile...</span>
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-[18px]">
                          check_circle
                        </span>
                        <span>Save & Create Profile</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
