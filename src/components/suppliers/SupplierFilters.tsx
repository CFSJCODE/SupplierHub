"use client";

import React, { useEffect, useState } from "react";
import { Search, RotateCcw, SlidersHorizontal, ChevronDown, Check } from "lucide-react";
import { SupplierFilters, SupplierSortOption } from "@/types/supplier";
import { SUPPLIER_CATEGORIES } from "@/lib/constants/categories";
import { SUPPLIER_STATUSES } from "@/lib/constants/statuses";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";

export interface SupplierFiltersBarProps {
  filters: SupplierFilters;
  onChange: (filters: SupplierFilters) => void;
  onReset: () => void;
  totalCount: number;
  filteredCount: number;
}

export function SupplierFiltersBar({
  filters,
  onChange,
  onReset,
  totalCount,
  filteredCount,
}: SupplierFiltersBarProps) {
  const [searchValue, setSearchValue] = useState(filters.search);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // 300ms Debounce implementation for search as requested in Requirement #8
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchValue !== filters.search) {
        onChange({ ...filters, search: searchValue });
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchValue, filters, onChange]);

  // Keep local search input synchronized if reset from outside
  useEffect(() => {
    setSearchValue(filters.search);
  }, [filters.search]);

  const hasActiveFilters =
    Boolean(filters.search) ||
    Boolean(filters.category) ||
    Boolean(filters.status) ||
    Boolean(filters.state) ||
    Boolean(filters.country) ||
    filters.favoriteOnly;

  return (
    <div className="bg-white border border-[#D2CAA9] rounded-lg p-3.5 shadow-subtle space-y-3">
      {/* Primary Search & Quick Toggle Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
        {/* Search Input with Debounce */}
        <div className="relative flex-1">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-forest-700/60 pointer-events-none">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Pesquisar fornecedores... (nome, categoria, cidade, estado, país)"
            className="w-full h-9 pl-9 pr-8 text-sm bg-[#FAF7EE] hover:bg-white focus:bg-white text-forest-900 placeholder:text-forest-800/40 border border-[#D2CAA9] rounded-md transition-colors focus:outline-none focus:ring-1 focus:ring-brand-copper focus:border-brand-copper"
          />
          {searchValue && (
            <button
              onClick={() => {
                setSearchValue("");
                onChange({ ...filters, search: "" });
              }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-forest-700/50 hover:text-forest-900 text-xs px-1"
              title="Limpar pesquisa"
            >
              ✕
            </button>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Favorite Toggle Button */}
          <button
            type="button"
            onClick={() => onChange({ ...filters, favoriteOnly: !filters.favoriteOnly })}
            className={cn(
              "h-9 px-3 text-xs font-medium border rounded-md transition-colors flex items-center gap-1.5 shrink-0 select-none",
              filters.favoriteOnly
                ? "bg-brand-olive text-white border-brand-olive shadow-subtle font-semibold"
                : "bg-[#FAF7EE] text-forest-800 border-[#D2CAA9] hover:bg-white"
            )}
          >
            <span className={cn("text-sm", filters.favoriteOnly ? "text-white" : "text-brand-copper")}>
              ★
            </span>
            <span>Favoritos</span>
          </button>

          {/* Sort Selector */}
          <div className="relative">
            <select
              value={filters.sortBy}
              onChange={(e) =>
                onChange({ ...filters, sortBy: e.target.value as SupplierSortOption })
              }
              aria-label="Ordenar por"
              className="h-9 pl-2.5 pr-7 text-xs bg-[#FAF7EE] hover:bg-white text-forest-900 border border-[#D2CAA9] rounded-md transition-colors appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-brand-copper"
            >
              <option value="created_desc">Mais recentes</option>
              <option value="name_asc">Nome (A-Z)</option>
              <option value="name_desc">Nome (Z-A)</option>
              <option value="rating_desc">Melhor avaliação</option>
              <option value="updated_desc">Última atualização</option>
              <option value="created_asc">Mais antigos</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 absolute right-2 top-1/2 -translate-y-1/2 text-forest-700/60 pointer-events-none" />
          </div>

          {/* Mobile Filter Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            className={cn(
              "h-9 px-2.5 text-xs font-medium border rounded-md sm:hidden flex items-center gap-1.5",
              hasActiveFilters ? "bg-brand-olive text-white border-brand-olive" : "bg-[#FAF7EE] text-forest-800 border-[#D2CAA9]"
            )}
            title="Filtros avançados"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Advanced Filter Row (Visible always on Desktop/Tablet, toggleable on Mobile) */}
      <div
        className={cn(
          "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 pt-2.5 border-t border-[#F0EBD7]",
          mobileFiltersOpen ? "block" : "hidden sm:grid"
        )}
      >
        {/* Category Filter */}
        <div className="space-y-1">
          <label className="text-[10px] font-semibold uppercase tracking-wider text-forest-800/80 font-mono">
            Categoria
          </label>
          <div className="relative">
            <select
              value={filters.category}
              onChange={(e) => onChange({ ...filters, category: e.target.value })}
              className="w-full h-8 pl-2.5 pr-7 text-xs bg-white text-forest-900 border border-[#D2CAA9] rounded-md appearance-none focus:outline-none focus:ring-1 focus:ring-brand-copper"
            >
              <option value="">Todas as categorias</option>
              {SUPPLIER_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 absolute right-2 top-1/2 -translate-y-1/2 text-forest-700/60 pointer-events-none" />
          </div>
        </div>

        {/* Status Filter */}
        <div className="space-y-1">
          <label className="text-[10px] font-semibold uppercase tracking-wider text-forest-800/80 font-mono">
            Status Operacional
          </label>
          <div className="relative">
            <select
              value={filters.status}
              onChange={(e) => onChange({ ...filters, status: e.target.value })}
              className="w-full h-8 pl-2.5 pr-7 text-xs bg-white text-forest-900 border border-[#D2CAA9] rounded-md appearance-none focus:outline-none focus:ring-1 focus:ring-brand-copper"
            >
              <option value="">Todos os status</option>
              {SUPPLIER_STATUSES.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 absolute right-2 top-1/2 -translate-y-1/2 text-forest-700/60 pointer-events-none" />
          </div>
        </div>

        {/* Country Filter */}
        <div className="space-y-1">
          <label className="text-[10px] font-semibold uppercase tracking-wider text-forest-800/80 font-mono">
            País
          </label>
          <div className="relative">
            <select
              value={filters.country}
              onChange={(e) => onChange({ ...filters, country: e.target.value })}
              className="w-full h-8 pl-2.5 pr-7 text-xs bg-white text-forest-900 border border-[#D2CAA9] rounded-md appearance-none focus:outline-none focus:ring-1 focus:ring-brand-copper"
            >
              <option value="">Todos os países</option>
              <option value="Brasil">Brasil</option>
              <option value="Estados Unidos">Estados Unidos</option>
              <option value="China">China</option>
              <option value="Alemanha">Alemanha</option>
              <option value="Japão">Japão</option>
              <option value="Outro">Outro</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 absolute right-2 top-1/2 -translate-y-1/2 text-forest-700/60 pointer-events-none" />
          </div>
        </div>

        {/* Reset & Summary Status */}
        <div className="flex items-end justify-between sm:justify-end gap-2 pt-1 sm:pt-0">
          {hasActiveFilters && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onReset}
              leftIcon={<RotateCcw className="w-3.5 h-3.5 text-forest-700" />}
              className="h-8 text-xs text-forest-800"
            >
              Limpar Filtros
            </Button>
          )}
          <span className="text-[11px] font-mono text-olive-800/80 py-1.5">
            {filteredCount} de {totalCount} registro{totalCount !== 1 ? "s" : ""}
          </span>
        </div>
      </div>
    </div>
  );
}
