import { useQuery } from "@tanstack/react-query";
import apiClient from "../api/axios";
import { API_ENDPOINTS } from "../constants/api";
import type { DashboardResponse, UrlAnalyticsResponse } from "../types";

export const useDashboardStats = () => {
  return useQuery<DashboardResponse>({
    queryKey: ["dashboardStats"],
    queryFn: async () => {
      const res = await apiClient.get(API_ENDPOINTS.ANALYTICS.DASHBOARD);
      return res.data;
    },
  });
};

export const useUrlAnalytics = (urlId: string, enabled = false) => {
  return useQuery<UrlAnalyticsResponse>({
    queryKey: ["urlAnalytics", urlId],
    queryFn: async () => {
      const res = await apiClient.get(API_ENDPOINTS.ANALYTICS.URL(urlId));
      return res.data;
    },
    enabled: enabled && !!urlId,
  });
};
