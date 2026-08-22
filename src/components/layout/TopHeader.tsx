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
    <header className="h-16 bg-white border-b border-[#D2CAA9] px-4 sm:px-6 flex items-center justify-between sticky top-0 z-20 shadow-subtle">
      <div className="flex items-center space-x-3 min-w-0">
        {/* Mobile menu toggle */}
        <button
          onClick={onOpenMobileNav}
          className="p-1.5 -ml-1.5 text-forest-800 hover:text-forest-900 rounded-md hover:bg-[#FAF7EE] lg:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-copper"
          aria-label="Abrir menu lateral"
        >
          <Menu className="w-5 h-5" />
        </button>

        {showBack && (
          <Link
            href={backHref}
            className="p-1.5 text-forest-800/80 hover:text-forest-900 hover:bg-[#FAF7EE] rounded-md transition-colors"
            title="Voltar"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
        )}

        <div className="min-w-0">
          <h1 className="text-base sm:text-lg font-bold text-forest-900 tracking-tight truncate leading-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-[11px] sm:text-xs text-olive-800/70 truncate">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-2 shrink-0">
        {action ? (
          action
        ) : (
          <>
            <Link href="/favoritos" className="hidden sm:inline-flex">
              <Button variant="subtle" size="sm" leftIcon={<BookmarkCheck className="w-3.5 h-3.5 text-brand-copper" />}>
                Favoritos
              </Button>
            </Link>
            <Link href="/fornecedores/novo">
              <Button size="sm" leftIcon={<PlusCircle className="w-3.5 h-3.5" />}>
                Novo Fornecedor
              </Button>
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
