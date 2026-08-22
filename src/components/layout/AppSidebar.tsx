"use client";

import React, { useEffect, useState } from "react";
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
  UserCheck,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number | string;
}

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>("compras@empresa.com");

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data.user?.email) {
        setUserEmail(data.user.email);
      }
    });
  }, []);

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

  const navItems: NavItem[] = [
    {
      label: "Painel Principal",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Fornecedores",
      href: "/fornecedores",
      icon: Building2,
    },
    {
      label: "Favoritos",
      href: "/favoritos",
      icon: BookmarkCheck,
    },
  ];

  const systemItems: NavItem[] = [
    {
      label: "Configurações",
      href: "/configuracoes",
      icon: Settings,
    },
  ];

  return (
    <aside className="w-64 bg-forest-950 text-slate-300 flex flex-col h-screen sticky top-0 border-r border-forest-900 select-none shrink-0 z-30">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-5 border-b border-forest-900 justify-between">
        <Link href="/dashboard" className="flex items-center space-x-2.5 group">
          <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-sm group-hover:bg-emerald-500 transition-colors">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-base tracking-tight text-white block leading-tight">
              SupplierHub
            </span>
            <span className="text-[10px] text-emerald-400 font-mono tracking-wider uppercase block font-semibold">
              Gestão de Fornecedores
            </span>
          </div>
        </Link>
      </div>

      {/* Action Shortcut */}
      <div className="p-4 border-b border-forest-900/60">
        <Link
          href="/fornecedores/novo"
          className="w-full flex items-center justify-center space-x-2 py-2 px-3 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white rounded-lg text-xs font-semibold tracking-wide transition-all shadow-sm focus-visible:ring-2 focus-visible:ring-emerald-400 cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Novo Fornecedor</span>
        </Link>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        <div>
          <span className="px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider font-mono block mb-2">
            Navegação
          </span>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive =
                item.href === "/fornecedores"
                  ? pathname === "/fornecedores" ||
                    (pathname.startsWith("/fornecedores/") && pathname !== "/fornecedores/novo")
                  : pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-all",
                    isActive
                      ? "bg-emerald-600/15 text-emerald-300 font-semibold border-l-2 border-emerald-500 pl-2.5"
                      : "text-slate-300 hover:bg-forest-900/80 hover:text-white"
                  )}
                >
                  <div className="flex items-center space-x-2.5">
                    <Icon
                      className={cn(
                        "w-4 h-4 shrink-0",
                        isActive ? "text-emerald-400" : "text-slate-400"
                      )}
                    />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className="px-1.5 py-0.5 text-[10px] font-mono bg-forest-900 rounded text-emerald-300">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        <div>
          <span className="px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider font-mono block mb-2">
            Sistema
          </span>
          <nav className="space-y-1">
            {systemItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-all",
                    isActive
                      ? "bg-emerald-600/15 text-emerald-300 font-semibold border-l-2 border-emerald-500 pl-2.5"
                      : "text-slate-300 hover:bg-forest-900/80 hover:text-white"
                  )}
                >
                  <div className="flex items-center space-x-2.5">
                    <Icon
                      className={cn(
                        "w-4 h-4 shrink-0",
                        isActive ? "text-emerald-400" : "text-slate-400"
                      )}
                    />
                    <span>{item.label}</span>
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Informação Útil e Amigável */}
        <div className="px-3 pt-2">
          <div className="p-3 bg-forest-900/70 border border-forest-800 rounded-lg space-y-1">
            <div className="flex items-center space-x-1.5 text-[11px] font-bold text-emerald-300">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Assistente Inteligente</span>
            </div>
            <p className="text-[10px] text-slate-400 leading-relaxed">
              Análises automáticas de fornecedores e recomendações de compras.
            </p>
          </div>
        </div>
      </div>

      {/* User Footer Profile & Sign Out */}
      <div className="p-3 border-t border-forest-900 bg-forest-950/80">
        <div className="flex items-center justify-between px-2 py-1.5">
          <div className="flex items-center space-x-2.5 min-w-0 pr-2">
            <div className="w-8 h-8 rounded-full bg-emerald-950 border border-emerald-800/80 flex items-center justify-center text-emerald-300 shrink-0">
              <UserCheck className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-white truncate leading-tight">
                {userEmail}
              </p>
              <p className="text-[10px] text-slate-400 font-mono">
                Conta Ativa
              </p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            title="Encerrar sessão"
            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 cursor-pointer"
            aria-label="Sair"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
