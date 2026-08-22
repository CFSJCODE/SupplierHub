"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  BookmarkCheck,
  Settings,
  PlusCircle,
  LogOut,
  Cpu,
  X,
  UserCheck,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const pathname = usePathname();
  const router = useRouter();

  // Close drawer automatically whenever route changes
  useEffect(() => {
    onClose();
  }, [pathname, onClose]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleSignOut = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      toast.success("Sessão encerrada com sucesso.");
      router.push("/login");
      router.refresh();
    } catch {
      router.push("/login");
    }
  };

  const navItems = [
    { label: "Painel Principal", href: "/dashboard", icon: LayoutDashboard },
    { label: "Fornecedores", href: "/fornecedores", icon: Building2 },
    { label: "Favoritos", href: "/favoritos", icon: BookmarkCheck },
    { label: "Configurações", href: "/configuracoes", icon: Settings },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Off-canvas Drawer Panel */}
      <div className="fixed inset-y-0 left-0 w-4/5 max-w-xs bg-forest-950 text-slate-300 shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-200 border-r border-forest-900">
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-forest-900">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-sm">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-base tracking-tight text-white block leading-tight">
                SupplierHub
              </span>
              <span className="text-[10px] text-emerald-400 font-mono tracking-wider uppercase block">
                Gestão de Fornecedores
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-forest-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 cursor-pointer"
            aria-label="Fechar menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Shortcut */}
        <div className="p-4 border-b border-forest-900/60">
          <Link
            href="/fornecedores/novo"
            onClick={onClose}
            className="w-full flex items-center justify-center space-x-2 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold tracking-wide shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Novo Fornecedor</span>
          </Link>
        </div>

        {/* Links */}
        <div className="flex-1 overflow-y-auto p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href === "/fornecedores" && pathname.startsWith("/fornecedores/"));
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center space-x-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all",
                  isActive
                    ? "bg-emerald-600/15 text-emerald-300 font-semibold border-l-2 border-emerald-500 pl-2.5"
                    : "text-slate-300 hover:bg-forest-900/80 hover:text-white"
                )}
              >
                <Icon
                  className={cn(
                    "w-4 h-4 shrink-0",
                    isActive ? "text-emerald-400" : "text-slate-400"
                  )}
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-forest-900 bg-forest-950/80">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 min-w-0 pr-2">
              <div className="w-7 h-7 rounded-full bg-emerald-950 border border-emerald-800 flex items-center justify-center text-emerald-300 shrink-0">
                <UserCheck className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-medium text-white truncate">
                Conta Ativa
              </span>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center space-x-1 text-xs text-slate-400 hover:text-rose-400 py-1 px-2 rounded-lg hover:bg-forest-900 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sair</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
