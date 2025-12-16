"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { materialService } from "@/services/material.service";
import { Upload, FileText, Video, AlertCircle } from "lucide-react";

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB in bytes

export default function MaterialUploadForm() {
  const params = useParams();
  const router = useRouter();
  const courseId = Number(params.id);

  const [formData, setFormData] = useState({
    title: "",
    content_type: "pdf" as "pdf" | "video",
  });
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Validate file size
    if (selectedFile.size > MAX_FILE_SIZE) {
      setError(
        `File size must be less than 50MB. Your file is ${(
          selectedFile.size /
          1024 /
          1024
        ).toFixed(2)}MB`
      );
      setFile(null);
      return;
    }

    // Validate file type
    const fileType = formData.content_type;
    if (fileType === "pdf" && !selectedFile.type.includes("pdf")) {
      setError("Please select a PDF file");
      setFile(null);
      return;
    }
    if (fileType === "video" && !selectedFile.type.includes("video")) {
      setError("Please select a video file");
      setFile(null);
      return;
    }

    setError(null);
    setFile(selectedFile);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a file to upload");
      return;
    }

    setLoading(true);
    setError(null);
    setUploadProgress(0);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("course_id", courseId.toString());
      formDataToSend.append("title", formData.title);
      formDataToSend.append("content_type", formData.content_type);
      formDataToSend.append("file", file);

      // Simulate upload progress (in real scenario, you'd use axios with onUploadProgress)
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      await materialService.uploadMaterial(formDataToSend);

      clearInterval(progressInterval);
      setUploadProgress(100);

      alert("✅ Material uploaded successfully!");
      router.push(`/admin/courses/${courseId}/materials`);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to upload material");
      setUploadProgress(0);
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
          {/* Title */}
          <div>
            <Label htmlFor="title">Material Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="Enter material title"
              required
              disabled={loading}
            />
          </div>

          {/* Content Type */}
          <div>
            <Label htmlFor="content_type">Material Type</Label>
            <Select
              value={formData.content_type}
              onValueChange={(value: "pdf" | "video") => {
                setFormData({ ...formData, content_type: value });
                setFile(null); // Reset file when type changes
                setError(null);
              }}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf">
                  <div className="flex items-center gap-2">
                    <FileText size={16} />
                    PDF Document
                  </div>
                </SelectItem>
                <SelectItem value="video">
                  <div className="flex items-center gap-2">
                    <Video size={16} />
                    Video
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* File Upload */}
          <div>
            <Label htmlFor="file">Select File (Max 50MB)</Label>
            <div className="mt-2">
              <label
                htmlFor="file"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-10 h-10 mb-3 text-gray-400" />
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {formData.content_type === "pdf"
                      ? "PDF files only"
                      : "Video files (MP4, AVI, MOV, etc.)"}
                  </p>
                </div>
                <input
                  id="file"
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  accept={formData.content_type === "pdf" ? ".pdf" : "video/*"}
                  disabled={loading}
                />
              </label>
            </div>
            {file && (
              <p className="mt-2 text-sm text-green-600 dark:text-green-400">
                ✓ Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)}
                MB)
              </p>
            )}
          </div>

          {/* Upload Progress */}
          {loading && uploadProgress > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || !file}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loading ? "Uploading..." : "Upload Material"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
