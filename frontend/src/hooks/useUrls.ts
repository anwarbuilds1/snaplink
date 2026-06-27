import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../api/axios";
import { API_ENDPOINTS } from "../constants/api";
import type { UrlsResponse } from "../types";

export const useMyUrls = (page = 1, limit = 10) => {
  return useQuery<UrlsResponse>({
    queryKey: ["urls", page, limit],
    queryFn: async () => {
      const res = await apiClient.get(API_ENDPOINTS.AUTH.URLS, {
        params: { page, limit },
      });
      return res.data;
    },
  });
};

export const useCreateUrl = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { originalUrl: string; customAlias?: string; expiresAt?: string | null }) => {
      const res = await apiClient.post(API_ENDPOINTS.URLS.CREATE, payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["urls"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
    },
  });
};

export const useUpdateUrl = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, originalUrl }: { id: string; originalUrl: string }) => {
      const res = await apiClient.patch(API_ENDPOINTS.URLS.UPDATE(id), { originalUrl });
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["urls"] });
      queryClient.invalidateQueries({ queryKey: ["url", variables.id] });
    },
  });
};

export const useDeleteUrl = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await apiClient.delete(API_ENDPOINTS.URLS.DELETE(id));
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["urls"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
    },
  });
};

export const useUrlQrCode = (id: string, enabled = false) => {
  return useQuery<string>({
    queryKey: ["url-qr", id],
    queryFn: async () => {
      const res = await apiClient.get(API_ENDPOINTS.URLS.QR(id), {
        responseType: "blob",
      });
      return URL.createObjectURL(res.data);
    },
    enabled: enabled && !!id,
    staleTime: Infinity,
  });
};
