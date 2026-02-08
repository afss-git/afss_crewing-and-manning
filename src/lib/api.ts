// Centralized API configuration - NO TRAILING SPACES!
const API_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8000";

console.log("🔧 API Base URL:", API_BASE_URL); // Debug log

export const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  ENDPOINTS: {
    AUTH: {
      LOGIN: `${API_BASE_URL}/api/v1/auth/login`,
      ADMIN_LOGIN: `${API_BASE_URL}/api/v1/admin/login/admin`,
    },
    SEAFARERS: {
      LIST: `${API_BASE_URL}/api/v1/admin/seafarers`,
    },
  },
};

console.log("🔧 Seafarers endpoint:", API_CONFIG.ENDPOINTS.SEAFARERS.LIST); // Debug log

// Helper for authenticated requests
export async function fetchWithAuth(
  url: string,
  options: RequestInit = {},
): Promise<Response> {
  const token = localStorage.getItem("crew-manning-token");

  if (!token) {
    throw new Error("No authentication token found");
  }

  const headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
  };

  console.log("📡 fetchWithAuth - URL:", url);
  console.log("📡 fetchWithAuth - Headers:", {
    ...headers,
    Authorization: "Bearer ***", // Mask token in console
  });

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    console.log("📡 fetchWithAuth - Response status:", response.status);

    return response;
  } catch (error) {
    console.error("❌ fetchWithAuth - Network error:", error);
    throw error;
  }
}

// Helper for form-urlencoded requests
export function createFormData(data: Record<string, string>): URLSearchParams {
  const formData = new URLSearchParams();
  Object.entries(data).forEach(([key, value]) => {
    formData.append(key, value);
  });
  return formData;
}
