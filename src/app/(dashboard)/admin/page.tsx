"use client";

import Image from "next/image";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Users, BookOpen, Trophy, Activity } from "lucide-react";
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function AdminDashboard() {
  // Dummy chart data
  const data = [
    { name: "Mon", students: 20 },
    { name: "Tue", students: 45 },
    { name: "Wed", students: 30 },
    { name: "Thu", students: 60 },
    { name: "Fri", students: 50 },
  ];

  return (
    <div className="w-full h-full space-y-10">
      <div className="w-full bg-gradient-to-r from-sky-300 to-sky-400 rounded-lg shadow-md p-8 md:p-12 flex flex-col md:flex-row items-center justify-between">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-black mb-4">
            Welcome to your Dashboard 🎓
          </h1>
          <p className="mt-9 text-lg md:text-sm text-black font-mono">
            Monitor activities, manage courses, and support better learning
            outcomes for your students. Let’s make today productive!
          </p>
        </div>

        <div className="ml-8">
          <Image
            src="/Illustration-1.svg"
            alt="User Dashboard Illustration"
            width={300}
            height={300}
            priority
          />
        </div>
      </div>

      {/* === Quick Stats Section === */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-sm border-t-4 border-blue-400">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
              <Users className="text-blue-500" size={18} /> Students
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">1,245</p>
            <p className="text-sm text-gray-500">Active students this month</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-t-4 border-green-400">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
              <BookOpen className="text-green-500" size={18} /> Courses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">32</p>
            <p className="text-sm text-gray-500">Available learning paths</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-t-4 border-yellow-400">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
              <Trophy className="text-yellow-500" size={18} /> Certificates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">240</p>
            <p className="text-sm text-gray-500">Issued this month</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-t-4 border-purple-400">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
              <Activity className="text-purple-500" size={18} /> Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">92%</p>
            <p className="text-sm text-gray-500">Overall student engagement</p>
          </CardContent>
        </Card>
      </div>

      {/* === Chart Section === */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Student Activity Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="students" fill="#0ea5e9" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* === Motivational Quote Section === */}
      <div className="bg-gradient-to-r from-indigo-400 to-blue-500 text-white rounded-xl shadow-md p-6 flex flex-col md:flex-row justify-between items-center">
        <p className="text-lg md:text-xl font-medium text-center md:text-left">
          🌟 “The beautiful thing about learning is that nobody can take it away
          from you.” — B.B. King
        </p>
        <Image
          src="/Illustration-1.svg"
          alt="Motivational Illustration"
          width={180}
          height={180}
          className="mt-4 md:mt-0"
        />
      </div>
    </div>
  );
}
