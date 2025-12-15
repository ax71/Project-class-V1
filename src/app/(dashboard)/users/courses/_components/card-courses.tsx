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
import { progressService } from "@/services/progress.service";
import { Course, Progress as ProgressType } from "@/types/api";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ErrorMessage from "@/components/common/ErrorMessage";
import { BookOpen } from "lucide-react";

export default function CourseCard() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [progress, setProgress] = useState<ProgressType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [coursesData, progressData] = await Promise.all([
        courseService.getAllCourses(),
        progressService.getUserProgress().catch(() => []),
      ]);
      setCourses(coursesData);
      setProgress(progressData);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getProgressForCourse = (courseId: number) => {
    const courseProgress = progress.find((p) => p.course_id === courseId);
    return courseProgress?.progress_percentage || 0;
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
      {courses.map((course) => (
        <Card
          key={course.id}
          className="w-full max-w-md h-auto hover:shadow-md transition-all duration-300"
        >
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              {course.title}
            </CardTitle>
            <CardDescription className="text-sm text-gray-500 line-clamp-2">
              {course.description}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="flex flex-col items-center justify-center">
              <div className="border border-gray-200 rounded-md overflow-hidden w-full">
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

          {/* ===== Footer (Progress Bar) ===== */}
          <CardFooter className="flex flex-col gap-2 mt-2">
            <div className="flex justify-between w-full text-sm text-gray-600">
              <span>Progress</span>
              <span>{getProgressForCourse(course.id)}%</span>
            </div>
            <Progress value={getProgressForCourse(course.id)} className="w-full" />
            <Link href={`/users/courses/${course.id}`} className="w-full mt-2">
              <Button className="w-full bg-blue-500 hover:bg-blue-600">
                View Course
              </Button>
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

