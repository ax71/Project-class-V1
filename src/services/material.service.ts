import apiClient from "@/lib/api-client";
import { Material, ApiResponse } from "@/types/api";

export const materialService = {

  async getMaterialsByCourse(courseId: number): Promise<Material[]> {
    const response = await apiClient.get<{ data: Material[] }>(
      `/materials?course_id=${courseId}`
    );
    return response.data.data || response.data;
  },

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

  async deleteMaterial(id: number): Promise<ApiResponse> {
    const response = await apiClient.delete<ApiResponse>(`/materials/${id}`);
    return response.data;
  },

  getMaterialUrl(filePath: string | null | undefined): string | null {

    if (!filePath) {
      return null;
    }
    const cleanPath = filePath.startsWith('/') ? filePath.substring(1) : filePath;
    const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "http://localhost:8000";
    return `${baseUrl}/storage/${cleanPath}`;

  },
};
