import React, { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils/cn";
import { Check } from "lucide-react";

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  description?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, description, id, checked, onChange, disabled, ...props }, ref) => {
    const checkboxId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="flex items-start space-x-2.5 select-none">
        <div className="relative flex items-center justify-center mt-0.5">
          <input
            id={checkboxId}
            type="checkbox"
            ref={ref}
            checked={checked}
            onChange={onChange}
            disabled={disabled}
            className="peer sr-only"
            {...props}
          />
          <div
            className={cn(
              "w-4 h-4 rounded border border-slate-300 bg-white transition-all flex items-center justify-center cursor-pointer shadow-xs",
              "peer-checked:bg-emerald-600 peer-checked:border-emerald-600 peer-focus-visible:ring-2 peer-focus-visible:ring-emerald-600 peer-focus-visible:ring-offset-1",
              "peer-disabled:bg-slate-200 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
              className
            )}
            onClick={() => {
              if (!disabled && onChange) {
                const syntheticEvent = {
                  target: { checked: !checked },
                } as React.ChangeEvent<HTMLInputElement>;
                onChange(syntheticEvent);
              }
            }}
          >
            {checked && <Check className="w-3 h-3 text-white stroke-[3]" />}
          </div>
        </div>
        {label && (
          <div className="text-sm">
            <label
              htmlFor={checkboxId}
              className={cn(
                "font-medium text-slate-900 cursor-pointer block leading-tight text-xs sm:text-sm",
                disabled && "opacity-50 cursor-not-allowed"
              )}
            >
              {label}
            </label>
            {description && (
              <p className="text-xs text-slate-500 mt-0.5">{description}</p>
            )}
          </div>
        )}
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";
