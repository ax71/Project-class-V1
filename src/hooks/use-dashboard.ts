import { useState, useEffect, useCallback } from "react";
import { getCurrentUser } from "@/services/auth.service";
import { courseService } from "@/services/course.service";
import { certificateService } from "@/services/certificate.service";
import { progressService } from "@/services/progress.service";
import { Course, Certificate, CourseProgressSummary } from "@/types/api";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface DashboardStatistics {
  enrolled: number;
  completed: number;
  avgProgress: number;
  certificates: number;
}

// Interface UI
interface EnrolledCourseUI extends CourseProgressSummary {
  id: number; // KITA WAJIB PUNYA INI UNTUK UI (key={course.id})
  progress: {
    percentage: number;
    completed_items: number;
    total_items: number;
    is_completed: boolean;
  };
}

interface DashboardData {
  user: User | null;
  enrolledCourses: EnrolledCourseUI[];
  latestCourses: Course[];
  certificates: Certificate[];
  statistics: DashboardStatistics;
}

export function useDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true);

      // 1. Fetch data
      const [user, progressSummary, latestCourses, certificates] =
        await Promise.all([
          getCurrentUser(),
          // Tambahkan safety check di catch agar return array kosong
          progressService.getProgressSummary().catch((err) => {
            console.error("Progress fetch error:", err);
            return [];
          }),
          courseService.getLatestCourses(4).catch(() => []),
          certificateService.getUserCertificates().catch(() => []),
        ]);

      // --- PERBAIKAN FATAL DI SINI (ANTI CRASH) ---
      // Pastikan progressSummary benar-benar Array sebelum di-map
      const safeSummary = Array.isArray(progressSummary) ? progressSummary : [];

      const enrolledCourses: EnrolledCourseUI[] = safeSummary.map(
        (item: any) => ({
          ...item,

          // PENTING: UI butuh 'id', Backend kirim 'course_id'.
          // Kita harus mapping manual di sini.
          id: item.course_id,

          progress: {
            percentage: item.percentage || 0, // Fallback ke 0
            completed_items: item.completed_items || 0,
            total_items: item.total_items || 0,
            is_completed: item.percentage === 100,
          },
        })
      );

      // 3. Calculate Statistics
      const completedCount = enrolledCourses.filter(
        (c) => c.progress.percentage === 100
      ).length;

      const avgProgress =
        enrolledCourses.length > 0
          ? Math.round(
              enrolledCourses.reduce(
                (sum, c) => sum + (c.progress.percentage || 0),
                0
              ) / enrolledCourses.length
            )
          : 0;

      setData({
        user,
        enrolledCourses,
        // Pastikan ini juga array
        latestCourses: Array.isArray(latestCourses) ? latestCourses : [],
        certificates: Array.isArray(certificates) ? certificates : [],
        statistics: {
          enrolled: enrolledCourses.length,
          completed: completedCount,
          avgProgress,
          certificates: Array.isArray(certificates) ? certificates.length : 0,
        },
      });

      setError(null);
    } catch (err: any) {
      console.error("Failed to fetch dashboard data:", err);
      setError(err.message || "Failed to load dashboard");
    } finally {
      // Pastikan loading mati apapun yang terjadi
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  return { data, loading, error, refresh: fetchDashboard };
}
