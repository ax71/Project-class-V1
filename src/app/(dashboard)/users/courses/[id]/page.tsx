"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress"; // Pastikan ini komponen shadcn ui
import { courseService } from "@/services/course.service";
import { materialService } from "@/services/material.service";
import { quizService } from "@/services/quiz.service";
import { progressService } from "@/services/progress.service";
import { Course, Material, Quiz } from "@/types/api";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ErrorMessage from "@/components/common/ErrorMessage";
import {
  BookOpen,
  FileText,
  Video,
  ClipboardList,
  ArrowLeft,
} from "lucide-react";

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = Number(params.id);

  const [course, setCourse] = useState<Course | null>(null);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);

  // State Progress
  const [overallProgress, setOverallProgress] = useState(0);
  const [completedMaterialIds, setCompletedMaterialIds] = useState<Set<number>>(
    new Set()
  );
  const [completedQuizIds, setCompletedQuizIds] = useState<Set<number>>(
    new Set()
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch semua data secara paralel
      const [
        courseData,
        materialsData,
        quizzesData,
        progressSummary,
        userProgress, // Array item ID dari /api/my-progress
      ] = await Promise.all([
        courseService.getCourseById(courseId),
        materialService.getMaterialsByCourse(courseId),
        quizService.getQuizzesByCourse(courseId),
        progressService.getProgressSummary().catch(() => []), // Fallback array kosong
        progressService.getUserProgress().catch(() => []), // Fallback array kosong
      ]);

      setCourse(courseData);
      setMaterials(materialsData);
      setQuizzes(quizzesData);

      // --- PERBAIKAN 1: Logika Summary (Penyebab 0%) ---
      // Data summary backend kuncinya adalah 'course_id', BUKAN 'id'
      const safeSummary = Array.isArray(progressSummary) ? progressSummary : [];
      const courseSummary = safeSummary.find(
        (p: any) => p.course_id === courseId
      );

      // Ambil 'percentage' (jika ada)
      setOverallProgress(courseSummary?.percentage || 0);

      // --- PERBAIKAN 2: Logika Checklist (Set) ---
      // Pastikan userProgress adalah Array sebelum di-filter
      if (Array.isArray(userProgress)) {
        // Filter Material Selesai
        const doneMaterials = userProgress
          .filter((p: any) => p.course_id === courseId && p.material_id) // Cek course & material_id ada
          .map((p: any) => p.material_id);

        setCompletedMaterialIds(new Set(doneMaterials));

        // Filter Quiz Selesai
        const doneQuizzes = userProgress
          .filter((p: any) => p.course_id === courseId && p.quiz_id) // Cek course & quiz_id ada
          .map((p: any) => p.quiz_id);

        setCompletedQuizIds(new Set(doneQuizzes));
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to load course details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (courseId) {
      fetchData();
    }
  }, [courseId]);

  if (loading) {
    return <LoadingSpinner size="lg" text="Loading course details..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchData} />;
  }

  if (!course) {
    return <ErrorMessage message="Course not found" />;
  }

  return (
    <div className="w-full space-y-6">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="flex items-center gap-2"
      >
        <ArrowLeft size={16} />
        Back to Courses
      </Button>

      {/* Course Header */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-1/3">
              <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                <Image
                  src={courseService.getCourseImageUrl(course.cover_image)}
                  alt={course.title}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div className="flex-1 flex flex-col justify-center">
              <CardTitle className="text-3xl mb-2">{course.title}</CardTitle>
              <CardDescription className="text-base line-clamp-3 mb-4">
                {course.description}
              </CardDescription>

              <div className="mt-auto">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    Your Progress
                  </p>
                  <span className="text-sm font-bold text-blue-600">
                    {overallProgress}%
                  </span>
                </div>
                <Progress value={overallProgress} className="w-full h-3" />
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Materials Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen size={20} className="text-blue-500" />
            Learning Materials
          </CardTitle>
        </CardHeader>
        <CardContent>
          {materials.length === 0 ? (
            <p className="text-gray-500 text-center py-8 bg-gray-50 rounded-lg border border-dashed">
              No materials available yet.
            </p>
          ) : (
            <div className="space-y-3">
              {materials.map((material) => {
                const isCompleted = completedMaterialIds.has(material.id);
                return (
                  <Link
                    key={material.id}
                    href={`/users/courses/${courseId}/materials/${material.id}`}
                  >
                    <div
                      className={`flex items-center gap-4 p-4 border rounded-lg transition-all duration-200 cursor-pointer group ${
                        isCompleted
                          ? "bg-green-50/50 border-green-200 hover:border-green-300 dark:bg-green-900/10 dark:border-green-800"
                          : "hover:bg-gray-50 hover:border-gray-300 dark:hover:bg-gray-800"
                      }`}
                    >
                      <div
                        className={`p-2 rounded-full ${
                          isCompleted ? "bg-green-100" : "bg-blue-50"
                        }`}
                      >
                        {material.content_type === "pdf" ? (
                          <FileText
                            className={
                              isCompleted ? "text-green-600" : "text-red-500"
                            }
                            size={20}
                          />
                        ) : (
                          <Video
                            className={
                              isCompleted ? "text-green-600" : "text-blue-500"
                            }
                            size={20}
                          />
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-gray-900 dark:text-gray-100 group-hover:text-blue-600 transition-colors">
                            {material.title}
                          </h4>
                          {isCompleted && (
                            <span className="text-xs font-semibold bg-green-100 text-green-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                              Check ✓
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 capitalize mt-0.5">
                          {material.content_type} •{" "}
                          {isCompleted ? "Completed" : "Pending"}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quizzes Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardList size={20} className="text-yellow-500" />
            Quizzes
          </CardTitle>
        </CardHeader>
        <CardContent>
          {quizzes.length === 0 ? (
            <p className="text-gray-500 text-center py-8 bg-gray-50 rounded-lg border border-dashed">
              No quizzes available yet.
            </p>
          ) : (
            <div className="space-y-3">
              {quizzes.map((quiz) => {
                const isCompleted = completedQuizIds.has(quiz.id);
                return (
                  <div
                    key={quiz.id}
                    className={`flex items-center justify-between p-4 border rounded-lg transition-all ${
                      isCompleted
                        ? "bg-green-50/50 border-green-200 dark:bg-green-900/10 dark:border-green-800"
                        : "bg-white dark:bg-card"
                    }`}
                  >
                    <div>
                      <h4 className="font-medium flex items-center gap-2 text-gray-900 dark:text-gray-100">
                        {quiz.title}
                        {isCompleted && (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">
                            Passed
                          </span>
                        )}
                      </h4>
                      <p className="text-sm text-gray-500 mt-1">
                        {quiz.description}
                      </p>
                    </div>
                    <Link
                      href={`/users/courses/${courseId}/quizzes/${quiz.id}`}
                    >
                      <Button
                        size="sm"
                        className={
                          isCompleted
                            ? "bg-green-600 hover:bg-green-700 text-white"
                            : "bg-blue-600 hover:bg-blue-700 text-white"
                        }
                      >
                        {isCompleted ? "Retake Quiz" : "Start Quiz"}
                      </Button>
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
