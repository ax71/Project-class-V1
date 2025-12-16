"use client";

import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export default function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 p-8 text-center">
      <AlertCircle className="h-12 w-12 text-red-500" />
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Oops! Something went wrong
        </h3>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          {message}
        </p>
      </div>
      {onRetry && (
        <Button onClick={onRetry} variant="outline">
          Try Again
        </Button>
      )}
    </div>
  );
}
