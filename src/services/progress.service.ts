import apiClient from "@/lib/api-client";

// Kita definisikan tipe responsenya di sini agar TypeScript paham struktur datanya
export interface ProgressUpdateResponse {
  message: string;
  data: {
    percentage: number;
    completed_items: number;
    total_items: number;
  };
}

export const progressService = {
  // 1. Ambil data progress summary (Untuk Dashboard & Persentase Bar)
  async getProgressSummary() {
    const response = await apiClient.get("/progress-summary");
    return response.data.data || response.data;
  },

  // 2. Ambil data checklist item (Untuk tombol hijau)
  async getUserProgress() {
    const response = await apiClient.get("/my-progress");
    return response.data.data || response.data;
  },

  // 3. UPDATE PROGRESS (Perbaikan Parameter)
  // Kita ubah urutan parameternya agar cocok dengan Hook yang baru
  async updateProgress(
    courseId: number,
    materialId: number | null, // Bisa null jika ini quiz
    isCompleted: boolean,
    quizId: number | null = null // Optional, default null
  ) {
    const payload = {
      course_id: courseId,
      material_id: materialId,
      quiz_id: quizId,
      is_completed: isCompleted,
    };

    // Kita return response.data UTUH (termasuk wrapper message & data)
    // agar Hook bisa mengakses result.data.percentage
    const response = await apiClient.post<ProgressUpdateResponse>(
      "/update-progress",
      payload
    );

    return response.data;
  },
};
