"use client";

import React, { useEffect, useState } from "react";
import { Search, RotateCcw, SlidersHorizontal, ChevronDown, Star } from "lucide-react";
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

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchValue !== filters.search) {
        onChange({ ...filters, search: searchValue });
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchValue, filters, onChange]);

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
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-card space-y-3.5">
      {/* Primary Search & Quick Toggle Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Search Input with Debounce */}
        <div className="relative flex-1">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Pesquisar por nome, categoria, cidade, estado..."
            className="w-full h-10 pl-10 pr-8 text-sm bg-slate-50 hover:bg-white focus:bg-white text-slate-900 placeholder:text-slate-400 border border-slate-200 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 shadow-xs"
          />
          {searchValue && (
            <button
              onClick={() => {
                setSearchValue("");
                onChange({ ...filters, search: "" });
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 text-xs px-1 cursor-pointer"
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
              "h-10 px-3.5 text-xs font-semibold border rounded-lg transition-all flex items-center gap-1.5 shrink-0 select-none shadow-xs cursor-pointer",
              filters.favoriteOnly
                ? "bg-amber-500 text-white border-amber-600 shadow-sm"
                : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-white hover:border-slate-300"
            )}
          >
            <Star className={cn("w-3.5 h-3.5", filters.favoriteOnly ? "fill-white text-white" : "text-amber-500 fill-amber-500")} />
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
              className="h-10 pl-3 pr-8 text-xs font-medium bg-slate-50 hover:bg-white text-slate-800 border border-slate-200 rounded-lg transition-all appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 shadow-xs"
            >
              <option value="created_desc">Mais recentes</option>
              <option value="name_asc">Nome (A-Z)</option>
              <option value="name_desc">Nome (Z-A)</option>
              <option value="rating_desc">Melhor avaliação</option>
              <option value="updated_desc">Última atualização</option>
              <option value="created_asc">Mais antigos</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

          {/* Mobile Filter Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            className={cn(
              "h-10 px-3 text-xs font-medium border rounded-lg sm:hidden flex items-center gap-1.5 cursor-pointer",
              hasActiveFilters ? "bg-emerald-600 text-white border-emerald-700" : "bg-slate-50 text-slate-700 border-slate-200"
            )}
            title="Filtros avançados"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Advanced Filter Row */}
      <div
        className={cn(
          "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 pt-3 border-t border-slate-100",
          mobileFiltersOpen ? "block" : "hidden sm:grid"
        )}
      >
        {/* Category Filter */}
        <div className="space-y-1">
          <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 font-mono">
            Categoria
          </label>
          <div className="relative">
            <select
              value={filters.category}
              onChange={(e) => onChange({ ...filters, category: e.target.value })}
              className="w-full h-9 pl-3 pr-8 text-xs bg-white text-slate-900 border border-slate-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 shadow-xs cursor-pointer"
            >
              <option value="">Todas as categorias</option>
              {SUPPLIER_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Status Filter */}
        <div className="space-y-1">
          <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 font-mono">
            Status
          </label>
          <div className="relative">
            <select
              value={filters.status}
              onChange={(e) => onChange({ ...filters, status: e.target.value })}
              className="w-full h-9 pl-3 pr-8 text-xs bg-white text-slate-900 border border-slate-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 shadow-xs cursor-pointer"
            >
              <option value="">Todos os status</option>
              {SUPPLIER_STATUSES.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Country Filter */}
        <div className="space-y-1">
          <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 font-mono">
            País
          </label>
          <div className="relative">
            <select
              value={filters.country}
              onChange={(e) => onChange({ ...filters, country: e.target.value })}
              className="w-full h-9 pl-3 pr-8 text-xs bg-white text-slate-900 border border-slate-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 shadow-xs cursor-pointer"
            >
              <option value="">Todos os países</option>
              <option value="Brasil">Brasil</option>
              <option value="Estados Unidos">Estados Unidos</option>
              <option value="China">China</option>
              <option value="Alemanha">Alemanha</option>
              <option value="Japão">Japão</option>
              <option value="Outro">Outro</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
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
              leftIcon={<RotateCcw className="w-3.5 h-3.5 text-slate-500" />}
              className="h-9 text-xs"
            >
              Limpar Filtros
            </Button>
          )}
          <span className="text-[11px] font-mono text-slate-500 py-2 font-medium">
            {filteredCount} de {totalCount} {totalCount === 1 ? "registro" : "registros"}
          </span>
        </div>
      </div>
    </div>
  );
}
