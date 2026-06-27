/* eslint-disable react-refresh/only-export-components, react-hooks/set-state-in-effect */
import { createContext, useEffect, useState } from "react";
import apiClient, { setAccessToken, setRefreshToken, getRefreshToken } from "../api/axios";
import { API_ENDPOINTS } from "../constants/api";

import type { User, AuthContextType } from "../types";

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const initAuth = async () => {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      setIsLoading(false);
      return;
    }

    try {
      // 1. Refresh token to obtain an active access token
      const refreshRes = await apiClient.post(API_ENDPOINTS.AUTH.REFRESH, { refreshToken });
      const { accessToken: newAccess, refreshToken: newRefresh } = refreshRes.data.data;
      
      setAccessToken(newAccess);
      setRefreshToken(newRefresh);

      // 2. Fetch user profile
      const profileRes = await apiClient.get(API_ENDPOINTS.AUTH.PROFILE);
      setUser(profileRes.data.data);
    } catch (err) {
      console.error("Auth initialization failed", err);
      setAccessToken(null);
      setRefreshToken(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    initAuth();

    // Listen to global unauthorized logout event
    const handleLogoutEvent = () => {
      setAccessToken(null);
      setRefreshToken(null);
      setUser(null);
      setIsLoading(false);
    };

    window.addEventListener("auth-logout", handleLogoutEvent);
    return () => {
      window.removeEventListener("auth-logout", handleLogoutEvent);
    };
  }, []);

  const login = async (payload: unknown) => {
    setIsLoading(true);
    try {
      const res = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, payload);
      const { user: loggedUser, accessToken, refreshToken } = res.data.data;
      
      setAccessToken(accessToken);
      setRefreshToken(refreshToken);
      setUser(loggedUser);
    } catch (err) {
      setAccessToken(null);
      setRefreshToken(null);
      setUser(null);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (payload: unknown) => {
    setIsLoading(true);
    try {
      const res = await apiClient.post(API_ENDPOINTS.AUTH.REGISTER, payload);
      const { user: registeredUser, accessToken, refreshToken } = res.data.data;

      setAccessToken(accessToken);
      setRefreshToken(refreshToken);
      setUser(registeredUser);
    } catch (err) {
      setAccessToken(null);
      setRefreshToken(null);
      setUser(null);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
    } catch (err) {
      console.warn("Logout request to backend failed", err);
    } finally {
      setAccessToken(null);
      setRefreshToken(null);
      setUser(null);
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
