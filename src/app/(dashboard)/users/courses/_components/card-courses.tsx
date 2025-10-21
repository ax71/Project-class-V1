"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import Image from "next/image";
import React, { useState } from "react";

export default function CourseCard() {
  const [progress, setProgress] = useState(0);

  React.useEffect(() => {
    const timer = setTimeout(() => setProgress(50), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Card className="w-[300px] max-w-md h-auto">
      <CardHeader>
        <CardTitle>Course Management</CardTitle>
        <CardDescription>
          Make your personality unique with our courses
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center">
          <div className="border border-gray-300 rounded-md p-4">
            <Image
              src="/Icon.svg"
              alt="Course Management Illustration"
              width={300}
              height={200}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex mt-4">
        <Progress value={progress} className="w-full" />
      </CardFooter>
    </Card>
  );
}
