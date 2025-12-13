"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { materialService } from "@/services/material.service";
import { Material } from "@/types/api";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ErrorMessage from "@/components/common/ErrorMessage";
import { ArrowLeft, FileText, Video } from "lucide-react";

export default function MaterialViewerPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = Number(params.id);
  const materialId = Number(params.materialId);

  const [material, setMaterial] = useState<Material | null>(null);
  const [allMaterials, setAllMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const materials = await materialService.getMaterialsByCourse(courseId);
      setAllMaterials(materials);
      const currentMaterial = materials.find((m) => m.id === materialId);
      if (currentMaterial) {
        setMaterial(currentMaterial);
      } else {
        setError("Material not found");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load material");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [courseId, materialId]);

  const currentIndex = allMaterials.findIndex((m) => m.id === materialId);
  const hasNext = currentIndex < allMaterials.length - 1;
  const hasPrevious = currentIndex > 0;

  const goToNext = () => {
    if (hasNext) {
      const nextMaterial = allMaterials[currentIndex + 1];
      router.push(`/users/courses/${courseId}/materials/${nextMaterial.id}`);
    }
  };

  const goToPrevious = () => {
    if (hasPrevious) {
      const prevMaterial = allMaterials[currentIndex - 1];
      router.push(`/users/courses/${courseId}/materials/${prevMaterial.id}`);
    }
  };

  if (loading) {
    return <LoadingSpinner size="lg" text="Loading material..." />;
  }

  if (error || !material) {
    return <ErrorMessage message={error || "Material not found"} onRetry={fetchData} />;
  }

  const fileUrl = materialService.getMaterialUrl(material.file_path);

  return (
    <div className="w-full space-y-6">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => router.push(`/users/courses/${courseId}`)}
        className="flex items-center gap-2"
      >
        <ArrowLeft size={16} />
        Back to Course
      </Button>

      {/* Material Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {material.content_type === "pdf" ? (
              <FileText className="text-red-500" size={24} />
            ) : (
              <Video className="text-blue-500" size={24} />
            )}
            {material.title}
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Material Viewer */}
      <Card>
        <CardContent className="p-0">
          {material.content_type === "pdf" ? (
            <iframe
              src={fileUrl}
              className="w-full h-[600px] rounded-lg"
              title={material.title}
            />
          ) : (
            <video
              src={fileUrl}
              controls
              className="w-full rounded-lg"
              controlsList="nodownload"
            >
              Your browser does not support the video tag.
            </video>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <Button
          onClick={goToPrevious}
          disabled={!hasPrevious}
          variant="outline"
        >
          Previous Material
        </Button>
        <span className="text-sm text-gray-500">
          {currentIndex + 1} of {allMaterials.length}
        </span>
        <Button onClick={goToNext} disabled={!hasNext}>
          Next Material
        </Button>
      </div>
    </div>
  );
}
