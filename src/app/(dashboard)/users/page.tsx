"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import {
  BookOpen,
  Trophy,
  CheckCircle,
  Layers,
  TrendingUp,
} from "lucide-react"; // Import ikon tambahan
import { useDashboard } from "@/hooks/use-dashboard";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ErrorMessage from "@/components/common/ErrorMessage";
import { courseService } from "@/services/course.service";
import UserActivityChart from "./_components/user-activity-chart";
import { StatsCard } from "@/components/common/stats-card";

export default function UserDashboard() {
  const { data, loading, error, refresh } = useDashboard();
  const [motivation, setMotivation] = useState(0);

  // Kata-kata motivasi bergilir
  const motivations = [
    `Keep it up! Every small step brings you closer to your goals.`,
    `You're doing great! Consistency is key.`,
    `You're on a roll! Keep learning and growing.`,
    `Amazing progress! Don't stop now.`,
    `You're unstoppable! The future is yours.`,
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setMotivation((prev) => (prev + 1) % motivations.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [motivations.length]);

  if (loading) {
    return <LoadingSpinner size="lg" text="Loading dashboard..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={refresh} />;
  }

  if (!data) {
    return null;
  }

  return (
    <div className="w-full space-y-8 p-1">
      <div className="w-full bg-gradient-to-r from-sky-500 to-blue-600 rounded-2xl shadow-lg p-8 md:p-10 flex flex-col md:flex-row items-center justify-between text-white relative overflow-hidden">
        <div className="relative z-10 max-w-lg">
          <h1 className="text-2xl md:text-4xl font-bold mb-4">
            Hello, {data.user?.name || "Student"}! 👋
          </h1>
          <p className="text-sky-50 text-sm md:text-base leading-relaxed">
            {motivations[motivation]}
          </p>
        </div>

        <div className="absolute right-0 bottom-0 opacity-20 transform translate-x-10 translate-y-10">
          <Trophy size={180} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Enrolled Courses"
          value={data.statistics.enrolled}
          icon={BookOpen}
          color="bg-blue-100"
          textColor="text-blue-600"
          subtext="Ongoing learning paths"
        />
        <StatsCard
          title="Completed"
          value={data.statistics.completed}
          icon={CheckCircle}
          color="bg-green-100"
          textColor="text-green-600"
          subtext="Courses finished"
        />
        <StatsCard
          title="Avg. Progress"
          value={`${data.statistics.avgProgress}%`}
          icon={Layers}
          color="bg-purple-100"
          textColor="text-purple-600"
          subtext="Keep pushing forward"
        />
        <StatsCard
          title="Certificates"
          value={data.statistics.certificates}
          icon={Trophy}
          color="bg-yellow-100"
          textColor="text-yellow-600"
          subtext="Achievements unlocked"
        />
      </div>

      {/* === 3. Main Content Grid (Chart + New Courses) === */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Kolom Kiri: Chart (Lebar 2/3) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Chart Activity */}
          <UserActivityChart />
        </div>

        {/* Kolom Kanan: Newly Added Courses (Lebar 1/3) - Mirip Sidebar Admin */}
        <Card className="shadow-sm border border-gray-100 h-fit">
          <CardHeader>
            <CardTitle className="text-lg font-bold">New Courses</CardTitle>
          </CardHeader>
          <CardContent>
            {data.latestCourses.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-400">No new courses yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {data.latestCourses.slice(0, 4).map(
                  (
                    course // Batasi 4 course saja biar rapi
                  ) => (
                    <Link
                      key={course.id}
                      href={`/users/courses/${course.id}`}
                      className="block group"
                    >
                      <div className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0 last:pb-0">
                        {/* Thumbnail Kecil */}
                        <div className="h-12 w-12 rounded-lg overflow-hidden flex-shrink-0 relative bg-gray-100">
                          <Image
                            src={courseService.getCourseImageUrl(
                              course.cover_image
                            )}
                            alt={course.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>

                        <div>
                          <h4 className="font-semibold text-sm line-clamp-1 text-gray-800 group-hover:text-blue-600 transition-colors">
                            {course.title}
                          </h4>
                          <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                            <span className="bg-sky-50 text-sky-600 px-1.5 py-0.5 rounded font-medium">
                              New
                            </span>
                            <span className="text-gray-300">•</span>
                            <span className="text-gray-400 line-clamp-1">
                              {course.instructor?.name || "Instructor"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  )
                )}
              </div>
            )}
            <div className="mt-4 pt-2 border-t border-gray-50">
              <Link
                href="/users/courses"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center justify-center"
              >
                View All Courses
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
