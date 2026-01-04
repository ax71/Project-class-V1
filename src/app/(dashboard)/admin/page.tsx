"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  BookOpen,
  Trophy,
  Activity,
  TrendingUp,
  CheckCircle,
} from "lucide-react";
import {
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { courseService } from "@/services/course.service";
import { Course } from "@/types/api";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import axios from "axios";
import { StatsCard } from "@/components/common/stats-card";

interface ChartData {
  date: string;
  total: number;
}

export default function AdminDashboard() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [adminName, setAdminName] = useState("Admin");

  // State Statistik Real
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalMaterials: 0,
    totalQuizzes: 0,
    weeklyCompletions: 0,
  });

  const getCookie = (name: string) => {
    if (typeof document === "undefined") return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return decodeURIComponent(parts.pop()?.split(";").shift() || "");
    }
    return null;
  };

  useEffect(() => {
    const userProfile = getCookie("user_profile");
    if (userProfile) {
      try {
        const decodedProfile = decodeURIComponent(userProfile);
        const jsonStr = decodedProfile.startsWith("j:")
          ? decodedProfile.slice(2)
          : decodedProfile;
        const user = JSON.parse(jsonStr);
        setAdminName(user.name || "Admin");
      } catch (e) {
        console.error("Error parsing user profile cookie", e);
      }
    }

    const fetchData = async () => {
      try {
        const token = getCookie("token") || localStorage.getItem("token");

        const coursesData = await courseService.getAllCourses();
        setCourses(coursesData);

        const tMaterials = coursesData.reduce(
          (sum, course) => sum + (course.materials_count || 0),
          0
        );
        const tQuizzes = coursesData.reduce(
          (sum, course) => sum + (course.quizzes_count || 0),
          0
        );

        let analyticsData: ChartData[] = [];
        let totalWeekly = 0;

        if (token) {
          try {
            const analyticsRes = await axios.get(
              "http://localhost:8000/api/admin/global-activity-chart",
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );
            analyticsData = analyticsRes.data.data;
            totalWeekly = analyticsData.reduce(
              (acc, curr) => acc + curr.total,
              0
            );
          } catch (err) {
            console.error("Gagal mengambil data analytics chart", err);
          }
        }

        setChartData(analyticsData);
        setStats({
          totalCourses: coursesData.length,
          totalMaterials: tMaterials,
          totalQuizzes: tQuizzes,
          weeklyCompletions: totalWeekly,
        });
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <LoadingSpinner size="lg" text="Syncing dashboard data..." />;
  }

  return (
    <div className="w-full space-y-8 p-1">
      <div className="w-full bg-gradient-to-r from-sky-500 to-blue-600 rounded-2xl shadow-lg p-8 md:p-10 flex flex-col md:flex-row items-center justify-between text-white relative overflow-hidden">
        <div className="relative z-10 max-w-lg">
          <h1 className="text-2xl md:text-4xl font-bold mb-4">
            Hello, {adminName}! 👋
          </h1>
          <p className="text-sky-50 text-sm md:text-base leading-relaxed">
            Here is your platform overview. You have{" "}
            <strong>{stats.totalCourses} active courses</strong> and{" "}
            <strong>{stats.weeklyCompletions} learning activities</strong> this
            week.
          </p>
        </div>
        <div className="absolute right-0 bottom-0 opacity-20 transform translate-x-10 translate-y-10">
          <Trophy size={180} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Courses"
          value={stats.totalCourses}
          icon={BookOpen}
          color="bg-blue-100"
          textColor="text-blue-600"
          subtext="Active learning paths"
        />
        <StatsCard
          title="Materials"
          value={stats.totalMaterials}
          icon={Activity}
          color="bg-indigo-100"
          textColor="text-indigo-600"
          subtext="Resources uploaded"
        />
        <StatsCard
          title="Quizzes"
          value={stats.totalQuizzes}
          icon={Trophy}
          color="bg-yellow-100"
          textColor="text-yellow-600"
          subtext="Assessments ready"
        />
        <StatsCard
          title="Completed"
          value={stats.weeklyCompletions}
          icon={CheckCircle}
          color="bg-sky-100"
          textColor="text-sky-600"
          subtext="Items completed"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 shadow-sm border border-gray-100">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold">
                  Global Learning Traffic
                </CardTitle>
                <p className="text-sm text-gray-500">
                  Student completion activity over the last 7 days
                </p>
              </div>
              <div className="p-2 bg-sky-50 text-sky-600 rounded-lg">
                <TrendingUp size={20} />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="colorCompletions"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#e5e7eb"
                  />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12, fill: "#6b7280" }}
                    axisLine={false}
                    tickLine={false}
                    dy={10}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: "#6b7280" }}
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "none",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="total"
                    stroke="#0ea5e9"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorCompletions)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border border-gray-100">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Recently Added</CardTitle>
          </CardHeader>
          <CardContent>
            {courses.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-400">No courses yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {courses.slice(0, 5).map((course) => (
                  <div
                    key={course.id}
                    className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0 last:pb-0"
                  >
                    <div className="h-10 w-10 rounded-lg bg-sky-100 flex items-center justify-center text-sky-600 flex-shrink-0">
                      <BookOpen size={18} />
                    </div>
                    <div>
                      <h4
                        className="font-semibold text-sm line-clamp-1 text-gray-800"
                        title={course.title}
                      >
                        {course.title}
                      </h4>
                      <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                        <span className="bg-gray-100 px-1.5 py-0.5 rounded">
                          {course.materials_count || 0} Materials
                        </span>
                        <span className="text-gray-300">•</span>
                        <span className="text-gray-400">
                          {new Date(
                            course.created_at || Date.now()
                          ).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
