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

interface ChartData {
  date: string;
  total: number;
}

interface ApiResponse {
  status: string;
  data: ChartData[];
}

const UserActivityChart: React.FC = () => {
  const [data, setData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // --- 1. Helper Function: Untuk Mengambil Cookie ---
  const getCookie = (name: string) => {
    if (typeof document === "undefined") return null; // Safety check untuk Server Side Rendering
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      // decodeURIComponent penting jika token mengandung karakter spesial
      return decodeURIComponent(parts.pop()?.split(";").shift() || "");
    }
    return null;
  };
  // --------------------------------------------------

  useEffect(() => {
    const fetchChartData = async () => {
      // --- 2. PERUBAHAN DISINI: Ambil dari Cookie, bukan LocalStorage ---
      // Prioritas: Cek Cookie dulu -> kalau gak ada baru cek LocalStorage
      const token = getCookie("token") || localStorage.getItem("token");

      // Debugging: Cek di Console browser apakah tokennya ketemu sekarang
      console.log("Token yang ditemukan:", token);

      if (!token) {
        setError("Token tidak ditemukan. Silakan login ulang.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get<ApiResponse>(
          "http://localhost:8000/api/progress/activity-chart",
          {
            headers: {
              Authorization: `Bearer ${token}`, // Kirim token di Header
              Accept: "application/json",
            },
          }
        );

        setData(response.data.data);
      } catch (err: any) {
        console.error("Gagal load chart user:", err);
        if (err.response?.status === 401) {
          setError("Sesi habis atau Token tidak valid.");
        } else {
          setError("Gagal memuat data grafik.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, []);

  if (loading)
    return (
      <div className="w-full h-64 flex items-center justify-center bg-gray-50 rounded-xl border border-gray-100">
        <p className="text-gray-400 text-sm animate-pulse">
          Memuat grafik aktivitas...
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
          Aktivitas Belajar Saya
        </h3>
        <p className="text-sm text-gray-500">Progress mingguan Anda</p>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorUser" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
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
              stroke="#4F46E5"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorUser)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default UserActivityChart;
