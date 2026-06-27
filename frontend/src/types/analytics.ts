export interface DashboardStats {
  totalUrls: number;
  totalClicks: number;
  topUrl: {
    shortCode: string;
    clicks: number;
  } | null;
}

export interface UrlAnalytics {
  totalClicks: number;
  topBrowsers: Record<string, number>;
  topOperatingSystems: Record<string, number>;
}

export interface DashboardResponse {
  success: boolean;
  data: DashboardStats;
}

export interface UrlAnalyticsResponse {
  success: boolean;
  data: UrlAnalytics;
}
