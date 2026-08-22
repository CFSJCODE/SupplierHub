import React from "react";
import { Button } from "./Button";
import { LucideIcon, Layers } from "lucide-react";
import Link from "next/link";

export interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  secondaryActionHref?: string;
  onSecondaryAction?: () => void;
}

export function EmptyState({
  icon: Icon = Layers,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  secondaryActionLabel,
  secondaryActionHref,
  onSecondaryAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center bg-white border border-[#D2CAA9] rounded-lg shadow-subtle my-4">
      <div className="w-12 h-12 rounded-md bg-[#FAF7EE] border border-[#E5DFC5] flex items-center justify-center text-forest-700/80 mb-4">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-base font-semibold text-forest-900 mb-1.5 tracking-tight">
        {title}
      </h3>
      <p className="text-xs text-olive-800/80 max-w-md leading-relaxed mb-6">
        {description}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-2.5">
        {actionLabel && actionHref && (
          <Link href={actionHref}>
            <Button size="sm">{actionLabel}</Button>
          </Link>
        )}
        {actionLabel && !actionHref && onAction && (
          <Button size="sm" onClick={onAction}>
            {actionLabel}
          </Button>
        )}
        {secondaryActionLabel && secondaryActionHref && (
          <Link href={secondaryActionHref}>
            <Button variant="outline" size="sm">
              {secondaryActionLabel}
            </Button>
          </Link>
        )}
        {secondaryActionLabel && !secondaryActionHref && onSecondaryAction && (
          <Button variant="outline" size="sm" onClick={onSecondaryAction}>
            {secondaryActionLabel}
          </Button>
        )}
      </div>
    </div>
  );
}
