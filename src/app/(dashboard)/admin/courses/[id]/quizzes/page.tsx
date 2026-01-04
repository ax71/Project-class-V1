"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card"; // Hapus CardHeader/Title biar lebih fleksibel
import { Button } from "@/components/ui/button";
import { quizService } from "@/services/quiz.service";
import { courseService } from "@/services/course.service";
import { Course } from "@/types/api";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ErrorMessage from "@/components/common/ErrorMessage";
import {
  FileQuestion,
  Trash2,
  Plus,
  ArrowLeft,
  Settings,
  HelpCircle,
  MoreVertical,
} from "lucide-react";

// Tipe Data
interface QuizWithCount {
  id: number;
  title: string;
  description: string;
  questions_count?: number;
  questions?: any[];
}

export default function QuizzesManagementPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = Number(params.id);

  const [course, setCourse] = useState<Course | null>(null);
  const [quizzes, setQuizzes] = useState<QuizWithCount[]>([]);
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
    if (courseId) fetchData();
  }, [courseId]);

  const handleDelete = async (quizId: number) => {
    if (!confirm("Are you sure you want to delete this quiz?")) return;
    try {
      await quizService.deleteQuiz(quizId);
      setQuizzes((prev) => prev.filter((q) => q.id !== quizId));
    } catch (err: any) {
      alert(`Failed to delete: ${err.response?.data?.message || err.message}`);
    }
  };

  if (loading) return <LoadingSpinner size="lg" text="Loading quizzes..." />;
  if (error) return <ErrorMessage message={error} onRetry={fetchData} />;

  return (
    <div className="w-full space-y-6 p-1">
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-6">
        <div>
          <Button
            variant="ghost"
            onClick={() => router.push("/admin/courses")}
            className="flex items-center gap-2 mb-1 text-gray-500 hover:text-gray-900 pl-0 h-auto p-0 hover:bg-transparent"
          >
            <ArrowLeft size={16} />
            Back to Courses
          </Button>
          <h1 className="text-2xl font-bold text-gray-800">
            {course?.title} <span className="text-gray-400 font-light">/</span>{" "}
            Quizzes
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage assessments and add questions to your course.
          </p>
        </div>
        <Button
          onClick={() =>
            router.push(`/admin/courses/${courseId}/quizzes/create`)
          }
          className="bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-100 transition-all"
        >
          <Plus size={18} className="mr-2" />
          Create New Quiz
        </Button>
      </div>

      {/* --- CONTENT --- */}
      {quizzes.length === 0 ? (
        // Empty State
        <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
          <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-4">
            <FileQuestion size={32} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            No Quizzes Yet
          </h3>
          <p className="text-gray-500 mb-6 max-w-sm text-center text-sm">
            This course doesn't have any quizzes. Create one to test your
            students' knowledge.
          </p>
          <Button
            variant="outline"
            onClick={() =>
              router.push(`/admin/courses/${courseId}/quizzes/create`)
            }
          >
            Create First Quiz
          </Button>
        </div>
      ) : (
        <div className="grid gap-4">
          {quizzes.map((quiz) => (
            <Card
              key={quiz.id}
              className="group transition-all duration-200 border-gray-200"
            >
              <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-xl flex-shrink-0 transition-colors duration-300">
                    <HelpCircle size={24} />
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-gray-800 transition-colors">
                      {quiz.title}
                    </h3>
                    <p className="text-sm text-gray-500 line-clamp-1 mb-2">
                      {quiz.description || "No description provided."}
                    </p>

                    <div className="inline-flex items-center gap-1.5 bg-gray-100 px-2.5 py-1 rounded-md text-xs font-medium text-gray-600">
                      <FileQuestion size={12} />
                      {quiz.questions_count || 0} Questions
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
