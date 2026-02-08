"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";

export type UserRole = "seafarer" | "shipowner" | "admin";

// Seafarer profile from API
export interface SeafarerProfile {
  id: number;
  user_id: number;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: string;
  nationality: string;
  phone_number: string;
  address: string;
  state_province: string;
  city: string;
  rank: string;
  years_of_experience: number;
  profile_photo_url: string | null;
  application_status?: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  title?: string; // e.g., "Chief Officer", "Fleet Manager", "System Admin"
  accessToken?: string;
}

interface AuthContextType {
  user: User | null;
  profile: SeafarerProfile | null;
  isLoading: boolean;
  isProfileLoading: boolean;
  isHydrated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  fetchProfile: () => Promise<{ success: boolean; status?: number }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper function to decode JWT and extract role
function decodeJWT(
  token: string,
): { sub: string; role: string; exp: number } | null {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  // Store user and token in memory only (no localStorage)
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<SeafarerProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [isHydrated, setIsHydrated] = useState(true);
  const router = useRouter();

  // No localStorage hydration - rely on API for secure state
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Fetch seafarer profile from API
  const fetchProfile = async (): Promise<{
    success: boolean;
    status?: number;
  }> => {
    if (!user?.accessToken) {
      console.log("No token available, cannot fetch profile");
      return { success: false, status: 401 };
    }

    // Validate token is not expired
    const decodedToken = decodeJWT(user.accessToken);
    if (!decodedToken || decodedToken.exp * 1000 < Date.now()) {
      console.log("Token expired");
      logout();
      return { success: false, status: 401 };
    }

    setIsProfileLoading(true);
    try {
      const response = await fetch("/api/v1/seafarers/profile", {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${user.accessToken}`,
        },
      });

      if (response.ok) {
        const profileData: SeafarerProfile = await response.json();
        setProfile(profileData);

        // Update user name and avatar from profile
        const updatedUser = {
          ...user,
          name: `${profileData.first_name} ${profileData.last_name}`,
          avatar: profileData.profile_photo_url || user.avatar,
          title: profileData.rank,
        };
        setUser(updatedUser);
        return { success: true, status: response.status };
      } else {
        console.log(`Profile fetch failed with status: ${response.status}`);
        return { success: false, status: response.status };
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
      return { success: false };
    } finally {
      setIsProfileLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setIsLoading(false);
        throw new Error(data.detail || "Invalid email or password");
      }

      // Successfully logged in with API
      const { access_token } = data;

      // Decode JWT to get user role
      const decoded = decodeJWT(access_token);
      if (!decoded) {
        setIsLoading(false);
        throw new Error("Invalid authentication token");
      }

      // Normalize role from backend (ship_owner -> shipowner)
      let normalizedRole = decoded.role as string;
      if (normalizedRole === "ship_owner") {
        normalizedRole = "shipowner";
      }

      // Set proper name and title based on role
      let userName = email.split("@")[0]; // Default to email prefix
      let userTitle = undefined;

      if (normalizedRole === "admin") {
        userName = "Administrator";
        userTitle = "System Administrator";
      } else if (normalizedRole === "seafarer") {
        userName = email.split("@")[0];
      } else if (normalizedRole === "shipowner") {
        userName = email.split("@")[0];
        userTitle = "Fleet Manager";
      }

      // Create user object from token data
      const apiUser: User = {
        id: decoded.sub,
        name: userName,
        email: decoded.sub,
        role: normalizedRole as UserRole,
        title: userTitle,
        accessToken: access_token,
      };

      setUser(apiUser);
      setIsLoading(false);

      // Route based on role and check profile status
      if (apiUser.role === "shipowner") {
        // Check if we just created a profile (flag to prevent redirect loop)
        const profileJustCreated =
          typeof window !== "undefined"
            ? sessionStorage.getItem("shipowner_profile_created") === "true"
            : false;

        if (profileJustCreated) {
          // Just created profile, go to dashboard
          if (typeof window !== "undefined") {
            sessionStorage.removeItem("shipowner_profile_created");
          }
          router.push("/shipowner/dashboard");
          return;
        }

        // Check if shipowner has a profile
        try {
          const profileResponse = await fetch("/api/v1/profile", {
            method: "GET",
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${access_token}`,
            },
          });

          if (profileResponse.ok) {
            // Profile exists, proceed to dashboard
            router.push("/shipowner/dashboard");
          } else if (profileResponse.status === 404) {
            // No profile found, redirect to profile creation
            const profileData = await profileResponse.json();
            if (
              profileData.detail &&
              profileData.detail.includes("profile not found")
            ) {
              router.push("/shipowner/profile/create");
            } else {
              router.push("/shipowner/profile/create");
            }
          } else {
            // Other error, default to profile creation
            router.push("/shipowner/profile/create");
          }
        } catch (error) {
          console.error("Error checking shipowner profile:", error);
          // On error, redirect to profile creation to be safe
          router.push("/shipowner/profile/create");
        }
      } else if (apiUser.role === "seafarer") {
        // Check if seafarer has a profile before allowing dashboard access
        try {
          const profileResponse = await fetch("/api/v1/seafarers/profile", {
            method: "GET",
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${access_token}`,
            },
          });

          if (profileResponse.ok) {
            // Profile exists, proceed to dashboard
            router.push(`/${apiUser.role}/dashboard`);
          } else if (profileResponse.status === 404) {
            // No profile found, redirect to profile creation
            router.push("/profile/create");
          } else {
            // Other error occurred, still redirect to profile creation to be safe
            router.push("/profile/create");
          }
        } catch (error) {
          console.error("Error checking seafarer profile:", error);
          // On network error, redirect to profile creation to ensure completion
          router.push("/profile/create");
        }
      } else {
        router.push(`/${apiUser.role}/dashboard`);
      }
    } catch (error) {
      setIsLoading(false);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Login failed. Please try again.");
    }
  };

  const logout = () => {
    setUser(null);
    setProfile(null);
    // No localStorage to clear
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isLoading,
        isProfileLoading,
        isHydrated,
        login,
        logout,
        isAuthenticated: !!user,
        fetchProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Helper to get role-specific dashboard path
export function getRoleDashboard(role: UserRole): string {
  return `/${role}/dashboard`;
}
