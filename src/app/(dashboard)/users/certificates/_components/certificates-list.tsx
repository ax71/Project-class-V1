"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { certificateService } from "@/services/certificate.service";
import { Certificate } from "@/types/api";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ErrorMessage from "@/components/common/ErrorMessage";
import { Award, Download } from "lucide-react";

export default function CertificateCard() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await certificateService.getUserCertificates();
      setCertificates(data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load certificates");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDownload = (certificateId: number) => {
    const url = certificateService.getCertificateUrl(certificateId);
    window.open(url, "_blank");
  };

  if (loading) {
    return <LoadingSpinner size="lg" text="Loading your certificates..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchData} />;
  }

  if (certificates.length === 0) {
    return (
      <div className="text-center py-12">
        <Award size={48} className="mx-auto mb-3 text-gray-400" />
        <p className="text-gray-500">
          No certificates yet. Complete courses to earn certificates!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
        Your Certificates
      </h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {certificates.map((certificate) => (
          <Card key={certificate.id} className="hover:shadow-lg transition">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Award className="text-yellow-500" size={24} />
                <CardTitle className="text-lg">Certificate</CardTitle>
              </div>
              <CardDescription>
                {certificate.course?.title || `Course #${certificate.course_id}`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Issued on:{" "}
                {new Date(certificate.issued_at).toLocaleDateString()}
              </p>
            </CardContent>
            <CardFooter>
              <Button
                onClick={() => handleDownload(certificate.id)}
                className="w-full bg-blue-500 hover:bg-blue-600 flex items-center gap-2"
              >
                <Download size={16} />
                Download Certificate
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
