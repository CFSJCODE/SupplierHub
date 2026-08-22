"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { supplierService } from "@/lib/services/supplierService";
import { Supplier, SupplierStats } from "@/types/supplier";
import { StatusBadge } from "@/components/suppliers/StatusBadge";
import { CategoryBadge } from "@/components/suppliers/CategoryBadge";
import { RatingStars } from "@/components/suppliers/RatingStars";
import { StatsSkeleton, TableSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { SupplierAIAnalysisModal } from "@/components/suppliers/SupplierAIAnalysisModal";
import {
  Building2,
  CheckCircle,
  BookmarkCheck,
  Layers,
  Star,
  PlusCircle,
  ArrowRight,
  Sparkles,
  ExternalLink,
  Building,
  TrendingUp,
  Award,
  Zap,
} from "lucide-react";
import { toast } from "sonner";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<SupplierStats | null>(null);
  const [recentSuppliers, setRecentSuppliers] = useState<Supplier[]>([]);
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({});
  const [seeding, setSeeding] = useState(false);
  const [aiModalSupplier, setAiModalSupplier] = useState<Supplier | null>(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const data = await supplierService.getDashboardStats();
      setStats(data.stats);
      setRecentSuppliers(data.recentSuppliers);
      setCategoryCounts(data.categoryCounts);
    } catch (err: unknown) {
      console.error("Erro ao carregar dados do dashboard:", err);
      toast.error("Erro ao carregar métricas do dashboard.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleSeedDemo = async () => {
    try {
      setSeeding(true);
      const count = await supplierService.seedDemoSuppliers();
      toast.success(`${count} fornecedores de exemplo adicionados com sucesso!`);
      await fetchDashboardData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro ao carregar exemplos.";
      toast.error(msg);
    } finally {
      setSeeding(false);
    }
  };

  const totalSuppliers = stats?.total || 0;

  return (
    <AppShell
      title="Painel de Controle"
      subtitle="Visão consolidada da cadeia de suprimentos e fornecedores técnicos"
    >
      <div className="space-y-6">
        {/* Bloco de Métricas Principais */}
        {loading ? (
          <StatsSkeleton />
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total de Fornecedores */}
            <div className="interactive-card bg-white border border-slate-200 rounded-xl p-5 shadow-card flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute top-0 left-0 right-0 h-1 bg-slate-900" />
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 font-mono">
                  Total Cadastrado
                </span>
                <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 shadow-2xs group-hover:scale-105 transition-transform">
                  <Building2 className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-3xl font-extrabold text-slate-900 font-mono tracking-tight block">
                  {stats?.total || 0}
                </span>
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                  <span>Parceiros mapeados</span>
                </p>
              </div>
            </div>

            {/* Fornecedores Ativos */}
            <div className="interactive-card bg-white border border-slate-200 rounded-xl p-5 shadow-card flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-600" />
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 font-mono">
                  Ativos & Preferenciais
                </span>
                <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shadow-2xs group-hover:scale-105 transition-transform">
                  <CheckCircle className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-3xl font-extrabold text-slate-900 font-mono tracking-tight block">
                  {(stats?.active || 0) + (stats?.preferred || 0)}
                </span>
                <p className="text-xs text-emerald-700 font-medium mt-1">
                  {stats?.preferred || 0} com status preferencial
                </p>
              </div>
            </div>

            {/* Favoritos */}
            <div className="interactive-card bg-white border border-slate-200 rounded-xl p-5 shadow-card flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute top-0 left-0 right-0 h-1 bg-amber-500" />
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 font-mono">
                  Favoritos de Compra
                </span>
                <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shadow-2xs group-hover:scale-105 transition-transform">
                  <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-3xl font-extrabold text-slate-900 font-mono tracking-tight block">
                  {stats?.favorites || 0}
                </span>
                <p className="text-xs text-amber-700 font-medium mt-1">
                  Acesso prioritário de compras
                </p>
              </div>
            </div>

            {/* Segmentos Cobertos */}
            <div className="interactive-card bg-white border border-slate-200 rounded-xl p-5 shadow-card flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute top-0 left-0 right-0 h-1 bg-blue-600" />
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 font-mono">
                  Segmentos Cobertos
                </span>
                <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 shadow-2xs group-hover:scale-105 transition-transform">
                  <Layers className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-3xl font-extrabold text-slate-900 font-mono tracking-tight block">
                  {stats?.categoriesCount || 0}
                </span>
                <p className="text-xs text-slate-500 mt-1">
                  Especialidades técnicas
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Bloco de Acesso Rápido com Efeito Visual Refinado */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-card space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 font-mono flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-600" />
              <span>Ações Operacionais de Engenharia</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              href="/fornecedores/novo"
              className="interactive-card p-4 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-xl flex items-center space-x-3.5 group shadow-xs"
            >
              <div className="w-10 h-10 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                <PlusCircle className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 block leading-tight group-hover:text-emerald-700 transition-colors">
                  Novo Fornecedor
                </span>
                <span className="text-[11px] text-slate-500 block mt-0.5">
                  Cadastrar catálogo, contatos e lead times
                </span>
              </div>
            </Link>

            <Link
              href="/fornecedores"
              className="interactive-card p-4 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-xl flex items-center space-x-3.5 group shadow-xs"
            >
              <div className="w-10 h-10 rounded-lg bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 block leading-tight group-hover:text-emerald-700 transition-colors">
                  Catálogo Geral
                </span>
                <span className="text-[11px] text-slate-500 block mt-0.5">
                  Pesquisar, filtrar e exportar dados
                </span>
              </div>
            </Link>

            <Link
              href="/favoritos"
              className="interactive-card p-4 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-xl flex items-center space-x-3.5 group shadow-xs"
            >
              <div className="w-10 h-10 rounded-lg bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                <BookmarkCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 block leading-tight group-hover:text-amber-700 transition-colors">
                  Fornecedores Favoritos
                </span>
                <span className="text-[11px] text-slate-500 block mt-0.5">
                  Acesso imediato para compras críticas
                </span>
              </div>
            </Link>
          </div>
        </div>

        {/* Fornecedores Recentes & Distribuição por Categoria */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Seção: Fornecedores Recentes (2 colunas) */}
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-6 shadow-card space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
              <div>
                <h2 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  <Award className="w-4 h-4 text-emerald-600" />
                  <span>Fornecedores Adicionados Recentemente</span>
                </h2>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Últimos parceiros catalogados e ativos no sistema
                </p>
              </div>
              <Link
                href="/fornecedores"
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 hover:underline inline-flex items-center gap-1 group"
              >
                <span>Ver todos ({totalSuppliers})</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            {loading ? (
              <TableSkeleton rows={4} />
            ) : recentSuppliers.length === 0 ? (
              <EmptyState
                title="Nenhum fornecedor cadastrado"
                description="Cadastre seu primeiro fornecedor para começar a organizar sua rede de compras e parceiros de engenharia."
                actionLabel="Cadastrar fornecedor"
                actionHref="/fornecedores/novo"
                secondaryActionLabel="Carregar Exemplos (UsinaInfo, RoboCore, MakerHero)"
                onSecondaryAction={handleSeedDemo}
              />
            ) : (
              <div className="divide-y divide-slate-100">
                {recentSuppliers.map((supplier) => (
                  <div
                    key={supplier.id}
                    className="py-3.5 flex items-center justify-between hover:bg-slate-50/80 px-3 rounded-lg transition-colors gap-3 group"
                  >
                    <div className="flex items-center space-x-3.5 min-w-0">
                      <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0 overflow-hidden text-slate-400 shadow-2xs">
                        {supplier.logo_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={supplier.logo_url}
                            alt={supplier.name}
                            className="w-full h-full object-contain p-1"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = "none";
                            }}
                          />
                        ) : (
                          <Building className="w-5 h-5 text-slate-300" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <Link
                          href={`/fornecedores/${supplier.id}`}
                          className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 truncate block transition-colors"
                        >
                          {supplier.name}
                        </Link>
                        <div className="flex items-center gap-2 mt-1">
                          <CategoryBadge category={supplier.category} />
                          {supplier.city && (
                            <span className="text-[11px] text-slate-500 truncate">
                              {supplier.city}/{supplier.state || supplier.country}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => setAiModalSupplier(supplier)}
                        className="p-1.5 text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                        title="Gerar parecer de IA"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      </button>
                      <StatusBadge status={supplier.status} size="sm" />
                      <Link
                        href={`/fornecedores/${supplier.id}`}
                        className="p-1.5 text-slate-400 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
                        title="Ver detalhes"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Seção: Distribuição por Segmento Técnico (1 coluna) */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-card space-y-4 flex flex-col justify-between">
            <div>
              <div className="border-b border-slate-100 pb-3.5">
                <h2 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  <Layers className="w-4 h-4 text-emerald-600" />
                  <span>Segmentos Técnicos</span>
                </h2>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Distribuição e concentração de catálogo
                </p>
              </div>

              <div className="pt-3.5 space-y-2.5 max-h-80 overflow-y-auto pr-1">
                {Object.keys(categoryCounts).length === 0 ? (
                  <p className="text-xs text-slate-400 py-6 text-center italic">
                    Nenhuma categoria registrada.
                  </p>
                ) : (
                  Object.entries(categoryCounts)
                    .sort(([, a], [, b]) => b - a)
                    .map(([category, count]) => {
                      const percentage = totalSuppliers > 0 ? Math.round((count / totalSuppliers) * 100) : 0;
                      return (
                        <div
                          key={category}
                          className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1.5"
                        >
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-medium text-slate-900 truncate mr-2">
                              {category}
                            </span>
                            <span className="font-mono text-[11px] font-bold text-slate-700 shrink-0">
                              {count} <span className="text-[10px] text-slate-400">({percentage}%)</span>
                            </span>
                          </div>
                          {/* Mini Progress Bar */}
                          <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                            <div
                              className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                              style={{ width: `${Math.max(percentage, 5)}%` }}
                            />
                          </div>
                        </div>
                      );
                    })
                )}
              </div>
            </div>

            {/* Seed Quick Trigger Card */}
            {stats && stats.total === 0 && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl mt-4 space-y-2 shadow-xs">
                <div className="flex items-center space-x-1.5 text-xs font-bold text-emerald-950">
                  <Sparkles className="w-4 h-4 text-emerald-700" />
                  <span>Ambiente inicial detectado</span>
                </div>
                <p className="text-[11px] text-emerald-900 leading-relaxed">
                  Deseja carregar os fornecedores de referência recomendados (MakerHero, UsinaInfo, RoboCore, Mouser, DigiKey)?
                </p>
                <Button
                  size="sm"
                  variant="primary"
                  onClick={handleSeedDemo}
                  isLoading={seeding}
                  className="w-full text-xs"
                >
                  Carregar Dados de Exemplo
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de Análise de IA Rápido */}
      {aiModalSupplier && (
        <SupplierAIAnalysisModal
          isOpen={!!aiModalSupplier}
          onClose={() => setAiModalSupplier(null)}
          supplier={aiModalSupplier}
        />
      )}
    </AppShell>
  );
}
