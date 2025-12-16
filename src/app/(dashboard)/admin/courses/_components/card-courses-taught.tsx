"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Edit, Trash2, BookOpen, Plus, FileText } from "lucide-react";
import Link from "next/link";
import { courseService } from "@/services/course.service";
import { Course } from "@/types/api";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ErrorMessage from "@/components/common/ErrorMessage";

export default function CoursesTaughtPage() {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await courseService.getAllCourses();
      setCourses(data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // === Fungsi hapus kursus ===
  const handleDelete = async (id: number) => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this course?"
    );
    if (confirmDelete) {
      try {
        await courseService.deleteCourse(id);
        setCourses((prevCourses) =>
          prevCourses.filter((course) => course.id !== id)
        );
        alert("✅ Course deleted successfully");
      } catch (err: any) {
        alert(
          `Failed to delete course: ${
            err.response?.data?.message || err.message
          }`
        );
      }
    }
  };

  // === Fungsi Edit (simpan ke localStorage lalu redirect) ===
  const handleEdit = (course: Course) => {
    localStorage.setItem("editingCourse", JSON.stringify(course));
    router.push("/edit-course");
  };

  // === Filter pencarian ===
  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <LoadingSpinner size="lg" text="Loading courses..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchCourses} />;
  }

  return (
    <main className="min-h-screen p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
            Courses Taught
          </h1>
          <p className="text-gray-500">
            Manage and update the courses you are teaching.
          </p>
        </div>

        <Link href="/add-course">
          <Button className="bg-blue-500 hover:bg-blue-700 text-white flex items-center gap-2">
            <Plus size={18} />
            New Course
          </Button>
        </Link>
      </div>

      <div className="relative w-full md:w-1/3 mb-8">
        <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Search courses..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
        />
      </div>

      {filteredCourses.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredCourses.map((course) => (
            <Card
              key={course.id}
              className="w-full max-w-md shadow-sm hover:shadow-lg transition"
            >
              <CardHeader>
                <CardTitle>{course.title}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {course.description}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="border border-gray-200 rounded-md overflow-hidden">
                  <Image
                    src={course.thumbnail || "/course-1.jpg"}
                    alt={course.title}
                    width={400}
                    height={250}
                    className="object-cover w-full h-40"
                  />
                </div>
              </CardContent>

              <CardFooter className="flex flex-col gap-2">
                <div className="flex justify-between gap-2 w-full">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex items-center gap-1 flex-1"
                    onClick={() =>
                      router.push(
                        `/admin/courses_taught/${course.id}/materials`
                      )
                    }
                  >
                    <FileText size={16} /> Materials
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    className="flex items-center gap-1 flex-1"
                    onClick={() =>
                      router.push(`/admin/courses_taught/${course.id}/quizzes`)
                    }
                  >
                    <BookOpen size={16} /> Quizzes
                  </Button>
                </div>

                <div className="flex justify-between gap-2 w-full">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex items-center gap-1"
                    onClick={() => handleEdit(course)}
                  >
                    <Edit size={16} /> Edit
                  </Button>

                  <Button
                    size="sm"
                    variant="destructive"
                    className="bg-red-600 text-white flex items-center gap-1"
                    onClick={() => handleDelete(course.id)}
                  >
                    <Trash2 size={16} /> Delete
                  </Button>
                </div>
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
