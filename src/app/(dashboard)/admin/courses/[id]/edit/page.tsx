"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation"; // ✅ Tambah useParams
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
// import { Course } from "@/types/api"; // Opsional, jika butuh type strict
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ErrorMessage from "@/components/common/ErrorMessage";
import { toast } from "sonner"; // ✅ Gunakan toast agar konsisten

export default function EditCoursePage() {
  const router = useRouter();
  const params = useParams(); // ✅ Ambil ID dari URL folder [id]

  // Konversi ID dari string URL ke number
  const courseId = Number(params.id);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  const [loading, setLoading] = useState(false); // Untuk proses update
  const [fetching, setFetching] = useState(true); // Untuk load data awal
  const [error, setError] = useState<string | null>(null);

  // 1. Fetch Data Course berdasarkan ID dari URL
  useEffect(() => {
    const fetchCourseData = async () => {
      if (!courseId) {
        setError("Invalid Course ID");
        setFetching(false);
        return;
      }

      try {
        setFetching(true);
        // Pastikan Anda punya method ini di courseService
        const data = await courseService.getCourseById(courseId);

        setFormData({
          title: data.title,
          description: data.description || "",
        });
      } catch (err: any) {
        console.error(err);
        setError(err.response?.data?.message || "Failed to load course data");
        toast.error("Could not load course details");
      } finally {
        setFetching(false);
      }
    };

    fetchCourseData();
  }, [courseId]);

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
      toast.success(`Course "${formData.title}" updated successfully!`);

      // Redirect kembali ke list courses
      router.push("/admin/courses");
      router.refresh(); // Refresh agar list di halaman depan terupdate
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to update course";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // State: Sedang mengambil data awal
  if (fetching) {
    return <LoadingSpinner size="lg" text="Fetching course details..." />;
  }

  // State: Jika ID tidak valid atau Course tidak ditemukan
  if (error && !formData.title) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <ErrorMessage
          message={error}
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  return (
    <main className="w-full min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-6">
      <Card className="w-full max-w-md shadow-lg border-t-4 border-t-blue-600">
        <CardHeader>
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            ✏️ Edit Course
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium">
                Course Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                name="title"
                placeholder="e.g. Introduction to React"
                value={formData.title}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">
                Description
              </Label>
              <Textarea
                id="description"
                name="description"
                placeholder="What will students learn?"
                value={formData.description}
                onChange={handleChange}
                required
                disabled={loading}
                rows={5}
                className="resize-none"
              />
            </div>

            {error && (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md border border-red-200">
                ⚠️ {error}
              </div>
            )}

            <CardFooter className="flex justify-end gap-3 p-0 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin/courses")}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white min-w-[120px]"
                disabled={loading}
              >
                {loading ? <>Processing...</> : <>Save Changes</>}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
