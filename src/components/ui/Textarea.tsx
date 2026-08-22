import React, { TextareaHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils/cn";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      id,
      required,
      rows = 3,
      ...props
    },
    ref
  ) => {
    const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-xs font-semibold text-slate-700 uppercase tracking-wide font-mono"
          >
            {label} {required && <span className="text-rose-600 font-bold">*</span>}
          </label>
        )}
        <textarea
          id={textareaId}
          rows={rows}
          ref={ref}
          className={cn(
            "w-full px-3.5 py-2.5 text-sm bg-white text-slate-900 placeholder:text-slate-400 border rounded-lg transition-all shadow-xs",
            "focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600",
            "disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed",
            error
              ? "border-rose-400 text-rose-900 focus:ring-rose-500/20 focus:border-rose-600"
              : "border-slate-200 hover:border-slate-300",
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-rose-600 font-medium">{error}</p>}
        {!error && helperText && (
          <p className="text-xs text-slate-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
