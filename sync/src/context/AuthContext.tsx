"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { storage } from "@/lib/storage";

interface AuthContextType {
  token: string | null;
  userId: string | null;
  name: string | null;
  setAuth: (token: string, userId: string, name: string) => void;
  clearAuth: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = storage.getItem("token");
    const storedUserId = storage.getItem("userId");
    const storedName = storage.getItem("name");

    if (storedToken && storedUserId && storedName) {
      setToken(storedToken);
      setUserId(storedUserId);
      setName(storedName);
    }
  }, []);

  const setAuth = (newToken: string, newUserId: string, newName: string) => {
    storage.setItem("token", newToken);
    storage.setItem("userId", newUserId);
    storage.setItem("name", newName);
    setToken(newToken);
    setUserId(newUserId);
    setName(newName);
  };

  const clearAuth = () => {
    storage.clear();
    setToken(null);
    setUserId(null);
    setName(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        userId,
        name,
        setAuth,
        clearAuth,
        isAuthenticated: !!token,
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
