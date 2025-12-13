"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { progressService } from "@/services/progress.service";
import { Progress as ProgressType } from "@/types/api";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ErrorMessage from "@/components/common/ErrorMessage";
import { BookOpen } from "lucide-react";

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
      <div className="text-center py-12">
        <BookOpen size={48} className="mx-auto mb-3 text-gray-400" />
        <p className="text-gray-500">
          No progress data available. Start learning to track your progress!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
        Your Learning Progress
      </h1>

      <div className="grid gap-4">
        {progressData.map((progress) => (
          <Card key={progress.id}>
            <CardHeader>
              <CardTitle className="text-lg">
                {progress.course?.title || `Course #${progress.course_id}`}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    Progress
                  </span>
                  <span className="font-medium">
                    {progress.progress_percentage}%
                  </span>
                </div>
                <Progress value={progress.progress_percentage} />
                {progress.completed && (
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
