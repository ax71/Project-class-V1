import { useState, useEffect, useCallback } from "react";
import { progressService } from "@/services/progress.service";
import { certificateService } from "@/services/certificate.service";

export function useCourseProgress(courseId: number) {
  const [completedItems, setCompletedItems] = useState<Set<number>>(new Set());
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);

  // 1. Fetch Data Awal
  const fetchProgress = useCallback(async () => {
    try {
      const [userProgress, summary] = await Promise.all([
        progressService.getUserProgress(),
        progressService.getProgressSummary().catch(() => []),
      ]);

      // Filter Item Course Ini
      const courseItems = Array.isArray(userProgress)
        ? userProgress
            .filter(
              (p: any) =>
                p.course_id === courseId && (p.material_id || p.quiz_id)
            )
            .map((p: any) => p.material_id || p.quiz_id)
        : [];

      setCompletedItems(new Set(courseItems));

      // Ambil Persentase
      const currentCourse = Array.isArray(summary)
        ? summary.find((c: any) => c.course_id === courseId)
        : null;

      if (currentCourse) {
        setProgressPercentage(currentCourse.percentage || 0);
      }
    } catch (error) {
      console.error("Gagal load progress:", error);
    }
  }, [courseId]);

  useEffect(() => {
    if (courseId) fetchProgress();
  }, [courseId, fetchProgress]);

  // 2. Tandai Materi Selesai
  const markMaterialComplete = useCallback(
    async (materialId: number) => {
      setIsUpdating(true);
      try {
        // PERBAIKAN ERROR 2: Parameter sesuai service baru
        // (courseId, materialId, isCompleted, quizId=null)
        const result = await progressService.updateProgress(
          courseId,
          materialId,
          true,
          null
        );

        // PERBAIKAN ERROR 1: Akses data langsung (karena service sudah return response.data)
        // Struktur result sekarang: { message: "...", data: { percentage: ... } }
        const newPercentage = result.data.percentage;

        setCompletedItems((prev) => {
          const newSet = new Set(prev);
          newSet.add(materialId);
          return newSet;
        });

        if (typeof newPercentage === "number") {
          console.log(`📈 Progress Updated: ${newPercentage}%`);
          setProgressPercentage(newPercentage);
        } else {
          fetchProgress();
        }

        // 3. Cek Sertifikat
        let certificate = null;
        if (newPercentage === 100) {
          try {
            const certResponse = await certificateService.generateCertificate(
              courseId
            );
            // PERBAIKAN ERROR 3: Hapus .data jika service certificate mengembalikan object langsung
            // Kita gunakan safety check (certResponse.data OR certResponse)
            certificate = (certResponse as any).data || certResponse;
            console.log("🎉 Certificate Generated!");
          } catch (err: any) {
            if (err.response?.status !== 409) {
              console.error("Gagal generate sertifikat:", err);
            }
          }
        }

        return {
          success: true,
          percentage: newPercentage,
          certificateGenerated: newPercentage === 100,
          certificate,
        };
      } catch (error) {
        console.error("Gagal update progress:", error);
        return { success: false };
      } finally {
        setIsUpdating(false);
      }
    },
    [courseId, fetchProgress]
  );

  const isMaterialViewed = useCallback(
    (materialId: number) => {
      return completedItems.has(materialId);
    },
    [completedItems]
  );

  return {
    completedItems,
    isMaterialViewed,
    markMaterialComplete,
    progressPercentage,
    isUpdating,
    refreshProgress: fetchProgress,
  };
}
