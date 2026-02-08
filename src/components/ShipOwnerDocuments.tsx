"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

interface DocumentData {
  id: string;
  filename: string;
  doc_type: string;
  status: 'pending' | 'approved' | 'rejected';
  uploaded_at: string;
  size: number;
  url?: string;
}

interface ShipOwnerDocumentsProps {
  compact?: boolean;
  showHeader?: boolean;
  maxItems?: number;
}

export default function ShipOwnerDocuments({
  compact = false,
  showHeader = true,
  maxItems
}: ShipOwnerDocumentsProps) {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<DocumentData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    if (!user?.accessToken) return;

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/v1/documents", {
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

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data: DocumentData[] = await response.json();
      console.log("Documents API response:", data);
      setDocuments(data);
    } catch (error) {
      console.error("Documents fetch error:", error);
      setError("Failed to load documents. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const formatFileSize = (bytes?: number | null): string => {
    if (bytes === undefined || bytes === null) return '—';
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    if (!isFinite(i) || i < 0) return '—';
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString?: string | null): string => {
    if (!dateString) return 'Unknown';
    const d = new Date(dateString);
    if (Number.isNaN(d.getTime())) return 'Unknown';
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-900/50';
      case 'pending':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-900/50';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-900/50';
      default:
        return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return 'check_circle';
      case 'pending':
        return 'schedule';
      case 'rejected':
        return 'cancel';
      default:
        return 'description';
    }
  };

  const handleDownload = (document: DocumentData) => {
    // In a real implementation, this would download the actual file
    // For now, just show an alert
    alert(`Downloading ${document.filename}`);
  };

  if (isLoading) {
    return (
      <div className={`bg-surface-light dark:bg-surface-dark p-6 rounded-xl border border-[#e8ebf3] dark:border-gray-800 ${compact ? 'p-4' : ''}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-48 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-slate-200 dark:bg-slate-700 rounded"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
                  <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-surface-light dark:bg-surface-dark p-6 rounded-xl border border-[#e8ebf3] dark:border-gray-800 ${compact ? 'p-4' : ''}`}>
        {showHeader && (
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-text-main dark:text-white">
              Company Documents
            </h3>
          </div>
        )}
        <div className="text-center py-8">
          <div className="text-6xl mb-4">📄</div>
          <p className="text-text-secondary mb-4">{error}</p>
          <button
            onClick={fetchDocuments}
            className="px-4 py-2 rounded-lg border border-[#d1d8e6] dark:border-slate-600 bg-surface-light dark:bg-surface-dark text-text-main dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const displayDocuments = maxItems ? documents.slice(0, maxItems) : documents;

  if (documents.length === 0) {
    return (
      <div className={`bg-surface-light dark:bg-surface-dark p-6 rounded-xl border border-[#e8ebf3] dark:border-gray-800 ${compact ? 'p-4' : ''}`}>
        {showHeader && (
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-text-main dark:text-white">
              Company Documents
            </h3>
          </div>
        )}
        <div className="text-center py-8">
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-lg font-bold text-text-main dark:text-white mb-2">
            No Documents Found
          </h3>
          <p className="text-text-secondary">
            Documents will appear here after you complete your company profile.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-surface-light dark:bg-surface-dark p-6 rounded-xl border border-[#e8ebf3] dark:border-gray-800 ${compact ? 'p-4' : ''}`}>
      {showHeader && (
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-text-main dark:text-white">
            Company Documents
          </h3>
          {!compact && (
            <span className="text-sm text-text-secondary">
              {documents.length} document{documents.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      )}

      <div className="space-y-3">
        {displayDocuments.map((document) => {
          const status = document.status ?? "pending";
          const statusLabel = status
            ? status.charAt(0).toUpperCase() + status.slice(1)
            : "Unknown";

          return (
            <div
              key={document.id}
              className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800/70 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-xl">description</span>
                  </div>

                  <div className="mt-2">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${getStatusColor(
                        status
                      )}`}
                    >
                      <span
                        className={`material-symbols-outlined text-sm mr-1 ${
                          status === "approved" ? "icon-fill" : ""
                        }`}
                      >
                        {getStatusIcon(status)}
                      </span>
                      {statusLabel}
                    </span>
                  </div>

                  <div className="flex items-center space-x-4 mt-3">
                    <p className="text-xs text-text-secondary">{document.doc_type}</p>
                    <p className="text-xs text-text-secondary">{formatFileSize(document.size)}</p>
                    <p className="text-xs text-text-secondary">Uploaded {formatDate(document.uploaded_at)}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleDownload(document)}
                  className="p-2 text-text-secondary hover:text-primary dark:hover:text-red-400 transition-colors"
                  title="Download"
                >
                  <span className="material-symbols-outlined text-lg">download</span>
                </button>
                {!compact && (
                  <button
                    className="p-2 text-text-secondary hover:text-primary dark:hover:text-red-400 transition-colors"
                    title="More options"
                  >
                    <span className="material-symbols-outlined text-lg">more_vert</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {maxItems && documents.length > maxItems && (
        <div className="mt-4 text-center">
          <button className="text-primary dark:text-red-400 hover:text-primary-light text-sm font-medium">
            View all {documents.length} documents →
          </button>
        </div>
      )}
    </div>
  );
}
