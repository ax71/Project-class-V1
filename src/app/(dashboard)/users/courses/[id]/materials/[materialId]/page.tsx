"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { materialService } from "@/services/material.service";
import { Material } from "@/types/api";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ErrorMessage from "@/components/common/ErrorMessage";
import {
  ArrowLeft,
  FileText,
  Video,
  CheckCircle,
  Circle,
  Loader2,
  Trophy,
  Award,
} from "lucide-react";
import { useCourseProgress } from "@/hooks/use-course-progress";
import { ProgressBar } from "@/components/ui/progress-bar";

export default function MaterialViewerPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = Number(params.id);
  const materialId = Number(params.materialId);

  const [material, setMaterial] = useState<Material | null>(null);
  const [allMaterials, setAllMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [materialMarked, setMaterialMarked] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showCertificateModal, setShowCertificateModal] = useState(false);

  const {
    // markMaterialViewed, // Tidak lagi dibutuhkan karena kita hapus timer-nya
    markMaterialComplete,
    isMaterialViewed,
    progressPercentage,
  } = useCourseProgress(courseId);

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

  // Effect 1: Fetch data dan cek status awal (apakah sudah pernah dicentang sebelumnya)
  useEffect(() => {
    fetchData();
    // Check if material is already marked
    const isMarked = isMaterialViewed(materialId);
    setMaterialMarked(isMarked);
  }, [courseId, materialId, isMaterialViewed]);

  const handleMarkComplete = async () => {
    setIsCompleting(true);
    try {
      const result = await markMaterialComplete(materialId);

      if (result.success) {
        setMaterialMarked(true);

        // Check if certificate was generated
        if (result.certificateGenerated) {
          setShowCertificateModal(true);
        } else {
          setShowSuccessMessage(true);
        }
      }
    } catch (error) {
      console.error("Failed to mark material as complete:", error);
      alert("Failed to update progress. Please try again.");
    } finally {
      setIsCompleting(false);
    }
  };

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
    return (
      <ErrorMessage
        message={error || "Material not found"}
        onRetry={fetchData}
      />
    );
  }

  const fileUrl = materialService.getMaterialUrl(material.file_path);

  if (!fileUrl) {
    return (
      <ErrorMessage message="Material file not found" onRetry={fetchData} />
    );
  }

  return (
    <div className="w-full space-y-6">
      {showSuccessMessage && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50 animate-in slide-in-from-top">
          <CheckCircle size={20} />
          <span>Material marked as complete! Progress updated.</span>
        </div>
      )}

      {/* Certificate Celebration Modal */}
      {showCertificateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full p-6 text-center animate-in zoom-in">
            <div className="mb-4">
              <Trophy className="mx-auto text-yellow-500" size={80} />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
              🎉 Congratulations!
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
              You've completed this course!
            </p>
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900 dark:to-orange-900 p-4 rounded-lg mb-6">
              <Award
                className="mx-auto text-yellow-600 dark:text-yellow-400 mb-2"
                size={48}
              />
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                Your certificate is ready!
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <Button
                onClick={() => router.push("/users/certificates")}
                className="w-full bg-yellow-500 hover:bg-yellow-600"
              >
                <Award className="mr-2" size={18} />
                View Certificate
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowCertificateModal(false)}
                className="w-full"
              >
                Continue Learning
              </Button>
            </div>
          </Card>
        </div>
      )}

      <Button
        variant="ghost"
        onClick={() => router.push(`/users/courses/${courseId}`)}
        className="flex items-center gap-2"
      >
        <ArrowLeft size={16} />
        Back to Course
      </Button>

      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900 dark:to-indigo-900 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                Course Progress
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Track your learning journey
              </p>
            </div>
          </div>
          <ProgressBar
            percentage={progressPercentage}
            completed={0}
            total={allMaterials.length}
            showDetails={false}
            size="sm"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <CardTitle className="flex items-center gap-2 flex-1">
              {material.content_type === "pdf" ? (
                <FileText className="text-red-500" size={24} />
              ) : (
                <Video className="text-blue-500" size={24} />
              )}
              {material.title}
            </CardTitle>

            <Button
              onClick={handleMarkComplete}
              disabled={materialMarked || isCompleting}
              className={
                materialMarked
                  ? "bg-green-600 hover:bg-green-600 cursor-not-allowed"
                  : isCompleting
                  ? "bg-gray-400 cursor-wait"
                  : "bg-blue-600 hover:bg-blue-700"
              }
              size="lg"
            >
              {isCompleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : materialMarked ? (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Completed
                </>
              ) : (
                <>
                  <Circle className="mr-2 h-4 w-4" />
                  Mark as Complete
                </>
              )}
            </Button>
          </div>
        </CardHeader>
      </Card>

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
