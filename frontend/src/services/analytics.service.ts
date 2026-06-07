import apiClient from "../api/axios";

export const analyticsService = {
  getDashboard: () => apiClient.get("/analytics/dashboard"),
};
