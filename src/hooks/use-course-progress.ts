import { useState, useEffect, useCallback } from "react";
import { progressService } from "@/services/progress.service";
import { certificateService } from "@/services/certificate.service";
import {
  getViewedMaterials,
  markMaterialAsViewed as markMaterialViewedUtil,
} from "@/lib/progress-calculator";

export function useCourseProgress(courseId: number) {
  const [viewedMaterials, setViewedMaterials] = useState<number[]>([]);

  // TAMBAHAN: State untuk menyimpan persentase
  const [progressPercentage, setProgressPercentage] = useState(0);

  const [isUpdating, setIsUpdating] = useState(false);

  // 1. Load Data Awal
  useEffect(() => {
    // Load local storage (biar checklist materi muncul)
    const materials = getViewedMaterials(courseId);
    setViewedMaterials(materials);

    // Load Persentase dari Backend (biar Progress Bar muncul)
    const fetchProgress = async () => {
      try {
        const allProgress = await progressService.getUserProgress();
        // Cari progress untuk course yang sedang dibuka ini
        const currentCourseProgress = allProgress.find(
          (p: any) => p.course_id === Number(courseId)
        );
        if (currentCourseProgress) {
          setProgressPercentage(currentCourseProgress.percentage);
        }
      } catch (error) {
        console.error("Gagal ambil progress awal:", error);
      }
    };
    fetchProgress();
  }, [courseId]);

  /**
   * Fungsi: Tandai materi selesai & Update Progress Bar
   */
  const markMaterialViewed = useCallback(
    async (materialId: number) => {
      // Jika sudah dilihat, stop (hemat request)
      if (viewedMaterials.includes(materialId)) {
        return;
      }

      setIsUpdating(true);
      try {
        // A. Update UI Checklist (Optimistic)
        markMaterialViewedUtil(courseId, materialId);
        setViewedMaterials((prev) => [...prev, materialId]);

        // B. Lapor Backend & AMBIL PERSENTASE BARU
        const result = await progressService.updateProgress(
          courseId,
          materialId,
          "material",
          true
        );

        // C. Update Progress Bar dengan angka dari Backend
        console.log("Progress Baru:", result.percentage, "%");
        setProgressPercentage(result.percentage);

        return true;
      } catch (error) {
        console.error("Gagal update progress:", error);
        return false;
      } finally {
        setIsUpdating(false);
      }
    },
    [courseId, viewedMaterials]
  );

  /**
   * Fungsi: Manual completion - untuk tombol "Mark as Complete"
   * Mengembalikan data lengkap dari backend untuk feedback ke user
   */
  const markMaterialComplete = useCallback(
    async (materialId: number) => {
      // Jika sudah completed, return early
      if (viewedMaterials.includes(materialId)) {
        return {
          success: false,
          message: "Already completed",
          percentage: progressPercentage,
        };
      }

      setIsUpdating(true);
      try {
        // A. Update UI Optimistically
        markMaterialViewedUtil(courseId, materialId);
        setViewedMaterials((prev) => [...prev, materialId]);

        // B. Send to Backend
        const result = await progressService.updateProgress(
          courseId,
          materialId,
          "material",
          true
        );

        // C. Update Progress State
        setProgressPercentage(result.percentage);

        console.log(`✅ Material completed! Progress: ${result.percentage}%`);

        // D. Check if course completed (100%) and generate certificate
        let certificate = null;
        if (result.percentage === 100) {
          try {
            certificate = await certificateService.generateCertificate(
              courseId
            );
            console.log("🎉 Certificate generated!", certificate);
          } catch (error: any) {
            // Handle duplicate certificate (409) - it's okay, certificate already exists
            if (error.response?.status === 409) {
              console.log("Certificate already exists");
            } else {
              console.error("Failed to generate certificate:", error);
            }
          }
        }

        return {
          success: true,
          percentage: result.percentage,
          completedItems: result.completed_items,
          totalItems: result.total_items,
          certificateGenerated: certificate !== null,
          certificate,
        };
      } catch (error) {
        console.error("Failed to mark material as complete:", error);
        throw error;
      } finally {
        setIsUpdating(false);
      }
    },
    [courseId, viewedMaterials, progressPercentage]
  );

  const isMaterialViewed = useCallback(
    (materialId: number) => viewedMaterials.includes(materialId),
    [viewedMaterials]
  );

  return {
    viewedMaterials,
    markMaterialViewed,
    markMaterialComplete,
    isMaterialViewed,
    isUpdating,
    progressPercentage,
  };
}
