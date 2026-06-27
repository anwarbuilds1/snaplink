export interface UrlData {
  _id: string;
  userId: string;
  originalUrl: string;
  shortCode: string;
  expiresAt: string | null;
  clickCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UrlsResponse {
  success: boolean;
  data: UrlData[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
