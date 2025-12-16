import axios from "axios";
import Cookies from "js-cookie";

/**
 * API Client
 * 
 * Axios instance configured for making requests to the Laravel backend API.
 * Automatically handles authentication tokens and error responses.
 * 
 * Configuration:
 * - Base URL: Configured via NEXT_PUBLIC_API_URL environment variable
 * - Default Headers: Content-Type and Accept set to application/json
 * - Authentication: Automatically adds Bearer token from cookies
 * - Error Handling: Redirects to login on 401 Unauthorized
 * 
 * @example
 * ```typescript
 * import apiClient from '@/lib/api-client';
 * 
 * // GET request
 * const response = await apiClient.get('/courses');
 * 
 * // POST request
 * const response = await apiClient.post('/courses', { title: 'New Course' });
 * ```
 */
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

/**
 * Request Interceptor
 * 
 * Automatically adds the authentication token to all requests if available.
 * The token is retrieved from cookies and added as a Bearer token in the
 * Authorization header.
 * 
 * This ensures all API requests are authenticated without manually adding
 * the token to each request.
 */
apiClient.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * 
 * Handles authentication errors globally. When a 401 Unauthorized response
 * is received, it automatically:
 * 1. Clears the authentication token and user profile from cookies
 * 2. Redirects the user to the login page
 * 
 * This ensures users are automatically logged out when their session expires
 * or their token becomes invalid.
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear tokens and redirect to login
      Cookies.remove("token");
      Cookies.remove("user_profile");
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;

