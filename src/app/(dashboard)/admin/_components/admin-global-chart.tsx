"use client";

import React, { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";

// 1. Definisikan Tipe Data
interface ChartData {
  date: string;
  total: number;
}

interface ApiResponse {
  status: string;
  data: ChartData[];
}

const AdminGlobalChart: React.FC = () => {
  const [data, setData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // --- HELPER: Fungsi Baca Cookie (Sama seperti di User Chart) ---
  const getCookie = (name: string) => {
    if (typeof document === "undefined") return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return decodeURIComponent(parts.pop()?.split(";").shift() || "");
    }
    return null;
  };

  useEffect(() => {
    const fetchGlobalData = async () => {
      try {
        // --- PERBAIKAN DISINI: Ambil token dari Cookie dulu ---
        const token = getCookie("token") || localStorage.getItem("token");

        if (!token) {
          setError("Token tidak ditemukan. Admin harus login.");
          setLoading(false);
          return;
        }

        // Panggil endpoint ADMIN
        const response = await axios.get<ApiResponse>(
          "http://localhost:8000/api/admin/global-activity-chart",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setData(response.data.data);
      } catch (err: any) {
        console.error("Gagal load chart admin:", err);
        // Cek jika error 403 (Forbidden) atau 401 (Unauthorized)
        if (err.response?.status === 403) {
          setError("Akses ditolak. Anda bukan Admin.");
        } else {
          setError("Gagal memuat data global.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchGlobalData();
  }, []);

  if (loading)
    return (
      <div className="w-full h-64 flex items-center justify-center bg-gray-50 rounded-xl border border-gray-100">
        <p className="text-gray-400 text-sm animate-pulse">
          Memuat data global...
        </p>
      </div>
    );

  if (error)
    return (
      <div className="w-full h-64 flex flex-col items-center justify-center bg-red-50 rounded-xl border border-red-100 p-6">
        <p className="text-red-500 font-medium mb-2">Gagal Memuat Grafik</p>
        <p className="text-red-400 text-xs">{error}</p>
      </div>
    );

  return (
    <div className="w-full bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-800">
          Traffic Pembelajaran Global
        </h3>
        <p className="text-sm text-gray-500">
          Total aktivitas seluruh mahasiswa
        </p>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorAdmin" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#E5E7EB"
            />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9CA3AF", fontSize: 12 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
              tick={{ fill: "#9CA3AF", fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{
                borderRadius: "12px",
                border: "none",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
            />
            <Area
              type="monotone"
              dataKey="total"
              stroke="#0ea5e9"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorAdmin)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AdminGlobalChart;
