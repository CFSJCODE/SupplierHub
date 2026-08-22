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
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center bg-white border border-slate-200 rounded-xl shadow-card my-4">
      <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200/80 flex items-center justify-center text-slate-500 mb-4 shadow-xs">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-base font-bold text-slate-900 mb-1.5 tracking-tight">
        {title}
      </h3>
      <p className="text-xs text-slate-500 max-w-md leading-relaxed mb-6">
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
