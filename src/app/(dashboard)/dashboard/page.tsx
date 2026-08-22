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
            <div className="interactive-card bg-white border border-[#D2CAA9] rounded-xl p-5 shadow-subtle flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-forest-800 to-forest-600" />
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-forest-800/80 font-mono">
                  Total Cadastrado
                </span>
                <div className="w-8 h-8 rounded-lg bg-[#FAF7EE] border border-[#E5DFC5] flex items-center justify-center text-forest-800 shadow-sm group-hover:scale-105 transition-transform">
                  <Building2 className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-3xl font-extrabold text-forest-900 font-mono tracking-tight block">
                  {stats?.total || 0}
                </span>
                <p className="text-xs text-olive-800/80 mt-1 flex items-center gap-1">
                  <span>Parceiros mapeados</span>
                </p>
              </div>
            </div>

            {/* Fornecedores Ativos */}
            <div className="interactive-card bg-white border border-[#D2CAA9] rounded-xl p-5 shadow-subtle flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-600 to-teal-500" />
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-forest-800/80 font-mono">
                  Ativos & Preferenciais
                </span>
                <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-800 shadow-sm group-hover:scale-105 transition-transform">
                  <CheckCircle className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-3xl font-extrabold text-emerald-950 font-mono tracking-tight block">
                  {(stats?.active || 0) + (stats?.preferred || 0)}
                </span>
                <p className="text-xs text-emerald-800 font-medium mt-1">
                  {stats?.preferred || 0} com status preferencial
                </p>
              </div>
            </div>

            {/* Favoritos */}
            <div className="interactive-card bg-white border border-[#D2CAA9] rounded-xl p-5 shadow-subtle flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-copper to-brand-clay" />
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-forest-800/80 font-mono">
                  Favoritos de Compra
                </span>
                <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-brand-copper shadow-sm group-hover:scale-105 transition-transform">
                  <Star className="w-4 h-4 fill-brand-copper" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-3xl font-extrabold text-forest-900 font-mono tracking-tight block">
                  {stats?.favorites || 0}
                </span>
                <p className="text-xs text-brand-copper font-medium mt-1">
                  Acesso prioritário de compras
                </p>
              </div>
            </div>

            {/* Segmentos Cobertos */}
            <div className="interactive-card bg-white border border-[#D2CAA9] rounded-xl p-5 shadow-subtle flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-olive to-olive-700" />
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-forest-800/80 font-mono">
                  Segmentos Cobertos
                </span>
                <div className="w-8 h-8 rounded-lg bg-clay-50 border border-clay-300 flex items-center justify-center text-clay-700 shadow-sm group-hover:scale-105 transition-transform">
                  <Layers className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-3xl font-extrabold text-forest-900 font-mono tracking-tight block">
                  {stats?.categoriesCount || 0}
                </span>
                <p className="text-xs text-olive-800/80 mt-1">
                  Especialidades técnicas
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Bloco de Acesso Rápido com Efeito Visual Refinado */}
        <div className="bg-white border border-[#D2CAA9] rounded-xl p-5 shadow-subtle space-y-3.5">
          <div className="flex items-center justify-between border-b border-[#F0EBD7] pb-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-forest-900 font-mono flex items-center gap-2">
              <Zap className="w-4 h-4 text-brand-copper" />
              <span>Ações Operacionais de Engenharia</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <Link
              href="/fornecedores/novo"
              className="interactive-card p-4 bg-[#FAF7EE] hover:bg-[#F3EED8] border border-[#D2CAA9] rounded-lg flex items-center space-x-3.5 group"
            >
              <div className="w-10 h-10 rounded-lg bg-brand-copper text-white flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                <PlusCircle className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-forest-900 block leading-tight group-hover:text-brand-copper transition-colors">
                  Novo Fornecedor
                </span>
                <span className="text-[11px] text-olive-800/70 block mt-0.5">
                  Cadastrar catálogo, contatos e lead times
                </span>
              </div>
            </Link>

            <Link
              href="/fornecedores"
              className="interactive-card p-4 bg-[#FAF7EE] hover:bg-[#F3EED8] border border-[#D2CAA9] rounded-lg flex items-center space-x-3.5 group"
            >
              <div className="w-10 h-10 rounded-lg bg-brand-olive text-white flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-forest-900 block leading-tight group-hover:text-brand-olive transition-colors">
                  Catálogo Geral
                </span>
                <span className="text-[11px] text-olive-800/70 block mt-0.5">
                  Pesquisar, filtrar e exportar dados
                </span>
              </div>
            </Link>

            <Link
              href="/favoritos"
              className="interactive-card p-4 bg-[#FAF7EE] hover:bg-[#F3EED8] border border-[#D2CAA9] rounded-lg flex items-center space-x-3.5 group"
            >
              <div className="w-10 h-10 rounded-lg bg-brand-clay text-white flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                <BookmarkCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-forest-900 block leading-tight group-hover:text-brand-copper transition-colors">
                  Fornecedores Favoritos
                </span>
                <span className="text-[11px] text-olive-800/70 block mt-0.5">
                  Acesso imediato para compras críticas
                </span>
              </div>
            </Link>
          </div>
        </div>

        {/* Fornecedores Recentes & Distribuição por Categoria */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Seção: Fornecedores Recentes (2 colunas) */}
          <div className="lg:col-span-2 bg-white border border-[#D2CAA9] rounded-xl p-5 sm:p-6 shadow-subtle space-y-4">
            <div className="flex items-center justify-between border-b border-[#F0EBD7] pb-3.5">
              <div>
                <h2 className="text-sm font-bold text-forest-900 tracking-tight flex items-center gap-2">
                  <Award className="w-4 h-4 text-brand-copper" />
                  <span>Fornecedores Adicionados Recentemente</span>
                </h2>
                <p className="text-[11px] text-olive-800/70 mt-0.5">
                  Últimos parceiros catalogados e ativos no sistema
                </p>
              </div>
              <Link
                href="/fornecedores"
                className="text-xs font-semibold text-brand-copper hover:underline inline-flex items-center gap-1 group"
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
              <div className="divide-y divide-[#F0EBD7]">
                {recentSuppliers.map((supplier) => (
                  <div
                    key={supplier.id}
                    className="py-3.5 flex items-center justify-between hover:bg-[#FAF7EE]/70 px-2.5 rounded-lg transition-colors gap-3 group"
                  >
                    <div className="flex items-center space-x-3.5 min-w-0">
                      <div className="w-10 h-10 rounded-lg bg-[#FAF7EE] border border-[#E5DFC5] flex items-center justify-center shrink-0 overflow-hidden text-forest-700/60 shadow-sm">
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
                          <Building className="w-5 h-5 text-forest-700/60" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <Link
                          href={`/fornecedores/${supplier.id}`}
                          className="text-xs font-bold text-forest-900 group-hover:text-brand-copper truncate block transition-colors"
                        >
                          {supplier.name}
                        </Link>
                        <div className="flex items-center gap-2 mt-1">
                          <CategoryBadge category={supplier.category} />
                          {supplier.city && (
                            <span className="text-[11px] text-olive-800/70 truncate">
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
                        className="p-1.5 text-brand-copper hover:bg-brand-clay/10 rounded-md transition-colors"
                        title="Gerar parecer de IA"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                      </button>
                      <StatusBadge status={supplier.status} size="sm" />
                      <Link
                        href={`/fornecedores/${supplier.id}`}
                        className="p-1.5 text-forest-700/60 hover:text-brand-copper rounded-md hover:bg-forest-100/50 transition-colors"
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
          <div className="bg-white border border-[#D2CAA9] rounded-xl p-5 sm:p-6 shadow-subtle space-y-4 flex flex-col justify-between">
            <div>
              <div className="border-b border-[#F0EBD7] pb-3.5">
                <h2 className="text-sm font-bold text-forest-900 tracking-tight flex items-center gap-2">
                  <Layers className="w-4 h-4 text-brand-olive" />
                  <span>Segmentos Técnicos</span>
                </h2>
                <p className="text-[11px] text-olive-800/70 mt-0.5">
                  Distribuição e concentração de catálogo
                </p>
              </div>

              <div className="pt-3.5 space-y-2.5 max-h-80 overflow-y-auto pr-1">
                {Object.keys(categoryCounts).length === 0 ? (
                  <p className="text-xs text-forest-800/60 py-6 text-center italic">
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
                          className="p-2.5 bg-[#FAF7EE] rounded-lg border border-[#E5DFC5]/70 space-y-1.5"
                        >
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-medium text-forest-900 truncate mr-2">
                              {category}
                            </span>
                            <span className="font-mono text-[11px] font-bold text-forest-800 shrink-0">
                              {count} <span className="text-[10px] text-olive-800/60">({percentage}%)</span>
                            </span>
                          </div>
                          {/* Mini Progress Bar */}
                          <div className="w-full bg-[#E5DFC5] h-1.5 rounded-full overflow-hidden">
                            <div
                              className="bg-brand-olive h-full rounded-full transition-all duration-500"
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
              <div className="p-4 bg-brand-cornsilk border border-brand-clay/50 rounded-lg mt-4 space-y-2 shadow-sm">
                <div className="flex items-center space-x-1.5 text-xs font-bold text-forest-900">
                  <Sparkles className="w-4 h-4 text-brand-copper" />
                  <span>Ambiente inicial detectado</span>
                </div>
                <p className="text-[11px] text-forest-800/80 leading-relaxed">
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
