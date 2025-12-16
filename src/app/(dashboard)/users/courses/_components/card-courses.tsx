"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { courseService } from "@/services/course.service";
import { Course } from "@/types/api";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ErrorMessage from "@/components/common/ErrorMessage";
import { BookOpen, CheckCircle } from "lucide-react";

export default function CourseCard() {
  const [courses, setCourses] = useState<Course[]>([]);
  // Kita pakai any[] karena struktur summary beda dengan Course biasa
  const [enrolledCourses, setEnrolledCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [allCoursesData, myEnrolledData] = await Promise.all([
        courseService.getAllCourses(),
        courseService.getEnrolledCourses().catch(() => []),
      ]);

      // --- DEBUGGING: Cek hasil data di Console Browser ---
      console.log("Semua Course:", allCoursesData);
      console.log("Progress Saya (Summary):", myEnrolledData);

      setCourses(allCoursesData);
      setEnrolledCourses(myEnrolledData);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Logika Pencocokan Data
  const getProgressForCourse = (courseId: number) => {
    // Pastikan enrolledCourses adalah array
    if (!Array.isArray(enrolledCourses)) return 0;

    // Cari match berdasarkan course_id
    const found = enrolledCourses.find((c: any) => c.course_id === courseId);

    if (found) {
      // Prioritaskan field 'percentage' langsung (sesuai backend v2.1)
      if (typeof found.percentage !== "undefined") return found.percentage;
      // Fallback untuk struktur lama
      if (found.progress && typeof found.progress.percentage !== "undefined")
        return found.progress.percentage;
    }
    return 0;
  };

  if (loading) {
    return <LoadingSpinner size="lg" text="Loading your courses..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchData} />;
  }

  if (courses.length === 0) {
    return (
      <div className="text-center py-12">
        <BookOpen size={48} className="mx-auto mb-3 text-gray-400" />
        <p className="text-gray-500">No courses available yet.</p>
      </div>
    );
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course) => {
        const percentage = getProgressForCourse(course.id);
        const isCompleted = percentage === 100;

        return (
          <Card
            key={course.id}
            className="w-full max-w-md h-auto hover:shadow-md transition-all duration-300 relative overflow-hidden"
          >
            {/* Badge Complete */}
            {isCompleted && (
              <div className="absolute top-3 right-3 z-10 bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
                <CheckCircle size={12} />
                Done
              </div>
            )}

            <CardHeader>
              <CardTitle className="text-lg font-semibold line-clamp-1">
                {course.title}
              </CardTitle>
              <CardDescription className="text-sm text-gray-500 line-clamp-1">
                {course.description}
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="flex flex-col items-center justify-center">
                <div className="border border-gray-200 rounded-md overflow-hidden w-full relative">
                  <Image
                    src={course.thumbnail || "/course-1.jpg"}
                    alt={course.title}
                    width={300}
                    height={180}
                    className="object-cover w-full h-40"
                  />
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-2 mt-2">
              <div className="flex justify-between w-full text-sm text-gray-600">
                <span className="font-medium text-xs uppercase tracking-wide text-gray-400">
                  Progress
                </span>
                <span className="font-bold text-gray-700">{percentage}%</span>
              </div>

              {/* FIX UI: Hapus properti indicator/indicatorClassName jika masih error */}
              <div className="w-full relative h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    isCompleted ? "bg-green-500" : "bg-blue-600"
                  }`}
                  style={{ width: `${percentage}%` }}
                />
              </div>

              <Link
                href={`/users/courses/${course.id}`}
                className="w-full mt-2"
              >
                <Button className="w-full bg-blue-600 hover:bg-blue-700 transition-colors">
                  {percentage > 0 ? "Continue Learning" : "Start Course"}
                </Button>
              </Link>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
