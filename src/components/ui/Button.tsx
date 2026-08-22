import React, { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils/cn";
import { Loader2 } from "lucide-react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive" | "subtle" | "amber";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none select-none cursor-pointer";

    const variants = {
      primary:
        "bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800 border border-emerald-700/30 shadow-sm",
      secondary:
        "bg-forest-900 text-white hover:bg-forest-800 active:bg-forest-950 border border-forest-950/40 shadow-sm",
      outline:
        "border border-slate-200 bg-white text-slate-800 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 shadow-xs",
      subtle:
        "bg-slate-100 text-slate-800 hover:bg-slate-200/80 active:bg-slate-300/60 border border-slate-200",
      ghost:
        "text-slate-700 hover:bg-slate-100 active:bg-slate-200/60 hover:text-slate-900",
      destructive:
        "bg-rose-600 text-white hover:bg-rose-700 active:bg-rose-800 border border-rose-700/30 shadow-sm",
      amber:
        "bg-amber-600 text-white hover:bg-amber-700 active:bg-amber-800 border border-amber-700/30 shadow-sm",
    };

    const sizes = {
      sm: "h-8 px-3 text-xs rounded-md gap-1.5",
      md: "h-9 px-4 text-xs sm:text-sm rounded-lg gap-2",
      lg: "h-11 px-5 text-sm sm:text-base rounded-lg gap-2.5",
      icon: "h-9 w-9 p-0 rounded-lg",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin text-current" />
        ) : (
          leftIcon
        )}
        {children}
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = "Button";
