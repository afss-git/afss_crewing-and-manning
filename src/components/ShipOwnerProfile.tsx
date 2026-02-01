"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

interface ShipOwnerProfileData {
  id?: string;
  company_name: string;
  imo_number?: string;
  website?: string;
  hq_address: string;
  vessel_types: string;
  fleet_size: string;
  primary_trading_area: string;
  contact_full_name: string;
  contact_role: string;
  contact_email: string;
  contact_phone: string;
  document_1?: string;
  document_2?: string;
  document_3?: string;
  document_4?: string;
  created_at?: string;
  updated_at?: string;
}

interface ShipOwnerProfileProps {
  compact?: boolean;
  showEditButton?: boolean;
  onEditClick?: () => void;
}

export default function ShipOwnerProfile({
  compact = false,
  showEditButton = true,
  onEditClick
}: ShipOwnerProfileProps) {
  const { user } = useAuth();
  const [profile, setProfile] = useState<ShipOwnerProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    if (!user?.accessToken) return;

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/v1/profile", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 401) {
        setError("Authentication required. Please log in again.");
        return;
      }

      if (response.status === 404) {
        setError("Profile not found. Please complete your company profile.");
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to load profile");
      }

      const data = await response.json();
      setProfile(data);
    } catch (error) {
      console.error("Profile fetch error:", error);
      setError("Failed to load profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditClick = () => {
    if (onEditClick) {
      onEditClick();
    } else {
      // Default behavior: redirect to fleet details page
      window.location.href = "/shipowner/fleet-details";
    }
  };

  if (isLoading) {
    return (
      <div className={`bg-surface-light dark:bg-surface-dark p-6 rounded-xl border border-[#e8ebf3] dark:border-gray-800 ${compact ? 'p-4' : ''}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-48 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-surface-light dark:bg-surface-dark p-6 rounded-xl border border-[#e8ebf3] dark:border-gray-800 ${compact ? 'p-4' : ''}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-text-main dark:text-white">
            Company Profile
          </h3>
          {showEditButton && (
            <button
              onClick={handleEditClick}
              className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-light text-white text-sm font-medium transition-colors"
            >
              Complete Profile
            </button>
          )}
        </div>
        <div className="text-center py-8">
          <div className="text-6xl mb-4">📋</div>
          <p className="text-text-secondary mb-4">{error}</p>
          <button
            onClick={fetchProfile}
            className="px-4 py-2 rounded-lg border border-[#d1d8e6] dark:border-slate-600 bg-surface-light dark:bg-surface-dark text-text-main dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className={`bg-surface-light dark:bg-surface-dark p-6 rounded-xl border border-[#e8ebf3] dark:border-gray-800 ${compact ? 'p-4' : ''}`}>
        <div className="text-center py-8">
          <div className="text-6xl mb-4">🏢</div>
          <h3 className="text-lg font-bold text-text-main dark:text-white mb-2">
            No Profile Found
          </h3>
          <p className="text-text-secondary mb-4">
            Complete your company profile to get started
          </p>
          {showEditButton && (
            <button
              onClick={handleEditClick}
              className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-light text-white font-medium transition-colors"
            >
              Create Profile
            </button>
          )}
        </div>
      </div>
    );
  }

  if (compact) {
    return (
      <div className="bg-surface-light dark:bg-surface-dark p-4 rounded-xl border border-[#e8ebf3] dark:border-gray-800">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-bold text-text-main dark:text-white uppercase tracking-wider">
            Company Profile
          </h4>
          {showEditButton && (
            <button
              onClick={handleEditClick}
              className="text-primary dark:text-red-400 hover:text-primary-light text-sm font-medium"
            >
              Edit
            </button>
          )}
        </div>
        <div className="space-y-2">
          <p className="text-sm">
            <span className="text-text-secondary">Company:</span>{" "}
            <span className="font-medium text-text-main dark:text-white">
              {profile.company_name}
            </span>
          </p>
          <p className="text-sm">
            <span className="text-text-secondary">Fleet:</span>{" "}
            <span className="font-medium text-text-main dark:text-white">
              {profile.fleet_size} vessels
            </span>
          </p>
          <p className="text-sm">
            <span className="text-text-secondary">Contact:</span>{" "}
            <span className="font-medium text-text-main dark:text-white">
              {profile.contact_full_name}
            </span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-xl border border-[#e8ebf3] dark:border-gray-800">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-text-main dark:text-white">
          Company Profile
        </h3>
        {showEditButton && (
          <button
            onClick={handleEditClick}
            className="px-4 py-2 rounded-lg border border-[#d1d8e6] dark:border-slate-600 bg-surface-light dark:bg-surface-dark text-text-main dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-sm font-medium flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-lg">edit</span>
            Edit Profile
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Company Information */}
        <div>
          <h4 className="text-sm font-bold text-text-main dark:text-white uppercase tracking-wider mb-3">
            Company Details
          </h4>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-text-secondary uppercase tracking-wider">Company Name</p>
              <p className="font-medium text-text-main dark:text-white">{profile.company_name}</p>
            </div>
            {profile.imo_number && (
              <div>
                <p className="text-xs text-text-secondary uppercase tracking-wider">IMO Number</p>
                <p className="font-medium text-text-main dark:text-white font-mono">{profile.imo_number}</p>
              </div>
            )}
            {profile.website && (
              <div>
                <p className="text-xs text-text-secondary uppercase tracking-wider">Website</p>
                <p className="font-medium text-primary dark:text-red-400">
                  <a href={profile.website} target="_blank" rel="noopener noreferrer">
                    {profile.website}
                  </a>
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Fleet Information */}
        <div>
          <h4 className="text-sm font-bold text-text-main dark:text-white uppercase tracking-wider mb-3">
            Fleet Information
          </h4>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-text-secondary uppercase tracking-wider">Vessel Types</p>
              <p className="font-medium text-text-main dark:text-white">{profile.vessel_types}</p>
            </div>
            <div>
              <p className="text-xs text-text-secondary uppercase tracking-wider">Fleet Size</p>
              <p className="font-medium text-text-main dark:text-white">{profile.fleet_size}</p>
            </div>
            <div>
              <p className="text-xs text-text-secondary uppercase tracking-wider">Trading Area</p>
              <p className="font-medium text-text-main dark:text-white">{profile.primary_trading_area}</p>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div>
          <h4 className="text-sm font-bold text-text-main dark:text-white uppercase tracking-wider mb-3">
            Primary Contact
          </h4>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-text-secondary uppercase tracking-wider">Full Name</p>
              <p className="font-medium text-text-main dark:text-white">{profile.contact_full_name}</p>
            </div>
            <div>
              <p className="text-xs text-text-secondary uppercase tracking-wider">Role/Position</p>
              <p className="font-medium text-text-main dark:text-white">{profile.contact_role}</p>
            </div>
          </div>
        </div>

        {/* Contact Details */}
        <div>
          <h4 className="text-sm font-bold text-text-main dark:text-white uppercase tracking-wider mb-3">
            Contact Details
          </h4>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-text-secondary uppercase tracking-wider">Email</p>
              <p className="font-medium text-primary dark:text-red-400">
                <a href={`mailto:${profile.contact_email}`}>
                  {profile.contact_email}
                </a>
              </p>
            </div>
            <div>
              <p className="text-xs text-text-secondary uppercase tracking-wider">Phone</p>
              <p className="font-medium text-text-main dark:text-white">{profile.contact_phone}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Headquarters Address - Full Width */}
      <div className="mt-6 pt-6 border-t border-[#e8ebf3] dark:border-gray-800">
        <h4 className="text-sm font-bold text-text-main dark:text-white uppercase tracking-wider mb-3">
          Headquarters Address
        </h4>
        <p className="text-text-main dark:text-white whitespace-pre-line">{profile.hq_address}</p>
      </div>

      {/* Documents */}
      {(profile.document_1 || profile.document_2 || profile.document_3 || profile.document_4) && (
        <div className="mt-6 pt-6 border-t border-[#e8ebf3] dark:border-gray-800">
          <h4 className="text-sm font-bold text-text-main dark:text-white uppercase tracking-wider mb-3">
            Documents
          </h4>
          <div className="flex flex-wrap gap-2">
            {[profile.document_1, profile.document_2, profile.document_3, profile.document_4]
              .filter(Boolean)
              .map((doc, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg"
                >
                  <span className="material-symbols-outlined text-sm">description</span>
                  <span className="text-sm font-medium text-text-main dark:text-white">
                    Document {index + 1}
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
