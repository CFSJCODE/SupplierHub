"use client";

import React, { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { SupplierForm } from "@/components/suppliers/SupplierForm";
import { TableSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { supplierService } from "@/lib/services/supplierService";
import { Supplier, CreateSupplierInput } from "@/types/supplier";
import { Building2 } from "lucide-react";
import { toast } from "sonner";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EditarFornecedorPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchSupplier = async () => {
      try {
        setLoading(true);
        const data = await supplierService.getSupplierById(resolvedParams.id);
        setSupplier(data);
      } catch (err: unknown) {
        console.error("Erro ao carregar fornecedor para edição:", err);
        toast.error("Erro ao carregar dados do fornecedor.");
      } finally {
        setLoading(false);
      }
    };

    fetchSupplier();
  }, [resolvedParams.id]);

  const handleUpdateSupplier = async (data: CreateSupplierInput) => {
    if (!supplier) return;
    try {
      setIsSaving(true);
      await supplierService.updateSupplier(supplier.id, data);
      toast.success(`Fornecedor "${data.name}" atualizado com sucesso!`);
      router.push(`/fornecedores/${supplier.id}`);
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro ao atualizar fornecedor.";
      toast.error(msg);
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AppShell
      title={supplier ? `Editar: ${supplier.name}` : "Editar Fornecedor"}
      subtitle="Atualize os dados de cadastro e observações de compras"
      showBack
      backHref={supplier ? `/fornecedores/${supplier.id}` : "/fornecedores"}
    >
      {loading ? (
        <div className="bg-white border border-[#D2CAA9] rounded-lg p-6 shadow-subtle max-w-4xl mx-auto">
          <TableSkeleton rows={4} />
        </div>
      ) : !supplier ? (
        <EmptyState
          icon={Building2}
          title="Fornecedor não encontrado"
          description="O fornecedor selecionado para edição não existe ou foi removido."
          actionLabel="Voltar para a lista"
          actionHref="/fornecedores"
        />
      ) : (
        <div className="max-w-4xl mx-auto">
          <SupplierForm
            initialData={supplier}
            onSubmit={handleUpdateSupplier}
            isLoading={isSaving}
            onCancel={() => router.push(`/fornecedores/${supplier.id}`)}
          />
        </div>
      )}
    </AppShell>
  );
}
