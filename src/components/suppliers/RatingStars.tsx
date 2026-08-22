"use client";

import React, { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export interface RatingStarsProps {
  value?: number | null;
  onChange?: (rating: number | null) => void;
  readOnly?: boolean;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
}

export function RatingStars({
  value = 0,
  onChange,
  readOnly = true,
  size = "md",
  showValue = false,
}: RatingStarsProps) {
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);

  const starSizes = {
    sm: "w-3.5 h-3.5",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  const currentVal = hoveredRating !== null ? hoveredRating : value || 0;

  if (readOnly) {
    if (!value || value <= 0) {
      return <span className="text-xs text-slate-400 italic font-mono">-</span>;
    }

    return (
      <div className="inline-flex items-center space-x-1" title={`Avaliação: ${value} de 5`}>
        <div className="flex items-center space-x-0.5">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={cn(
                starSizes[size],
                star <= (value || 0)
                  ? "text-amber-500 fill-amber-500"
                  : "text-slate-200 fill-transparent"
              )}
            />
          ))}
        </div>
        {showValue && (
          <span className="text-xs font-mono font-bold text-slate-700 ml-1">
            {value.toFixed(0)}/5
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      <div className="flex items-center space-x-1" onMouseLeave={() => setHoveredRating(null)}>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            type="button"
            key={star}
            onClick={() => {
              if (onChange) {
                onChange(value === star ? null : star);
              }
            }}
            onMouseEnter={() => setHoveredRating(star)}
            className="p-0.5 rounded hover:scale-110 transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 cursor-pointer"
            aria-label={`Avaliar ${star} estrelas`}
          >
            <Star
              className={cn(
                starSizes[size],
                star <= currentVal
                  ? "text-amber-500 fill-amber-500"
                  : "text-slate-300 hover:text-amber-400 fill-transparent"
              )}
            />
          </button>
        ))}
      </div>
      {value && value > 0 ? (
        <button
          type="button"
          onClick={() => onChange && onChange(null)}
          className="text-xs text-slate-500 hover:text-rose-600 underline cursor-pointer"
        >
          Limpar
        </button>
      ) : (
        <span className="text-xs text-slate-400">(opcional)</span>
      )}
    </div>
  );
}
