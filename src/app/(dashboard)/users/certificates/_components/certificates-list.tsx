"use client";

import { useEffect, useState, useRef } from "react";
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
import { Award, Download, Eye, X, Printer, Loader2 } from "lucide-react";
import CertificateView from "@/components/certificates/CertificateView";
import { useReactToPrint } from "react-to-print";

// 1. IMPORT LIBRARY PDF
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function CertificateCard() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State untuk Modal
  const [selectedCertificate, setSelectedCertificate] =
    useState<Certificate | null>(null);
  const [userName, setUserName] = useState("Student");

  // State untuk Loading saat generate PDF
  const [isDownloading, setIsDownloading] = useState(false);

  // Ref ke elemen sertifikat yang akan di-capture
  const certificateRef = useRef<HTMLDivElement>(null);

  // Setup React-to-Print (Opsional, jika masih ingin fitur Print dialog)
  const handlePrint = useReactToPrint({
    contentRef: certificateRef,
    documentTitle: `Certificate-${selectedCertificate?.certificate_code}`,
  });

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

    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      setUserName(user.name || "Student");
    }
  }, []);

  const handleView = (certificate: Certificate) => {
    setSelectedCertificate(certificate);
  };

  const handleDownloadPDF = async () => {
    const element = certificateRef.current;
    if (!element) return;

    try {
      setIsDownloading(true);

      // A. Capture tampilan sertifikat jadi gambar
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        scrollY: -window.scrollY,
      });

      // B. Setup PDF Landscape A4
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("l", "mm", "a4");

      const pdfWidth = 297;
      const pdfHeight = 210;

      // C. Masukkan gambar ke PDF
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

      // D. Simpan File
      const fileName = `Certificate-${
        selectedCertificate?.course?.title || "Course"
      }-${userName}.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error("Gagal generate PDF", error);
      alert("Gagal mendownload sertifikat. Silakan coba lagi.");
    } finally {
      setIsDownloading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner size="lg" text="Loading your certificates..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchData} />;
  }

  if (certificates.length === 0) {
    return (
      <div className="text-center py-12 w-full h-full">
        <div className="flex flex-col items-center align-center justify-center">
          <Award size={48} className="mx-auto mb-3 text-gray-400" />
          <p className="text-gray-500">
            No certificates yet. Complete courses to earn certificates!
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* LIST CARD SERTIFIKAT */}
      <div className="space-y-6 w-full">
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
                  {certificate.course?.title ||
                    `Course #${certificate.course_id}`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Issued on:{" "}
                  {new Date(certificate.issued_at).toLocaleDateString()}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 font-mono">
                  {certificate.certificate_code}
                </p>
              </CardContent>
              <CardFooter className="flex gap-2">
                {/* Tombol View: Membuka Modal */}
                <Button
                  onClick={() => handleView(certificate)}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 flex items-center gap-2"
                >
                  <Eye size={16} />
                  View & Download
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      {/* MODAL VIEW & DOWNLOAD */}
      {selectedCertificate && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-lg max-w-5xl w-full relative my-8 shadow-2xl">
            {/* Tombol Close */}
            <Button
              onClick={() => setSelectedCertificate(null)}
              className="absolute top-4 right-4 z-10 bg-gray-800 hover:bg-gray-900 rounded-full"
              size="icon"
            >
              <X size={20} />
            </Button>

            <div className="p-6 flex justify-center bg-gray-100/50">
              {/* AREA RENDERING SERTIFIKAT */}
              <div className="shadow-xl">
                <CertificateView
                  ref={certificateRef}
                  certificate={selectedCertificate}
                  user={selectedCertificate.user?.name || "Student"}
                />
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex gap-3 p-6 border-t bg-white rounded-b-lg">
              {/* Tombol Print (Bawaan Browser Dialog) */}
              <Button
                onClick={() => handlePrint()}
                variant="outline"
                className="flex-1 border-gray-300"
              >
                <Printer className="mr-2" size={18} />
                Print Dialog
              </Button>

              {/* 3. TOMBOL DOWNLOAD BARU (Direct PDF) */}
              <Button
                onClick={handleDownloadPDF}
                disabled={isDownloading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isDownloading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating PDF...
                  </>
                ) : (
                  <>
                    <Download className="mr-2" size={18} />
                    Download PDF Direct
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
