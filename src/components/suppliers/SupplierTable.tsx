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
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

export interface SupplierTableProps {
  suppliers: Supplier[];
  onToggleFavorite: (id: string, current: boolean) => void;
  onDelete: (supplier: Supplier) => void;
}

export function SupplierTable({
  suppliers,
  onToggleFavorite,
  onDelete,
}: SupplierTableProps) {
  return (
    <div className="w-full overflow-x-auto bg-white border border-[#D2CAA9] rounded-lg shadow-subtle">
      <table className="w-full text-left text-xs border-collapse">
        <thead>
          <tr className="bg-[#FAF7EE] border-b border-[#D2CAA9] text-forest-800 uppercase font-mono text-[10px] tracking-wider select-none">
            <th className="py-3 px-3.5 w-10 text-center font-bold">Fav</th>
            <th className="py-3 px-4 font-bold">Fornecedor</th>
            <th className="py-3 px-3.5 font-bold">Categoria</th>
            <th className="py-3 px-3.5 font-bold">Localização</th>
            <th className="py-3 px-3.5 font-bold">Website</th>
            <th className="py-3 px-3 font-bold">Status</th>
            <th className="py-3 px-3.5 font-bold">Avaliação</th>
            <th className="py-3 px-3.5 font-bold">Atualização</th>
            <th className="py-3 px-4 text-right font-bold w-28">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#F0EBD7]">
          {suppliers.map((supplier) => {
            const hasLocation = supplier.city || supplier.state || supplier.country;
            const locationStr = [supplier.city, supplier.state, supplier.country !== "Brasil" ? supplier.country : null]
              .filter(Boolean)
              .join(", ");

            return (
              <tr
                key={supplier.id}
                className="hover:bg-[#FAF7EE]/70 transition-colors group"
              >
                {/* Favorite Toggle */}
                <td className="py-2.5 px-3 text-center">
                  <button
                    type="button"
                    onClick={() => onToggleFavorite(supplier.id, supplier.favorite)}
                    className="p-1 rounded hover:scale-110 transition-transform focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-copper"
                    title={supplier.favorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                    aria-label="Alternar favorito"
                  >
                    <Star
                      className={cn(
                        "w-4 h-4",
                        supplier.favorite
                          ? "text-brand-copper fill-brand-copper"
                          : "text-[#D2CAA9] group-hover:text-forest-700/40 fill-transparent"
                      )}
                    />
                  </button>
                </td>

                {/* Name & Identifier */}
                <td className="py-2.5 px-4 font-medium text-forest-900">
                  <Link
                    href={`/fornecedores/${supplier.id}`}
                    className="flex items-center space-x-3 group/link hover:underline"
                  >
                    {/* Logo thumbnail */}
                    <div className="w-8 h-8 rounded-md bg-[#FAF7EE] border border-[#E5DFC5] flex items-center justify-center shrink-0 overflow-hidden text-forest-800/60 font-mono text-[10px] font-bold">
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
                        <Building className="w-4 h-4 text-forest-700/60" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <span className="font-semibold text-xs text-forest-900 group-hover/link:text-brand-copper block truncate">
                        {supplier.name}
                      </span>
                      {supplier.trade_name && supplier.trade_name !== supplier.name && (
                        <span className="text-[10px] text-olive-800/70 block truncate">
                          {supplier.trade_name}
                        </span>
                      )}
                    </div>
                  </Link>
                </td>

                {/* Category */}
                <td className="py-2.5 px-3.5">
                  <CategoryBadge category={supplier.category} />
                </td>

                {/* Location */}
                <td className="py-2.5 px-3.5 text-forest-800 text-[11px]">
                  {hasLocation ? (
                    <span className="inline-flex items-center gap-1 text-olive-800/90 truncate max-w-[160px]" title={locationStr}>
                      <MapPin className="w-3 h-3 shrink-0 text-clay-600" />
                      <span className="truncate">{locationStr}</span>
                    </span>
                  ) : (
                    <span className="text-forest-800/30 italic font-mono">-</span>
                  )}
                </td>

                {/* Website */}
                <td className="py-2.5 px-3.5 text-[11px]">
                  {supplier.website ? (
                    <a
                      href={supplier.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1 text-forest-800 hover:text-brand-copper underline decoration-[#D2CAA9] hover:decoration-brand-copper transition-colors truncate max-w-[140px]"
                      title={supplier.website}
                    >
                      <span className="truncate">{cleanUrl(supplier.website)}</span>
                      <ExternalLink className="w-3 h-3 shrink-0 text-forest-700/50" />
                    </a>
                  ) : (
                    <span className="text-forest-800/30 italic font-mono">-</span>
                  )}
                </td>

                {/* Status */}
                <td className="py-2.5 px-3">
                  <StatusBadge status={supplier.status} size="sm" />
                </td>

                {/* Rating */}
                <td className="py-2.5 px-3.5">
                  <RatingStars value={supplier.rating} readOnly size="sm" />
                </td>

                {/* Updated At */}
                <td className="py-2.5 px-3.5 text-forest-700 text-[11px] font-mono whitespace-nowrap">
                  {formatDate(supplier.updated_at || supplier.created_at)}
                </td>

                {/* Action Buttons */}
                <td className="py-2.5 px-4 text-right">
                  <div className="flex items-center justify-end space-x-1">
                    <Link
                      href={`/fornecedores/${supplier.id}`}
                      className="p-1 text-forest-800 hover:text-brand-copper hover:bg-[#FAF7EE] rounded transition-colors"
                      title="Ver detalhes"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </Link>
                    <Link
                      href={`/fornecedores/${supplier.id}/editar`}
                      className="p-1 text-forest-800 hover:text-brand-olive hover:bg-[#FAF7EE] rounded transition-colors"
                      title="Editar fornecedor"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => onDelete(supplier)}
                      className="p-1 text-forest-800 hover:text-rose-700 hover:bg-rose-50 rounded transition-colors"
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
