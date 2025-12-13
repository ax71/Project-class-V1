import apiClient from "@/lib/api-client";
import { Quiz, ApiResponse } from "@/types/api";

export const quizService = {
  /**
   * Get all quizzes for a specific course
   */
  async getQuizzesByCourse(courseId: number): Promise<Quiz[]> {
    const response = await apiClient.get<{ data: Quiz[] }>(
      `/quizzes?course_id=${courseId}`
    );
    return response.data.data || response.data;
  },

  /**
   * Get quiz by ID with questions and answers
   */
  async getQuizById(id: number): Promise<Quiz> {
    const response = await apiClient.get<{ data: Quiz }>(`/quizzes/${id}`);
    return response.data.data || response.data;
  },

  /**
   * Create new quiz (Admin only)
   */
  async createQuiz(data: {
    course_id: number;
    title: string;
    description: string;
  }): Promise<Quiz> {
    const response = await apiClient.post<{ data: Quiz }>("/quizzes", data);
    return response.data.data || response.data;
  },

  /**
   * Create question with answers (Admin only)
   */
  async createQuestion(data: {
    quiz_id: number;
    question_text: string;
    answers: {
      answer_text: string;
      is_correct: boolean;
    }[];
  }): Promise<ApiResponse> {
    const response = await apiClient.post<ApiResponse>("/questions", data);
    return response.data;
  },

  /**
   * Delete quiz (Admin only)
   */
  async deleteQuiz(id: number): Promise<ApiResponse> {
    const response = await apiClient.delete<ApiResponse>(`/quizzes/${id}`);
    return response.data;
  },
};
