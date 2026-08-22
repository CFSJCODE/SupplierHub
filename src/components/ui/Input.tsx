import React, { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils/cn";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftElement?: React.ReactNode;
  rightElement?: React.ReactNode;
  required?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = "text",
      label,
      error,
      helperText,
      leftElement,
      rightElement,
      id,
      required,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-semibold uppercase tracking-wider text-forest-800"
          >
            {label} {required && <span className="text-copper-700">*</span>}
          </label>
        )}
        <div className="relative flex items-center">
          {leftElement && (
            <div className="absolute left-3 flex items-center pointer-events-none text-forest-700/60">
              {leftElement}
            </div>
          )}
          <input
            id={inputId}
            type={type}
            ref={ref}
            className={cn(
              "w-full h-9 px-3 py-1.5 text-sm bg-white text-forest-900 placeholder:text-forest-800/40 border rounded-md transition-colors",
              "focus:outline-none focus:ring-1 focus:ring-brand-copper focus:border-brand-copper",
              "disabled:bg-stone-100 disabled:text-stone-400 disabled:cursor-not-allowed",
              error
                ? "border-rose-600 focus:ring-rose-600 focus:border-rose-600"
                : "border-[#D2CAA9] hover:border-[#B5AB86]",
              leftElement && "pl-9",
              rightElement && "pr-9",
              className
            )}
            {...props}
          />
          {rightElement && (
            <div className="absolute right-3 flex items-center text-forest-700/60">
              {rightElement}
            </div>
          )}
        </div>
        {error && <p className="text-xs text-rose-700 font-medium">{error}</p>}
        {!error && helperText && (
          <p className="text-xs text-olive-800/70">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
