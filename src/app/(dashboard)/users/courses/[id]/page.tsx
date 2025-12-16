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
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { courseService } from "@/services/course.service";
import { materialService } from "@/services/material.service";
import { quizService } from "@/services/quiz.service";
import { progressService } from "@/services/progress.service";
import { Course, Material, Quiz, Progress as ProgressType } from "@/types/api";
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

  // New State Logic
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
      const [
        courseData,
        materialsData,
        quizzesData,
        progressSummary,
        userProgress,
      ] = await Promise.all([
        courseService.getCourseById(courseId),
        materialService.getMaterialsByCourse(courseId),
        quizService.getQuizzesByCourse(courseId),
        progressService.getProgressSummary(),
        progressService.getUserProgress(),
      ]);

      setCourse(courseData);
      setMaterials(materialsData);
      setQuizzes(quizzesData);

      // 1. Set Overall Percentage from Summary
      const courseSummary = progressSummary.find((p: any) => p.id === courseId);
      setOverallProgress(courseSummary?.percentage || 0);

      // 2. Set Completed Item IDs for Checkmarks
      const completedMaterials = new Set(
        userProgress
          .filter((p) => p.course_id === courseId && p.material_id)
          .map((p) => p.material_id!) // Assert not null because filtered
      );
      setCompletedMaterialIds(completedMaterials);

      const completedQuizzes = new Set(
        userProgress
          .filter((p) => p.course_id === courseId && p.quiz_id)
          .map((p) => p.quiz_id!) // Assert not null because filtered
      );
      setCompletedQuizIds(completedQuizzes);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load course details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
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
              <Image
                src={course.thumbnail || "/course-1.jpg"}
                alt={course.title}
                width={400}
                height={250}
                className="rounded-lg object-cover w-full h-48"
              />
            </div>
            <div className="flex-1">
              <CardTitle className="text-3xl mb-2">{course.title}</CardTitle>
              <CardDescription className="text-base line-clamp-2">
                {course.description}
              </CardDescription>
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">Your Progress</p>
                <Progress value={overallProgress} className="w-full" />
                <p className="text-sm text-gray-500 mt-1">
                  {overallProgress}% Complete
                </p>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Materials Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen size={20} />
            Learning Materials
          </CardTitle>
        </CardHeader>
        <CardContent>
          {materials.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
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
                      className={`flex items-center gap-3 p-4 border rounded-lg transition cursor-pointer ${
                        isCompleted
                          ? "bg-green-50 border-green-200 dark:bg-green-900/10 dark:border-green-800"
                          : "hover:bg-gray-50 dark:hover:bg-gray-800"
                      }`}
                    >
                      {material.content_type === "pdf" ? (
                        <FileText
                          className={
                            isCompleted ? "text-green-500" : "text-red-500"
                          }
                          size={24}
                        />
                      ) : (
                        <Video
                          className={
                            isCompleted ? "text-green-500" : "text-blue-500"
                          }
                          size={24}
                        />
                      )}
                      <div className="flex-1">
                        <h4 className="font-medium flex items-center gap-2">
                          {material.title}
                          {isCompleted && (
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                              Completed
                            </span>
                          )}
                        </h4>
                        <p className="text-sm text-gray-500 capitalize">
                          {material.content_type}
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
            <ClipboardList size={20} />
            Quizzes
          </CardTitle>
        </CardHeader>
        <CardContent>
          {quizzes.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              No quizzes available yet.
            </p>
          ) : (
            <div className="space-y-3">
              {quizzes.map((quiz) => {
                const isCompleted = completedQuizIds.has(quiz.id);
                return (
                  <div
                    key={quiz.id}
                    className={`flex items-center justify-between p-4 border rounded-lg ${
                      isCompleted
                        ? "bg-green-50 border-green-200 dark:bg-green-900/10 dark:border-green-800"
                        : ""
                    }`}
                  >
                    <div>
                      <h4 className="font-medium flex items-center gap-2">
                        {quiz.title}
                        {isCompleted && (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                            Completed
                          </span>
                        )}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {quiz.description}
                      </p>
                    </div>
                    <Link
                      href={`/users/courses/${courseId}/quizzes/${quiz.id}`}
                    >
                      <Button
                        className={
                          isCompleted
                            ? "bg-green-600 hover:bg-green-700"
                            : "bg-green-500 hover:bg-green-600"
                        }
                      >
                        {isCompleted ? "Retake Quiz" : "Take Quiz"}
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
