"use client";

import { useAuth } from "../context/AuthContext";

export default function SeafarerSidebarProfile() {
  const { user } = useAuth();

  if (!user || user.role !== 'seafarer') {
    return null;
  }

  // Generate initials from name
  const getInitials = (name: string) => {
    if (name && name !== user.email.split('@')[0]) {
      return name.split(' ').map(n => n[0]).join('').toUpperCase();
    }
    return user.email.split('@')[0].substring(0, 2).toUpperCase();
  };

  const initials = getInitials(user.name);
  const displayName = user.name && user.name !== user.email.split('@')[0]
    ? user.name
    : user.email.split('@')[0];
  const displayTitle = user.title || 'Seafarer';

  return (
    <div className="p-4 border-t border-slate-200 dark:border-slate-800">
      <div className="flex items-center gap-3 px-2">
        <div className="size-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 font-semibold text-sm border-2 border-white dark:border-slate-600">
          {initials}
        </div>
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
