"use client";

import React, { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { supplierService } from "@/lib/services/supplierService";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { exportSuppliersToCSV, exportSuppliersToJSON } from "@/lib/utils/export";
import { isSystemAdmin, getUserRoleBadge } from "@/lib/constants/admin";
import {
  Settings,
  Database,
  Download,
  ShieldCheck,
  Server,
  UserCheck,
  CheckCircle2,
  FileSpreadsheet,
  FileCode,
  Lock,
  Cloud,
  Crown,
  Sparkles,
  Users,
} from "lucide-react";
import { toast } from "sonner";

export default function ConfiguracoesPage() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [exporting, setExporting] = useState(false);

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

  const isAdmin = isSystemAdmin(userEmail);
  const roleInfo = getUserRoleBadge(userEmail);

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
      toast.success("Cópia de segurança JSON exportada com sucesso.");
    } catch {
      toast.error("Erro ao exportar cópia de segurança JSON.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <AppShell
      title="Configurações do Sistema"
      subtitle="Status da conta, permissões e gerenciamento de dados"
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Painel Exclusivo de Administrador do Sistema */}
        {isAdmin && (
          <section className="bg-linear-to-r from-amber-500/10 via-emerald-500/10 to-transparent border border-amber-300/60 rounded-xl p-6 shadow-card space-y-3">
            <div className="flex items-center justify-between border-b border-amber-200/60 pb-3.5">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center shadow-xs">
                  <Crown className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                    Painel do Administrador Master
                  </h2>
                  <p className="text-xs text-amber-800 font-medium">
                    Acesso irrestrito ao banco de dados e controle global
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 text-xs font-mono font-bold bg-amber-500 text-white rounded-full shadow-2xs">
                Root Admin
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
              <div className="p-3.5 bg-white/80 border border-amber-200/70 rounded-xl space-y-1">
                <span className="text-[10px] uppercase font-mono text-slate-500 font-semibold block">
                  Permissão RLS
                </span>
                <span className="font-bold text-slate-900 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Acesso Global
                </span>
              </div>
              <div className="p-3.5 bg-white/80 border border-amber-200/70 rounded-xl space-y-1">
                <span className="text-[10px] uppercase font-mono text-slate-500 font-semibold block">
                  Conta Vinculada
                </span>
                <span className="font-bold text-slate-900 truncate block">
                  {userEmail}
                </span>
              </div>
              <div className="p-3.5 bg-white/80 border border-amber-200/70 rounded-xl space-y-1">
                <span className="text-[10px] uppercase font-mono text-slate-500 font-semibold block">
                  Autenticação
                </span>
                <span className="font-bold text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Google OAuth 2.0
                </span>
              </div>
            </div>
          </section>
        )}

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
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-bold text-slate-900">
                  Sincronização em Nuvem Ativa
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Seus cadastros de fornecedores e atualizações são sincronizados em tempo real no banco de dados e protegidos com criptografia.
              </p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 font-mono block">
                Usuário Conectado
              </span>
              <div className="flex items-center space-x-2">
                {isAdmin ? (
                  <Crown className="w-4 h-4 text-amber-500 shrink-0" />
                ) : (
                  <UserCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                )}
                <span className="font-bold text-slate-900 truncate">
                  {userEmail || "Carregando..."}
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                    isAdmin ? "bg-amber-100 text-amber-800" : "bg-slate-200 text-slate-700"
                  }`}
                >
                  {roleInfo.label}
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Total de fornecedores gerenciados: <strong className="text-slate-900">{totalCount}</strong>
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

        {/* Segurança e Recursos da Plataforma */}
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
