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
            className="block text-xs font-semibold uppercase tracking-wider text-forest-800"
          >
            {label} {required && <span className="text-copper-700">*</span>}
          </label>
        )}
        <textarea
          id={textareaId}
          rows={rows}
          ref={ref}
          className={cn(
            "w-full px-3 py-2 text-sm bg-white text-forest-900 placeholder:text-forest-800/40 border rounded-md transition-colors",
            "focus:outline-none focus:ring-1 focus:ring-brand-copper focus:border-brand-copper",
            "disabled:bg-stone-100 disabled:text-stone-400 disabled:cursor-not-allowed",
            error
              ? "border-rose-600 focus:ring-rose-600 focus:border-rose-600"
              : "border-[#D2CAA9] hover:border-[#B5AB86]",
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-rose-700 font-medium">{error}</p>}
        {!error && helperText && (
          <p className="text-xs text-olive-800/70">{helperText}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
