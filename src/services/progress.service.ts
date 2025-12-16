import apiClient from "@/lib/api-client";
import { Progress, ProgressUpdateResponse } from "@/types/api";

export const progressService = {
  
  // Ambil data progress
  async getUserProgress(): Promise<Progress[]> {
    const response = await apiClient.get<{ data: Progress[] }>("/my-progress");
    return response.data.data || response.data;
  },

  // UPDATE PROGRESS (VERSI BARU - SINKRON DENGAN BACKEND)
  async updateProgress(
    courseId: number,
    itemId: number,          
    type: "material" | "quiz", 
    isCompleted: boolean = true 
  ): Promise<ProgressUpdateResponse> { 
    
    const payload = {
      course_id: courseId,
      is_completed: isCompleted,
      material_id: type === "material" ? itemId : null,
      quiz_id: type === "quiz" ? itemId : null,
    };

    // Kirim ke backend
    const response = await apiClient.post("/update-progress", payload);
    
    // Backend akan membalas dengan persentase terbaru hasil hitungan otomatis
    return response.data.data || response.data;
  },
};