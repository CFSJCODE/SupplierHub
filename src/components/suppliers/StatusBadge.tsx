import React from "react";
import { SupplierStatus } from "@/types/supplier";
import { STATUS_CONFIG } from "@/lib/constants/statuses";
import { cn } from "@/lib/utils/cn";

export interface StatusBadgeProps {
  status: SupplierStatus;
  className?: string;
  size?: "sm" | "md";
}

export function StatusBadge({ status, className, size = "sm" }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG["Ativo"];

  return (
    <span
      className={cn(
        "inline-flex items-center font-medium border rounded-full select-none",
        config.bg,
        config.text,
        config.border,
        size === "sm" ? "px-2 py-0.5 text-[11px] gap-1.5" : "px-2.5 py-1 text-xs gap-2",
        className
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", config.dot)} />
      {config.label}
    </span>
  );
}
