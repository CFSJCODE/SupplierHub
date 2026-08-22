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
import { formatDate } from "@/lib/utils/formatters";
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
} from "lucide-react";
import { toast } from "sonner";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<SupplierStats | null>(null);
  const [recentSuppliers, setRecentSuppliers] = useState<Supplier[]>([]);
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({});
  const [seeding, setSeeding] = useState(false);

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
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
            {/* Total de Fornecedores */}
            <div className="bg-white border border-[#D2CAA9] rounded-lg p-4 shadow-subtle flex flex-col justify-between hover:border-brand-olive transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-forest-800/80 font-mono">
                  Total Cadastrado
                </span>
                <div className="w-7 h-7 rounded bg-[#FAF7EE] border border-[#E5DFC5] flex items-center justify-center text-forest-800">
                  <Building2 className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="mt-3">
                <span className="text-2xl font-bold text-forest-900 font-mono tracking-tight">
                  {stats?.total || 0}
                </span>
                <p className="text-[11px] text-olive-800/80 mt-0.5">
                  Parceiros mapeados
                </p>
              </div>
            </div>

            {/* Fornecedores Ativos */}
            <div className="bg-white border border-[#D2CAA9] rounded-lg p-4 shadow-subtle flex flex-col justify-between hover:border-brand-olive transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-forest-800/80 font-mono">
                  Ativos & Preferenciais
                </span>
                <div className="w-7 h-7 rounded bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-800">
                  <CheckCircle className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="mt-3">
                <span className="text-2xl font-bold text-forest-900 font-mono tracking-tight">
                  {(stats?.active || 0) + (stats?.preferred || 0)}
                </span>
                <p className="text-[11px] text-emerald-800 font-medium mt-0.5">
                  {stats?.preferred || 0} com status preferencial
                </p>
              </div>
            </div>

            {/* Favoritos */}
            <div className="bg-white border border-[#D2CAA9] rounded-lg p-4 shadow-subtle flex flex-col justify-between hover:border-brand-olive transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-forest-800/80 font-mono">
                  Favoritos de Compra
                </span>
                <div className="w-7 h-7 rounded bg-amber-50 border border-amber-200 flex items-center justify-center text-brand-copper">
                  <Star className="w-3.5 h-3.5 fill-brand-copper" />
                </div>
              </div>
              <div className="mt-3">
                <span className="text-2xl font-bold text-forest-900 font-mono tracking-tight">
                  {stats?.favorites || 0}
                </span>
                <p className="text-[11px] text-brand-copper font-medium mt-0.5">
                  Acesso prioritário
                </p>
              </div>
            </div>

            {/* Categorias Utilizadas */}
            <div className="bg-white border border-[#D2CAA9] rounded-lg p-4 shadow-subtle flex flex-col justify-between hover:border-brand-olive transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-forest-800/80 font-mono">
                  Segmentos Cobertos
                </span>
                <div className="w-7 h-7 rounded bg-clay-50 border border-clay-300 flex items-center justify-center text-clay-600">
                  <Layers className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="mt-3">
                <span className="text-2xl font-bold text-forest-900 font-mono tracking-tight">
                  {stats?.categoriesCount || 0}
                </span>
                <p className="text-[11px] text-olive-800/80 mt-0.5">
                  Categorias técnicas
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Bloco de Acesso Rápido */}
        <div className="bg-white border border-[#D2CAA9] rounded-lg p-4 sm:p-5 shadow-subtle space-y-3">
          <div className="flex items-center justify-between border-b border-[#F0EBD7] pb-2.5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-forest-900 font-mono">
              Acesso Rápido & Ações Operacionais
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Link
              href="/fornecedores/novo"
              className="p-3 bg-[#FAF7EE] hover:bg-[#F3EED8] border border-[#D2CAA9] rounded-md flex items-center space-x-3 transition-colors group"
            >
              <div className="w-9 h-9 rounded bg-brand-copper text-white flex items-center justify-center shrink-0 shadow-subtle group-hover:scale-105 transition-transform">
                <PlusCircle className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-forest-900 block leading-tight">
                  Novo Fornecedor
                </span>
                <span className="text-[11px] text-olive-800/70 block">
                  Cadastrar catálogo, contatos e dados
                </span>
              </div>
            </Link>

            <Link
              href="/fornecedores"
              className="p-3 bg-[#FAF7EE] hover:bg-[#F3EED8] border border-[#D2CAA9] rounded-md flex items-center space-x-3 transition-colors group"
            >
              <div className="w-9 h-9 rounded bg-brand-olive text-white flex items-center justify-center shrink-0 shadow-subtle group-hover:scale-105 transition-transform">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-forest-900 block leading-tight">
                  Ver Fornecedores
                </span>
                <span className="text-[11px] text-olive-800/70 block">
                  Buscar, filtrar e gerenciar cadastros
                </span>
              </div>
            </Link>

            <Link
              href="/favoritos"
              className="p-3 bg-[#FAF7EE] hover:bg-[#F3EED8] border border-[#D2CAA9] rounded-md flex items-center space-x-3 transition-colors group"
            >
              <div className="w-9 h-9 rounded bg-brand-clay text-white flex items-center justify-center shrink-0 shadow-subtle group-hover:scale-105 transition-transform">
                <BookmarkCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-forest-900 block leading-tight">
                  Ver Favoritos
                </span>
                <span className="text-[11px] text-olive-800/70 block">
                  Lista rápida de parceiros frequentes
                </span>
              </div>
            </Link>
          </div>
        </div>

        {/* Fornecedores Recentes & Distribuição por Categoria */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Seção: Fornecedores Recentes (2 colunas) */}
          <div className="lg:col-span-2 bg-white border border-[#D2CAA9] rounded-lg p-5 shadow-subtle space-y-4">
            <div className="flex items-center justify-between border-b border-[#F0EBD7] pb-3">
              <div>
                <h2 className="text-sm font-bold text-forest-900 tracking-tight">
                  Fornecedores Adicionados Recentemente
                </h2>
                <p className="text-[11px] text-olive-800/70">
                  Últimos parceiros catalogados no sistema
                </p>
              </div>
              <Link
                href="/fornecedores"
                className="text-xs font-semibold text-brand-copper hover:underline inline-flex items-center gap-1"
              >
                <span>Ver todos</span>
                <ArrowRight className="w-3.5 h-3.5" />
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
                    className="py-3 flex items-center justify-between hover:bg-[#FAF7EE]/60 px-2 rounded-md transition-colors gap-3"
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <div className="w-9 h-9 rounded-md bg-[#FAF7EE] border border-[#E5DFC5] flex items-center justify-center shrink-0 overflow-hidden text-forest-700/60 font-mono text-xs">
                        {supplier.logo_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={supplier.logo_url}
                            alt={supplier.name}
                            className="w-full h-full object-contain p-0.5"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = "none";
                            }}
                          />
                        ) : (
                          <Building className="w-4 h-4 text-forest-700/60" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <Link
                          href={`/fornecedores/${supplier.id}`}
                          className="text-xs font-bold text-forest-900 hover:text-brand-copper truncate block"
                        >
                          {supplier.name}
                        </Link>
                        <div className="flex items-center gap-2 mt-0.5">
                          <CategoryBadge category={supplier.category} />
                          {supplier.city && (
                            <span className="text-[11px] text-olive-800/70 truncate">
                              {supplier.city}/{supplier.state || supplier.country}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 shrink-0">
                      <StatusBadge status={supplier.status} size="sm" />
                      <Link
                        href={`/fornecedores/${supplier.id}`}
                        className="p-1 text-forest-700/60 hover:text-brand-copper"
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
          <div className="bg-white border border-[#D2CAA9] rounded-lg p-5 shadow-subtle space-y-4 flex flex-col justify-between">
            <div>
              <div className="border-b border-[#F0EBD7] pb-3">
                <h2 className="text-sm font-bold text-forest-900 tracking-tight">
                  Distribuição por Segmento
                </h2>
                <p className="text-[11px] text-olive-800/70">
                  Concentração técnica de fornecedores
                </p>
              </div>

              <div className="pt-3 space-y-2 max-h-72 overflow-y-auto pr-1">
                {Object.keys(categoryCounts).length === 0 ? (
                  <p className="text-xs text-forest-800/60 py-4 text-center italic">
                    Nenhuma categoria registrada.
                  </p>
                ) : (
                  Object.entries(categoryCounts)
                    .sort(([, a], [, b]) => b - a)
                    .map(([category, count]) => (
                      <div
                        key={category}
                        className="flex items-center justify-between text-xs py-1.5 px-2 bg-[#FAF7EE] rounded border border-[#E5DFC5]/60"
                      >
                        <span className="font-medium text-forest-900 truncate mr-2">
                          {category}
                        </span>
                        <span className="px-2 py-0.5 bg-white border border-[#D2CAA9] rounded-md font-mono text-[10px] font-bold text-forest-800">
                          {count}
                        </span>
                      </div>
                    ))
                )}
              </div>
            </div>

            {/* Seed Quick Trigger Card */}
            {stats && stats.total === 0 && (
              <div className="p-3.5 bg-brand-cornsilk/80 border border-brand-clay/40 rounded-md mt-4 space-y-2">
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
    </AppShell>
  );
}
