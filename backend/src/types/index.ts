// Shared types for the backend application
// Add common interfaces and type definitions here

export interface ApiResponse<T = unknown> {
  data?: T;
  error?: {
    message: string;
    status: number;
  };
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
