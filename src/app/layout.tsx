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
      <body className="min-h-screen bg-brand-cornsilk text-forest-900 antialiased selection:bg-brand-clay/30">
        {children}
        <Toaster
          position="top-right"
          richColors
          closeButton
          toastOptions={{
            style: {
              background: "#FFFFFF",
              color: "#18220F",
              border: "1px solid #D2CAA9",
              borderRadius: "6px",
              fontSize: "13px",
              fontFamily: "inherit",
              boxShadow: "0 4px 6px -1px rgba(40, 54, 24, 0.1)",
            },
          }}
        />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
