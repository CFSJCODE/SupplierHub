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
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

export interface SupplierCardProps {
  supplier: Supplier;
  onToggleFavorite: (id: string, current: boolean) => void;
  onDelete: (supplier: Supplier) => void;
}

export function SupplierCard({
  supplier,
  onToggleFavorite,
  onDelete,
}: SupplierCardProps) {
  const hasLocation = supplier.city || supplier.state || supplier.country;
  const locationStr = [supplier.city, supplier.state, supplier.country !== "Brasil" ? supplier.country : null]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="bg-white border border-[#D2CAA9] rounded-lg p-4 shadow-subtle flex flex-col justify-between space-y-3 hover:border-brand-olive transition-colors">
      {/* Top Header: Logo + Name + Favorite */}
      <div className="flex items-start justify-between gap-2.5">
        <div className="flex items-start space-x-3 min-w-0">
          <div className="w-10 h-10 rounded-md bg-[#FAF7EE] border border-[#E5DFC5] flex items-center justify-center shrink-0 overflow-hidden">
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
              <Building className="w-5 h-5 text-forest-700/60" />
            )}
          </div>
          <div className="min-w-0">
            <Link
              href={`/fornecedores/${supplier.id}`}
              className="text-sm font-bold text-forest-900 hover:text-brand-copper leading-snug block truncate"
            >
              {supplier.name}
            </Link>
            {supplier.trade_name && (
              <p className="text-xs text-olive-800/70 truncate">
                {supplier.trade_name}
              </p>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={() => onToggleFavorite(supplier.id, supplier.favorite)}
          className="p-1.5 -mr-1 -mt-1 rounded hover:scale-110 transition-transform focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-copper"
          title={supplier.favorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
          aria-label="Alternar favorito"
        >
          <Star
            className={cn(
              "w-5 h-5",
              supplier.favorite
                ? "text-brand-copper fill-brand-copper"
                : "text-[#D2CAA9] fill-transparent"
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
        <p className="text-xs text-forest-800/80 line-clamp-2 leading-relaxed">
          {supplier.description}
        </p>
      )}

      {/* Location & Website meta */}
      <div className="pt-2 border-t border-[#F0EBD7] text-xs space-y-1.5 text-olive-800/90 font-medium">
        {hasLocation && (
          <div className="flex items-center gap-1.5 text-[11px] truncate">
            <MapPin className="w-3.5 h-3.5 text-clay-600 shrink-0" />
            <span className="truncate">{locationStr}</span>
          </div>
        )}
        {supplier.website && (
          <div className="flex items-center gap-1.5 text-[11px] truncate">
            <ExternalLink className="w-3.5 h-3.5 text-forest-700/60 shrink-0" />
            <a
              href={supplier.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-copper hover:underline truncate"
            >
              {cleanUrl(supplier.website)}
            </a>
          </div>
        )}
      </div>

      {/* Card Action Footer */}
      <div className="pt-2 border-t border-[#F0EBD7] flex items-center justify-between gap-2">
        <div className="flex items-center space-x-1">
          {supplier.phone && (
            <a
              href={`tel:${supplier.phone.replace(/\D/g, "")}`}
              className="p-1.5 bg-[#FAF7EE] text-forest-800 hover:text-brand-olive rounded border border-[#E5DFC5]"
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
              className="p-1.5 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 rounded border border-emerald-200"
              title="Abrir WhatsApp"
            >
              <MessageSquare className="w-3.5 h-3.5" />
            </a>
          )}
        </div>

        <div className="flex items-center space-x-1.5">
          <Link
            href={`/fornecedores/${supplier.id}`}
            className="px-2.5 py-1 text-xs font-semibold text-forest-800 bg-[#FAF7EE] hover:bg-[#F3EED8] border border-[#D2CAA9] rounded-md transition-colors"
          >
            Detalhes
          </Link>
          <Link
            href={`/fornecedores/${supplier.id}/editar`}
            className="p-1.5 text-forest-800 hover:text-brand-olive hover:bg-[#FAF7EE] rounded border border-transparent transition-colors"
            title="Editar"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </Link>
          <button
            type="button"
            onClick={() => onDelete(supplier)}
            className="p-1.5 text-forest-800 hover:text-rose-700 hover:bg-rose-50 rounded border border-transparent transition-colors"
            title="Excluir"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
