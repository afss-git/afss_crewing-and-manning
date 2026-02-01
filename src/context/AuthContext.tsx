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
  fetchProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// NOTE: removed demo/mock user fallback to require real backend auth

// Helper function to decode JWT and extract role
function decodeJWT(
  token: string
): { sub: string; role: string; exp: number } | null {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  // Initialize with null - will hydrate from localStorage in useEffect
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<SeafarerProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Start as loading until hydrated
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const router = useRouter();

  // Hydrate from localStorage after mount (client-side only)
  useEffect(() => {
    const storedUser = localStorage.getItem("crew-manning-user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("crew-manning-user");
      }
    }

    const storedProfile = localStorage.getItem("crew-manning-profile");
    if (storedProfile) {
      try {
        setProfile(JSON.parse(storedProfile));
      } catch {
        localStorage.removeItem("crew-manning-profile");
      }
    }

    setIsLoading(false);
    setIsHydrated(true);
  }, []);

  // Fetch seafarer profile from API
  const fetchProfile = async () => {
    const token = localStorage.getItem("crew-manning-token");
    if (!token) return;

    setIsProfileLoading(true);
    try {
      const response = await fetch("/api/seafarer/profile", {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const profileData: SeafarerProfile = await response.json();
        setProfile(profileData);
        localStorage.setItem(
          "crew-manning-profile",
          JSON.stringify(profileData)
        );

        // Update user name and avatar from profile
        if (user && profileData.first_name) {
          const updatedUser = {
            ...user,
            name: `${profileData.first_name} ${profileData.last_name}`,
            avatar: profileData.profile_photo_url || user.avatar,
            title: profileData.rank,
          };
          setUser(updatedUser);
          localStorage.setItem(
            "crew-manning-user",
            JSON.stringify(updatedUser)
          );
        }
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    } finally {
      setIsProfileLoading(false);
    }
  };

  // Fetch profile on mount if user is logged in as seafarer
  useEffect(() => {
    if (user?.role === "seafarer" && user.accessToken && !profile) {
      fetchProfile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.role, user?.accessToken]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);

    // No demo fallback: always use real API login

    // Try real API login
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
        userName = "Administrator"; // Professional admin name
        userTitle = "System Administrator";
      } else if (normalizedRole === "seafarer") {
        // Keep existing seafarer logic - name will be updated from profile later
        userName = email.split("@")[0];
      } else if (normalizedRole === "shipowner") {
        userName = email.split("@")[0]; // Could be enhanced later
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
      localStorage.setItem("crew-manning-user", JSON.stringify(apiUser));
      localStorage.setItem("crew-manning-token", access_token);
      setIsLoading(false);

      // Redirect based on role
      if (apiUser.role === "shipowner") {
        router.push("/shipowner/contract-type");
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
    localStorage.removeItem("crew-manning-user");
    localStorage.removeItem("crew-manning-token");
    localStorage.removeItem("crew-manning-profile");
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
