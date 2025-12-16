import { useState, useEffect } from "react";
import { courseService } from "@/services/course.service";
import { progressService } from "@/services/progress.service";
import { Course, Progress } from "@/types/api";

interface CourseProgress {
  courseId: number;
  percentage: number;
  completedItems: number;
  totalItems: number;
  isComplete: boolean;
}

/**
 * Hook to fetch and calculate progress for all courses
 * Groups progress items by course and calculates percentages
 */
export function useAllCoursesProgress() {
  const [coursesProgress, setCoursesProgress] = useState<Map<number, CourseProgress>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProgress = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all courses and progress items
      const [courses, progressItems] = await Promise.all([
        courseService.getAllCourses(),
        progressService.getUserProgress().catch(() => []),
      ]);

      const progressMap = new Map<number, CourseProgress>();

      // Calculate progress for each course
      courses.forEach((course: Course) => {
        // Get all progress items for this course
        const courseProgressItems = progressItems.filter(
          (p: Progress) => p.course_id === course.id && p.is_completed
        );

        // Count completed items
        const completedItems = courseProgressItems.length;

        // Calculate total items (materials + quizzes)
        const totalMaterials = course.materials?.length || 0;
        const totalQuizzes = course.quizzes?.length || 0;
        const totalItems = totalMaterials + totalQuizzes;

        // Calculate percentage
        const percentage = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;

        progressMap.set(course.id, {
          courseId: course.id,
          percentage: Math.round(percentage * 100) / 100, // Round to 2 decimals
          completedItems,
          totalItems,
          isComplete: percentage === 100,
        });
      });

      setCoursesProgress(progressMap);
    } catch (err: any) {
      console.error("Failed to fetch progress:", err);
      setError(err.message || "Failed to load progress");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgress();
  }, []);

  return {
    coursesProgress,
    loading,
    error,
    refetch: fetchProgress,
  };
}
