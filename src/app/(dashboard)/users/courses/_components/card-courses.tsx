"use client";

import React from "react";
import Image from "next/image";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function CourseCard() {
  // === Dummy data: course yang diikuti user ===
  const userCourses = [
    {
      id: 1,
      title: "Web Design Basics",
      category: "Frontend Development",
      progress: 80,
      thumbnail: "/course-1.jpg",
    },
    {
      id: 2,
      title: "Advanced React Patterns",
      category: "Frontend Development",
      progress: 45,
      thumbnail: "/course-2.jpg",
    },
    {
      id: 3,
      title: "UX for Developers",
      category: "UI/UX",
      progress: 100,
      thumbnail: "/course-3.jpg",
    },
  ];

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {userCourses.map((course) => (
        <Card
          key={course.id}
          className="w-[300px] max-w-md h-auto hover:shadow-md transition-all duration-300"
        >
          {/* ===== Header ===== */}
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              {course.title}
            </CardTitle>
            <CardDescription className="text-sm text-gray-500">
              {course.category}
            </CardDescription>
          </CardHeader>

          {/* ===== Image ===== */}
          <CardContent>
            <div className="flex flex-col items-center justify-center">
              <div className="border border-gray-200 rounded-md overflow-hidden">
                <Image
                  src={course.thumbnail}
                  alt={course.title}
                  width={300}
                  height={180}
                  className="object-cover w-full h-40"
                />
              </div>
            </div>
          </CardContent>

          {/* ===== Footer (Progress Bar) ===== */}
          <CardFooter className="flex flex-col gap-2 mt-2">
            <div className="flex justify-between w-full text-sm text-gray-600">
              <span>Progress</span>
              <span>{course.progress}%</span>
            </div>
            <Progress value={course.progress} className="w-full" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
