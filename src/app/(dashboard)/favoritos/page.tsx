"use client";

import React, { useEffect, useState, useCallback } from "react";
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
import { BookmarkCheck, PlusCircle, FileSpreadsheet, List, LayoutGrid } from "lucide-react";
import { exportSuppliersToCSV } from "@/lib/utils/export";
import { toast } from "sonner";

const FAVORITE_FILTERS: SupplierFilters = {
  search: "",
  category: "",
  status: "",
  state: "",
  country: "",
  favoriteOnly: true,
  sortBy: "name_asc",
};

export default function FavoritosPage() {
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<Supplier[]>([]);
  const [filters, setFilters] = useState<SupplierFilters>(FAVORITE_FILTERS);
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  const [supplierToDelete, setSupplierToDelete] = useState<Supplier | null>(null);
  const [supplierForAI, setSupplierForAI] = useState<Supplier | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchFavorites = useCallback(async () => {
    try {
      setLoading(true);
      const data = await supplierService.getSuppliers({ ...filters, favoriteOnly: true });
      setFavorites(data);
    } catch (err: unknown) {
      console.error("Erro ao buscar favoritos:", err);
      toast.error("Erro ao carregar lista de favoritos.");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const handleToggleFavorite = async (id: string, currentStatus: boolean) => {
    setFavorites((prev) => prev.filter((s) => s.id !== id));

    try {
      await supplierService.toggleFavorite(id, currentStatus);
      toast.success("Fornecedor removido dos favoritos.");
    } catch (err: unknown) {
      await fetchFavorites();
      const msg = err instanceof Error ? err.message : "Erro ao alterar favorito.";
      toast.error(msg);
    }
  };

  const handleConfirmDelete = async () => {
    if (!supplierToDelete) return;
    try {
      setIsDeleting(true);
      await supplierService.deleteSupplier(supplierToDelete.id);
      toast.success(`Fornecedor "${supplierToDelete.name}" excluído.`);
      setSupplierToDelete(null);
      await fetchFavorites();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro ao excluir fornecedor.";
      toast.error(msg);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AppShell
      title="Fornecedores Favoritos"
      subtitle="Parceiros prioritários para cotações e compras rápidas"
      headerAction={
        <div className="flex items-center space-x-2">
          {favorites.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => exportSuppliersToCSV(favorites)}
              leftIcon={<FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />}
              className="hidden sm:inline-flex"
            >
              Exportar CSV
            </Button>
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
        {/* Filters */}
        <SupplierFiltersBar
          filters={filters}
          onChange={(newFilters) => setFilters({ ...newFilters, favoriteOnly: true })}
          onReset={() => setFilters(FAVORITE_FILTERS)}
          totalCount={favorites.length}
          filteredCount={favorites.length}
        />

        {/* View Mode Header */}
        {!loading && favorites.length > 0 && (
          <div className="flex items-center justify-between px-1">
            <div className="text-xs text-slate-500 font-mono">
              <strong className="text-slate-900">{favorites.length}</strong> fornecedor{favorites.length !== 1 ? "es" : ""} favorito{favorites.length !== 1 ? "s" : ""}
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
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="bg-white border border-slate-200 rounded-xl shadow-card">
            <TableSkeleton rows={4} />
          </div>
        ) : favorites.length === 0 ? (
          <EmptyState
            icon={BookmarkCheck}
            title="Nenhum fornecedor favorito"
            description="Você ainda não marcou nenhum fornecedor como favorito. Acesse a listagem geral e clique na estrela para adicionar seus parceiros preferenciais."
            actionLabel="Ver todos os fornecedores"
            actionHref="/fornecedores"
          />
        ) : (
          <div className="space-y-4">
            {viewMode === "table" ? (
              <>
                <div className="hidden lg:block">
                  <SupplierTable
                    suppliers={favorites}
                    onToggleFavorite={handleToggleFavorite}
                    onDelete={(s) => setSupplierToDelete(s)}
                    onOpenAIModal={(s) => setSupplierForAI(s)}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:hidden">
                  {favorites.map((supplier) => (
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {favorites.map((supplier) => (
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
          </div>
        )}
      </div>

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
