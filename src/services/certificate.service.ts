import apiClient from "@/lib/api-client";
import { Certificate } from "@/types/api";

export const certificateService = {
  /**
   * Get all certificates for the current user
   */
  async getUserCertificates(): Promise<Certificate[]> {
    const response = await apiClient.get<{ data: Certificate[] }>("/certificates");
    return response.data.data || response.data;
  },

  /**
   * Generate certificate for a completed course
   */
  async generateCertificate(courseId: number): Promise<Certificate> {
    const response = await apiClient.post<{ data: Certificate }>(
      "/certificates/generate",
      { course_id: courseId }
    );
    return response.data.data || response.data;
  },

  /**
   * Get certificate download URL
   */
  getCertificateUrl(id: number): string {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
    return `${baseUrl}/certificates/${id}/download`;
  },
};
