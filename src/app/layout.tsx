import type { Metadata } from "next";
import "@/styles/globals.css";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata: Metadata = {
  title: "SupplierHub - Gestão de Fornecedores de Engenharia",
  description:
    "Sistema corporativo interno para catalogação, avaliação e procurement de fornecedores de componentes eletrônicos, robótica, prototipagem e materiais de engenharia.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased selection:bg-emerald-100 selection:text-emerald-950 font-sans">
        {children}
        <Toaster
          position="top-right"
          richColors
          closeButton
          toastOptions={{
            style: {
              background: "#FFFFFF",
              color: "#0F172A",
              border: "1px solid #E2E8F0",
              borderRadius: "8px",
              fontSize: "13px",
              fontFamily: "inherit",
              boxShadow: "0 10px 25px -3px rgba(15, 23, 42, 0.08)",
            },
          }}
        />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
