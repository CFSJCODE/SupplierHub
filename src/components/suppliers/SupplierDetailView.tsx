"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Supplier } from "@/types/supplier";
import { StatusBadge } from "./StatusBadge";
import { CategoryBadge } from "./CategoryBadge";
import { RatingStars } from "./RatingStars";
import { Button } from "@/components/ui/Button";
import { formatDate, formatDateTime, formatPhoneNumber, formatWhatsAppUrl, cleanUrl } from "@/lib/utils/formatters";
import { SupplierAIAnalysisModal } from "./SupplierAIAnalysisModal";
import {
  ExternalLink,
  Edit2,
  Trash2,
  Star,
  Building,
  Globe,
  Mail,
  Phone,
  MessageSquare,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Clock,
  ThumbsUp,
  AlertTriangle,
  History,
  ShieldCheck,
  Calendar,
  Key,
  FileText,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

export interface SupplierDetailViewProps {
  supplier: Supplier;
  onToggleFavorite: (id: string, current: boolean) => void;
  onDelete: (supplier: Supplier) => void;
}

export function SupplierDetailView({
  supplier,
  onToggleFavorite,
  onDelete,
}: SupplierDetailViewProps) {
  const [showAIModal, setShowAIModal] = useState(false);
  const hasLocation = supplier.city || supplier.state || supplier.country || supplier.address;
  const addressQuery = [supplier.address, supplier.city, supplier.state, supplier.country].filter(Boolean).join(", ");
  const mapsUrl = addressQuery ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addressQuery)}` : null;
  const waUrl = formatWhatsAppUrl(supplier.whatsapp);

  return (
    <div className="space-y-6">
      {/* Header Banner & Core Info */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-card space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          {/* Logo & Main Identifiers */}
          <div className="flex items-start space-x-4 min-w-0">
            <div className="w-16 h-16 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0 overflow-hidden shadow-xs">
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
                <Building className="w-8 h-8 text-slate-400" />
              )}
            </div>

            <div className="min-w-0 space-y-1.5">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight leading-tight">
                  {supplier.name}
                </h1>
                <button
                  type="button"
                  onClick={() => onToggleFavorite(supplier.id, supplier.favorite)}
                  className="p-1 rounded-md hover:scale-110 transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 cursor-pointer"
                  title={supplier.favorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                  aria-label="Alternar favorito"
                >
                  <Star
                    className={cn(
                      "w-5 h-5",
                      supplier.favorite
                        ? "text-amber-500 fill-amber-500"
                        : "text-slate-300 hover:text-amber-400 fill-transparent"
                    )}
                  />
                </button>
              </div>

              {(supplier.trade_name || supplier.legal_name) && (
                <p className="text-xs text-slate-500">
                  {supplier.trade_name && <span className="font-semibold text-slate-700">{supplier.trade_name}</span>}
                  {supplier.trade_name && supplier.legal_name && " • "}
                  {supplier.legal_name && <span>{supplier.legal_name}</span>}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-2 pt-0.5">
                <CategoryBadge category={supplier.category} />
                <StatusBadge status={supplier.status} size="md" />
                {supplier.rating && (
                  <div className="flex items-center ml-1">
                    <RatingStars value={supplier.rating} readOnly size="sm" showValue />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAIModal(true)}
              leftIcon={<Sparkles className="w-3.5 h-3.5 text-emerald-600" />}
            >
              Parecer IA
            </Button>
            {supplier.website && (
              <a
                href={supplier.website}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="outline"
                  size="sm"
                  rightIcon={<ExternalLink className="w-3.5 h-3.5" />}
                >
                  Acessar Website
                </Button>
              </a>
            )}
            <Link href={`/fornecedores/${supplier.id}/editar`}>
              <Button
                variant="secondary"
                size="sm"
                leftIcon={<Edit2 className="w-3.5 h-3.5" />}
              >
                Editar
              </Button>
            </Link>
            <Button
              variant="destructive"
              size="sm"
              leftIcon={<Trash2 className="w-3.5 h-3.5" />}
              onClick={() => onDelete(supplier)}
            >
              Excluir
            </Button>
          </div>
        </div>

        {/* General Description */}
        {supplier.description && (
          <div className="text-sm text-slate-700 leading-relaxed max-w-4xl pt-1">
            {supplier.description}
          </div>
        )}
      </div>

      {/* Grid: Contact & Location */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Contatos */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-card space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-3.5">
            <Globe className="w-4 h-4 text-emerald-600 shrink-0" />
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">
              Canais de Contato & Vendas
            </h2>
          </div>

          <div className="space-y-3 text-xs">
            {/* Website */}
            <div className="flex items-start justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500 font-medium flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-slate-400" /> Website
              </span>
              {supplier.website ? (
                <a
                  href={supplier.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-emerald-700 hover:text-emerald-800 hover:underline inline-flex items-center gap-1"
                >
                  <span>{cleanUrl(supplier.website)}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              ) : (
                <span className="text-slate-400 italic font-mono">-</span>
              )}
            </div>

            {/* Email */}
            <div className="flex items-start justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500 font-medium flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" /> E-mail
              </span>
              {supplier.email ? (
                <a
                  href={`mailto:${supplier.email}`}
                  className="font-medium text-slate-900 hover:text-emerald-700 underline"
                >
                  {supplier.email}
                </a>
              ) : (
                <span className="text-slate-400 italic font-mono">-</span>
              )}
            </div>

            {/* Phone */}
            <div className="flex items-start justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500 font-medium flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" /> Telefone
              </span>
              {supplier.phone ? (
                <a
                  href={`tel:${supplier.phone.replace(/\D/g, "")}`}
                  className="font-medium font-mono text-slate-900 hover:text-emerald-700"
                >
                  {formatPhoneNumber(supplier.phone)}
                </a>
              ) : (
                <span className="text-slate-400 italic font-mono">-</span>
              )}
            </div>

            {/* WhatsApp */}
            <div className="flex items-start justify-between py-2">
              <span className="text-slate-500 font-medium flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-emerald-600" /> WhatsApp
              </span>
              {waUrl && supplier.whatsapp ? (
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-emerald-800 hover:underline inline-flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200"
                >
                  <span>{formatPhoneNumber(supplier.whatsapp)}</span>
                  <ExternalLink className="w-3 h-3 text-emerald-600" />
                </a>
              ) : (
                <span className="text-slate-400 italic font-mono">-</span>
              )}
            </div>
          </div>
        </div>

        {/* Localização */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-card space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-3.5">
            <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">
              Localização & Despacho
            </h2>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-start justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500 font-medium">País de Origem</span>
              <span className="font-semibold text-slate-900">{supplier.country || "Brasil"}</span>
            </div>

            <div className="flex items-start justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Estado / Província</span>
              <span className="font-medium text-slate-900">{supplier.state || "-"}</span>
            </div>

            <div className="flex items-start justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Cidade</span>
              <span className="font-medium text-slate-900">{supplier.city || "-"}</span>
            </div>

            <div className="py-2">
              <span className="text-slate-500 font-medium block mb-1">Endereço Completo</span>
              <p className="text-slate-800 leading-relaxed font-mono text-[11px] bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                {supplier.address || "Endereço detalhado não informado."}
              </p>
              {mapsUrl && (
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2.5 inline-flex items-center gap-1.5 text-xs text-emerald-700 hover:underline font-semibold"
                >
                  <span>Ver localização no Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Procurement & Engineering Technical Evaluation Panel */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-card space-y-4">
        <div className="flex items-center space-x-2 border-b border-slate-100 pb-3.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <h2 className="text-sm font-bold text-slate-900 tracking-tight">
            Avaliação Técnica de Procurement & Engenharia
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Vantagens */}
          <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-4.5 space-y-2">
            <div className="flex items-center space-x-2 text-emerald-950 font-bold text-xs">
              <ThumbsUp className="w-4 h-4 text-emerald-700" />
              <span>Vantagens & Pontos Fortes</span>
            </div>
            <p className="text-xs text-slate-800 leading-relaxed">
              {supplier.advantages || "Nenhuma vantagem específica registrada."}
            </p>
          </div>

          {/* Limitações */}
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-4.5 space-y-2">
            <div className="flex items-center space-x-2 text-amber-950 font-bold text-xs">
              <AlertTriangle className="w-4 h-4 text-amber-700" />
              <span>Limitações & Pontos de Atenção</span>
            </div>
            <p className="text-xs text-slate-800 leading-relaxed">
              {supplier.limitations || "Nenhuma limitação específica registrada."}
            </p>
          </div>

          {/* Experiência de Compra */}
          <div className="col-span-full bg-slate-50 border border-slate-200 rounded-xl p-4.5 space-y-2">
            <div className="flex items-center space-x-2 text-slate-900 font-bold text-xs">
              <History className="w-4 h-4 text-slate-600" />
              <span>Histórico & Experiência de Compra</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              {supplier.purchase_experience || "Nenhum histórico detalhado de compras registrado até o momento."}
            </p>
          </div>

          {/* Observações Gerais */}
          {supplier.notes && (
            <div className="col-span-full bg-white border border-slate-200 rounded-xl p-4.5 space-y-2">
              <div className="flex items-center space-x-2 text-slate-900 font-bold text-xs">
                <FileText className="w-4 h-4 text-slate-600" />
                <span>Observações Internas</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">
                {supplier.notes}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Auditoria & Metadados do Registro */}
      <div className="bg-slate-100/70 border border-slate-200 rounded-xl p-4 text-[11px] font-mono text-slate-600 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <Key className="w-3.5 h-3.5 text-slate-400" />
          <span>UUID: <strong className="text-slate-800">{supplier.id}</strong></span>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            Cadastrado em: <strong className="text-slate-800">{formatDateTime(supplier.created_at)}</strong>
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            Última atualização: <strong className="text-slate-800">{formatDateTime(supplier.updated_at)}</strong>
          </span>
        </div>
      </div>

      {/* Modal de Análise de IA */}
      <SupplierAIAnalysisModal
        isOpen={showAIModal}
        onClose={() => setShowAIModal(false)}
        supplier={supplier}
      />
    </div>
  );
}
