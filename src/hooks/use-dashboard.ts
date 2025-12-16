import { useState, useEffect, useCallback } from "react";
import { getCurrentUser } from "@/services/auth.service";
import { courseService } from "@/services/course.service";
import { certificateService } from "@/services/certificate.service";
import { Course, Certificate } from "@/types/api";

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

interface DashboardData {
  user: User | null;
  enrolledCourses: Course[];
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

      // Fetch all data in parallel
      const [user, enrolledCourses, latestCourses, certificates] =
        await Promise.all([
          getCurrentUser(),
          courseService.getEnrolledCourses(),
          courseService.getLatestCourses(4),
          certificateService.getUserCertificates().catch(() => []),
        ]);

      // Calculate statistics from enrolled courses
      const completed = enrolledCourses.filter(
        (c) => c.progress?.percentage === 100
      ).length;

      const avgProgress =
        enrolledCourses.length > 0
          ? Math.round(
              enrolledCourses.reduce(
                (sum, c) => sum + (c.progress?.percentage || 0),
                0
              ) / enrolledCourses.length
            )
          : 0;

      setData({
        user,
        enrolledCourses,
        latestCourses,
        certificates,
        statistics: {
          enrolled: enrolledCourses.length,
          completed,
          avgProgress,
          certificates: certificates.length,
        },
      });

      setError(null);
    } catch (err: any) {
      console.error("Failed to fetch dashboard data:", err);
      setError(err.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(fetchDashboard, 30000);
    return () => clearInterval(interval);
  }, [fetchDashboard]);

  return { data, loading, error, refresh: fetchDashboard };
}
