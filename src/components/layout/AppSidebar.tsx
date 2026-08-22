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
  UserCheck
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
  const [userEmail, setUserEmail] = useState<string | null>("engenharia@local");

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
      label: "Dashboard",
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
    <aside className="w-64 bg-forest-800 text-cornsilk-500 flex flex-col h-screen sticky top-0 border-r border-forest-900 select-none shrink-0 z-30">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-5 border-b border-forest-700/60 justify-between">
        <Link href="/dashboard" className="flex items-center space-x-2.5 group">
          <div className="w-8 h-8 rounded-md bg-brand-copper flex items-center justify-center text-white shadow-subtle group-hover:bg-copper-600 transition-colors">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-base tracking-tight text-white block leading-tight">
              SupplierHub
            </span>
            <span className="text-[10px] text-clay-400 font-mono tracking-wider uppercase block">
              Procurement & Eng.
            </span>
          </div>
        </Link>
      </div>

      {/* Action Shortcut */}
      <div className="p-4 border-b border-forest-700/40">
        <Link
          href="/fornecedores/novo"
          className="w-full flex items-center justify-center space-x-2 py-2 px-3 bg-brand-copper hover:bg-copper-800 text-white rounded-md text-xs font-semibold tracking-wide transition-colors shadow-subtle focus-visible:ring-2 focus-visible:ring-brand-copper"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Novo Fornecedor</span>
        </Link>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        <div>
          <span className="px-3 text-[11px] font-semibold text-clay-400/80 uppercase tracking-wider font-mono block mb-2">
            Visão Geral
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
                    "flex items-center justify-between px-3 py-2 text-xs font-medium rounded-md transition-colors",
                    isActive
                      ? "bg-brand-olive text-white shadow-subtle font-semibold"
                      : "text-cornsilk-500/80 hover:bg-forest-700/60 hover:text-white"
                  )}
                >
                  <div className="flex items-center space-x-2.5">
                    <Icon
                      className={cn(
                        "w-4 h-4 shrink-0",
                        isActive ? "text-white" : "text-clay-400/70"
                      )}
                    />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className="px-1.5 py-0.5 text-[10px] font-mono bg-forest-900/60 rounded text-clay-300">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        <div>
          <span className="px-3 text-[11px] font-semibold text-clay-400/80 uppercase tracking-wider font-mono block mb-2">
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
                    "flex items-center justify-between px-3 py-2 text-xs font-medium rounded-md transition-colors",
                    isActive
                      ? "bg-brand-olive text-white shadow-subtle font-semibold"
                      : "text-cornsilk-500/80 hover:bg-forest-700/60 hover:text-white"
                  )}
                >
                  <div className="flex items-center space-x-2.5">
                    <Icon
                      className={cn(
                        "w-4 h-4 shrink-0",
                        isActive ? "text-white" : "text-clay-400/70"
                      )}
                    />
                    <span>{item.label}</span>
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* User Footer Profile & Sign Out */}
      <div className="p-3 border-t border-forest-700/60 bg-forest-900/40">
        <div className="flex items-center justify-between px-2 py-2">
          <div className="flex items-center space-x-2 min-w-0 pr-2">
            <div className="w-7 h-7 rounded-full bg-olive-700 flex items-center justify-center text-cornsilk-500 shrink-0">
              <UserCheck className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-white truncate leading-tight">
                {userEmail}
              </p>
              <p className="text-[10px] text-clay-400/80 font-mono">
                Engenharia
              </p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            title="Encerrar sessão"
            className="p-1.5 text-cornsilk-500/70 hover:text-rose-300 hover:bg-rose-950/40 rounded transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-copper"
            aria-label="Sair"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
