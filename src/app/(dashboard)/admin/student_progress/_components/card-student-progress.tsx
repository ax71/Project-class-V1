"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Users, BookOpen } from "lucide-react";

export default function StudentProgressPage() {
  const [search, setSearch] = useState("");

  // Dummy data course
  const courses = [
    {
      id: 1,
      title: "Introduction to Web Design",
      category: "Frontend Development",
      thumbnail: "/course-1.jpg",
      students: 10,
      completed: 3,
    },
    {
      id: 2,
      title: "Advanced React Patterns",
      category: "Frontend Development",
      thumbnail: "/course-2.jpg",
      students: 18,
      completed: 12,
    },
    {
      id: 3,
      title: "Responsive Layout Techniques",
      category: "UI/UX",
      thumbnail: "/course-3.jpg",
      students: 30,
      completed: 22,
    },
    {
      id: 4,
      title: "Backend Fundamentals",
      category: "Backend Development",
      thumbnail: "/course-4.jpg",
      students: 15,
      completed: 7,
    },
  ];

  // Filter pencarian
  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="min-h-screen p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
            Student Progress
          </h1>
          <p className="text-gray-500">
            View student progress across your courses.
          </p>
        </div>
      </div>

      {/* ===== Search Bar ===== */}
      <div className="relative w-full md:w-1/3 mb-8">
        <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Search courses..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* ===== Course Cards ===== */}
      {filteredCourses.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredCourses.map((course) => {
            const progressRatio = course.completed / course.students;
            const progressPercent = progressRatio * 100;

            return (
              <Card
                key={course.id}
                className="w-full max-w-md shadow-sm hover:shadow-lg transition cursor-pointer"
              >
                <CardHeader>
                  <CardTitle>{course.title}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {course.category}
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="border border-gray-200 rounded-md overflow-hidden">
                    <Image
                      src={course.thumbnail}
                      alt={course.title}
                      width={400}
                      height={250}
                      className="object-cover w-full h-40"
                    />
                  </div>
                </CardContent>

                <CardFooter className="flex flex-col gap-3">
                  {/* Diagram batang progress */}
                  <div className="w-full">
                    <div className="flex justify-between text-sm text-gray-700 dark:text-gray-300 mb-1">
                      <span>Progress</span>
                      <span>
                        {course.completed}/{course.students} completed
                      </span>
                    </div>

                    {/* Bar progress */}
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-[#00A7BD] h-3 transition-all duration-500"
                        style={{ width: `${progressPercent}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Tombol */}
                  <Link href={`/admin/student_progress/student`} passHref>
                    <Button
                      size="sm"
                      className="bg-blue-400 hover:bg-blue-700 text-white flex gap-1 mt-2"
                    >
                      <Users size={16} /> View Students
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="text-center text-gray-500 mt-16">
          <BookOpen size={48} className="mx-auto mb-3 text-gray-400" />
          <p>No courses found.</p>
        </div>
      )}
    </main>
  );
}
