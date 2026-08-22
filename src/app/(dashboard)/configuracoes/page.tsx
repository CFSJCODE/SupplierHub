"use client";

import React, { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { supplierService, isSupabaseConfigured } from "@/lib/services/supplierService";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { exportSuppliersToCSV, exportSuppliersToJSON } from "@/lib/utils/export";
import {
  Settings,
  Database,
  Download,
  Sparkles,
  ShieldCheck,
  Server,
  UserCheck,
  CheckCircle2,
  AlertTriangle,
  Code2,
  Layers,
} from "lucide-react";
import { toast } from "sonner";

export default function ConfiguracoesPage() {
  const [userEmail, setUserEmail] = useState<string | null>("engenharia@local");
  const [totalCount, setTotalCount] = useState<number>(0);
  const [seeding, setSeeding] = useState(false);
  const [exporting, setExporting] = useState(false);
  const isConnected = isSupabaseConfigured();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data.user?.email) {
        setUserEmail(data.user.email);
      }
    });

    supplierService.getSuppliers().then((suppliers) => {
      setTotalCount(suppliers.length);
    });
  }, []);

  const handleSeedDemo = async () => {
    try {
      setSeeding(true);
      const count = await supplierService.seedDemoSuppliers();
      toast.success(`${count} fornecedores de referência adicionados com sucesso!`);
      const updated = await supplierService.getSuppliers();
      setTotalCount(updated.length);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro ao carregar exemplos.";
      toast.error(msg);
    } finally {
      setSeeding(false);
    }
  };

  const handleExportCSV = async () => {
    try {
      setExporting(true);
      const data = await supplierService.getSuppliers();
      exportSuppliersToCSV(data);
      toast.success("Arquivo CSV exportado com sucesso.");
    } catch (err: unknown) {
      toast.error("Erro ao exportar arquivo CSV.");
    } finally {
      setExporting(false);
    }
  };

  const handleExportJSON = async () => {
    try {
      setExporting(true);
      const data = await supplierService.getSuppliers();
      exportSuppliersToJSON(data);
      toast.success("Backup JSON exportado com sucesso.");
    } catch (err: unknown) {
      toast.error("Erro ao exportar backup JSON.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <AppShell
      title="Configurações do Sistema"
      subtitle="Diagnóstico de conectividade, gerenciamento de dados e portabilidade"
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Painel de Status e Conectividade */}
        <section className="bg-white border border-[#D2CAA9] rounded-lg p-5 shadow-subtle space-y-4">
          <div className="flex items-center space-x-2 border-b border-[#F0EBD7] pb-3">
            <Server className="w-4 h-4 text-brand-copper shrink-0" />
            <h2 className="text-sm font-bold text-forest-900 tracking-tight">
              Diagnóstico de Banco de Dados & Autenticação
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 bg-[#FAF7EE] border border-[#E5DFC5] rounded-md space-y-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-forest-800/70 font-mono block">
                Conexão Supabase
              </span>
              <div className="flex items-center space-x-2">
                {isConnected ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span className="font-bold text-emerald-900">
                      Conectado ao Supabase (PostgreSQL + RLS)
                    </span>
                  </>
                ) : (
                  <>
                    <div className="w-2.5 h-2.5 rounded-full bg-brand-clay shrink-0" />
                    <span className="font-bold text-forest-900">
                      Modo Demonstração / LocalStorage
                    </span>
                  </>
                )}
              </div>
              <p className="text-[11px] text-olive-800/80 leading-relaxed">
                {isConnected
                  ? "As operações de CRUD e autenticação estão sendo persistidas diretamente nas tabelas seguras do Supabase."
                  : "Para conectar ao seu projeto Supabase de produção, configure as variáveis NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY no arquivo .env.local ou na Vercel."}
              </p>
            </div>

            <div className="p-3.5 bg-[#FAF7EE] border border-[#E5DFC5] rounded-md space-y-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-forest-800/70 font-mono block">
                Usuário Autenticado
              </span>
              <div className="flex items-center space-x-2">
                <UserCheck className="w-4 h-4 text-brand-copper shrink-0" />
                <span className="font-bold text-forest-900 truncate">
                  {userEmail}
                </span>
              </div>
              <p className="text-[11px] text-olive-800/80 leading-relaxed">
                Total de fornecedores vinculados: <strong className="text-forest-900">{totalCount}</strong>
              </p>
            </div>
          </div>
        </section>

        {/* Gerenciamento e Portabilidade de Dados */}
        <section className="bg-white border border-[#D2CAA9] rounded-lg p-5 shadow-subtle space-y-4">
          <div className="flex items-center space-x-2 border-b border-[#F0EBD7] pb-3">
            <Database className="w-4 h-4 text-brand-copper shrink-0" />
            <h2 className="text-sm font-bold text-forest-900 tracking-tight">
              Portabilidade & Exportação de Dados
            </h2>
          </div>

          <p className="text-xs text-olive-800/80 leading-relaxed">
            Seus dados pertencem a você. Exporte a listagem completa de fornecedores para planilhas ou realize um backup estruturado em formato JSON.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportCSV}
              isLoading={exporting}
              leftIcon={<Download className="w-3.5 h-3.5" />}
            >
              Exportar para Excel (CSV)
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportJSON}
              isLoading={exporting}
              leftIcon={<Download className="w-3.5 h-3.5" />}
            >
              Exportar Backup Estruturado (JSON)
            </Button>
          </div>
        </section>

        {/* Ferramentas de Demonstração e Seed */}
        <section className="bg-white border border-[#D2CAA9] rounded-lg p-5 shadow-subtle space-y-4">
          <div className="flex items-center space-x-2 border-b border-[#F0EBD7] pb-3">
            <Sparkles className="w-4 h-4 text-brand-copper shrink-0" />
            <h2 className="text-sm font-bold text-forest-900 tracking-tight">
              Dados de Demonstração & Referência
            </h2>
          </div>

          <p className="text-xs text-olive-800/80 leading-relaxed">
            Carregue automaticamente os dados dos fornecedores de engenharia de referência (UsinaInfo, RoboCore, MakerHero, Mouser, DigiKey, AliExpress) com dados completos de contato, avaliação e observações técnicas de compras.
          </p>

          <div className="pt-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleSeedDemo}
              isLoading={seeding}
              leftIcon={<Sparkles className="w-3.5 h-3.5" />}
            >
              Carregar Fornecedores de Exemplo
            </Button>
          </div>
        </section>

        {/* Arquitetura & Segurança */}
        <section className="bg-white border border-[#D2CAA9] rounded-lg p-5 shadow-subtle space-y-3">
          <div className="flex items-center space-x-2 border-b border-[#F0EBD7] pb-3">
            <ShieldCheck className="w-4 h-4 text-brand-copper shrink-0" />
            <h2 className="text-sm font-bold text-forest-900 tracking-tight">
              Arquitetura & Conformidade Técnica
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono pt-1">
            <div className="p-2.5 bg-[#FAF7EE] rounded border border-[#E5DFC5]">
              <span className="text-[10px] text-olive-800/70 block">Frontend</span>
              <strong className="text-forest-900">Next.js 15 App Router</strong>
            </div>
            <div className="p-2.5 bg-[#FAF7EE] rounded border border-[#E5DFC5]">
              <span className="text-[10px] text-olive-800/70 block">Database</span>
              <strong className="text-forest-900">PostgreSQL (Supabase)</strong>
            </div>
            <div className="p-2.5 bg-[#FAF7EE] rounded border border-[#E5DFC5]">
              <span className="text-[10px] text-olive-800/70 block">Segurança</span>
              <strong className="text-forest-900">Row Level Security (RLS)</strong>
            </div>
            <div className="p-2.5 bg-[#FAF7EE] rounded border border-[#E5DFC5]">
              <span className="text-[10px] text-olive-800/70 block">Deploy</span>
              <strong className="text-forest-900">Vercel Ready</strong>
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
