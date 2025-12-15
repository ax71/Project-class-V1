"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Trophy, CheckCircle, Layers } from "lucide-react";
import { courseService } from "@/services/course.service";
import { progressService } from "@/services/progress.service";
import { certificateService } from "@/services/certificate.service";
import { Course, Progress as ProgressType, Certificate } from "@/types/api";
import LoadingSpinner from "@/components/common/LoadingSpinner";

export default function UserDashboard() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [progress, setProgress] = useState<ProgressType[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("Student");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesData, progressData, certificatesData] =
          await Promise.all([
            courseService.getAllCourses(),
            progressService.getUserProgress().catch(() => []),
            certificateService.getUserCertificates().catch(() => []),
          ]);

        setCourses(coursesData);
        setProgress(progressData);
        setCertificates(certificatesData);

        const userStr = localStorage.getItem("user");
        if (userStr) {
          const user = JSON.parse(userStr);
          setUserName(user.name || "Student");
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const enrolledCount = progress.length;
  const completedCount = progress.filter((p) => p.completed).length;
  const avgProgress =
    progress.length > 0
      ? Math.round(
          progress.reduce((sum, p) => sum + p.progress_percentage, 0) /
            progress.length
        )
      : 0;

  const recentCourses = progress
    .slice(0, 3)
    .map((p) => ({
      ...p,
      course: courses.find((c) => c.id === p.course_id),
    }))
    .filter((p) => p.course);

  if (loading) {
    return <LoadingSpinner size="lg" text="Loading dashboard..." />;
  }

  return (
    <div className="w-full h-full space-y-10">
      <div className="w-full bg-gradient-to-r from-sky-300 to-sky-400 rounded-lg shadow-md p-8 md:p-12 flex flex-col md:flex-row items-center justify-between">
        <div>
          <h1 className="mt-9 text-4xl md:text-5xl font-bold text-black mb-4">
            Good Day, {userName}!
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

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-sm border-t-4 border-blue-400">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
              <BookOpen className="text-blue-500" size={18} /> Enrolled Courses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{enrolledCount}</p>
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
            <p className="text-3xl font-bold">{completedCount}</p>
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
            <p className="text-3xl font-bold">{avgProgress}%</p>
            <Progress value={avgProgress} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="shadow-sm border-t-4 border-yellow-400">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
              <Trophy className="text-yellow-500" size={18} /> Certificates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{certificates.length}</p>
            <p className="text-sm text-gray-500">Achievements unlocked</p>
          </CardContent>
        </Card>
      </div>

      {/* === RECENT COURSES === */}
      {recentCourses.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 dark:text-white">
            Recently Viewed Courses
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentCourses.map((item) => (
              <Link
                key={item.id}
                href={`/users/courses/${item.course_id}`}
              >
                <Card className="overflow-hidden shadow-sm hover:shadow-lg transition">
                  <div className="relative h-40">
                    <Image
                      src={item.course?.thumbnail || "/course-1.jpg"}
                      alt={item.course?.title || "Course"}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      {item.course?.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        Progress: {item.progress_percentage}%
                      </span>
                    </div>
                    <Progress value={item.progress_percentage} className="mt-2" />
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* === MOTIVATIONAL BANNER === */}
      <div className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white rounded-xl shadow-md p-6 flex flex-col md:flex-row justify-between items-center">
        <p className="text-lg md:text-xl font-medium text-center md:text-left">
          ✨ Keep it up, {userName}! Every small step brings you closer to
          mastery.
        </p>
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
