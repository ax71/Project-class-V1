import apiClient from "@/lib/api-client";
import { Course, ApiResponse } from "@/types/api";

export const courseService = {
  async getAllCourses(): Promise<Course[]> {
    const response = await apiClient.get<{ data: Course[] }>("/courses");
    return response.data.data || response.data;
  },

  async getCourseById(id: number): Promise<Course> {
    const response = await apiClient.get<{ data: Course }>(`/courses/${id}`);
    return response.data.data || response.data;
  },

  async createCourse(data: FormData) {
    const response = await apiClient.post("/courses", data, {
      headers: {
        // Penting: Beritahu browser bahwa ini adalah upload file
        "Content-Type": "multipart/form-data", 
      },
    });
    return response.data;
  },

  async updateCourse(
    id: number,
    data: { title: string; description: string }
  ): Promise<Course> {
    const response = await apiClient.put<{ data: Course }>(
      `/courses/${id}`,
      data
    );
    return response.data.data || response.data;
  },

  async deleteCourse(id: number): Promise<ApiResponse> {
    const response = await apiClient.delete<ApiResponse>(`/courses/${id}`);
    return response.data;
  },

  async getEnrolledCourses(): Promise<Course[]> {
    const response = await apiClient.get<{ data: Course[] }>(
      "/progress-summary"
    );
    return response.data.data || response.data;
  },

  async getLatestCourses(limit: number = 4): Promise<Course[]> {
    const response = await apiClient.get<{ data: Course[] }>(
      `/courses?latest=true&limit=${limit}`
    );
    return response.data.data || response.data;
  },

  getCourseImageUrl(path: string | null | undefined) {
    if (!path) return "/course-1.jpg"; // Placeholder default dari public folder Next.js
    
    // Jika path sudah lengkap (https://...), kembalikan langsung
    if (path.startsWith("http")) return path;

    // Jika path relatif, gabungkan dengan BASE URL Backend
    // Pastikan NEXT_PUBLIC_API_URL mengarah ke root backend (bukan /api)
    // Contoh: http://localhost:8000
    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
    
    // Laravel storage link biasanya ada di /storage/
    return `${baseUrl}/storage/${path}`;
  }

};
