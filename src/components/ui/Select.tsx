import React, { SelectHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils/cn";
import { ChevronDown } from "lucide-react";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options?: (SelectOption | string)[];
  placeholder?: string;
  required?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      options = [],
      placeholder,
      id,
      required,
      children,
      ...props
    },
    ref
  ) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-xs font-semibold text-slate-700 uppercase tracking-wide font-mono"
          >
            {label} {required && <span className="text-rose-600 font-bold">*</span>}
          </label>
        )}
        <div className="relative flex items-center">
          <select
            id={selectId}
            ref={ref}
            className={cn(
              "w-full h-10 pl-3.5 pr-9 py-2 text-sm bg-white text-slate-900 border rounded-lg appearance-none transition-all shadow-xs cursor-pointer",
              "focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600",
              "disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed",
              error
                ? "border-rose-400 text-rose-900 focus:ring-rose-500/20 focus:border-rose-600"
                : "border-slate-200 hover:border-slate-300",
              className
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled hidden>
                {placeholder}
              </option>
            )}
            {options.map((opt) => {
              if (typeof opt === "string") {
                return (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                );
              }
              return (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              );
            })}
            {children}
          </select>
          <div className="absolute right-3 pointer-events-none text-slate-400 flex items-center">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
        {error && <p className="text-xs text-rose-600 font-medium">{error}</p>}
        {!error && helperText && (
          <p className="text-xs text-slate-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";
