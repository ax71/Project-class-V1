"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Edit, Trash2, BookOpen } from "lucide-react";

export default function CoursesTaughtPage() {
  const [search, setSearch] = useState("");

  // Data kursus sederhana
  const courses = [
    {
      id: 1,
      title: "Introduction to Web Design",
      category: "Design",
      thumbnail: "/course-1.jpg",
    },
    {
      id: 2,
      title: "Basic HTML & CSS",
      category: "Programming",
      thumbnail: "/course-2.jpg",
    },
    {
      id: 3,
      title: "Responsive Layout Techniques",
      category: "UI/UX",
      thumbnail: "/course-3.jpg",
    },
  ];

  // Filter pencarian berdasarkan judul kursus
  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      {/* ===== Header ===== */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            Courses Taught
          </h1>
          <p className="text-gray-500">
            Manage and update the courses you’re teaching.
          </p>
        </div>
        <Button className="bg-blue-500 hover:bg-blue-700 text-white">
          + New Course
        </Button>
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
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <Card
              key={course.id}
              className="w-full max-w-md shadow-sm hover:shadow-lg transition"
            >
              <CardHeader>
                <CardTitle>{course.title}</CardTitle>
                <CardDescription>{course.category}</CardDescription>
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
              <CardFooter className="flex justify-between gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex items-center gap-1"
                >
                  <Edit size={16} /> Edit
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  className="bg-gray-600 text-white flex items-center gap-1"
                >
                  <Trash2 size={16} /> Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
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
