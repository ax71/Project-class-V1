"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { quizService } from "@/services/quiz.service";
import { courseService } from "@/services/course.service";
import { Quiz, Course } from "@/types/api";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ErrorMessage from "@/components/common/ErrorMessage";
import {
  FileQuestion,
  Trash2,
  Plus,
  ArrowLeft,
  Edit,
} from "lucide-react";

export default function QuizzesManagementPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = Number(params.id);

  const [course, setCourse] = useState<Course | null>(null);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [courseData, quizzesData] = await Promise.all([
        courseService.getCourseById(courseId),
        quizService.getQuizzesByCourse(courseId),
      ]);
      setCourse(courseData);
      setQuizzes(quizzesData);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load quizzes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [courseId]);

  const handleDelete = async (quizId: number) => {
    if (!confirm("Are you sure you want to delete this quiz?")) return;

    try {
      await quizService.deleteQuiz(quizId);
      setQuizzes((prev) => prev.filter((q) => q.id !== quizId));
      alert("✅ Quiz deleted successfully");
    } catch (err: any) {
      alert(`Failed to delete: ${err.response?.data?.message || err.message}`);
    }
  };

  if (loading) {
    return <LoadingSpinner size="lg" text="Loading quizzes..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchData} />;
  }

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Button
            variant="ghost"
            onClick={() => router.push("/admin/courses_taught")}
            className="flex items-center gap-2 mb-2"
          >
            <ArrowLeft size={16} />
            Back to Courses
          </Button>
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
            Quizzes for: {course?.title}
          </h1>
          <p className="text-gray-500">Manage course quizzes and questions</p>
        </div>
        <Button
          onClick={() =>
            router.push(`/admin/courses_taught/${courseId}/quizzes/create`)
          }
          className="bg-blue-500 hover:bg-blue-600 flex items-center gap-2"
        >
          <Plus size={18} />
          Create Quiz
        </Button>
      </div>

      {/* Quizzes List */}
      {quizzes.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileQuestion size={48} className="text-gray-400 mb-3" />
            <p className="text-gray-500 mb-4">No quizzes created yet</p>
            <Button
              onClick={() =>
                router.push(`/admin/courses_taught/${courseId}/quizzes/create`)
              }
              className="bg-blue-500 hover:bg-blue-600"
            >
              Create First Quiz
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {quizzes.map((quiz) => (
            <Card key={quiz.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <FileQuestion className="text-blue-500" size={24} />
                    <div>
                      <CardTitle className="text-lg">{quiz.title}</CardTitle>
                      <p className="text-sm text-gray-500 mt-1">
                        {quiz.questions?.length || 0} questions • Passing score:{" "}
                        {quiz.passing_score}%
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        router.push(
                          `/admin/courses_taught/${courseId}/quizzes/${quiz.id}/edit`
                        )
                      }
                      className="flex items-center gap-1"
                    >
                      <Edit size={16} />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(quiz.id)}
                      className="flex items-center gap-1"
                    >
                      <Trash2 size={16} />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
