import apiClient from "@/lib/api-client";
import { Material, ApiResponse } from "@/types/api";

export const materialService = {
  /**
   * Get all materials for a specific course
   */
  async getMaterialsByCourse(courseId: number): Promise<Material[]> {
    const response = await apiClient.get<{ data: Material[] }>(
      `/materials?course_id=${courseId}`
    );
    return response.data.data || response.data;
  },

  /**
   * Upload new material (Admin only)
   * Uses FormData for file upload
   */
  async uploadMaterial(formData: FormData): Promise<Material> {
    const response = await apiClient.post<{ data: Material }>(
      "/materials",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data.data || response.data;
  },

  /**
   * Delete material (Admin only)
   */
  async deleteMaterial(id: number): Promise<ApiResponse> {
    const response = await apiClient.delete<ApiResponse>(`/materials/${id}`);
    return response.data;
  },

  /**
   * Get material file URL
   */
  getMaterialUrl(filePath: string): string {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "http://localhost:8000";
    return `${baseUrl}/storage/${filePath}`;
  },
};
