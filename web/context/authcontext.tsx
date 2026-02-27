"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { authService } from "@/lib/services/auth.service";
import type { UserResponse } from "@/lib/types/auth";

interface AuthContextType {
  user: UserResponse | null;
  isLoggedIn: boolean;
  displayName: string;
  setUser: (user: UserResponse) => void;
  clearUser: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<UserResponse | null>(null);

  useEffect(() => {
    // Initialise auth state from localStorage on mount
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    const stored = authService.getUser();
    if (stored) {
      setUserState(stored);
    } else {
      // Fallback: decode the JWT subject to get a display hint
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUserState({ email: payload.sub } as UserResponse);
      } catch {
        // ignore malformed token
      }
    }
  }, []);

  const setUser = useCallback((newUser: UserResponse) => {
    setUserState(newUser);
  }, []);

  const clearUser = useCallback(() => {
    setUserState(null);
  }, []);

  const displayName = user
    ? (user as any).firstName
      ? `${(user as any).firstName} ${(user as any).lastName ?? ""}`.trim()
      : user.fullName || user.email || "Account"
    : "";

  return (
    <AuthContext.Provider
      value={{ user, isLoggedIn: !!user, displayName, setUser, clearUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuthContext must be used inside <AuthProvider>");
  }
  return ctx;
}
