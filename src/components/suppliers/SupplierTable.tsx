"use client";

import React from "react";
import Link from "next/link";
import { Supplier } from "@/types/supplier";
import { StatusBadge } from "./StatusBadge";
import { CategoryBadge } from "./CategoryBadge";
import { RatingStars } from "./RatingStars";
import { formatDate, cleanUrl } from "@/lib/utils/formatters";
import {
  ExternalLink,
  Edit2,
  Trash2,
  Eye,
  Star,
  Building,
  MapPin,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

export interface SupplierTableProps {
  suppliers: Supplier[];
  onToggleFavorite: (id: string, current: boolean) => void;
  onDelete: (supplier: Supplier) => void;
  onOpenAIModal?: (supplier: Supplier) => void;
}

export function SupplierTable({
  suppliers,
  onToggleFavorite,
  onDelete,
  onOpenAIModal,
}: SupplierTableProps) {
  return (
    <div className="w-full overflow-x-auto bg-white border border-slate-200 rounded-xl shadow-card">
      <table className="w-full text-left text-xs border-collapse">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-mono text-[11px] tracking-wider select-none">
            <th className="py-3 px-3.5 w-10 text-center font-bold">Fav</th>
            <th className="py-3 px-4 font-bold">Fornecedor</th>
            <th className="py-3 px-3.5 font-bold">Categoria</th>
            <th className="py-3 px-3.5 font-bold">Localização</th>
            <th className="py-3 px-3.5 font-bold">Website</th>
            <th className="py-3 px-3 font-bold">Status</th>
            <th className="py-3 px-3.5 font-bold">Avaliação</th>
            <th className="py-3 px-3.5 font-bold">Atualização</th>
            <th className="py-3 px-4 text-right font-bold w-32">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {suppliers.map((supplier) => {
            const hasLocation = supplier.city || supplier.state || supplier.country;
            const locationStr = [supplier.city, supplier.state, supplier.country !== "Brasil" ? supplier.country : null]
              .filter(Boolean)
              .join(", ");

            return (
              <tr
                key={supplier.id}
                className="hover:bg-slate-50/80 transition-colors group"
              >
                {/* Favorite Toggle */}
                <td className="py-3 px-3 text-center">
                  <button
                    type="button"
                    onClick={() => onToggleFavorite(supplier.id, supplier.favorite)}
                    className="p-1 rounded-md hover:scale-110 transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 cursor-pointer"
                    title={supplier.favorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                    aria-label="Alternar favorito"
                  >
                    <Star
                      className={cn(
                        "w-4 h-4",
                        supplier.favorite
                          ? "text-amber-500 fill-amber-500"
                          : "text-slate-300 group-hover:text-slate-400 fill-transparent"
                      )}
                    />
                  </button>
                </td>

                {/* Name & Identifier */}
                <td className="py-3 px-4 font-medium text-slate-900">
                  <Link
                    href={`/fornecedores/${supplier.id}`}
                    className="flex items-center space-x-3 group/link"
                  >
                    {/* Logo thumbnail */}
                    <div className="w-9 h-9 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0 overflow-hidden text-slate-400 font-mono text-[10px] font-bold shadow-xs">
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
                        <Building className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <span className="font-bold text-xs text-slate-900 group-hover/link:text-emerald-700 block truncate transition-colors">
                        {supplier.name}
                      </span>
                      {supplier.trade_name && supplier.trade_name !== supplier.name && (
                        <span className="text-[11px] text-slate-500 block truncate">
                          {supplier.trade_name}
                        </span>
                      )}
                    </div>
                  </Link>
                </td>

                {/* Category */}
                <td className="py-3 px-3.5">
                  <CategoryBadge category={supplier.category} />
                </td>

                {/* Location */}
                <td className="py-3 px-3.5 text-slate-600 text-[11px]">
                  {hasLocation ? (
                    <span className="inline-flex items-center gap-1 text-slate-600 truncate max-w-[160px]" title={locationStr}>
                      <MapPin className="w-3 h-3 shrink-0 text-slate-400" />
                      <span className="truncate">{locationStr}</span>
                    </span>
                  ) : (
                    <span className="text-slate-300 italic font-mono">-</span>
                  )}
                </td>

                {/* Website */}
                <td className="py-3 px-3.5 text-[11px]">
                  {supplier.website ? (
                    <a
                      href={supplier.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1 text-slate-700 hover:text-emerald-700 underline decoration-slate-300 hover:decoration-emerald-600 transition-colors truncate max-w-[140px]"
                      title={supplier.website}
                    >
                      <span className="truncate">{cleanUrl(supplier.website)}</span>
                      <ExternalLink className="w-3 h-3 shrink-0 text-slate-400" />
                    </a>
                  ) : (
                    <span className="text-slate-300 italic font-mono">-</span>
                  )}
                </td>

                {/* Status */}
                <td className="py-3 px-3">
                  <StatusBadge status={supplier.status} size="sm" />
                </td>

                {/* Rating */}
                <td className="py-3 px-3.5">
                  <RatingStars value={supplier.rating} readOnly size="sm" />
                </td>

                {/* Updated At */}
                <td className="py-3 px-3.5 text-slate-500 text-[11px] font-mono whitespace-nowrap">
                  {formatDate(supplier.updated_at || supplier.created_at)}
                </td>

                {/* Action Buttons */}
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end space-x-1">
                    {onOpenAIModal && (
                      <button
                        type="button"
                        onClick={() => onOpenAIModal(supplier)}
                        className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                        title="Parecer de IA"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      </button>
                    )}
                    <Link
                      href={`/fornecedores/${supplier.id}`}
                      className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                      title="Ver detalhes"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </Link>
                    <Link
                      href={`/fornecedores/${supplier.id}/editar`}
                      className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                      title="Editar fornecedor"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => onDelete(supplier)}
                      className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="Excluir fornecedor"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
