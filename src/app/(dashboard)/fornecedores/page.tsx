"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { supplierService } from "@/lib/services/supplierService";
import { Supplier, SupplierFilters } from "@/types/supplier";
import { SupplierTable } from "@/components/suppliers/SupplierTable";
import { SupplierCard } from "@/components/suppliers/SupplierCard";
import { SupplierFiltersBar } from "@/components/suppliers/SupplierFilters";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { EmptyState } from "@/components/ui/EmptyState";
import { TableSkeleton } from "@/components/ui/Skeleton";
import { Button } from "@/components/ui/Button";
import { SupplierAIAnalysisModal } from "@/components/suppliers/SupplierAIAnalysisModal";
import {
  PlusCircle,
  Building2,
  ChevronLeft,
  ChevronRight,
  Download,
  LayoutGrid,
  List,
  FileSpreadsheet,
  FileCode,
} from "lucide-react";
import { exportSuppliersToCSV, exportSuppliersToJSON } from "@/lib/utils/export";
import { toast } from "sonner";

const DEFAULT_FILTERS: SupplierFilters = {
  search: "",
  category: "",
  status: "",
  state: "",
  country: "",
  favoriteOnly: false,
  sortBy: "created_desc",
};

const ITEMS_PER_PAGE = 12;

export default function FornecedoresPage() {
  const [loading, setLoading] = useState(true);
  const [allSuppliers, setAllSuppliers] = useState<Supplier[]>([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState<Supplier[]>([]);
  const [filters, setFilters] = useState<SupplierFilters>(DEFAULT_FILTERS);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  // Modal states
  const [supplierToDelete, setSupplierToDelete] = useState<Supplier | null>(null);
  const [supplierForAI, setSupplierForAI] = useState<Supplier | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchSuppliers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await supplierService.getSuppliers(filters);
      setFilteredSuppliers(data);

      if (!filters.search && !filters.category && !filters.status && !filters.favoriteOnly) {
        setAllSuppliers(data);
      }
    } catch (err: unknown) {
      console.error("Erro ao buscar fornecedores:", err);
      toast.error("Erro ao carregar lista de fornecedores.");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchSuppliers();
  }, [fetchSuppliers]);

  const handleFilterChange = (newFilters: SupplierFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setCurrentPage(1);
  };

  const handleToggleFavorite = async (id: string, currentStatus: boolean) => {
    setFilteredSuppliers((prev) =>
      prev.map((s) => (s.id === id ? { ...s, favorite: !currentStatus } : s))
    );

    try {
      const nextStatus = await supplierService.toggleFavorite(id, currentStatus);
      toast.success(
        nextStatus ? "Fornecedor marcado como favorito." : "Removido dos favoritos."
      );
    } catch (err: unknown) {
      setFilteredSuppliers((prev) =>
        prev.map((s) => (s.id === id ? { ...s, favorite: currentStatus } : s))
      );
      const msg = err instanceof Error ? err.message : "Erro ao alterar favorito.";
      toast.error(msg);
    }
  };

  const handleConfirmDelete = async () => {
    if (!supplierToDelete) return;

    try {
      setIsDeleting(true);
      await supplierService.deleteSupplier(supplierToDelete.id);
      toast.success(`Fornecedor "${supplierToDelete.name}" excluído com sucesso.`);
      setSupplierToDelete(null);
      await fetchSuppliers();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro ao excluir fornecedor.";
      toast.error(msg);
    } finally {
      setIsDeleting(false);
    }
  };

  const totalPages = Math.ceil(filteredSuppliers.length / ITEMS_PER_PAGE) || 1;
  const paginatedSuppliers = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredSuppliers.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredSuppliers, currentPage]);

  return (
    <AppShell
      title="Catálogo de Fornecedores"
      subtitle="Gerenciamento de contatos, categorias técnicas e parâmetros de compras"
      headerAction={
        <div className="flex items-center space-x-2">
          {filteredSuppliers.length > 0 && (
            <div className="hidden sm:flex items-center space-x-1.5">
              <Button
                variant="outline"
                size="sm"
                onClick={() => exportSuppliersToCSV(filteredSuppliers)}
                leftIcon={<FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />}
              >
                CSV
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => exportSuppliersToJSON(filteredSuppliers)}
                leftIcon={<FileCode className="w-3.5 h-3.5 text-slate-600" />}
              >
                JSON
              </Button>
            </div>
          )}
          <Link href="/fornecedores/novo">
            <Button size="sm" leftIcon={<PlusCircle className="w-3.5 h-3.5" />}>
              Novo Fornecedor
            </Button>
          </Link>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Filtros e Busca com Debounce */}
        <SupplierFiltersBar
          filters={filters}
          onChange={handleFilterChange}
          onReset={handleResetFilters}
          totalCount={allSuppliers.length || filteredSuppliers.length}
          filteredCount={filteredSuppliers.length}
        />

        {/* View Mode Switcher Header Bar */}
        {!loading && filteredSuppliers.length > 0 && (
          <div className="flex items-center justify-between px-1">
            <div className="text-xs text-slate-500 font-mono">
              Mostrando <strong className="text-slate-900">{paginatedSuppliers.length}</strong> de{" "}
              <strong className="text-slate-900">{filteredSuppliers.length}</strong> fornecedores encontrados
            </div>

            <div className="flex items-center space-x-1 bg-white border border-slate-200 rounded-lg p-0.5 shadow-2xs">
              <button
                type="button"
                onClick={() => setViewMode("table")}
                className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                  viewMode === "table"
                    ? "bg-slate-100 text-slate-900 font-bold"
                    : "text-slate-400 hover:text-slate-700"
                }`}
                title="Visualização em tabela"
                aria-label="Tabela"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                  viewMode === "grid"
                    ? "bg-slate-100 text-slate-900 font-bold"
                    : "text-slate-400 hover:text-slate-700"
                }`}
                title="Visualização em cards"
                aria-label="Cards"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Content: Loading Skeleton, Empty State, or Results */}
        {loading ? (
          <div className="bg-white border border-slate-200 rounded-xl shadow-card">
            <TableSkeleton rows={6} />
          </div>
        ) : filteredSuppliers.length === 0 ? (
          <EmptyState
            icon={Building2}
            title={
              filters.search || filters.category || filters.status || filters.favoriteOnly
                ? "Nenhum fornecedor encontrado para estes filtros"
                : "Nenhum fornecedor cadastrado"
            }
            description={
              filters.search || filters.category || filters.status || filters.favoriteOnly
                ? "Tente ajustar os termos de pesquisa ou limpe os filtros para visualizar os outros registros."
                : "Cadastre seu primeiro fornecedor para iniciar a organização de sua rede de compras."
            }
            actionLabel={
              filters.search || filters.category || filters.status || filters.favoriteOnly
                ? "Limpar Filtros"
                : "Cadastrar Fornecedor"
            }
            actionHref={
              filters.search || filters.category || filters.status || filters.favoriteOnly
                ? undefined
                : "/fornecedores/novo"
            }
            onAction={
              filters.search || filters.category || filters.status || filters.favoriteOnly
                ? handleResetFilters
                : undefined
            }
          />
        ) : (
          <div className="space-y-4">
            {/* View Mode: Table */}
            {viewMode === "table" ? (
              <>
                <div className="hidden lg:block">
                  <SupplierTable
                    suppliers={paginatedSuppliers}
                    onToggleFavorite={handleToggleFavorite}
                    onDelete={(s) => setSupplierToDelete(s)}
                    onOpenAIModal={(s) => setSupplierForAI(s)}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:hidden">
                  {paginatedSuppliers.map((supplier) => (
                    <SupplierCard
                      key={supplier.id}
                      supplier={supplier}
                      onToggleFavorite={handleToggleFavorite}
                      onDelete={(s) => setSupplierToDelete(s)}
                      onOpenAIModal={(s) => setSupplierForAI(s)}
                    />
                  ))}
                </div>
              </>
            ) : (
              /* View Mode: Grid */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {paginatedSuppliers.map((supplier) => (
                  <SupplierCard
                    key={supplier.id}
                    supplier={supplier}
                    onToggleFavorite={handleToggleFavorite}
                    onDelete={(s) => setSupplierToDelete(s)}
                    onOpenAIModal={(s) => setSupplierForAI(s)}
                  />
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between bg-white border border-slate-200 rounded-xl p-3.5 px-4 shadow-card text-xs font-mono select-none">
                <span className="text-slate-500">
                  Página <strong className="text-slate-900">{currentPage}</strong> de{" "}
                  <strong className="text-slate-900">{totalPages}</strong> ({filteredSuppliers.length} itens)
                </span>

                <div className="flex items-center space-x-1.5">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    className="h-8 px-2.5"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">Anterior</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="h-8 px-2.5"
                  >
                    <span className="hidden sm:inline">Próxima</span>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal de Confirmação de Exclusão */}
      <ConfirmModal
        isOpen={Boolean(supplierToDelete)}
        onClose={() => setSupplierToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Excluir fornecedor?"
        message="Esta ação removerá permanentemente o fornecedor da sua base de dados."
        supplierName={supplierToDelete?.name}
        confirmLabel="Excluir fornecedor"
        cancelLabel="Cancelar"
        isLoading={isDeleting}
      />

      {/* Modal de Parecer de IA */}
      {supplierForAI && (
        <SupplierAIAnalysisModal
          isOpen={Boolean(supplierForAI)}
          onClose={() => setSupplierForAI(null)}
          supplier={supplierForAI}
        />
      )}
    </AppShell>
  );
}
