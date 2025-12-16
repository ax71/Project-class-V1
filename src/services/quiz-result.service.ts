import apiClient from "@/lib/api-client";

export interface QuizResult {
  id: number;
  user_id: number;
  quiz_id: number;
  score: number;
  completed_at: string;
  quiz?: {
    id: number;
    title: string;
    course_id: number;
  };
}

export const quizResultService = {
  /**
   * Get all quiz results for the current user
   * 
   * @returns Promise resolving to an array of QuizResult objects
   * @throws Error if request fails
   */
  async getMyResults(): Promise<QuizResult[]> {
    const response = await apiClient.get<{ data: QuizResult[] }>("/my-results");
    return response.data.data || response.data;
  },
};
