import apiClient from "../api/axios";

export const urlService = {
  list: () => apiClient.get("/urls"),
  create: (payload: unknown) => apiClient.post("/urls", payload),
};
