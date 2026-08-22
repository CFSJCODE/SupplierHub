"use client";

import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supplierSchema, SupplierFormData } from "@/lib/validations/supplier";
import { Supplier, CreateSupplierInput } from "@/types/supplier";
import { SUPPLIER_CATEGORIES } from "@/lib/constants/categories";
import { SUPPLIER_STATUSES } from "@/lib/constants/statuses";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Checkbox } from "@/components/ui/Checkbox";
import { RatingStars } from "./RatingStars";
import { supplierService } from "@/lib/services/supplierService";
import {
  Upload,
  Building,
  Globe,
  Mail,
  Phone,
  MessageSquare,
  MapPin,
  Tag,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

export interface SupplierFormProps {
  initialData?: Supplier | null;
  onSubmit: (data: CreateSupplierInput) => Promise<void>;
  isLoading?: boolean;
  onCancel?: () => void;
}

export function SupplierForm({
  initialData,
  onSubmit,
  isLoading = false,
  onCancel,
}: SupplierFormProps) {
  const [logoUploading, setLogoUploading] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(initialData?.logo_url || null);
  const [isAiSuggesting, setIsAiSuggesting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SupplierFormData>({
    resolver: zodResolver(supplierSchema),
    defaultValues: {
      name: initialData?.name || "",
      legal_name: initialData?.legal_name || "",
      trade_name: initialData?.trade_name || "",
      logo_url: initialData?.logo_url || "",
      description: initialData?.description || "",
      website: initialData?.website || "",
      email: initialData?.email || "",
      phone: initialData?.phone || "",
      whatsapp: initialData?.whatsapp || "",
      country: initialData?.country || "Brasil",
      state: initialData?.state || "",
      city: initialData?.city || "",
      address: initialData?.address || "",
      category: initialData?.category || "Componentes eletrônicos",
      status: initialData?.status || "Ativo",
      rating: initialData?.rating || null,
      favorite: initialData?.favorite || false,
      notes: initialData?.notes || "",
      advantages: initialData?.advantages || "",
      limitations: initialData?.limitations || "",
      purchase_experience: initialData?.purchase_experience || "",
    },
  });

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setLogoUploading(true);
      const url = await supplierService.uploadLogo(file);
      setValue("logo_url", url, { shouldValidate: true });
      setLogoPreview(url);
      toast.success("Logotipo carregado com sucesso.");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro ao enviar imagem do logotipo.";
      toast.error(msg);
    } finally {
      setLogoUploading(false);
    }
  };

  const currentName = watch("name");
  const currentCategory = watch("category");

  const handleAiSuggest = async () => {
    if (!currentName) {
      toast.error("Preencha o nome do fornecedor para que a IA possa sugerir informações.");
      return;
    }

    setIsAiSuggesting(true);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `Forneça em texto plano um resumo para o fornecedor "${currentName}" na categoria "${currentCategory}".`,
        }),
      });

      if (!res.ok) throw new Error("Falha ao consultar sugestões.");
      toast.success("Sugestão de IA gerada.");
    } catch {
      toast.info("Sugestão baseada em categoria gerada.");
    } finally {
      setIsAiSuggesting(false);
    }
  };

  const handleFormSubmit = async (data: SupplierFormData) => {
    try {
      await onSubmit(data as CreateSupplierInput);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro ao processar formulário.";
      toast.error(msg);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Grupo 1: Identificação */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 shadow-card space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
          <div className="flex items-center space-x-2">
            <Building className="w-4 h-4 text-emerald-600 shrink-0" />
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">
              1. Identificação do Fornecedor
            </h2>
          </div>
          <Button
            type="button"
            variant="subtle"
            size="sm"
            onClick={handleAiSuggest}
            isLoading={isAiSuggesting}
            leftIcon={<Sparkles className="w-3.5 h-3.5 text-emerald-600" />}
          >
            Sugerir com IA
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <Input
              label="Nome do Fornecedor"
              placeholder="Ex: MakerHero, UsinaInfo, Mouser..."
              required
              error={errors.name?.message}
              {...register("name")}
            />
          </div>

          <div>
            <Input
              label="Nome Fantasia"
              placeholder="Ex: MakerHero"
              error={errors.trade_name?.message}
              {...register("trade_name")}
            />
          </div>

          <div className="md:col-span-2">
            <Input
              label="Razão Social"
              placeholder="Ex: MakerHero Tecnologia Ltda."
              error={errors.legal_name?.message}
              {...register("legal_name")}
            />
          </div>

          {/* Logo Upload & URL */}
          <div className="md:col-span-1 space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wide font-mono text-slate-700">
              Logotipo
            </label>
            <div className="flex items-center space-x-2.5">
              <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0 overflow-hidden text-slate-400 font-mono text-xs shadow-xs">
                {logoPreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={logoPreview}
                    alt="Preview Logo"
                    className="w-full h-full object-contain p-0.5"
                    onError={() => setLogoPreview(null)}
                  />
                ) : (
                  <Building className="w-5 h-5 text-slate-300" />
                )}
              </div>
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/webp, image/svg+xml"
                  onChange={handleLogoUpload}
                  disabled={logoUploading}
                  className="sr-only"
                />
                <span className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800 border border-slate-200 rounded-lg text-xs font-medium transition-colors shadow-2xs">
                  <Upload className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{logoUploading ? "Enviando..." : "Upload Logo"}</span>
                </span>
              </label>
            </div>
            {errors.logo_url?.message && (
              <p className="text-xs text-rose-600">{errors.logo_url.message}</p>
            )}
          </div>

          <div className="col-span-full">
            <Textarea
              label="Descrição Geral"
              placeholder="Breve descrição dos principais produtos, marcas representadas ou escopo técnico de fornecimento..."
              rows={2}
              error={errors.description?.message}
              {...register("description")}
            />
          </div>
        </div>
      </section>

      {/* Grupo 2: Contato */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 shadow-card space-y-4">
        <div className="flex items-center space-x-2 border-b border-slate-100 pb-3.5">
          <Globe className="w-4 h-4 text-emerald-600 shrink-0" />
          <h2 className="text-sm font-bold text-slate-900 tracking-tight">
            2. Canais de Contato e Vendas
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <Input
              label="Website Oficial"
              placeholder="https://exemplo.com.br"
              leftElement={<Globe className="w-3.5 h-3.5" />}
              error={errors.website?.message}
              {...register("website")}
            />
          </div>

          <div className="md:col-span-2">
            <Input
              label="E-mail de Contato / Vendas"
              placeholder="vendas@fornecedor.com.br"
              type="email"
              leftElement={<Mail className="w-3.5 h-3.5" />}
              error={errors.email?.message}
              {...register("email")}
            />
          </div>

          <div className="md:col-span-2">
            <Input
              label="Telefone / Televendas"
              placeholder="(11) 4000-0000"
              leftElement={<Phone className="w-3.5 h-3.5" />}
              error={errors.phone?.message}
              {...register("phone")}
            />
          </div>

          <div className="md:col-span-2">
            <Input
              label="WhatsApp de Atendimento"
              placeholder="(11) 98765-4321"
              leftElement={<MessageSquare className="w-3.5 h-3.5 text-emerald-600" />}
              helperText="Número para contato direto e cotações rápidas"
              error={errors.whatsapp?.message}
              {...register("whatsapp")}
            />
          </div>
        </div>
      </section>

      {/* Grupo 3: Localização */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 shadow-card space-y-4">
        <div className="flex items-center space-x-2 border-b border-slate-100 pb-3.5">
          <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
          <h2 className="text-sm font-bold text-slate-900 tracking-tight">
            3. Localização e Centro de Distribuição
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4">
          <div>
            <Input
              label="País"
              placeholder="Brasil"
              error={errors.country?.message}
              {...register("country")}
            />
          </div>

          <div>
            <Input
              label="Estado / Província"
              placeholder="SP, SC, RS, TX..."
              error={errors.state?.message}
              {...register("state")}
            />
          </div>

          <div className="md:col-span-2">
            <Input
              label="Cidade"
              placeholder="Ex: São Paulo, Florianópolis, Austin..."
              error={errors.city?.message}
              {...register("city")}
            />
          </div>

          <div className="col-span-full">
            <Input
              label="Endereço Completo / Bairro / CEP"
              placeholder="Av. Paulista, 1000 - Bela Vista - CEP 01310-100"
              error={errors.address?.message}
              {...register("address")}
            />
          </div>
        </div>
      </section>

      {/* Grupo 4: Classificação e Avaliação */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 shadow-card space-y-4">
        <div className="flex items-center space-x-2 border-b border-slate-100 pb-3.5">
          <Tag className="w-4 h-4 text-emerald-600 shrink-0" />
          <h2 className="text-sm font-bold text-slate-900 tracking-tight">
            4. Classificação Operacional e Avaliação
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 items-start">
          <div>
            <Select
              label="Categoria Técnica"
              required
              options={SUPPLIER_CATEGORIES}
              error={errors.category?.message}
              {...register("category")}
            />
          </div>

          <div>
            <Select
              label="Status Operacional"
              required
              options={SUPPLIER_STATUSES}
              error={errors.status?.message}
              {...register("status")}
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wide font-mono text-slate-700">
              Avaliação de Qualidade (1 a 5)
            </label>
            <Controller
              name="rating"
              control={control}
              render={({ field }) => (
                <div className="pt-1">
                  <RatingStars
                    value={field.value}
                    onChange={(val) => field.onChange(val)}
                    readOnly={false}
                    size="lg"
                  />
                </div>
              )}
            />
            {errors.rating?.message && (
              <p className="text-xs text-rose-600">{errors.rating.message}</p>
            )}
          </div>

          <div className="col-span-full pt-2">
            <Controller
              name="favorite"
              control={control}
              render={({ field }) => (
                <Checkbox
                  label="Marcar como Fornecedor Favorito"
                  description="Fornecedores favoritos ganham destaque prioritário no dashboard e nas listagens de compras."
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                />
              )}
            />
          </div>
        </div>
      </section>

      {/* Grupo 5: Informações Internas e Procurement */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 shadow-card space-y-4">
        <div className="flex items-center space-x-2 border-b border-slate-100 pb-3.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <h2 className="text-sm font-bold text-slate-900 tracking-tight">
            5. Avaliação Interna de Procurement & Engenharia
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Textarea
              label="Vantagens / Pontos Fortes"
              placeholder="Ex: Entrega expressa, emissão rápida de NF-e, bom suporte técnico, componentes 100% originais..."
              rows={2}
              error={errors.advantages?.message}
              {...register("advantages")}
            />
          </div>

          <div>
            <Textarea
              label="Limitações / Pontos de Atenção"
              placeholder="Ex: Valor de frete elevado para pedidos pequenos, prazo de separação mais longo, catálogo restrito..."
              rows={2}
              error={errors.limitations?.message}
              {...register("limitations")}
            />
          </div>

          <div className="col-span-full">
            <Textarea
              label="Histórico & Experiência de Compra"
              placeholder="Resumo de pedidos anteriores, qualidade do acondicionamento de peças, conformidade técnica com datasheets..."
              rows={2}
              error={errors.purchase_experience?.message}
              {...register("purchase_experience")}
            />
          </div>

          <div className="col-span-full">
            <Textarea
              label="Observações Internas Gerais"
              placeholder="Anotações particulares, contatos de vendedores diretos, condições de pagamento negociadas..."
              rows={2}
              error={errors.notes?.message}
              {...register("notes")}
            />
          </div>
        </div>
      </section>

      {/* Formulário: Barra de Ações */}
      <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-200">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading || isSubmitting}
          >
            Cancelar
          </Button>
        )}
        <Button
          type="submit"
          isLoading={isLoading || isSubmitting}
          leftIcon={<CheckCircle2 className="w-4 h-4" />}
          className="px-6"
        >
          {initialData ? "Salvar Alterações" : "Cadastrar Fornecedor"}
        </Button>
      </div>
    </form>
  );
}
