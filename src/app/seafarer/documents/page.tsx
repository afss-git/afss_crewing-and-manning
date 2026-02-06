"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

// Document type definition
interface DocumentFile {
  file: File | null;
  preview: string | null;
  name: string;
  required: boolean;
  description: string;
  fieldName: string;
}

// Uploaded document from API
interface UploadedDocument {
  id: number;
  doc_type: string;
  custom_title: string | null;
  file_name: string;
  file_url: string;
  file_size: number;
  created_at: string;
}

// Document type display names
const DOC_TYPE_NAMES: Record<string, string> = {
  seaman_book: "Seaman's Book",
  stcw_basic_safety: "STCW Basic Safety",
  psc_lifeboat: "PSC/Lifeboat Certificate",
  coc_or_rating: "CoC/Rating Certificate",
  medical_fitness: "Medical Fitness Certificate",
  sea_service: "Sea Service Certificate",
  passport: "Passport",
};

// Required document types
const REQUIRED_DOC_TYPES = [
  "seaman_book",
  "stcw_basic_safety",
  "psc_lifeboat",
  "coc_or_rating",
  "medical_fitness",
  "sea_service",
];

// Helper function to de-duplicate documents by doc_type
// Keeps only the latest version (highest ID) of each document type
const deduplicateDocuments = (docs: UploadedDocument[]): UploadedDocument[] => {
  const docMap = new Map<string, UploadedDocument>();

  for (const doc of docs) {
    const key = doc.custom_title ? `custom_${doc.custom_title}` : doc.doc_type;
    const existing = docMap.get(key);

    // Keep the document with the higher ID (most recent)
    if (!existing || doc.id > existing.id) {
      docMap.set(key, doc);
    }
  }

  return Array.from(docMap.values());
};

export default function DocumentsPage() {
  const { logout, user, profile, isHydrated } = useAuth();
  const router = useRouter();

  // State for document uploads
  const [documents, setDocuments] = useState<Record<string, DocumentFile>>({
    seaman_book: {
      file: null,
      preview: null,
      name: "Seaman's Book",
      required: true,
      description: "Primary seafarer identity document",
      fieldName: "seaman_book",
    },
    stcw_basic_safety: {
      file: null,
      preview: null,
      name: "STCW Basic Safety",
      required: true,
      description: "Basic safety training certificate",
      fieldName: "stcw_basic_safety",
    },
    psc_lifeboat: {
      file: null,
      preview: null,
      name: "PSC/Lifeboat Certificate",
      required: true,
      description: "Proficiency in survival craft",
      fieldName: "psc_lifeboat",
    },
    coc_or_rating: {
      file: null,
      preview: null,
      name: "CoC/Rating Certificate",
      required: true,
      description: "Certificate of Competency or Rating",
      fieldName: "coc_or_rating",
    },
    medical_fitness: {
      file: null,
      preview: null,
      name: "Medical Fitness Certificate",
      required: true,
      description: "Medical fitness for sea duty",
      fieldName: "medical_fitness",
    },
    sea_service: {
      file: null,
      preview: null,
      name: "Sea Service Certificate",
      required: true,
      description: "Record of sea service experience",
      fieldName: "sea_service",
    },
    passport: {
      file: null,
      preview: null,
      name: "Passport",
      required: false,
      description: "International passport (optional)",
      fieldName: "passport",
    },
  });

  // Custom documents state
  const [customTitles, setCustomTitles] = useState<string[]>([]);
  const [customFiles, setCustomFiles] = useState<(File | null)[]>([]);
  const [newCustomTitle, setNewCustomTitle] = useState("");

  // Upload state
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Fetched documents state
  const [uploadedDocuments, setUploadedDocuments] = useState<
    UploadedDocument[]
  >([]);
  const [isLoadingDocuments, setIsLoadingDocuments] = useState(true);
  const [hasUploadedDocuments, setHasUploadedDocuments] = useState(false);

  // Show upload form state (allows user to switch to upload mode)
  const [showUploadForm, setShowUploadForm] = useState(false);

  // Document preview modal state
  const [previewDocument, setPreviewDocument] =
    useState<UploadedDocument | null>(null);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  // Fetch a document by its ID
  const fetchDocumentById = async (documentId: number) => {
    const token = localStorage.getItem("crew-manning-token");
    if (!token) {
      router.push("/login");
      return null;
    }
    setIsLoadingPreview(true);
    try {
      const response = await fetch(`/api/seafarer/documents/${documentId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      if (response.status === 401) {
        localStorage.removeItem("crew-manning-token");
        router.push("/login");
        return null;
      }
      if (response.ok) {
        const data = await response.json();
        return data.document || null;
      }
    } catch (err) {
      console.error("Error fetching document by ID:", err);
    } finally {
      setIsLoadingPreview(false);
    }
    return null;
  };

  // Single document update state
  const [updatingDoc, setUpdatingDoc] = useState<{
    id: number;
    doc_type: string;
  } | null>(null);
  const [isUpdatingSingle, setIsUpdatingSingle] = useState(false);
  const singleUpdateInputRef = useRef<HTMLInputElement | null>(null);

  // Edit document title state
  const [editingTitleDoc, setEditingTitleDoc] =
    useState<UploadedDocument | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [isUpdatingTitle, setIsUpdatingTitle] = useState(false);

  // Mobile sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // File input refs
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  // Check authentication on mount
  useEffect(() => {
    if (isHydrated) {
      const token = localStorage.getItem("crew-manning-token");
      if (!token || !user) {
        router.push("/login");
      }
    }
  }, [isHydrated, user, router]);

  // Fetch existing documents on mount
  useEffect(() => {
    const fetchDocuments = async () => {
      const token = localStorage.getItem("crew-manning-token");
      if (!token) return;

      setIsLoadingDocuments(true);
      try {
        const response = await fetch("/api/seafarer/documents", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        if (response.status === 401) {
          // Token expired or invalid - redirect to login
          localStorage.removeItem("crew-manning-token");
          router.push("/login");
          return;
        }

        if (response.ok) {
          const data = await response.json();
          if (data.documents && data.documents.length > 0) {
            // De-duplicate documents - keep only the latest version of each doc_type
            const deduplicatedDocs = deduplicateDocuments(data.documents);
            setUploadedDocuments(deduplicatedDocs);
            setHasUploadedDocuments(true);
          }
        }
      } catch (err) {
        console.error("Error fetching documents:", err);
      } finally {
        setIsLoadingDocuments(false);
      }
    };

    if (isHydrated && user) {
      fetchDocuments();
    }
  }, [isHydrated, user, router]);

  // Display values from profile
  const displayName = profile
    ? `${profile.first_name} ${profile.last_name}`
    : user?.email?.split("@")[0] || "Seafarer";
  const rankTitle = profile?.rank?.replace(/_/g, " ") || "Seafarer";
  const profilePhoto =
    profile?.profile_photo_url ||
    "https://ui-avatars.com/api/?name=" + encodeURIComponent(displayName);

  // Helper function to format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  // Helper function to format date
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get document display name
  const getDocumentName = (doc: UploadedDocument): string => {
    if (doc.custom_title) return doc.custom_title;
    return DOC_TYPE_NAMES[doc.doc_type] || doc.doc_type.replace(/_/g, " ");
  };

  // Handle file selection for a specific document type
  const handleFileSelect = (fieldName: string, file: File | null) => {
    if (!file) return;

    // Validate file type
    const validTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/jpg",
    ];
    if (!validTypes.includes(file.type)) {
      setError(
        `Invalid file type for ${documents[fieldName]?.name}. Please use PDF, JPG, or PNG.`
      );
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError(
        `File size too large for ${documents[fieldName]?.name}. Maximum 5MB allowed.`
      );
      return;
    }

    setDocuments((prev) => ({
      ...prev,
      [fieldName]: {
        ...prev[fieldName],
        file,
        preview: file.type.startsWith("image/")
          ? URL.createObjectURL(file)
          : null,
      },
    }));
    setError(null);
  };

  // Handle custom document addition
  const addCustomDocument = () => {
    if (!newCustomTitle.trim()) {
      setError("Please enter a title for the custom document");
      return;
    }
    if (customTitles.length >= 5) {
      setError("Maximum 5 custom documents allowed");
      return;
    }
    setCustomTitles([...customTitles, newCustomTitle.trim()]);
    setCustomFiles([...customFiles, null]);
    setNewCustomTitle("");
    setError(null);
  };

  // Handle custom file selection
  const handleCustomFileSelect = (index: number, file: File | null) => {
    if (!file) return;
    const newFiles = [...customFiles];
    newFiles[index] = file;
    setCustomFiles(newFiles);
  };

  // Remove custom document
  const removeCustomDocument = (index: number) => {
    setCustomTitles(customTitles.filter((_, i) => i !== index));
    setCustomFiles(customFiles.filter((_, i) => i !== index));
  };

  // Handle single document update
  const handleSingleDocumentUpdate = async (
    documentId: number,
    docType: string,
    file: File
  ) => {
    const token = localStorage.getItem("crew-manning-token");
    if (!token) {
      router.push("/login");
      return;
    }

    // Validate file type
    const validTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/jpg",
    ];
    if (!validTypes.includes(file.type)) {
      setError("Invalid file type. Please use PDF, JPG, or PNG.");
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError("File size too large. Maximum 5MB allowed.");
      return;
    }

    setIsUpdatingSingle(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("document_id", documentId.toString());
      formData.append("file", file);

      const response = await fetch("/api/seafarer/documents", {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.detail || "Failed to update document");
        return;
      }

      // Refresh documents list
      const refreshResponse = await fetch("/api/seafarer/documents", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (refreshResponse.ok) {
        const refreshData = await refreshResponse.json();
        if (refreshData.documents) {
          // De-duplicate documents - keep only the latest version of each doc_type
          const deduplicatedDocs = deduplicateDocuments(refreshData.documents);
          setUploadedDocuments(deduplicatedDocs);
        }
      }

      setSuccess(`${DOC_TYPE_NAMES[docType] || docType} updated successfully!`);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Update error:", err);
      setError("Network error. Please try again.");
    } finally {
      setIsUpdatingSingle(false);
      setUpdatingDoc(null);
    }
  };

  // Handle updating document title (for custom documents only)
  const handleUpdateDocumentTitle = async () => {
    if (!editingTitleDoc || !newTitle.trim()) {
      setError("Please enter a title");
      return;
    }

    const token = localStorage.getItem("crew-manning-token");
    if (!token) {
      router.push("/login");
      return;
    }

    setIsUpdatingTitle(true);
    setError(null);

    try {
      const response = await fetch("/api/seafarer/documents", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          document_id: editingTitleDoc.id,
          custom_title: newTitle.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.detail || "Failed to update document title");
        return;
      }

      // Refresh documents list
      const refreshResponse = await fetch("/api/seafarer/documents", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (refreshResponse.ok) {
        const refreshData = await refreshResponse.json();
        if (refreshData.documents) {
          const deduplicatedDocs = deduplicateDocuments(refreshData.documents);
          setUploadedDocuments(deduplicatedDocs);
        }
      }

      setSuccess("Document title updated successfully!");
      setTimeout(() => setSuccess(null), 3000);
      setEditingTitleDoc(null);
      setNewTitle("");
    } catch (err) {
      console.error("Update title error:", err);
      setError("Network error. Please try again.");
    } finally {
      setIsUpdatingTitle(false);
    }
  };

  // Check if all required documents are uploaded
  const allRequiredUploaded = Object.values(documents)
    .filter((doc) => doc.required)
    .every((doc) => doc.file !== null);

  // Check if all required documents already exist on server
  const allRequiredDocumentsOnServer = REQUIRED_DOC_TYPES.every((docType) =>
    uploadedDocuments.some((doc) => doc.doc_type === docType)
  );

  // Count uploaded files
  const uploadedCount = Object.values(documents).filter(
    (doc) => doc.file !== null
  ).length;
  const totalRequired = Object.values(documents).filter(
    (doc) => doc.required
  ).length;

  // Handle form submission
  const handleSubmit = async () => {
    setError(null);
    setSuccess(null);

    // Validate required documents
    const missingDocs = Object.values(documents)
      .filter((doc) => doc.required && !doc.file)
      .map((doc) => doc.name);

    if (missingDocs.length > 0) {
      setError(`Missing required documents: ${missingDocs.join(", ")}`);
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const token = localStorage.getItem("crew-manning-token");
      console.log("Token exists:", !!token); // Debug log

      if (!token) {
        setError("Session expired. Please log in again.");
        router.push("/login");
        return;
      }

      const formData = new FormData();

      // Add all document files
      Object.entries(documents).forEach(([key, doc]) => {
        if (doc.file) {
          formData.append(key, doc.file);
        }
      });

      // Add custom documents
      if (customTitles.length > 0) {
        formData.append("custom_titles", customTitles.join(","));
        customFiles.forEach((file) => {
          if (file) {
            formData.append("custom_files", file);
          }
        });
      }

      setUploadProgress(30);

      const response = await fetch("/api/seafarer/documents", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: formData,
      });

      setUploadProgress(80);

      const data = await response.json();

      if (!response.ok) {
        setError(data.detail || "Failed to upload documents");
        return;
      }

      setUploadProgress(100);
      setSuccess(
        "All documents uploaded successfully! They are now pending verification."
      );

      // Refresh the documents list
      const refreshResponse = await fetch("/api/seafarer/documents", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      if (refreshResponse.ok) {
        const refreshData = await refreshResponse.json();
        if (refreshData.documents && refreshData.documents.length > 0) {
          // De-duplicate documents - keep only the latest version of each doc_type
          const deduplicatedDocs = deduplicateDocuments(refreshData.documents);
          setUploadedDocuments(deduplicatedDocs);
          setHasUploadedDocuments(true);
        }
      }

      // Reset form after successful upload
      setTimeout(() => {
        setDocuments((prev) => {
          const reset = { ...prev };
          Object.keys(reset).forEach((key) => {
            reset[key] = { ...reset[key], file: null, preview: null };
          });
          return reset;
        });
        setCustomTitles([]);
        setCustomFiles([]);
      }, 2000);
    } catch (err) {
      console.error("Upload error:", err);
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsUploading(false);
    }
  };

  // Loading state
  if (!isHydrated) {
    return (
      <div className="bg-background-light dark:bg-background-dark min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-white animate-pulse">
            <span className="material-symbols-outlined">anchor</span>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen flex overflow-hidden font-display">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Desktop */}
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
            className="nav-item flex items-center gap-3 px-3 py-3 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            href="/seafarer/profile"
          >
            <span className="material-symbols-outlined text-[24px]">
              person
            </span>
            <span className="font-medium text-sm">Profile</span>
          </a>
          <a
            className="nav-item active flex items-center gap-3 px-3 py-3 rounded-lg bg-primary text-white group transition-colors"
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

      {/* Sidebar - Mobile */}
      <aside
        className={`lg:hidden flex flex-col w-64 bg-surface-light dark:bg-surface-dark border-r border-gray-200 dark:border-gray-800 h-screen fixed left-0 top-0 z-40 transform transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-white shrink-0">
              <span className="material-symbols-outlined">anchor</span>
            </div>
            <h1 className="text-gray-900 dark:text-white text-lg font-bold leading-tight">
              Maritime
              <br />
              <span className="text-primary">Crewing</span>
            </h1>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
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
            className="nav-item flex items-center gap-3 px-3 py-3 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            href="/seafarer/profile"
          >
            <span className="material-symbols-outlined text-[24px]">
              person
            </span>
            <span className="font-medium text-sm">Profile</span>
          </a>
          <a
            className="nav-item active flex items-center gap-3 px-3 py-3 rounded-lg bg-primary text-white group transition-colors"
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
            onClick={() => {
              setIsSidebarOpen(false);
              logout();
            }}
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
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden p-2 -ml-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <span className="material-symbols-outlined">menu</span>
          </button>
          <div className="hidden md:flex text-sm text-gray-500">
            <span>Documents</span>
            <span className="mx-2">/</span>
            <span className="font-medium text-gray-900 dark:text-white">
              Upload
            </span>
          </div>
          <div className="flex items-center gap-4 ml-auto">
            <div
              className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => router.push("/seafarer/profile")}
            >
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-gray-900 dark:text-white">
                  {displayName}
                </p>
                <p className="text-xs text-gray-500">{rankTitle}</p>
              </div>
              <div
                className="h-10 w-10 rounded-full bg-gray-200 bg-cover bg-center border-2 border-white dark:border-gray-700 shadow-sm"
                style={{ backgroundImage: `url('${profilePhoto}')` }}
              ></div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
          <div className="max-w-5xl mx-auto flex flex-col gap-8">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                  {allRequiredDocumentsOnServer
                    ? "My Documents"
                    : "Upload Documents"}
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mt-2">
                  {allRequiredDocumentsOnServer
                    ? "View and manage your uploaded maritime certification documents."
                    : "Upload all required maritime certification documents. All 6 mandatory documents must be submitted together."}
                </p>
              </div>
              {allRequiredDocumentsOnServer && !showUploadForm && (
                <button
                  onClick={() => setShowUploadForm(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg font-medium hover:bg-primary/20 transition-colors shrink-0"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    upload_file
                  </span>
                  Update Documents
                </button>
              )}
            </div>

            {/* Progress Indicator - Only show when uploading new documents */}
            {(!allRequiredDocumentsOnServer || showUploadForm) && (
              <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-6 border border-gray-200 dark:border-gray-800">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary">
                        folder_open
                      </span>
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white">
                        Upload Progress
                      </p>
                      <p className="text-sm text-gray-500">
                        {uploadedCount} of {Object.keys(documents).length}{" "}
                        documents selected
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">
                      {Math.round(
                        (uploadedCount / Object.keys(documents).length) * 100
                      )}
                      %
                    </p>
                    <p className="text-xs text-gray-500">Complete</p>
                  </div>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-500"
                    style={{
                      width: `${
                        (uploadedCount / Object.keys(documents).length) * 100
                      }%`,
                    }}
                  ></div>
                </div>
                {!allRequiredUploaded && (
                  <p className="text-sm text-orange-600 mt-3 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">
                      warning
                    </span>
                    {totalRequired -
                      Object.values(documents).filter(
                        (d) => d.required && d.file
                      ).length}{" "}
                    required documents remaining
                  </p>
                )}
              </div>
            )}

            {/* Error/Success Messages */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start gap-3">
                <span className="material-symbols-outlined text-red-600">
                  error
                </span>
                <p className="text-sm text-red-700 dark:text-red-300">
                  {error}
                </p>
              </div>
            )}
            {success && (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-start gap-3">
                <span className="material-symbols-outlined text-green-600">
                  check_circle
                </span>
                <p className="text-sm text-green-700 dark:text-green-300">
                  {success}
                </p>
              </div>
            )}

            {/* Uploaded Documents Section */}
            {isLoadingDocuments ? (
              <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-6 border border-gray-200 dark:border-gray-800">
                <div className="flex items-center justify-center gap-3 py-8">
                  <span className="material-symbols-outlined animate-spin text-primary">
                    sync
                  </span>
                  <p className="text-gray-500 dark:text-gray-400">
                    Loading your documents...
                  </p>
                </div>
              </div>
            ) : hasUploadedDocuments ? (
              <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                <div className="p-6 border-b border-gray-200 dark:border-gray-800 bg-green-50 dark:bg-green-900/20">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-green-600">
                      verified
                    </span>
                    Your Uploaded Documents
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {uploadedDocuments.length} document(s) on file
                  </p>
                </div>
                <div className="p-6">
                  {/* Hidden input for single document update */}
                  <input
                    type="file"
                    ref={singleUpdateInputRef}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file && updatingDoc) {
                        handleSingleDocumentUpdate(
                          updatingDoc.id,
                          updatingDoc.doc_type,
                          file
                        );
                      }
                      e.target.value = "";
                    }}
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="hidden"
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {uploadedDocuments.map((doc) => (
                      <div
                        key={doc.id}
                        className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-primary transition-colors group"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-primary">
                              {doc.file_name.endsWith(".pdf")
                                ? "picture_as_pdf"
                                : "image"}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 dark:text-white text-sm truncate">
                              {getDocumentName(doc)}
                            </p>
                            <p className="text-xs text-gray-500 truncate mt-0.5">
                              {doc.file_name}
                            </p>
                            <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                              <span>{formatFileSize(doc.file_size)}</span>
                              <span>•</span>
                              <span>{formatDate(doc.created_at)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="mt-3 flex gap-2">
                          <button
                            onClick={() => {
                              setPreviewDocument(doc);
                            }}
                            className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg text-xs font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                          >
                            <span className="material-symbols-outlined text-[16px]">
                              visibility
                            </span>
                            View
                          </button>
                          <button
                            onClick={() => {
                              setUpdatingDoc({
                                id: doc.id,
                                doc_type: doc.doc_type,
                              });
                              singleUpdateInputRef.current?.click();
                            }}
                            disabled={isUpdatingSingle}
                            className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 rounded-lg text-xs font-medium hover:bg-orange-200 dark:hover:bg-orange-900/40 transition-colors disabled:opacity-50"
                          >
                            <span className="material-symbols-outlined text-[16px]">
                              {isUpdatingSingle && updatingDoc?.id === doc.id
                                ? "sync"
                                : "upload"}
                            </span>
                            {isUpdatingSingle && updatingDoc?.id === doc.id
                              ? "Updating..."
                              : "Update"}
                          </button>
                          {/* Edit title button - only for custom documents */}
                          {doc.custom_title !== null && (
                            <button
                              onClick={() => {
                                setEditingTitleDoc(doc);
                                setNewTitle(doc.custom_title || "");
                              }}
                              className="flex items-center justify-center gap-1 px-3 py-1.5 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-lg text-xs font-medium hover:bg-blue-200 dark:hover:bg-blue-900/40 transition-colors"
                            >
                              <span className="material-symbols-outlined text-[16px]">
                                edit
                              </span>
                            </button>
                          )}
                          <a
                            href={doc.file_url}
                            download={doc.file_name}
                            className="flex items-center justify-center gap-1 px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-xs font-medium hover:bg-primary/20 transition-colors"
                          >
                            <span className="material-symbols-outlined text-[16px]">
                              download
                            </span>
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}

            {/* Required Documents Section - Only show when uploading */}
            {(!allRequiredDocumentsOnServer || showUploadForm) && (
              <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                <div className="p-6 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-red-600">
                      priority_high
                    </span>
                    {showUploadForm
                      ? "Update Required Documents"
                      : "Required Documents"}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {showUploadForm
                      ? "Select new files to replace your existing documents"
                      : "All 6 documents below are mandatory for your application"}
                  </p>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(documents)
                    .filter(([, doc]) => doc.required)
                    .map(([key, doc]) => (
                      <div
                        key={key}
                        className={`border-2 border-dashed rounded-xl p-4 transition-all ${
                          doc.file
                            ? "border-green-400 bg-green-50 dark:bg-green-900/10"
                            : "border-gray-300 dark:border-gray-600 hover:border-primary"
                        }`}
                      >
                        <input
                          type="file"
                          ref={(el) => {
                            fileInputRefs.current[key] = el;
                          }}
                          onChange={(e) =>
                            handleFileSelect(key, e.target.files?.[0] || null)
                          }
                          accept=".pdf,.jpg,.jpeg,.png"
                          className="hidden"
                        />
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span
                                className={`material-symbols-outlined ${
                                  doc.file ? "text-green-600" : "text-gray-400"
                                }`}
                              >
                                {doc.file ? "check_circle" : "upload_file"}
                              </span>
                              <p className="font-bold text-gray-900 dark:text-white text-sm">
                                {doc.name}
                                <span className="text-red-500 ml-1">*</span>
                              </p>
                            </div>
                            <p className="text-xs text-gray-500 mt-1 ml-8">
                              {doc.description}
                            </p>
                            {doc.file && (
                              <p className="text-xs text-green-600 mt-2 ml-8 flex items-center gap-1">
                                <span className="material-symbols-outlined text-[14px]">
                                  attach_file
                                </span>
                                {doc.file.name}
                              </p>
                            )}
                          </div>
                          <button
                            onClick={() => fileInputRefs.current[key]?.click()}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                              doc.file
                                ? "bg-green-100 text-green-700 hover:bg-green-200"
                                : "bg-primary text-white hover:bg-primary-hover"
                            }`}
                          >
                            {doc.file ? "Replace" : "Select"}
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Optional Documents Section - Only show when uploading */}
            {(!allRequiredDocumentsOnServer || showUploadForm) && (
              <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                <div className="p-6 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-blue-600">
                      add_circle
                    </span>
                    Optional Documents
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Additional documents that may support your application
                  </p>
                </div>
                <div className="p-6 space-y-4">
                  {/* Passport */}
                  {Object.entries(documents)
                    .filter(([, doc]) => !doc.required)
                    .map(([key, doc]) => (
                      <div
                        key={key}
                        className={`border-2 border-dashed rounded-xl p-4 transition-all ${
                          doc.file
                            ? "border-green-400 bg-green-50 dark:bg-green-900/10"
                            : "border-gray-300 dark:border-gray-600 hover:border-primary"
                        }`}
                      >
                        <input
                          type="file"
                          ref={(el) => {
                            fileInputRefs.current[key] = el;
                          }}
                          onChange={(e) =>
                            handleFileSelect(key, e.target.files?.[0] || null)
                          }
                          accept=".pdf,.jpg,.jpeg,.png"
                          className="hidden"
                        />
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span
                                className={`material-symbols-outlined ${
                                  doc.file ? "text-green-600" : "text-gray-400"
                                }`}
                              >
                                {doc.file ? "check_circle" : "upload_file"}
                              </span>
                              <p className="font-bold text-gray-900 dark:text-white text-sm">
                                {doc.name}
                              </p>
                            </div>
                            <p className="text-xs text-gray-500 mt-1 ml-8">
                              {doc.description}
                            </p>
                            {doc.file && (
                              <p className="text-xs text-green-600 mt-2 ml-8 flex items-center gap-1">
                                <span className="material-symbols-outlined text-[14px]">
                                  attach_file
                                </span>
                                {doc.file.name}
                              </p>
                            )}
                          </div>
                          <button
                            onClick={() => fileInputRefs.current[key]?.click()}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                              doc.file
                                ? "bg-green-100 text-green-700 hover:bg-green-200"
                                : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
                            }`}
                          >
                            {doc.file ? "Replace" : "Select"}
                          </button>
                        </div>
                      </div>
                    ))}

                  {/* Custom Documents */}
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                    <p className="font-medium text-gray-900 dark:text-white mb-3">
                      Custom Documents (up to 5)
                    </p>
                    <div className="flex gap-2 mb-4">
                      <input
                        type="text"
                        value={newCustomTitle}
                        onChange={(e) => setNewCustomTitle(e.target.value)}
                        placeholder="Enter document title (e.g., Flag State License)"
                        className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm"
                      />
                      <button
                        onClick={addCustomDocument}
                        disabled={customTitles.length >= 5}
                        className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Add
                      </button>
                    </div>
                    {customTitles.map((title, index) => (
                      <div
                        key={index}
                        className={`border-2 border-dashed rounded-xl p-4 mb-3 transition-all ${
                          customFiles[index]
                            ? "border-green-400 bg-green-50 dark:bg-green-900/10"
                            : "border-gray-300 dark:border-gray-600"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <p className="font-bold text-gray-900 dark:text-white text-sm">
                              {title}
                            </p>
                            {customFiles[index] && (
                              <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                                <span className="material-symbols-outlined text-[14px]">
                                  attach_file
                                </span>
                                {customFiles[index]?.name}
                              </p>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <input
                              type="file"
                              id={`custom-file-${index}`}
                              onChange={(e) =>
                                handleCustomFileSelect(
                                  index,
                                  e.target.files?.[0] || null
                                )
                              }
                              accept=".pdf,.jpg,.jpeg,.png"
                              className="hidden"
                            />
                            <label
                              htmlFor={`custom-file-${index}`}
                              className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg text-sm font-medium cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600"
                            >
                              {customFiles[index] ? "Replace" : "Select"}
                            </label>
                            <button
                              onClick={() => removeCustomDocument(index)}
                              className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                            >
                              <span className="material-symbols-outlined text-[18px]">
                                delete
                              </span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button - Only show when uploading */}
            {(!allRequiredDocumentsOnServer || showUploadForm) && (
              <div className="flex flex-col sm:flex-row gap-4 justify-end">
                <button
                  onClick={() => {
                    if (showUploadForm) {
                      setShowUploadForm(false);
                      // Reset the form
                      setDocuments((prev) => {
                        const reset = { ...prev };
                        Object.keys(reset).forEach((key) => {
                          reset[key] = {
                            ...reset[key],
                            file: null,
                            preview: null,
                          };
                        });
                        return reset;
                      });
                      setCustomTitles([]);
                      setCustomFiles([]);
                    } else {
                      router.push("/seafarer/dashboard");
                    }
                  }}
                  className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!allRequiredUploaded || isUploading}
                  className="px-8 py-3 bg-primary text-white rounded-lg font-bold hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
                >
                  {isUploading ? (
                    <>
                      <span className="material-symbols-outlined animate-spin text-[20px]">
                        sync
                      </span>
                      Uploading... {uploadProgress}%
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[20px]">
                        cloud_upload
                      </span>
                      Upload All Documents
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Info Box - Only show when uploading */}
            {(!allRequiredDocumentsOnServer || showUploadForm) && (
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-5 border border-blue-100 dark:border-blue-800 flex gap-4">
                <span className="material-symbols-outlined text-blue-600 shrink-0">
                  info
                </span>
                <div>
                  <p className="font-bold text-gray-900 dark:text-white mb-1">
                    Verification Process
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Once uploaded, your documents will be reviewed by our
                    crewing team. Verification usually takes 1-2 business days.
                    You&apos;ll receive a notification once your documents are
                    approved.
                  </p>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Document Preview Modal */}
      {previewDocument && (
        <div
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
          onClick={() => setPreviewDocument(null)}
        >
          <div
            className="bg-white dark:bg-gray-900 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary">
                    {previewDocument.file_name.endsWith(".pdf")
                      ? "picture_as_pdf"
                      : "image"}
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white">
                    {getDocumentName(previewDocument)}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {previewDocument.file_name} •{" "}
                    {formatFileSize(previewDocument.file_size)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={previewDocument.file_url}
                  download={previewDocument.file_name}
                  className="flex items-center gap-1 px-3 py-2 bg-primary/10 text-primary rounded-lg text-sm font-medium hover:bg-primary/20 transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    download
                  </span>
                  Download
                </a>
                <button
                  onClick={() => setPreviewDocument(null)}
                  className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-4 bg-gray-100 dark:bg-gray-800 overflow-auto max-h-[calc(90vh-80px)]">
              {isLoadingPreview ? (
                <div className="flex items-center justify-center h-[70vh]">
                  <span className="material-symbols-outlined animate-spin text-primary text-4xl">
                    sync
                  </span>
                </div>
              ) : previewDocument.file_name.toLowerCase().endsWith(".pdf") ? (
                <iframe
                  src={previewDocument.file_url}
                  className="w-full h-[70vh] rounded-lg border-0"
                  title={getDocumentName(previewDocument)}
                />
              ) : (
                <div className="flex items-center justify-center">
                  <Image
                    src={previewDocument.file_url}
                    alt={getDocumentName(previewDocument)}
                    className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-lg"
                    width={1200}
                    height={900}
                    unoptimized
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Edit Document Title Modal */}
      {editingTitleDoc && (
        <div
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
          onClick={() => {
            setEditingTitleDoc(null);
            setNewTitle("");
          }}
        >
          <div
            className="bg-white dark:bg-gray-900 rounded-xl max-w-md w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">
                  edit
                </span>
                Edit Document Title
              </h3>
              <button
                onClick={() => {
                  setEditingTitleDoc(null);
                  setNewTitle("");
                }}
                className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <p className="text-sm text-gray-500 mb-4">
                Update the title for your custom document. Standard documents
                cannot be renamed.
              </p>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Document Title
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Enter new document title"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => {
                    setEditingTitleDoc(null);
                    setNewTitle("");
                  }}
                  className="px-4 py-2 text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateDocumentTitle}
                  disabled={isUpdatingTitle || !newTitle.trim()}
                  className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isUpdatingTitle ? (
                    <>
                      <span className="material-symbols-outlined animate-spin text-[18px]">
                        sync
                      </span>
                      Saving...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[18px]">
                        check
                      </span>
                      Save
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
