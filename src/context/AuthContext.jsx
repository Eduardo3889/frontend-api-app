import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { authService } from "../services/authService.js";
import { tokenStorage } from "../services/tokenStorage.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => tokenStorage.getToken());
  const [user, setUser] = useState(() => tokenStorage.getUser());
  const [loading, setLoading] = useState(Boolean(token));

  const logout = useCallback(() => {
    tokenStorage.clear();
    setToken(null);
    setUser(null);
  }, []);

  const login = useCallback(async (credentials) => {
    const data = await authService.login(credentials);
    tokenStorage.setToken(data.token);
    tokenStorage.setUser(data.user);
    setToken(data.token);
    setUser(data.user);
    return data.user;
  }, []);

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const profile = await authService.me();
        if (!active) return;
        const normalizedProfile = profile?.user || profile?.usuario || profile?.data || profile;
        if (normalizedProfile) {
          tokenStorage.setUser(normalizedProfile);
          setUser(normalizedProfile);
        }
      } catch (error) {
        if (error.status === 401 || error.status === 403) {
          logout();
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadProfile();
    return () => {
      active = false;
    };
  }, [logout, token]);

  useEffect(() => {
    window.addEventListener("auth:expired", logout);
    return () => window.removeEventListener("auth:expired", logout);
  }, [logout]);

  const value = useMemo(
    () => ({
      authenticated: Boolean(token),
      loading,
      login,
      logout,
      token,
      user
    }),
    [loading, login, logout, token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider.");
  }
  return context;
}
