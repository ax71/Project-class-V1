import apiClient from "@/lib/api-client";
import { Progress } from "@/types/api";


export const progressService = {
  
  async getUserProgress(): Promise<Progress[]> {
    const response = await apiClient.get<{ data: Progress[] }>("/my-progress");
    return response.data.data || response.data;
  },

  async updateProgress(
    courseId: number,
    data: { progress_percentage: number; completed?: boolean }
  ): Promise<Progress> {
    const response = await apiClient.post<{ data: Progress }>("/update-progress", {
      course_id: courseId,
      ...data,
    });
    return response.data.data || response.data;
  },
};
