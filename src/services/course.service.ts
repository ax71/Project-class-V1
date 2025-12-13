import apiClient from "@/lib/api-client";
import { Course, ApiResponse } from "@/types/api";

export const courseService = {
  /**
   * Get all courses
   */
  async getAllCourses(): Promise<Course[]> {
    const response = await apiClient.get<{ data: Course[] }>("/courses");
    return response.data.data || response.data;
  },

  /**
   * Get course by ID
   */
  async getCourseById(id: number): Promise<Course> {
    const response = await apiClient.get<{ data: Course }>(`/courses/${id}`);
    return response.data.data || response.data;
  },

  /**
   * Create new course (Admin only)
   */
  async createCourse(data: {
    title: string;
    description: string;
  }): Promise<Course> {
    const response = await apiClient.post<{ data: Course }>("/courses", data);
    return response.data.data || response.data;
  },

  /**
   * Update course (Admin only)
   */
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

  /**
   * Delete course (Admin only)
   */
  async deleteCourse(id: number): Promise<ApiResponse> {
    const response = await apiClient.delete<ApiResponse>(`/courses/${id}`);
    return response.data;
  },
};
