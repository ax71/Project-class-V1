import apiClient from "@/lib/api-client";
import { Progress } from "@/types/api";

export const progressService = {
  /**
   * Get user's progress for all courses
   */
  async getUserProgress(): Promise<Progress[]> {
    const response = await apiClient.get<{ data: Progress[] }>("/user/progress");
    return response.data.data || response.data;
  },

  /**
   * Update progress for a specific course
   */
  async updateProgress(
    courseId: number,
    data: { progress_percentage: number; completed?: boolean }
  ): Promise<Progress> {
    const response = await apiClient.post<{ data: Progress }>("/progress", {
      course_id: courseId,
      ...data,
    });
    return response.data.data || response.data;
  },
};
