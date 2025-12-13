"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Users, BookOpen, Trophy, Activity } from "lucide-react";
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { courseService } from "@/services/course.service";
import { Course } from "@/types/api";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import Cookies from "js-cookie";

export default function AdminDashboard() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [adminName, setAdminName] = useState("Admin");

  useEffect(() => {
    // Get admin name from cookies
    const userProfile = Cookies.get("user_profile");
    if (userProfile) {
      const user = JSON.parse(userProfile);
      setAdminName(user.name || "Admin");
    }

    // Fetch courses
    const fetchData = async () => {
      try {
        const coursesData = await courseService.getAllCourses();
        setCourses(coursesData);
      } catch (error) {
        console.error("Failed to load courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate statistics
  const totalCourses = courses.length;
  const totalMaterials = courses.reduce(
    (sum, course) => sum + (course.materials?.length || 0),
    0
  );
  const totalQuizzes = courses.reduce(
    (sum, course) => sum + (course.quizzes?.length || 0),
    0
  );

  // Chart data - courses created over time (simplified)
  const chartData = [
    { name: "Mon", courses: 2 },
    { name: "Tue", courses: 5 },
    { name: "Wed", courses: 3 },
    { name: "Thu", courses: 7 },
    { name: "Fri", courses: 4 },
  ];

  if (loading) {
    return <LoadingSpinner size="lg" text="Loading dashboard..." />;
  }

  return (
    <div className="w-full h-full space-y-10">
      <div className="w-full bg-gradient-to-r from-sky-300 to-sky-400 rounded-lg shadow-md p-8 md:p-12 flex flex-col md:flex-row items-center justify-between">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-black mb-4">
            Welcome back, {adminName}! 🎓
          </h1>
          <p className="mt-9 text-lg md:text-sm text-black font-mono">
            Monitor activities, manage courses, and support better learning
            outcomes for your students. Let's make today productive!
          </p>
        </div>

        <div className="ml-8">
          <Image
            src="/Illustration-1.svg"
            alt="Admin Dashboard Illustration"
            width={300}
            height={300}
            priority
          />
        </div>
      </div>

      {/* === Quick Stats Section === */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-sm border-t-4 border-blue-400">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <BookOpen size={18} className="text-blue-500" />
              Total Courses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalCourses}</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-t-4 border-green-400">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Activity size={18} className="text-green-500" />
              Total Materials
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalMaterials}</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-t-4 border-yellow-400">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Trophy size={18} className="text-yellow-500" />
              Total Quizzes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalQuizzes}</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-t-4 border-purple-400">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Users size={18} className="text-purple-500" />
              Active Students
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">-</p>
            <p className="text-xs text-gray-500 mt-1">Coming soon</p>
          </CardContent>
        </Card>
      </div>

      {/* === Chart Section === */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Course Activity Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 10, right: 20, left: -10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="courses" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* === Recent Courses === */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Recent Courses</CardTitle>
        </CardHeader>
        <CardContent>
          {courses.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              No courses created yet
            </p>
          ) : (
            <div className="space-y-3">
              {courses.slice(0, 5).map((course) => (
                <div
                  key={course.id}
                  className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <div>
                    <p className="font-medium">{course.title}</p>
                    <p className="text-sm text-gray-500">
                      {course.materials?.length || 0} materials •{" "}
                      {course.quizzes?.length || 0} quizzes
                    </p>
                  </div>
                  <p className="text-sm text-gray-400">
                    {new Date(course.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
