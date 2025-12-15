import apiClient from "@/lib/api-client";
import { Certificate } from "@/types/api";


export const certificateService = {

  async getUserCertificates(): Promise<Certificate[]> {
    const response = await apiClient.get<{ data: Certificate[] }>("/my-certificates");
    return response.data.data || response.data;
  },


  async generateCertificate(courseId: number): Promise<Certificate> {
    const response = await apiClient.post<{ data: Certificate }>(
      "/my-certificates/generate",
      { course_id: courseId }
    );
    return response.data.data || response.data;
  },

  getCertificateUrl(id: number): string {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
    return `${baseUrl}/my-certificates/${id}/download`;
  },
};

