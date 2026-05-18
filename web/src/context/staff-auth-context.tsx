"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  role: "staff" | "admin";
};

type AuthState = {
  token: string | null;
  user: AuthUser | null;
  /** True after client session has been read from storage. */
  authReady: boolean;
  setSession: (token: string, user: AuthUser) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthState | null>(null);
const TOKEN_KEY = "bd_staff_token";
const USER_KEY = "bd_staff_user";

function readStoredAuth(): { token: string | null; user: AuthUser | null } {
  if (typeof window === "undefined") {
    return { token: null, user: null };
  }
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    const rawUser = localStorage.getItem(USER_KEY);
    if (!rawUser) {
      if (token) localStorage.removeItem(TOKEN_KEY);
      return { token: null, user: null };
    }
    const user = JSON.parse(rawUser) as AuthUser;
    if (!token || !user?.id || !user?.email) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      return { token: null, user: null };
    }
    return { token, user };
  } catch {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    return { token: null, user: null };
  }
}

type SessionState = {
  token: string | null;
  user: AuthUser | null;
  authReady: boolean;
};

export function StaffAuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<SessionState>({
    token: null,
    user: null,
    authReady: false,
  });

  const hydrate = useCallback(() => {
    const stored = readStoredAuth();
    setSession({ ...stored, authReady: true });
  }, []);

  useLayoutEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    const failSafe = window.setTimeout(() => {
      setSession((prev) => (prev.authReady ? prev : { ...readStoredAuth(), authReady: true }));
    }, 300);
    return () => window.clearTimeout(failSafe);
  }, []);

  const setSessionFn = useCallback((t: string, u: AuthUser) => {
    localStorage.setItem(TOKEN_KEY, t);
    localStorage.setItem(USER_KEY, JSON.stringify(u));
    setSession({ token: t, user: u, authReady: true });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setSession({ token: null, user: null, authReady: true });
  }, []);

  const value = useMemo(
    () => ({
      token: session.token,
      user: session.user,
      authReady: session.authReady,
      setSession: setSessionFn,
      logout,
    }),
    [session, setSessionFn, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useStaffAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useStaffAuth must be used within StaffAuthProvider");
  return ctx;
}
