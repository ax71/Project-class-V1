"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { progressService } from "@/services/progress.service";
import { Progress as ProgressType } from "@/types/api";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ErrorMessage from "@/components/common/ErrorMessage";
import { BookOpen } from "lucide-react";
import Image from "next/image";

export default function CardProgress() {
  const [progressData, setProgressData] = useState<ProgressType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await progressService.getUserProgress();
      setProgressData(data);
    } catch (err: any) {
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
      <div className="text-center py-12 w-full h-full">
        <div className="flex flex-col items-center align-center justify-center">
          <BookOpen size={48} className="mx-auto mb-3 text-gray-400" />
          <p className="text-gray-500">
            No progress yet. Start learning to track your progress!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
        Your Learning Progress
      </h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {progressData.map((progress) => (
          <Card key={progress.course_id}>
            <CardHeader>
              <CardTitle className="text-lg">
                {progress.title || `Course #${progress.course_id}`}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative w-full aspect-video bg-gray-200 rounded-lg mb-4">
                <Image
                  src={progress.thumbnail || "/course-1.jpg"}
                  alt={progress.title}
                  width={300}
                  height={180}
                  className="object-cover rounded-lg"
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    Progress
                  </span>
                  <span className="font-medium">{progress.percentage}%</span>
                </div>
                <Progress value={progress.percentage} />
                {progress.is_completed && (
                  <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                    ✓ Completed
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
