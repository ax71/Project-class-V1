"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
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
import { Input } from "@/components/ui/input"; // Menggunakan komponen Input shadcn
import {
  Search,
  Edit,
  Trash2,
  BookOpen,
  Plus,
  FileText,
  MoreVertical,
  GraduationCap,
} from "lucide-react";
import { courseService } from "@/services/course.service";
import { Course } from "@/types/api";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ErrorMessage from "@/components/common/ErrorMessage";
import { toast } from "sonner";

export default function CoursesTaughtPage() {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await courseService.getAllCourses();
      setCourses(data);
    } catch (err: any) {
      console.error(err);
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
    // Menggunakan confirm bawaan browser (bisa diganti dengan Dialog component jika mau lebih cantik)
    if (
      !confirm(
        "Are you sure you want to delete this course? This action cannot be undone."
      )
    )
      return;

    setIsDeleting(id);
    try {
      await courseService.deleteCourse(id);

      setCourses((prevCourses) =>
        prevCourses.filter((course) => course.id !== id)
      );

      toast.success("Course deleted successfully");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to delete course");
    } finally {
      setIsDeleting(null);
    }
  };

  const handleEdit = (courseId: number) => {
    router.push(`/admin/courses/${courseId}/edit`);
  };

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
    <main className="p-6 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
            <GraduationCap className="h-8 w-8 text-blue-600" />
            Courses Taught
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your curriculum, materials, and quizzes here.
          </p>
        </div>

        <Link href="/add-course">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-md">
            <Plus className="mr-2 h-4 w-4" />
            Create New Course
          </Button>
        </Link>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          type="text"
          placeholder="Search your courses..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 bg-white dark:bg-gray-900"
        />
      </div>

      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCourses.map((course) => (
            <Card
              key={course.id}
              className="group flex flex-col overflow-hidden border hover:border-blue-300 hover:shadow-lg transition-all duration-300"
            >
              <div className="relative w-full aspect-video bg-gray-100 dark:bg-gray-800 overflow-hidden">
                <Image
                  src={courseService.getCourseImageUrl(course.cover_image)}
                  alt={course.title}
                  width={300}
                  height={180}
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <CardHeader className="pb-1">
                <CardTitle
                  className="text-lg leading-tight line-clamp-1"
                  title={course.title}
                >
                  {course.title}
                </CardTitle>
                <CardDescription className="line-clamp-2 text-xs mt-1">
                  {course.description || "No description provided."}
                </CardDescription>
              </CardHeader>

              <CardFooter className="flex flex-col gap-3 pt-0 p-4 bg-gray-50/50 dark:bg-gray-900/30 border-t">
                <div className="grid grid-cols-2 gap-2 w-full">
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full text-xs h-8"
                    onClick={() =>
                      router.push(`/admin/courses/${course.id}/materials`)
                    }
                  >
                    <FileText className="mr-1.5 h-3.5 w-3.5 text-blue-500" />
                    Materials
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full text-xs h-8"
                    onClick={() =>
                      router.push(`/admin/courses/${course.id}/quizzes`)
                    }
                  >
                    <BookOpen className="mr-1.5 h-3.5 w-3.5 text-orange-500" />
                    Quizzes
                  </Button>
                </div>

                {/* Manage Actions */}
                <div className="flex items-center justify-between gap-2 w-full pt-2 border-t border-dashed border-gray-200 dark:border-gray-700">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="flex-1 text-gray-600 hover:text-blue-600 hover:bg-blue-50 h-8"
                    onClick={() => handleEdit(course.id)}
                  >
                    <Edit className="mr-1.5 h-3.5 w-3.5" />
                    Edit
                  </Button>

                  <div className="w-px h-4 bg-gray-300 dark:bg-gray-700"></div>

                  <Button
                    size="sm"
                    variant="ghost"
                    className="flex-1 text-gray-600 hover:text-red-600 hover:bg-red-50 h-8"
                    disabled={isDeleting === course.id}
                    onClick={() => handleDelete(course.id)}
                  >
                    {isDeleting === course.id ? (
                      <span className="animate-pulse">Deleting...</span>
                    ) : (
                      <>
                        <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                        Delete
                      </>
                    )}
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-20 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
          <div className="p-4 bg-white dark:bg-gray-800 rounded-full shadow-sm mb-4">
            <BookOpen className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            No courses found
          </h3>
          <p className="text-gray-500 text-sm max-w-sm text-center mt-1 mb-6">
            {search
              ? `No results for "${search}". Try a different keyword.`
              : "You haven't created any courses yet. Start by creating your first course."}
          </p>
          {!search && (
            <Link href="/admin/courses/create">
              <Button>Create Course</Button>
            </Link>
          )}
        </div>
      )}
    </main>
  );
}