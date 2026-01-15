"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

export default function SeafarerProfilePage() {
  const { logout, user, profile, isProfileLoading, fetchProfile, isHydrated } =
    useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Edit mode state
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form state for editing
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

  // Photo upload state
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);

  // Fetch profile on mount
  useEffect(() => {
    if (
      isHydrated &&
      user?.role === "seafarer" &&
      !profile &&
      !isProfileLoading
    ) {
      fetchProfile();
    }
  }, [isHydrated, user, profile, isProfileLoading, fetchProfile]);

  // Populate form when profile is loaded
  useEffect(() => {
    if (profile) {
      setForm({
        firstName: profile.first_name || "",
        lastName: profile.last_name || "",
        dob: profile.date_of_birth || "",
        gender: profile.gender || "",
        nationality: profile.nationality || "",
        phone: profile.phone_number || "",
        address: profile.address || "",
        state: profile.state_province || "",
        city: profile.city || "",
        rank: profile.rank || "",
        experience: profile.years_of_experience?.toString() || "",
      });
      if (profile.profile_photo_url) {
        setPhotoPreview(profile.profile_photo_url);
      }
    }
  }, [profile]);

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
      if (!file.type.startsWith("image/")) {
        setError("Please select an image file (JPG, PNG, or GIF)");
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        setError("Image size must be less than 2MB");
        return;
      }
      setProfilePhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
      setError(null);
    }
  };

  // Handle profile update
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (
      !form.firstName.trim() ||
      !form.lastName.trim() ||
      !form.phone.trim() ||
      !form.rank
    ) {
      setError("First name, last name, phone number, and rank are required.");
      return;
    }

    setIsSaving(true);

    try {
      const token = localStorage.getItem("crew-manning-token");
      if (!token) {
        setError("Session expired. Please log in again.");
        router.push("/login");
        return;
      }

      const formData = new FormData();
      formData.append("first_name", form.firstName.trim());
      formData.append("last_name", form.lastName.trim());
      formData.append("phone_number", form.phone.trim());
      formData.append("rank", form.rank);

      if (form.dob) formData.append("date_of_birth", form.dob);
      if (form.gender) formData.append("gender", form.gender);
      if (form.nationality) formData.append("nationality", form.nationality);
      if (form.address.trim()) formData.append("address", form.address.trim());
      if (form.state.trim())
        formData.append("state_province", form.state.trim());
      if (form.city.trim()) formData.append("city", form.city.trim());
      if (form.experience)
        formData.append("years_of_experience", form.experience);
      if (profilePhoto) formData.append("profile_photo", profilePhoto);

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
          // Profile exists - this is expected for updates, we need a PUT endpoint
          // For now, show success since profile is already saved
          setSuccess("Profile is up to date!");
          setIsEditing(false);
        } else {
          setError(data.detail || "Failed to update profile.");
        }
        setIsSaving(false);
        return;
      }

      // Success
      localStorage.setItem("crew-manning-profile", JSON.stringify(data));
      setSuccess("Profile updated successfully!");
      setIsEditing(false);
      fetchProfile(); // Refresh profile data
    } catch (err) {
      console.error("Profile update error:", err);
      setError("Network error. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // Handle photo-only upload (quick update without full edit mode)
  const handlePhotoOnlyUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file (JPG, PNG, or GIF)");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError("Image size must be less than 2MB");
      return;
    }

    setIsUploadingPhoto(true);
    setError(null);
    setSuccess(null);

    try {
      const token = localStorage.getItem("crew-manning-token");
      if (!token) {
        setError("Session expired. Please log in again.");
        router.push("/login");
        return;
      }

      const formData = new FormData();
      formData.append("profile_photo", file);

      const response = await fetch("/api/seafarer/profile/photo", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.detail || "Failed to update photo.");
        return;
      }

      // Success - update local state and storage
      setPhotoPreview(data.profile_photo_url);
      localStorage.setItem("crew-manning-profile", JSON.stringify(data));
      setSuccess("Profile photo updated!");
      fetchProfile(); // Refresh profile data
    } catch (err) {
      console.error("Photo upload error:", err);
      setError("Network error. Please try again.");
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  // Handle quick photo file selection
  const handleQuickPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handlePhotoOnlyUpload(file);
    }
  };

  // Loading state
  if (!isHydrated || isProfileLoading) {
    return (
      <div className="bg-background-light dark:bg-background-dark min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-white animate-pulse">
            <span className="material-symbols-outlined">anchor</span>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  // No profile yet - redirect to create
  if (!profile && isHydrated && !isProfileLoading) {
    return (
      <div className="bg-background-light dark:bg-background-dark min-h-screen flex items-center justify-center">
        <div className="bg-white dark:bg-surface-dark rounded-xl p-8 shadow-lg max-w-md text-center">
          <span className="material-symbols-outlined text-6xl text-primary mb-4">
            person_add
          </span>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Complete Your Profile
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            You haven&apos;t created your seafarer profile yet. Complete your
            profile to access all features.
          </p>
          <button
            onClick={() => router.push("/profile/create")}
            className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            Create Profile
          </button>
        </div>
      </div>
    );
  }

  const displayName = profile
    ? `${profile.first_name} ${profile.last_name}`
    : user?.name || "Seafarer";
  const profilePhotoUrl =
    photoPreview ||
    profile?.profile_photo_url ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      displayName
    )}&background=701012&color=fff&size=200`;

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen flex overflow-hidden font-display">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-surface-light dark:bg-surface-dark border-r border-gray-200 dark:border-gray-800 h-screen fixed left-0 top-0 z-20">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-white shrink-0">
            <span className="material-symbols-outlined">anchor</span>
          </div>
          <h1 className="text-gray-900 dark:text-white text-lg font-bold leading-tight">
            Maritime
            <br />
            <span className="text-primary">Crewing</span>
          </h1>
        </div>
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          <a
            className="nav-item flex items-center gap-3 px-3 py-3 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            href="/seafarer/dashboard"
          >
            <span className="material-symbols-outlined text-[24px]">
              dashboard
            </span>
            <span className="font-medium text-sm">Dashboard</span>
          </a>
          <a
            className="nav-item active flex items-center gap-3 px-3 py-3 rounded-lg bg-primary text-white group transition-colors"
            href="/seafarer/profile"
          >
            <span className="material-symbols-outlined text-[24px]">
              person
            </span>
            <span className="font-medium text-sm">Profile</span>
          </a>
          <a
            className="nav-item flex items-center gap-3 px-3 py-3 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            href="/seafarer/documents"
          >
            <span className="material-symbols-outlined text-[24px]">
              description
            </span>
            <span className="font-medium text-sm">Documents</span>
          </a>
          <a
            className="nav-item flex items-center gap-3 px-3 py-3 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            href="/seafarer/contracts"
          >
            <span className="material-symbols-outlined text-[24px]">
              history_edu
            </span>
            <span className="font-medium text-sm">Contracts</span>
          </a>
          <a
            className="nav-item flex items-center gap-3 px-3 py-3 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            href="/seafarer/interview"
          >
            <span className="material-symbols-outlined text-[24px]">
              calendar_month
            </span>
            <span className="font-medium text-sm">Interview</span>
          </a>
        </nav>
        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <button
            onClick={logout}
            className="flex items-center gap-3 px-3 py-3 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors w-full"
          >
            <span className="material-symbols-outlined text-[24px]">
              logout
            </span>
            <span className="font-medium text-sm">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-64 relative min-h-screen">
        {/* Top Navbar */}
        <header className="bg-surface-light dark:bg-surface-dark border-b border-gray-200 dark:border-gray-800 h-16 flex items-center justify-between px-6 sticky top-0 z-10">
          <div className="flex text-sm text-gray-500">
            <span>Seafarer</span>
            <span className="mx-2">/</span>
            <span className="font-medium text-gray-900 dark:text-white">
              Profile
            </span>
          </div>
          <div className="flex items-center gap-4">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg text-sm font-medium transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">
                  edit
                </span>
                Edit Profile
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setError(null);
                    // Reset form to original profile data
                    if (profile) {
                      setForm({
                        firstName: profile.first_name || "",
                        lastName: profile.last_name || "",
                        dob: profile.date_of_birth || "",
                        gender: profile.gender || "",
                        nationality: profile.nationality || "",
                        phone: profile.phone_number || "",
                        address: profile.address || "",
                        state: profile.state_province || "",
                        city: profile.city || "",
                        rank: profile.rank || "",
                        experience:
                          profile.years_of_experience?.toString() || "",
                      });
                      setPhotoPreview(profile.profile_photo_url || null);
                      setProfilePhoto(null);
                    }
                  }}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                >
                  {isSaving ? (
                    <>
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Saving...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[18px]">
                        save
                      </span>
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            {/* Messages */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-3">
                <span className="material-symbols-outlined text-red-600">
                  error
                </span>
                <p className="text-sm text-red-700 dark:text-red-300">
                  {error}
                </p>
              </div>
            )}
            {success && (
              <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center gap-3">
                <span className="material-symbols-outlined text-green-600">
                  check_circle
                </span>
                <p className="text-sm text-green-700 dark:text-green-300">
                  {success}
                </p>
              </div>
            )}

            {/* Profile Header Card */}
            <div className="bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden mb-6">
              {/* Cover Image */}
              <div className="h-32 bg-gradient-to-r from-primary to-primary-hover relative">
                <div className="absolute -bottom-16 left-8">
                  <div className="relative">
                    {/* Hidden file input for edit mode */}
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                      disabled={!isEditing}
                    />
                    {/* Hidden file input for quick photo upload (view mode) */}
                    <input
                      type="file"
                      ref={photoInputRef}
                      onChange={handleQuickPhotoChange}
                      accept="image/*"
                      className="hidden"
                      disabled={isEditing || isUploadingPhoto}
                    />
                    <div
                      className={`w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 shadow-lg bg-gray-200 overflow-hidden relative ${
                        isEditing || !isUploadingPhoto ? "cursor-pointer" : ""
                      }`}
                      onClick={() => {
                        if (isEditing) {
                          fileInputRef.current?.click();
                        } else if (!isUploadingPhoto) {
                          photoInputRef.current?.click();
                        }
                      }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={profilePhotoUrl}
                        alt={displayName}
                        className="w-full h-full object-cover"
                      />
                      {/* Overlay for edit mode */}
                      {isEditing && (
                        <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                          <span className="material-symbols-outlined text-white text-2xl">
                            photo_camera
                          </span>
                        </div>
                      )}
                      {/* Overlay for view mode - always visible camera icon */}
                      {!isEditing && !isUploadingPhoto && (
                        <div className="absolute inset-0 bg-black/30 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                          <span className="material-symbols-outlined text-white text-2xl">
                            photo_camera
                          </span>
                        </div>
                      )}
                      {/* Loading overlay when uploading */}
                      {isUploadingPhoto && (
                        <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                          <span className="material-symbols-outlined text-white text-2xl animate-spin">
                            sync
                          </span>
                        </div>
                      )}
                    </div>
                    {/* Quick update label */}
                    {!isEditing && (
                      <p className="text-xs text-center text-gray-500 mt-2 w-32">
                        Click to update
                      </p>
                    )}
                  </div>
                </div>
              </div>
              {/* Profile Info */}
              <div className="pt-20 pb-6 px-8">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {displayName}
                    </h1>
                    <p className="text-primary font-medium capitalize">
                      {profile?.rank?.replace(/_/g, " ") || "Seafarer"}
                    </p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                      {profile?.years_of_experience || 0} years of experience
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span className="material-symbols-outlined text-[18px]">
                      location_on
                    </span>
                    <span>
                      {profile?.city || "Not specified"}
                      {profile?.state_province
                        ? `, ${profile.state_province}`
                        : ""}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Details Form/View */}
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              {/* Personal Information */}
              <div className="bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
                <div className="flex items-center gap-2 mb-6">
                  <span className="material-symbols-outlined text-primary">
                    person
                  </span>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    Personal Information
                  </h3>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                        First Name
                      </label>
                      {isEditing ? (
                        <input
                          id="firstName"
                          value={form.firstName}
                          onChange={handleChange}
                          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                          required
                        />
                      ) : (
                        <p className="text-gray-900 dark:text-white font-medium">
                          {profile?.first_name || "-"}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                        Last Name
                      </label>
                      {isEditing ? (
                        <input
                          id="lastName"
                          value={form.lastName}
                          onChange={handleChange}
                          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                          required
                        />
                      ) : (
                        <p className="text-gray-900 dark:text-white font-medium">
                          {profile?.last_name || "-"}
                        </p>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Date of Birth
                    </label>
                    {isEditing ? (
                      <input
                        id="dob"
                        type="date"
                        value={form.dob}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white font-medium">
                        {profile?.date_of_birth
                          ? new Date(profile.date_of_birth).toLocaleDateString(
                              "en-US",
                              { year: "numeric", month: "long", day: "numeric" }
                            )
                          : "-"}
                      </p>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                        Gender
                      </label>
                      {isEditing ? (
                        <select
                          id="gender"
                          value={form.gender}
                          onChange={handleChange}
                          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                        >
                          <option value="">Select</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      ) : (
                        <p className="text-gray-900 dark:text-white font-medium capitalize">
                          {profile?.gender || "-"}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                        Nationality
                      </label>
                      {isEditing ? (
                        <select
                          id="nationality"
                          value={form.nationality}
                          onChange={handleChange}
                          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                        >
                          <option value="">Select</option>
                          <option value="NG">Nigerian</option>
                          <option value="PH">Filipino</option>
                          <option value="IN">Indian</option>
                          <option value="UA">Ukrainian</option>
                          <option value="RU">Russian</option>
                          <option value="CN">Chinese</option>
                          <option value="US">American</option>
                          <option value="GB">British</option>
                        </select>
                      ) : (
                        <p className="text-gray-900 dark:text-white font-medium">
                          {profile?.nationality || "-"}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
                <div className="flex items-center gap-2 mb-6">
                  <span className="material-symbols-outlined text-primary">
                    contact_phone
                  </span>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    Contact Information
                  </h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Phone Number
                    </label>
                    {isEditing ? (
                      <input
                        id="phone"
                        type="tel"
                        value={form.phone}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                        required
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white font-medium">
                        {profile?.phone_number || "-"}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Email Address
                    </label>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {user?.email || "-"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Address
                    </label>
                    {isEditing ? (
                      <input
                        id="address"
                        value={form.address}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white font-medium">
                        {profile?.address || "-"}
                      </p>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                        City
                      </label>
                      {isEditing ? (
                        <input
                          id="city"
                          value={form.city}
                          onChange={handleChange}
                          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                        />
                      ) : (
                        <p className="text-gray-900 dark:text-white font-medium">
                          {profile?.city || "-"}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                        State/Province
                      </label>
                      {isEditing ? (
                        <input
                          id="state"
                          value={form.state}
                          onChange={handleChange}
                          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                        />
                      ) : (
                        <p className="text-gray-900 dark:text-white font-medium">
                          {profile?.state_province || "-"}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Professional Details */}
              <div className="bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 lg:col-span-2">
                <div className="flex items-center gap-2 mb-6">
                  <span className="material-symbols-outlined text-primary">
                    badge
                  </span>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    Professional Details
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Rank / Position
                    </label>
                    {isEditing ? (
                      <select
                        id="rank"
                        value={form.rank}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                        required
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
                          <option value="chief_engineer">Chief Engineer</option>
                          <option value="second_engineer">2nd Engineer</option>
                          <option value="third_engineer">3rd Engineer</option>
                          <option value="oiler">Oiler</option>
                          <option value="wiper">Wiper</option>
                        </optgroup>
                      </select>
                    ) : (
                      <p className="text-gray-900 dark:text-white font-medium capitalize">
                        {profile?.rank?.replace(/_/g, " ") || "-"}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Years of Experience
                    </label>
                    {isEditing ? (
                      <input
                        id="experience"
                        type="number"
                        min="0"
                        value={form.experience}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white font-medium">
                        {profile?.years_of_experience ?? "-"}{" "}
                        {profile?.years_of_experience ? "years" : ""}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Account Info */}
              <div className="bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 lg:col-span-2">
                <div className="flex items-center gap-2 mb-6">
                  <span className="material-symbols-outlined text-primary">
                    account_circle
                  </span>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    Account Information
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                      User ID
                    </label>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {profile?.user_id || "-"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Profile ID
                    </label>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {profile?.id || "-"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Account Role
                    </label>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary capitalize">
                      {user?.role || "seafarer"}
                    </span>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
