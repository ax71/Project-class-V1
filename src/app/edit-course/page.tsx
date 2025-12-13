"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { courseService } from "@/services/course.service";
import { Course } from "@/types/api";
import LoadingSpinner from "@/components/common/LoadingSpinner";

export default function EditCoursePage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });
  const [courseId, setCourseId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Get course data from localStorage (set by edit button)
    const courseStr = localStorage.getItem("editingCourse");
    if (courseStr) {
      const course: Course = JSON.parse(courseStr);
      setFormData({
        title: course.title,
        description: course.description,
      });
      setCourseId(course.id);
      localStorage.removeItem("editingCourse");
    } else {
      alert("No course selected for editing");
      router.push("/admin/courses_taught");
    }
    setInitialLoading(false);
  }, [router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseId) return;

    setLoading(true);
    setError(null);

    try {
      await courseService.updateCourse(courseId, formData);
      alert(`✅ Course "${formData.title}" updated successfully!`);
      router.push("/admin/courses_taught");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update course");
      alert(`❌ Error: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return <LoadingSpinner size="lg" text="Loading course..." />;
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-6">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Edit Course
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div>
              <Label htmlFor="title">Course Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter course title"
                required
                disabled={loading}
              />
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter course description"
                required
                disabled={loading}
                rows={4}
              />
            </div>

            {error && (
              <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                {error}
              </div>
            )}

            <CardFooter className="flex justify-end gap-2 p-0 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin/courses_taught")}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white"
                disabled={loading}
              >
                {loading ? "Updating..." : "Update Course"}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
