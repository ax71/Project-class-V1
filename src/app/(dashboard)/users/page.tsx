"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { BookOpen, Trophy, CheckCircle, Layers } from "lucide-react";
import { useDashboard } from "@/hooks/use-dashboard";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ErrorMessage from "@/components/common/ErrorMessage";

export default function UserDashboard() {
  const { data, loading, error, refresh } = useDashboard();
  const [motivation, setMotivation] = useState(0);

  const motivations = [
    {
      title: `Keep it up, ${
        data?.user?.name || "Student"
      }! Every small step brings you closer to your goals.`,
    },
    {
      title: `You're doing great, ${
        data?.user?.name || "Student"
      }! Keep it up!`,
    },
    {
      title: `You're on a roll, ${
        data?.user?.name || "Student"
      }! Keep learning!`,
    },
    {
      title: `Amazing progress, ${
        data?.user?.name || "Student"
      }! Keep pushing forward!`,
    },
    {
      title: `You're unstoppable, ${
        data?.user?.name || "Student"
      }! Keep it up!`,
    },
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
    <div className="w-full h-full space-y-10">
      {/* Welcome Banner */}
      <div className="w-full bg-gradient-to-r from-sky-300 to-sky-400 rounded-lg shadow-md p-8 md:p-12 flex flex-col md:flex-row items-center justify-between">
        <div>
          <h1 className="mt-9 text-4xl md:text-5xl font-bold text-black mb-4">
            Good Day, {data.user?.name || "Student"}!
          </h1>
          <p className="mt-15 text-lg md:text-sm text-black font-mono">
            Ready to start your day with Positivus?
          </p>
        </div>

        <div className="ml-8">
          <Image
            src="/Illustration-1.svg"
            alt="User Dashboard Illustration"
            width={300}
            height={200}
            priority
          />
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-sm border-t-4 border-blue-400">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
              <BookOpen className="text-blue-500" size={18} /> Enrolled Courses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{data.statistics.enrolled}</p>
            <p className="text-sm text-gray-500">Ongoing learning paths</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-t-4 border-green-400">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
              <CheckCircle className="text-green-500" size={18} /> Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{data.statistics.completed}</p>
            <p className="text-sm text-gray-500">Courses finished</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-t-4 border-purple-400">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
              <Layers className="text-purple-500" size={18} /> Average Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{data.statistics.avgProgress}%</p>
            <div className="mt-2">
              <ProgressBar
                percentage={data.statistics.avgProgress}
                completed={data.statistics.completed}
                total={data.statistics.enrolled}
                showDetails={false}
                size="sm"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-t-4 border-yellow-400">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
              <Trophy className="text-yellow-500" size={18} /> Certificates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{data.statistics.certificates}</p>
            <p className="text-sm text-gray-500">Achievements unlocked</p>
          </CardContent>
        </Card>
      </div>

      {/* Newly Added Courses */}
      {data.latestCourses.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 dark:text-white">
            Newly Added Courses
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {data.latestCourses.map((course) => (
              <Link key={course.id} href={`/users/courses/${course.id}`}>
                <Card className="overflow-hidden shadow-sm hover:shadow-lg transition h-full">
                  <div className="relative h-40">
                    <Image
                      src={course.thumbnail || "/course-1.jpg"}
                      alt={course.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                      New
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-lg line-clamp-2">
                      {course.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-500 line-clamp-2">
                      {course.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* My Enrolled Courses */}
      {data.enrolledCourses.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 dark:text-white">
            My Enrolled Courses
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {data.enrolledCourses.map((course) => (
              <Link key={course.id} href={`/users/courses/${course.id}`}>
                <Card className="overflow-hidden shadow-sm hover:shadow-lg transition h-full">
                  <div className="relative h-40">
                    <Image
                      src={course.thumbnail || "/course-1.jpg"}
                      alt={course.title}
                      fill
                      className="object-cover"
                    />
                    {course.progress?.percentage === 100 && (
                      <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                        <CheckCircle size={14} />
                        Complete
                      </div>
                    )}
                  </div>
                  <CardHeader>
                    <CardTitle className="text-lg line-clamp-2">
                      {course.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {course.progress && (
                      <ProgressBar
                        percentage={course.progress.percentage || 0}
                        // PERBAIKAN DI SINI: Tambahkan fallback '|| 0'
                        completed={course.progress.completed_items || 0}
                        total={course.progress.total_items || 0}
                        showDetails={true}
                        size="sm"
                      />
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Motivational Banner */}
      <div className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white rounded-xl shadow-md p-6 flex flex-col md:flex-row justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">
            {motivations[motivation].title}
          </h1>
        </div>
        <Image
          src="/Illustration-1.svg"
          alt="Motivation Illustration"
          width={180}
          height={180}
          className="mt-4 md:mt-0"
        />
      </div>
    </div>
  );
}
