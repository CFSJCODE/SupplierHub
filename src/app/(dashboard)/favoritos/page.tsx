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
import { BookmarkCheck, PlusCircle, Download } from "lucide-react";
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
  const [supplierToDelete, setSupplierToDelete] = useState<Supplier | null>(null);
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
              leftIcon={<Download className="w-3.5 h-3.5" />}
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

        {loading ? (
          <div className="bg-white border border-[#D2CAA9] rounded-lg shadow-subtle">
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
            {/* Desktop Table View */}
            <div className="hidden lg:block">
              <SupplierTable
                suppliers={favorites}
                onToggleFavorite={handleToggleFavorite}
                onDelete={(s) => setSupplierToDelete(s)}
              />
            </div>

            {/* Mobile & Tablet Card View */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 lg:hidden">
              {favorites.map((supplier) => (
                <SupplierCard
                  key={supplier.id}
                  supplier={supplier}
                  onToggleFavorite={handleToggleFavorite}
                  onDelete={(s) => setSupplierToDelete(s)}
                />
              ))}
            </div>
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
    </AppShell>
  );
}
