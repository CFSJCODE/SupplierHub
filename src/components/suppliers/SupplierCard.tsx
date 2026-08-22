"use client";

import React from "react";
import Link from "next/link";
import { Supplier } from "@/types/supplier";
import { StatusBadge } from "./StatusBadge";
import { CategoryBadge } from "./CategoryBadge";
import { RatingStars } from "./RatingStars";
import { cleanUrl } from "@/lib/utils/formatters";
import {
  ExternalLink,
  Edit2,
  Trash2,
  Star,
  MapPin,
  Building,
  Phone,
  MessageSquare,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

export interface SupplierCardProps {
  supplier: Supplier;
  onToggleFavorite: (id: string, current: boolean) => void;
  onDelete: (supplier: Supplier) => void;
  onOpenAIModal?: (supplier: Supplier) => void;
}

export function SupplierCard({
  supplier,
  onToggleFavorite,
  onDelete,
  onOpenAIModal,
}: SupplierCardProps) {
  const hasLocation = supplier.city || supplier.state || supplier.country;
  const locationStr = [supplier.city, supplier.state, supplier.country !== "Brasil" ? supplier.country : null]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="interactive-card bg-white border border-slate-200 rounded-xl p-5 shadow-card flex flex-col justify-between space-y-4 group">
      {/* Top Header: Logo + Name + Favorite */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start space-x-3.5 min-w-0">
          <div className="w-11 h-11 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0 overflow-hidden shadow-xs">
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
              <Building className="w-5 h-5 text-slate-400" />
            )}
          </div>
          <div className="min-w-0">
            <Link
              href={`/fornecedores/${supplier.id}`}
              className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 leading-snug block truncate transition-colors"
            >
              {supplier.name}
            </Link>
            {supplier.trade_name && (
              <p className="text-xs text-slate-500 truncate mt-0.5">
                {supplier.trade_name}
              </p>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={() => onToggleFavorite(supplier.id, supplier.favorite)}
          className="p-1.5 -mr-1 -mt-1 rounded-lg hover:scale-110 transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 cursor-pointer"
          title={supplier.favorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
          aria-label="Alternar favorito"
        >
          <Star
            className={cn(
              "w-5 h-5",
              supplier.favorite
                ? "text-amber-500 fill-amber-500"
                : "text-slate-200 hover:text-amber-400 fill-transparent"
            )}
          />
        </button>
      </div>

      {/* Badges & Rating */}
      <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
        <CategoryBadge category={supplier.category} />
        <StatusBadge status={supplier.status} size="sm" />
        {supplier.rating && (
          <div className="ml-auto">
            <RatingStars value={supplier.rating} readOnly size="sm" />
          </div>
        )}
      </div>

      {/* Description Snippet if available */}
      {supplier.description && (
        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
          {supplier.description}
        </p>
      )}

      {/* Location & Website meta */}
      <div className="pt-3 border-t border-slate-100 text-xs space-y-1.5 text-slate-600 font-medium">
        {hasLocation && (
          <div className="flex items-center gap-1.5 text-[11px] truncate">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{locationStr}</span>
          </div>
        )}
        {supplier.website && (
          <div className="flex items-center gap-1.5 text-[11px] truncate">
            <ExternalLink className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <a
              href={supplier.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-700 hover:text-emerald-800 hover:underline truncate"
            >
              {cleanUrl(supplier.website)}
            </a>
          </div>
        )}
      </div>

      {/* Card Action Footer */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        <div className="flex items-center space-x-1">
          {supplier.phone && (
            <a
              href={`tel:${supplier.phone.replace(/\D/g, "")}`}
              className="p-1.5 bg-slate-50 text-slate-600 hover:text-emerald-700 rounded-lg border border-slate-200 shadow-2xs transition-colors"
              title="Ligar"
            >
              <Phone className="w-3.5 h-3.5" />
            </a>
          )}
          {supplier.whatsapp && (
            <a
              href={`https://wa.me/${supplier.whatsapp.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg border border-emerald-200 shadow-2xs transition-colors"
              title="Abrir WhatsApp"
            >
              <MessageSquare className="w-3.5 h-3.5" />
            </a>
          )}
          {onOpenAIModal && (
            <button
              type="button"
              onClick={() => onOpenAIModal(supplier)}
              className="p-1.5 bg-slate-50 text-slate-600 hover:text-emerald-700 rounded-lg border border-slate-200 shadow-2xs transition-colors cursor-pointer"
              title="Parecer de IA"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            </button>
          )}
        </div>

        <div className="flex items-center space-x-1.5">
          <Link
            href={`/fornecedores/${supplier.id}`}
            className="px-3 py-1.5 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors shadow-2xs flex items-center gap-1"
          >
            <span>Ver</span>
            <ArrowRight className="w-3 h-3 text-slate-400" />
          </Link>
          <Link
            href={`/fornecedores/${supplier.id}/editar`}
            className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-slate-100 rounded-lg border border-transparent transition-colors"
            title="Editar"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </Link>
          <button
            type="button"
            onClick={() => onDelete(supplier)}
            className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg border border-transparent transition-colors cursor-pointer"
            title="Excluir"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
