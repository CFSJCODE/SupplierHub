"use client";

import React, { useState } from "react";
import { AppSidebar } from "./AppSidebar";
import { MobileNav } from "./MobileNav";
import { TopHeader } from "./TopHeader";

export interface AppShellProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  backHref?: string;
  headerAction?: React.ReactNode;
}

export function AppShell({
  children,
  title = "SupplierHub",
  subtitle,
  showBack = false,
  backHref = "/fornecedores",
  headerAction,
}: AppShellProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-brand-cornsilk text-forest-900">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <AppSidebar />
      </div>

      {/* Mobile Drawer */}
      <MobileNav
        isOpen={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <TopHeader
          title={title}
          subtitle={subtitle}
          showBack={showBack}
          backHref={backHref}
          action={headerAction}
          onOpenMobileNav={() => setMobileNavOpen(true)}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-in fade-in duration-100">
          {children}
        </main>
      </div>
    </div>
  );
}
