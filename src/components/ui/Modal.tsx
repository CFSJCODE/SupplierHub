"use client";

import React, { useEffect } from "react";
import { cn } from "@/lib/utils/cn";
import { X } from "lucide-react";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl";
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = "md",
}: ModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidths = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-150">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-forest-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Card */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "modal-title" : undefined}
        className={cn(
          "relative w-full bg-white border border-[#D2CAA9] rounded-lg shadow-dropdown p-6 z-10 transition-all",
          maxWidths[maxWidth]
        )}
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            {title && (
              <h3
                id="modal-title"
                className="text-base font-semibold text-forest-900 tracking-tight"
              >
                {title}
              </h3>
            )}
            {description && (
              <p className="text-xs text-olive-800/80 mt-1">{description}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-forest-700/60 hover:text-forest-900 rounded-sm p-1 transition-colors hover:bg-forest-900/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-copper"
            aria-label="Fechar modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div>{children}</div>
      </div>
    </div>
  );
}
