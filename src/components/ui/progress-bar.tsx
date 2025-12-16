import React from "react";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  percentage?: number; // Tambahkan '?' agar opsional
  total?: number;
  completed?: number;
  showDetails?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
  // indicatorClassName?: string; // (Opsional: jika Anda pakai ini sebelumnya)
}

export const ProgressBar = ({
  percentage = 0, // Default value 0 jika tidak dikirim
  total,
  completed,
  showDetails = true,
  size = "md",
  className,
}: ProgressBarProps) => {
  // Pastikan value valid angka
  const safePercentage = typeof percentage === "number" ? percentage : 0;

  // Logika ukuran tinggi bar
  const heightClass = size === "sm" ? "h-1.5" : size === "lg" ? "h-4" : "h-2.5";
  const textSizeClass = size === "sm" ? "text-xs" : "text-sm";

  return (
    <div className={cn("w-full", className)}>
      {showDetails && (
        <div className="flex justify-between mb-1">
          <span
            className={cn(
              "font-medium text-gray-700 dark:text-gray-300",
              textSizeClass
            )}
          >
            Progress
          </span>
          <span
            className={cn(
              "font-medium text-gray-700 dark:text-gray-300",
              textSizeClass
            )}
          >
            {/* PERBAIKAN DI SINI: Gunakan safePercentage */}
            {safePercentage.toFixed(0)}%
          </span>
        </div>
      )}

      <div
        className={cn(
          "w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden",
          heightClass
        )}
      >
        <div
          className="bg-blue-600 h-full rounded-full transition-all duration-500 ease-in-out"
          style={{ width: `${safePercentage}%` }}
        />
      </div>

      {showDetails && total !== undefined && completed !== undefined && (
        <p className="text-xs text-gray-500 mt-1 text-right">
          {completed} of {total} items completed
        </p>
      )}
    </div>
  );
};
