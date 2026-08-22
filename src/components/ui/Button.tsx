import React, { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils/cn";
import { Loader2 } from "lucide-react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive" | "subtle";
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
      "inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none select-none";

    const variants = {
      primary:
        "bg-brand-copper text-white hover:bg-copper-800 active:bg-copper-800 focus-visible:ring-brand-copper border border-transparent shadow-subtle",
      secondary:
        "bg-brand-olive text-white hover:bg-olive-800 active:bg-olive-800 focus-visible:ring-brand-olive border border-transparent shadow-subtle",
      outline:
        "border border-[#D2CAA9] bg-white text-forest-800 hover:bg-[#FAF7EE] active:bg-[#F3EED8] focus-visible:ring-brand-forest shadow-subtle",
      subtle:
        "bg-[#FAF7EE] text-forest-800 hover:bg-[#F3EED8] border border-[#E5DFC5] focus-visible:ring-brand-forest",
      ghost:
        "text-forest-800 hover:bg-[#FAF7EE] active:bg-[#F3EED8] focus-visible:ring-brand-forest",
      destructive:
        "bg-rose-700 text-white hover:bg-rose-800 active:bg-rose-900 focus-visible:ring-rose-600 border border-transparent shadow-subtle",
    };

    const sizes = {
      sm: "h-8 px-2.5 text-xs rounded-sm gap-1.5",
      md: "h-9 px-3.5 text-sm rounded-md gap-2",
      lg: "h-11 px-5 text-base rounded-md gap-2.5",
      icon: "h-9 w-9 p-0 rounded-md",
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
