export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: "/auth/register",
    LOGIN: "/auth/login",
    REFRESH: "/auth/refresh",
    LOGOUT: "/auth/logout",
    PROFILE: "/auth/profile",
    URLS: "/auth/urls",
  },
  URLS: {
    CREATE: "/urls",
    UPDATE: (id: string) => `/urls/${id}`,
    DELETE: (id: string) => `/urls/${id}`,
    QR: (id: string) => `/urls/${id}/qr`,
  },
  ANALYTICS: {
    DASHBOARD: "/analytics/dashboard",
    URL: (urlId: string) => `/analytics/${urlId}`,
  },
};
