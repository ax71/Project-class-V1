"use client";

import { useEffect, useState } from "react";
import Link from "next/link"; // Tambahkan Link agar kartu bisa diklik
import Image from "next/image";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { progressService } from "@/services/progress.service";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ErrorMessage from "@/components/common/ErrorMessage";
import { BookOpen, CheckCircle } from "lucide-react";

// Kita definisikan tipe data lokal agar aman
interface ProgressSummaryItem {
  course_id: number;
  title: string;
  percentage: number;
  thumbnail?: string;
  is_completed?: boolean;
}

export default function CardProgress() {
  const [progressData, setProgressData] = useState<ProgressSummaryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // PERBAIKAN 1: Panggil Summary (Bukan UserProgress biasa)
      const data = await progressService.getProgressSummary();
      setProgressData(data);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to load progress");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return <LoadingSpinner size="lg" text="Loading your progress..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchData} />;
  }

  if (progressData.length === 0) {
    return (
      <div className="text-center py-12 w-full h-full border-2 border-dashed rounded-lg bg-gray-50">
        <div className="flex flex-col items-center align-center justify-center">
          <BookOpen size={48} className="mx-auto mb-3 text-gray-400" />
          <p className="text-gray-500 font-medium">No progress found.</p>
          <p className="text-sm text-gray-400 mt-1">
            Start a course to track your journey!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
        Your Learning Progress
      </h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {progressData.map((item) => (
          <Card
            key={item.course_id}
            className="flex flex-col overflow-hidden hover:shadow-lg transition-all duration-300"
          >
            <CardHeader className="p-0">
              <div className="relative w-full aspect-video bg-gray-200">
                <Image
                  src={item.thumbnail || "/course-1.jpg"}
                  // PERBAIKAN 2: Pastikan ALT selalu ada
                  alt={item.title || "Course Thumbnail"}
                  fill
                  className="object-cover"
                />
              </div>
            </CardHeader>

            <CardContent className="flex-1 p-5">
              {/* PERBAIKAN 3: Syntax title diperbaiki */}
              <CardTitle className="text-lg font-semibold line-clamp-1 mb-2">
                {item.title || `Course #${item.course_id}`}
              </CardTitle>

              <div className="space-y-2 mt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400 font-medium">
                    Progress
                  </span>
                  <span className="font-bold text-blue-600">
                    {item.percentage}%
                  </span>
                </div>
                <Progress value={item.percentage} className="h-2" />
              </div>
            </CardContent>

            <CardFooter className="p-5 pt-0">
              {item.percentage === 100 ? (
                <div className="w-full bg-green-50 text-green-700 py-2 rounded-md flex items-center justify-center gap-2 text-sm font-semibold border border-green-200">
                  <CheckCircle size={16} /> Completed
                </div>
              ) : (
                <Link
                  href={`/users/courses/${item.course_id}`}
                  className="w-full"
                >
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    Continue Learning
                  </Button>
                </Link>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
