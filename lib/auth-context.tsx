"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { api } from "./api";

interface AuthUser {
  id: string;
  email: string;
  username: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = typeof window !== "undefined" ? window.sessionStorage.getItem("wcc_token") : null;
    if (stored) {
      setToken(stored);
      api
        .get<{ user: AuthUser }>("/auth/me", stored)
        .then((res) => setUser(res.user))
        .catch(() => window.sessionStorage.removeItem("wcc_token"))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  function persist(newToken: string, newUser: AuthUser) {
    window.sessionStorage.setItem("wcc_token", newToken);
    setToken(newToken);
    setUser(newUser);
  }

  async function login(email: string, password: string) {
    const res = await api.post<{ token: string; user: AuthUser }>("/auth/login", { email, password });
    persist(res.token, res.user);
  }

  async function register(email: string, username: string, password: string) {
    const res = await api.post<{ token: string; user: AuthUser }>("/auth/register", {
      email,
      username,
      password,
    });
    persist(res.token, res.user);
  }

  function logout() {
    window.sessionStorage.removeItem("wcc_token");
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
