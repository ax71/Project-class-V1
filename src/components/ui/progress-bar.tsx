import React from "react";

interface ProgressBarProps {
  percentage: number;
  completed: number;
  total: number;
  showDetails?: boolean;
  size?: "sm" | "md" | "lg";
}

export function ProgressBar({
  percentage,
  completed,
  total,
  showDetails = true,
  size = "md",
}: ProgressBarProps) {
  const heightClass = {
    sm: "h-1.5",
    md: "h-2.5",
    lg: "h-3",
  }[size];

  const textSizeClass = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  }[size];

  // Determine color based on percentage
  const getColor = () => {
    if (percentage === 100) return "bg-green-600";
    if (percentage >= 70) return "bg-blue-600";
    if (percentage >= 40) return "bg-yellow-500";
    return "bg-gray-400";
  };

  return (
    <div className="w-full">
      <div className="flex justify-between mb-1">
        <span className={`${textSizeClass} font-medium text-gray-700 dark:text-gray-300`}>
          Progress
        </span>
        <span className={`${textSizeClass} font-medium text-gray-700 dark:text-gray-300`}>
          {percentage.toFixed(0)}%
        </span>
      </div>
      <div className={`w-full bg-gray-200 dark:bg-gray-700 rounded-full ${heightClass}`}>
        <div
          className={`${getColor()} ${heightClass} rounded-full transition-all duration-300 ease-in-out`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
      {showDetails && (
        <p className={`${textSizeClass} text-gray-500 dark:text-gray-400 mt-1`}>
          {completed} of {total} items completed
        </p>
      )}
    </div>
  );
}
