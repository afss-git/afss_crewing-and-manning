"use client";

import { useAuth } from "../context/AuthContext";

export default function AdminProfile() {
  const { user } = useAuth();

  if (!user || user.role !== "admin") {
    return null;
  }

  const displayName =
    user.name && user.name !== user.email.split("@")[0]
      ? user.name
      : user.email.split("@")[0];
  const displayTitle = user.title || "Administrator";

  // Generate dynamic profile image URL
  const profileImageUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=1F2937&color=fff&size=128`;

  return (
    <div className="p-4 border-t border-slate-200 dark:border-slate-800">
      <div className="flex items-center gap-3 px-2">
        <div
          className="size-10 rounded-full bg-cover bg-center border-2 border-white dark:border-slate-600"
          style={{ backgroundImage: `url('${profileImageUrl}')` }}
        ></div>
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
