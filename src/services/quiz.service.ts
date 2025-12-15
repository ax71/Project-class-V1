import apiClient from "@/lib/api-client";
import { Quiz, ApiResponse } from "@/types/api";


export const quizService = {
  
  async getQuizzesByCourse(courseId: number): Promise<Quiz[]> {
    const response = await apiClient.get<{ data: Quiz[] }>(
      `/quizzes?course_id=${courseId}`
    );
    return response.data.data || response.data;
  },

  async getQuizById(id: number): Promise<Quiz> {
    const response = await apiClient.get<{ data: Quiz }>(`/quizzes/${id}`);
    return response.data.data || response.data;
  },

  async createQuiz(data: {
    course_id: number;
    title: string;
    description: string;
  }): Promise<Quiz> {
    const response = await apiClient.post<{ data: Quiz }>("/quizzes", data);
    return response.data.data || response.data;
  },

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

  async deleteQuiz(id: number): Promise<ApiResponse> {
    const response = await apiClient.delete<ApiResponse>(`/quizzes/${id}`);
    return response.data;
  },
};
