import React from "react";
import { CATEGORY_COLORS } from "@/lib/constants/categories";
import { cn } from "@/lib/utils/cn";

export interface CategoryBadgeProps {
  category: string;
  className?: string;
}

export function CategoryBadge({ category, className }: CategoryBadgeProps) {
  const colors = CATEGORY_COLORS[category] || {
    bg: "bg-gray-100",
    text: "text-gray-800",
    border: "border-gray-300",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 text-[11px] font-medium border rounded-md select-none tracking-tight",
        colors.bg,
        colors.text,
        colors.border,
        className
      )}
    >
      {category}
    </span>
  );
}
