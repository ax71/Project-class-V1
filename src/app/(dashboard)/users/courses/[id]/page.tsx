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
  const [progress, setProgress] = useState<ProgressType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [courseData, materialsData, quizzesData, progressData] =
        await Promise.all([
          courseService.getCourseById(courseId),
          materialService.getMaterialsByCourse(courseId),
          quizService.getQuizzesByCourse(courseId),
          progressService
            .getUserProgress()
            .then((data) => data.find((p) => p.course_id === courseId) || null)
            .catch(() => null),
        ]);

      setCourse(courseData);
      setMaterials(materialsData);
      setQuizzes(quizzesData);
      setProgress(progressData);
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
                <Progress
                  value={progress?.percentage || 0}
                  className="w-full"
                />
                <p className="text-sm text-gray-500 mt-1">
                  {progress?.percentage || 0}% Complete
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
              {materials.map((material) => (
                <Link
                  key={material.id}
                  href={`/users/courses/${courseId}/materials/${material.id}`}
                >
                  <div className="flex items-center gap-3 p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition cursor-pointer">
                    {material.content_type === "pdf" ? (
                      <FileText className="text-red-500" size={24} />
                    ) : (
                      <Video className="text-blue-500" size={24} />
                    )}
                    <div className="flex-1">
                      <h4 className="font-medium">{material.title}</h4>
                      <p className="text-sm text-gray-500 capitalize">
                        {material.content_type}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
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
              {quizzes.map((quiz) => (
                <div
                  key={quiz.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <h4 className="font-medium">{quiz.title}</h4>
                    <p className="text-sm text-gray-500">{quiz.description}</p>
                  </div>
                  <Link href={`/users/courses/${courseId}/quizzes/${quiz.id}`}>
                    <Button className="bg-green-500 hover:bg-green-600">
                      Take Quiz
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
