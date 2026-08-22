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
            className="block text-xs font-semibold uppercase tracking-wider text-forest-800"
          >
            {label} {required && <span className="text-copper-700">*</span>}
          </label>
        )}
        <div className="relative flex items-center">
          <select
            id={selectId}
            ref={ref}
            className={cn(
              "w-full h-9 pl-3 pr-8 py-1.5 text-sm bg-white text-forest-900 border rounded-md appearance-none transition-colors cursor-pointer",
              "focus:outline-none focus:ring-1 focus:ring-brand-copper focus:border-brand-copper",
              "disabled:bg-stone-100 disabled:text-stone-400 disabled:cursor-not-allowed",
              error
                ? "border-rose-600 focus:ring-rose-600 focus:border-rose-600"
                : "border-[#D2CAA9] hover:border-[#B5AB86]",
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
          <div className="absolute right-2.5 pointer-events-none text-forest-700/60 flex items-center">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
        {error && <p className="text-xs text-rose-700 font-medium">{error}</p>}
        {!error && helperText && (
          <p className="text-xs text-olive-800/70">{helperText}</p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";
