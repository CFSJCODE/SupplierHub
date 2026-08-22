"use client";

import React from "react";
import Link from "next/link";
import { Menu, PlusCircle, BookmarkCheck, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";

export interface TopHeaderProps {
  title: string;
  subtitle?: string;
  onOpenMobileNav: () => void;
  showBack?: boolean;
  backHref?: string;
  action?: React.ReactNode;
}

export function TopHeader({
  title,
  subtitle,
  onOpenMobileNav,
  showBack = false,
  backHref = "/fornecedores",
  action,
}: TopHeaderProps) {
  return (
    <header className="h-16 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-20 shadow-xs transition-all">
      <div className="flex items-center space-x-3 min-w-0">
        {/* Mobile menu toggle */}
        <button
          onClick={onOpenMobileNav}
          className="p-1.5 -ml-1.5 text-slate-700 hover:text-slate-900 rounded-lg hover:bg-slate-100 lg:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 cursor-pointer"
          aria-label="Abrir menu lateral"
        >
          <Menu className="w-5 h-5" />
        </button>

        {showBack && (
          <Link
            href={backHref}
            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            title="Voltar"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
        )}

        <div className="min-w-0">
          <div className="flex items-center space-x-2.5">
            <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight truncate leading-tight">
              {title}
            </h1>
            <span className="hidden md:inline-flex items-center space-x-1.5 px-2.5 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-[10px] font-mono font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Supabase Cloud</span>
            </span>
          </div>
          {subtitle && (
            <p className="text-[11px] sm:text-xs text-slate-500 truncate mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-2.5 shrink-0">
        {action ? (
          action
        ) : (
          <>
            <Link href="/favoritos" className="hidden sm:inline-flex">
              <Button
                variant="outline"
                size="sm"
                leftIcon={<BookmarkCheck className="w-3.5 h-3.5 text-amber-600" />}
              >
                Favoritos
              </Button>
            </Link>
            <Link href="/fornecedores/novo">
              <Button
                size="sm"
                leftIcon={<PlusCircle className="w-3.5 h-3.5" />}
              >
                Novo Fornecedor
              </Button>
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
