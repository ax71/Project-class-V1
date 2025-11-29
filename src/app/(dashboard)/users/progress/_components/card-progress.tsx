"use client";

import { useMemo } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Layers, CheckCircle, Clock, BookOpen } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function CardProgress() {
  // === Dummy data kursus user ===
  const courses = [
    { id: 1, title: "Web Design Basics", progress: 85 },
    { id: 2, title: "React Advanced Patterns", progress: 45 },
    { id: 3, title: "UX for Developers", progress: 100 },
    { id: 4, title: "Backend Fundamentals", progress: 60 },
  ];

  // === Statistik ringkas ===
  const totalCourses = courses.length;
  const completedCourses = courses.filter((c) => c.progress === 100).length;
  const inProgressCourses = courses.filter((c) => c.progress < 100).length;

  // === Hitung rata-rata progres semua kursus ===
  const averageProgress = useMemo(() => {
    const totalProgress = courses.reduce((acc, c) => acc + c.progress, 0);
    return Math.round(totalProgress / totalCourses);
  }, [courses]);

  // === Data dummy untuk aktivitas terbaru ===
  const activities = [
    { id: 1, text: "✅ Completed UX for Developers — 2 days ago" },
    { id: 2, text: "📘 Started React Advanced Patterns — 3 days ago" },
    { id: 3, text: "🚀 Earned 10 XP points for daily login" },
  ];

  return (
    <div className="space-y-8">
      {/* ===== Header ===== */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800 flex items-center gap-2 dark:text-white">
            <BookOpen size={22} /> Learning Progress
          </h1>
          <p className="text-gray-500">
            Track your overall learning performance and course completion.
          </p>
        </div>
      </div>

      {/* ===== Summary Cards ===== */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-sm border-t-4 border-blue-400">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Layers size={18} className="text-blue-500" /> Total Courses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalCourses}</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-t-4 border-green-400">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <CheckCircle size={18} className="text-green-500" /> Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{completedCourses}</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-t-4 border-yellow-400">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Clock size={18} className="text-yellow-500" /> In Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{inProgressCourses}</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-t-4 border-purple-400">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              🎯 Avg Completion
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{averageProgress}%</p>
            <Progress value={averageProgress} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* ===== Chart + Sidebar Section ===== */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* === Left: Chart === */}
        <Card className="shadow-sm lg:col-span-2">
          <CardHeader>
            <CardTitle>Course Progress Overview</CardTitle>
            <CardDescription className="dark:text-white">
              Progress percentage across all your enrolled courses.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 ">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={courses}
                  margin={{ top: 10, right: 20, left: -10, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="title" tick={{ fontSize: 12 }} />
                  <YAxis />
                  <Tooltip />
                  <Bar
                    dataKey="progress"
                    fill="#7c3aed"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* === Right: Activities + Motivation === */}
        <div className="flex flex-col gap-4 dark:text-white">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-gray-600 dark:text-white">
              {activities.map((a) => (
                <p key={a.id}>{a.text}</p>
              ))}
            </CardContent>
          </Card>

          <Card className="shadow-sm border-l-4 border-sky-400">
            <CardHeader>
              <CardTitle>Motivation of the Day 💪</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="italic text-gray-700 dark:text-white">
                “Consistency is what transforms average into excellence.”
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
