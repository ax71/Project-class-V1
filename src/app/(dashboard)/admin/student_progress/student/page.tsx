"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function CourseStudentsPage() {
  const { courseId } = useParams();

  // Dummy data siswa
  const students = [
    {
      id: 1,
      name: "Ni Wayan Diantini",
      email: "diantini@example.com",
      progress: 85,
    },
    {
      id: 2,
      name: "Kadek Buktiasa",
      email: "buktiasa@example.com",
      progress: 60,
    },
    {
      id: 3,
      name: "Momet Dwika",
      email: "mometdwika@example.com",
      progress: 40,
    },
  ];

  return (
    <main className="min-h-screen p-6">
      {/* ===== Header ===== */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            Students – Course #{courseId}
          </h1>
          <p className="text-gray-500">
            View learning progress for each student.
          </p>
        </div>

        <Link href="/admin/student_progress" passHref>
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowLeft size={16} /> Back
          </Button>
        </Link>
      </div>

      {/* ===== Student List ===== */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-6">
        {students.map((student) => (
          <Card
            key={student.id}
            className="shadow-sm hover:shadow-md transition border-t-4 border-blue-200"
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold">
                {student.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-3 text-sm">{student.email}</p>

              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Progress
                </span>
                <span className="text-sm text-gray-500">
                  {student.progress}%
                </span>
              </div>

              <Progress value={student.progress} className="h-2 bg-gray-200" />
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
