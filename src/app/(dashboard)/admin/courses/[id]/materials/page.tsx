"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { materialService } from "@/services/material.service";
import { courseService } from "@/services/course.service";
import { Material, Course } from "@/types/api";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ErrorMessage from "@/components/common/ErrorMessage";
import { FileText, Video, Trash2, Plus, ArrowLeft, Upload } from "lucide-react";

export default function MaterialsManagementPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = Number(params.id);

  const [course, setCourse] = useState<Course | null>(null);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showUploadForm, setShowUploadForm] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [courseData, materialsData] = await Promise.all([
        courseService.getCourseById(courseId),
        materialService.getMaterialsByCourse(courseId),
      ]);
      setCourse(courseData);
      setMaterials(materialsData);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load materials");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [courseId]);

  const handleDelete = async (materialId: number) => {
    if (!confirm("Are you sure you want to delete this material?")) return;

    try {
      await materialService.deleteMaterial(materialId);
      setMaterials((prev) => prev.filter((m) => m.id !== materialId));
      alert("✅ Material deleted successfully");
    } catch (err: any) {
      alert(`Failed to delete: ${err.response?.data?.message || err.message}`);
    }
  };

  if (loading) {
    return <LoadingSpinner size="lg" text="Loading materials..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchData} />;
  }

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Button
            variant="ghost"
            onClick={() => router.push("/admin/courses")}
            className="flex items-center gap-2 mb-2"
          >
            <ArrowLeft size={16} />
            Back to Courses
          </Button>
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
            Materials for: {course?.title}
          </h1>
          <p className="text-gray-500">Manage course materials (PDF & Video)</p>
        </div>
        <Button
          onClick={() => setShowUploadForm(!showUploadForm)}
          className="bg-blue-500 hover:bg-blue-600 flex items-center gap-2"
        >
          {showUploadForm ? (
            <>
              <ArrowLeft size={18} />
              Back to List
            </>
          ) : (
            <>
              <Plus size={18} />
              Upload Material
            </>
          )}
        </Button>
      </div>

      {/* Upload Form or Materials List */}
      {showUploadForm ? (
        <MaterialUploadForm
          onSuccess={() => {
            setShowUploadForm(false);
            fetchData();
          }}
        />
      ) : (
        <>
          {materials.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Upload size={48} className="text-gray-400 mb-3" />
                <p className="text-gray-500 mb-4">No materials uploaded yet</p>
                <Button
                  onClick={() => setShowUploadForm(true)}
                  className="bg-blue-500 hover:bg-blue-600"
                >
                  Upload First Material
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {materials.map((material) => (
                <Card key={material.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        {material.content_type === "pdf" ? (
                          <FileText className="text-red-500" size={24} />
                        ) : (
                          <Video className="text-blue-500" size={24} />
                        )}
                        <div>
                          <CardTitle className="text-lg">
                            {material.title}
                          </CardTitle>
                          <p className="text-sm text-gray-500 capitalize mt-1">
                            {material.content_type} • Uploaded{" "}
                            {new Date(material.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(material.id)}
                        className="flex items-center gap-1"
                      >
                        <Trash2 size={16} />
                        Delete
                      </Button>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

// Inline Upload Form Component
function MaterialUploadForm({ onSuccess }: { onSuccess: () => void }) {
  const params = useParams();
  const courseId = Number(params.id);

  const [formData, setFormData] = useState({
    title: "",
    content_type: "pdf" as "pdf" | "video",
  });
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (selectedFile.size > MAX_FILE_SIZE) {
      setError(
        `File too large. Max size is 50MB. Your file: ${(
          selectedFile.size /
          1024 /
          1024
        ).toFixed(2)}MB`
      );
      return;
    }

    setError(null);
    setFile(selectedFile);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a file");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("course_id", courseId.toString());
      formDataToSend.append("title", formData.title);
      formDataToSend.append("content_type", formData.content_type);
      formDataToSend.append("file", file);

      await materialService.uploadMaterial(formDataToSend);
      alert("✅ Material uploaded successfully!");
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload New Material</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Type</label>
            <select
              value={formData.content_type}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  content_type: e.target.value as "pdf" | "video",
                })
              }
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
              disabled={loading}
            >
              <option value="pdf">PDF Document</option>
              <option value="video">Video</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              File (Max 50MB)
            </label>
            <input
              type="file"
              onChange={handleFileChange}
              accept={formData.content_type === "pdf" ? ".pdf" : "video/*"}
              className="w-full"
              disabled={loading}
            />
            {file && (
              <p className="text-sm text-green-600 mt-1">
                ✓ {file.name} ({(file.size / 1024 / 1024).toFixed(2)}MB)
              </p>
            )}
          </div>

          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-sm text-red-700 dark:text-red-300">
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={loading || !file}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            {loading ? "Uploading..." : "Upload"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
