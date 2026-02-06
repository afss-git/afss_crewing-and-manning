"use client";

import Image from "next/image";
import { useAuth } from "@/context/AuthContext";

// Helper function to get profile image URL
const getProfileImageUrl = (profilePhotoUrl: string | null) => {
  if (!profilePhotoUrl) {
    return "/images/default-user-avatar.svg"; // Fallback
  }

  // If it's already a full URL, use it
  if (profilePhotoUrl.startsWith("http")) {
    return profilePhotoUrl;
  }

  // If it's just a filename/path, construct the public R2 URL
  return `https://pub-27c3417763044ae78c1b2975fa3cfdea.r2.dev/${profilePhotoUrl}`;
};

export default function SeafarerSidebarProfile() {
  const { user, profile } = useAuth();

  if (!user || user.role !== "seafarer") {
    return null;
  }

  // Generate initials from name
  const getInitials = (name: string) => {
    if (name && name !== user.email.split("@")[0]) {
      return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase();
    }
    return user.email.split("@")[0].substring(0, 2).toUpperCase();
  };

  const initials = getInitials(user.name);
  const displayName =
    user.name && user.name !== user.email.split("@")[0]
      ? user.name
      : user.email.split("@")[0];
  const displayTitle = user.title || "Seafarer";

  return (
    <div className="p-4 border-t border-slate-200 dark:border-slate-800">
      <div className="flex items-center gap-3 px-2">
        {profile?.profile_photo_url ? (
          <Image
            src={getProfileImageUrl(profile.profile_photo_url)}
            alt="Profile"
            width={40}
            height={40}
            className="size-10 rounded-full object-cover border-2 border-white dark:border-slate-600"
            onError={(e) => {
              e.currentTarget.src = "/images/default-user-avatar.svg";
            }}
          />
        ) : (
          <div className="size-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 font-semibold text-sm border-2 border-white dark:border-slate-600">
            {initials}
          </div>
        )}
        <div className="flex flex-col min-w-0 flex-1">
          <p className="text-slate-900 dark:text-white text-sm font-semibold truncate">
            {displayName}
          </p>
          <p className="text-slate-500 dark:text-slate-400 text-xs truncate">
            {displayTitle}
          </p>
        </div>
      </div>
    </div>
  );
}
