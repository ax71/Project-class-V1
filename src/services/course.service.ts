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

  async createCourse(data: {
    title: string;
    description: string;
  }): Promise<Course> {
    const response = await apiClient.post<{ data: Course }>("/courses", data);
    return response.data.data || response.data;
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
};
