import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { authApi } from "../services/authApi";
import {
  clearToken,
  getToken,
  setToken as persistToken,
  setUnauthorizedHandler,
} from "../services/api";

const AuthContext = createContext(null);

// The backend's JWT payload only contains { id, email } (see authController.js),
// so decoding it is how we recover the session's identity on page refresh
// before /user/me resolves.
function decodeToken(token) {
  try {
    const payload = token.split(".")[1];
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(decodeURIComponent(escape(json)));
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [token, setTokenState] = useState(() => getToken());
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  const logout = useCallback(() => {
    clearToken();
    setTokenState(null);
    setUser(null);
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(() => {
      clearToken();
      setTokenState(null);
      setUser(null);
    });
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      if (!token) {
        setInitializing(false);
        return;
      }

      const decoded = decodeToken(token);
      if (decoded) {
        setUser((prev) => prev || { id: decoded.id, email: decoded.email, name: null });
      }

      try {
        const res = await authApi.me();
        if (!cancelled && res?.data) {
          setUser(res.data);
        }
      } catch {
        // /user/me failing (e.g. expired token) already triggers the 401
        // handler above, which clears the session.
      } finally {
        if (!cancelled) setInitializing(false);
      }
    }

    init();
    return () => {
      cancelled = true;
    };
  }, [token]);

  const login = useCallback(async ({ email, password }) => {
    const res = await authApi.login({ email, password });
    const newToken = res.token;
    persistToken(newToken);
    setTokenState(newToken);
    const decoded = decodeToken(newToken);
    if (decoded) setUser({ id: decoded.id, email: decoded.email, name: null });
    return res;
  }, []);

  const signup = useCallback(async ({ name, email, password }) => {
    const res = await authApi.signup({ name, email, password });
    if (!res?.user) {
      // Backend returns { message } with no user/token on validation errors
      // (400-style responses that still come back with HTTP 200 in this API).
      throw new Error(res?.message || "Signup failed");
    }
    const newToken = res.user.token;
    persistToken(newToken);
    setTokenState(newToken);
    setUser({ id: res.user.id, name: res.user.name, email: res.user.email });
    return res;
  }, []);

  const value = {
    token,
    user,
    isAuthenticated: Boolean(token),
    initializing,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
