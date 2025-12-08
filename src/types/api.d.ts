export interface ApiResponse {
  message: string;
  status: string;
  timestamp?: string;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

export interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
}
