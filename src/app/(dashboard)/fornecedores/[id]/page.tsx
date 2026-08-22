"use client";

import React, { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { SupplierDetailView } from "@/components/suppliers/SupplierDetailView";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { TableSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { supplierService } from "@/lib/services/supplierService";
import { Supplier } from "@/types/supplier";
import { Building2 } from "lucide-react";
import { toast } from "sonner";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function FornecedorDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchSupplier = async () => {
    try {
      setLoading(true);
      const data = await supplierService.getSupplierById(resolvedParams.id);
      setSupplier(data);
    } catch (err: unknown) {
      console.error("Erro ao buscar detalhes:", err);
      toast.error("Erro ao carregar dados do fornecedor.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSupplier();
  }, [resolvedParams.id]);

  const handleToggleFavorite = async (id: string, current: boolean) => {
    if (!supplier) return;
    setSupplier({ ...supplier, favorite: !current });
    try {
      const nextStatus = await supplierService.toggleFavorite(id, current);
      toast.success(
        nextStatus ? "Fornecedor marcado como favorito." : "Removido dos favoritos."
      );
    } catch (err: unknown) {
      setSupplier({ ...supplier, favorite: current });
      const msg = err instanceof Error ? err.message : "Erro ao alterar favorito.";
      toast.error(msg);
    }
  };

  const handleConfirmDelete = async () => {
    if (!supplier) return;
    try {
      setIsDeleting(true);
      await supplierService.deleteSupplier(supplier.id);
      toast.success(`Fornecedor "${supplier.name}" excluído com sucesso.`);
      setShowDeleteModal(false);
      router.push("/fornecedores");
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro ao excluir fornecedor.";
      toast.error(msg);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AppShell
      title={supplier ? supplier.name : "Detalhes do Fornecedor"}
      subtitle={supplier ? `Categoria: ${supplier.category} • Status: ${supplier.status}` : "Dossiê técnico"}
      showBack
      backHref="/fornecedores"
    >
      {loading ? (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-card">
          <TableSkeleton rows={4} />
        </div>
      ) : !supplier ? (
        <EmptyState
          icon={Building2}
          title="Fornecedor não encontrado"
          description="O fornecedor solicitado não existe ou foi removido do catálogo."
          actionLabel="Voltar para a lista"
          actionHref="/fornecedores"
        />
      ) : (
        <div className="max-w-5xl mx-auto">
          <SupplierDetailView
            supplier={supplier}
            onToggleFavorite={handleToggleFavorite}
            onDelete={() => setShowDeleteModal(true)}
          />
        </div>
      )}

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        title="Excluir fornecedor?"
        message="Esta ação removerá permanentemente o fornecedor da sua base de dados."
        supplierName={supplier?.name}
        confirmLabel="Excluir fornecedor"
        cancelLabel="Cancelar"
        isLoading={isDeleting}
      />
    </AppShell>
  );
}
