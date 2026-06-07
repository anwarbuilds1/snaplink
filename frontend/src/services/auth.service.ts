import apiClient from "../api/axios";

export const authService = {
  login: (payload: unknown) => apiClient.post("/auth/login", payload),
  register: (payload: unknown) => apiClient.post("/auth/register", payload),
};
