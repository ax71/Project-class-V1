import React from "react";
import { Certificate } from "@/types/api";
import { Award } from "lucide-react";
import Image from "next/image";

interface CertificateViewProps {
  certificate: Certificate;
  user: string;
}

const CertificateView = React.forwardRef<HTMLDivElement, CertificateViewProps>(
  ({ certificate, user }, ref) => {
    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    };

    return (
      <div ref={ref} className="certificate-container bg-white">
        <div className="certificate-border">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-4">
              <div className="relative w-14 h-14">
                <Image
                  src="/icon.svg"
                  alt="Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="text-left">
                <h1 className="text-2xl font-bold text-slate-800 tracking-tight uppercase">
                  Positivus
                </h1>
                <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">
                  Learning Platform
                </p>
              </div>
            </div>

            <div className="badge-ribbon">
              <div className="certificate-seal">
                <Award size={32} className="text-white drop-shadow-sm" />
              </div>
              <div className="mt-1 space-y-0.5">
                <p className="badge-text">OFFICIAL</p>
                <p className="badge-text">CERTIFIED</p>
              </div>
            </div>
          </div>

          <div className="certificate-body flex-1 flex flex-col justify-center items-center text-center">
            <h2 className="text-base font-medium text-slate-500 tracking-[0.4em] uppercase mb-2">
              Certificate of Completion
            </h2>

            <p className="text-slate-500 font-serif italic mb-4">
              This certificate is proudly presented to
            </p>

            <h4 className="recipient-name mb-4">{user}</h4>

            <div className="w-100 h-1 bg-gradient-to-r from-yellow-500 to-yellow-300 rounded-full mb-6"></div>

            <p className="completion-text mb-2">
              for successfully completing the online course
            </p>

            <h4 className="course-title">{certificate.course?.title}</h4>

            <p className="course-description mt-3 max-w-2xl mx-auto">
              Verified & Authorized by Positivus Learning Platform{" "}
              {formatDate(certificate.issued_at)}{" "}
            </p>
          </div>

          <div className="mt-6 flex justify-between items-end">
            <div className="text-left">
              <div className="border-b-2 border-slate-800 w-56 mb-2 relative"></div>
              <p className="font-bold text-slate-900 text-base">
                I Kadek Buktiasa
              </p>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                Lead Software Engineer
              </p>
            </div>

            <div className="text-right">
              <div className="border border-slate-200 px-3 py-1 rounded bg-slate-50 inline-block mb-1">
                <p className="text-[9px] text-slate-400 uppercase">
                  Certificate ID
                </p>
                <p className="font-mono font-bold text-slate-700 text-xs tracking-wide">
                  {certificate.certificate_code}
                </p>
              </div>
              <p className="text-[10px] text-blue-600">
                Verify at:{" "}
                {certificate.certificate_url || "positivus.com/verify"}
              </p>
            </div>
          </div>
        </div>

        <style jsx>{`
          /* Import Font Premium */
          @import url("https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Great+Vibes&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap");

          /* --- STYLE DASAR (Untuk Print & Render) --- */
          .certificate-container {
            width: 297mm; /* Ukuran Asli A4 Landscape */
            height: 210mm;

            margin: 0 auto;
            padding: 15mm;
            background: #ffffff;
            color: #1f2937;
            font-family: "Inter", sans-serif;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;

            /* Shadow biar terlihat "mengambang" di layar */
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
          }

          /* --- TRIK AGAR RAPI DI LAYAR (RESPONSIVE PREVIEW) --- */
          @media screen {
            .certificate-container {
              /* Perkecil tampilan agar muat di layar laptop (Zoom Out) */
              /* Browser Chrome/Edge support 'zoom' property */
              zoom: 0.5;
            }

            /* Untuk Layar Tablet/Laptop Kecil */
            @media (min-width: 768px) {
              .certificate-container {
                zoom: 0.6;
              }
            }

            /* Untuk Layar Laptop Standar */
            @media (min-width: 1024px) {
              .certificate-container {
                zoom: 0.75;
              }
            }

            /* Untuk Monitor Besar */
            @media (min-width: 1440px) {
              .certificate-container {
                zoom: 0.9;
              }
            }
          }

          /* --- STYLE BORDER & ELEMEN --- */
          .certificate-border {
            border: 8px double #c5a059; /* Emas */
            outline: 1px solid #e5c985;
            outline-offset: -6px;
            height: 100%;
            padding: 30px 50px;
            position: relative;
            display: flex;
            flex-direction: column;
            background: linear-gradient(to bottom right, #fff, #fdfbf7);
          }

          .badge-ribbon {
            background: #c5a059;
            color: white;
            padding: 12px 10px;
            text-align: center;
            border-radius: 0 0 4px 4px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            position: relative;
            top: -30px;
          }

          .badge-ribbon::after {
            content: "";
            position: absolute;
            bottom: -8px;
            left: 0;
            right: 0;
            height: 8px;
            background: inherit;
            clip-path: polygon(0% 0%, 100% 0%, 50% 100%);
          }

          .badge-text {
            font-size: 0.5rem;
            font-weight: 700;
            letter-spacing: 1.2px;
          }

          .recipient-name {
            font-family: "Playfair Display", serif;
            font-size: 3.2rem;
            font-weight: 700;
            color: #1e293b;
            line-height: 1;
            margin: 0;
          }

          .course-title {
            font-family: "Cinzel", serif;
            font-size: 2.2rem;
            font-weight: 700;
            color: #0f172a;
            text-transform: uppercase;
            letter-spacing: 1px;
            line-height: 1.2;
          }

          .font-script {
            font-family: "Great Vibes", cursive;
          }

          /* --- PENGATURAN KHUSUS PRINTER --- */
          @media print {
            @page {
              size: landscape; /* Wajib: Paksa printer ke landscape */
              margin: 0;
            }
            body {
              margin: 0;
              background: white;
              -webkit-print-color-adjust: exact; /* Agar background warna tercetak */
            }
            .certificate-container {
              /* Kembalikan ke ukuran asli saat diprint */
              zoom: 1 !important;
              width: 297mm;
              height: 210mm;
              box-shadow: none;
              padding: 10mm; /* Padding aman printer */
              margin: 0;
              page-break-after: always;
            }
          }
        `}</style>
      </div>
    );
  }
);

CertificateView.displayName = "CertificateView";

export default CertificateView;
