"use client";

import Image from "next/image";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Trophy, CheckCircle, Layers } from "lucide-react";

export default function UserDashboard() {
  const recentCourses = [
    {
      id: 1,
      title: "Web Design Basics",
      thumbnail: "/course-1.jpg",
      progress: 85,
    },
    {
      id: 2,
      title: "Mastering React",
      thumbnail: "/course-2.jpg",
      progress: 45,
    },
    {
      id: 3,
      title: "UI/UX Principles",
      thumbnail: "/course-3.jpg",
      progress: 100,
    },
  ];

  return (
    <div className="w-full h-full space-y-10">
      <div className="w-full bg-gradient-to-r from-sky-300 to-sky-400 rounded-lg shadow-md p-8 md:p-12 flex flex-col md:flex-row items-center justify-between">
        <div>
          <h1 className="mt-9 text-4xl md:text-5xl font-bold text-black mb-4">
            Good Day, Bukti!
          </h1>
          <p className="mt-15 text-lg md:text-sm text-black font-mono">
            Ready start your day with Positivus?
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

      {/* === QUICK STATS SECTION === */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-sm border-t-4 border-blue-400">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
              <BookOpen className="text-blue-500" size={18} /> Enrolled Courses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">6</p>
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
            <p className="text-3xl font-bold">3</p>
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
            <p className="text-3xl font-bold">74%</p>
            <Progress value={74} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="shadow-sm border-t-4 border-yellow-400">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
              <Trophy className="text-yellow-500" size={18} /> Certificates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">2</p>
            <p className="text-sm text-gray-500">Achievements unlocked</p>
          </CardContent>
        </Card>
      </div>

      {/* === RECENT COURSES === */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 dark:text-white">
          Recently Viewed Courses
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {recentCourses.map((course) => (
            <Card key={course.id} className=" overflow-hidden shadow-sm">
              <div className="relative h-40">
                <Image
                  src={course.thumbnail}
                  alt={course.title}
                  fill
                  className="object-cover"
                />
              </div>
              <CardHeader>
                <CardTitle className="text-lg">{course.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    Progress: {course.progress}%
                  </span>
                </div>
                <Progress value={course.progress} className="mt-2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* === MOTIVATIONAL BANNER === */}
      <div className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white rounded-xl shadow-md p-6 flex flex-col md:flex-row justify-between items-center">
        <p className="text-lg md:text-xl font-medium text-center md:text-left">
          ✨ Keep it up, Bukti! Every small step brings you closer to mastery.
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
