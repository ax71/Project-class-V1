"use client";

import { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function CertificateCard() {
  const certificateRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    const input = certificateRef.current;
    if (!input) return;

    // Ambil tampilan elemen jadi gambar
    const canvas = await html2canvas(input, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    // Buat PDF
    const pdf = new jsPDF("landscape", "pt", "a4");
    const imgWidth = 800;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 20, 60, imgWidth, imgHeight);
    pdf.save("certificate.pdf");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 space-y-6">
      {/* Sertifikat */}
      <div
        ref={certificateRef}
        className="bg-white border-4 border-yellow-400 shadow-lg rounded-xl w-[800px] h-[550px] flex flex-col items-center justify-center text-center p-10"
      >
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          Certificate of Completion
        </h1>
        <p className="text-gray-600 mb-8">This is proudly presented to</p>
        <h2 className="text-3xl font-semibold text-blue-700 mb-4">John Doe</h2>
        <p className="text-gray-600">For successfully completing the course</p>
        <h3 className="text-2xl font-semibold text-gray-800 mt-2">
          React Advanced Patterns
        </h3>

        <div className="flex justify-between w-full mt-16 px-12 text-gray-600">
          <div>
            <p className="font-semibold">Instructor</p>
            <div className="border-t border-gray-400 w-32 mt-1"></div>
          </div>
          <div>
            <p className="font-semibold">Date Issued</p>
            <div className="border-t border-gray-400 w-32 mt-1"></div>
          </div>
        </div>
      </div>

      {/* Tombol Download */}
      <Button
        onClick={handleDownload}
        className="bg-blue-600 text-white hover:bg-blue-700"
      >
        Download PDF
      </Button>
    </div>
  );
}
