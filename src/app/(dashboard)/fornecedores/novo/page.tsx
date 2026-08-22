"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { SupplierForm } from "@/components/suppliers/SupplierForm";
import { supplierService } from "@/lib/services/supplierService";
import { CreateSupplierInput } from "@/types/supplier";
import { toast } from "sonner";

export default function NovoFornecedorPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleCreateSupplier = async (data: CreateSupplierInput) => {
    try {
      setLoading(true);
      const created = await supplierService.createSupplier(data);
      toast.success(`Fornecedor "${created.name}" cadastrado com sucesso!`);
      router.push(`/fornecedores/${created.id}`);
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro ao cadastrar fornecedor.";
      toast.error(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell
      title="Novo Fornecedor"
      subtitle="Preencha os dados de identificação, canais de contato e parâmetros de compra"
      showBack
      backHref="/fornecedores"
    >
      <div className="max-w-4xl mx-auto">
        <SupplierForm
          onSubmit={handleCreateSupplier}
          isLoading={loading}
          onCancel={() => router.push("/fornecedores")}
        />
      </div>
    </AppShell>
  );
}
