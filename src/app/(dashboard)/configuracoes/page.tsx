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
  FileSpreadsheet,
  FileCode,
  Lock,
  Cloud,
} from "lucide-react";
import { toast } from "sonner";

export default function ConfiguracoesPage() {
  const [userEmail, setUserEmail] = useState<string | null>("compras@empresa.com");
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
      toast.success(`${count} fornecedores de exemplo adicionados com sucesso!`);
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
    } catch {
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
    } catch {
      toast.error("Erro ao exportar backup JSON.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <AppShell
      title="Configurações do Sistema"
      subtitle="Status da conta, gerenciamento de dados e exportação de relatórios"
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Painel de Status da Conta e Conexão */}
        <section className="bg-white border border-slate-200 rounded-xl p-6 shadow-card space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-3.5">
            <Server className="w-4 h-4 text-emerald-600 shrink-0" />
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">
              Status da Conta & Conexão
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 font-mono block">
                Armazenamento de Dados
              </span>
              <div className="flex items-center space-x-2">
                {isConnected ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="font-bold text-slate-900">
                      Sincronização em Nuvem Ativa
                    </span>
                  </>
                ) : (
                  <>
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                    <span className="font-bold text-slate-900">
                      Modo Demonstração
                    </span>
                  </>
                )}
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {isConnected
                  ? "Suas alterações e cadastros são sincronizados automaticamente e protegidos em ambiente seguro."
                  : "Ambiente de demonstração ativo para testes locais de navegação."}
              </p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 font-mono block">
                Usuário Conectado
              </span>
              <div className="flex items-center space-x-2">
                <UserCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-bold text-slate-900 truncate">
                  {userEmail}
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Total de fornecedores vinculados à sua conta: <strong className="text-slate-900">{totalCount}</strong>
              </p>
            </div>
          </div>
        </section>

        {/* Gerenciamento e Portabilidade de Dados */}
        <section className="bg-white border border-slate-200 rounded-xl p-6 shadow-card space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-3.5">
            <Database className="w-4 h-4 text-emerald-600 shrink-0" />
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">
              Exportação e Relatórios
            </h2>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Exporte sua lista de fornecedores para planilhas do Excel ou faça o download de uma cópia de segurança em formato estruturado.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportCSV}
              isLoading={exporting}
              leftIcon={<FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />}
            >
              Exportar para Excel (CSV)
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportJSON}
              isLoading={exporting}
              leftIcon={<FileCode className="w-3.5 h-3.5 text-slate-600" />}
            >
              Exportar Cópia de Segurança (JSON)
            </Button>
          </div>
        </section>

        {/* Dados de Exemplo */}
        <section className="bg-white border border-slate-200 rounded-xl p-6 shadow-card space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-3.5">
            <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">
              Dados de Exemplo
            </h2>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Adicione uma lista com dados de exemplo de fornecedores (contatos, avaliações e histórico) para testar os filtros, relatórios e recursos do sistema.
          </p>

          <div className="pt-1">
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

        {/* Segurança e Privacidade */}
        <section className="bg-white border border-slate-200 rounded-xl p-6 shadow-card space-y-3">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-3.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">
              Segurança & Recursos da Plataforma
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono pt-1">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-[10px] text-slate-500 block">Privacidade</span>
              <strong className="text-slate-900">Acesso Restrito</strong>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-[10px] text-slate-500 block">Backup</span>
              <strong className="text-slate-900">Exportação CSV / JSON</strong>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-[10px] text-slate-500 block">Conexão</span>
              <strong className="text-slate-900">Criptografia SSL</strong>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-[10px] text-slate-500 block">Assistente</span>
              <strong className="text-slate-900">Inteligência Artificial</strong>
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
