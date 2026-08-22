import { SupplierStatus } from "@/types/supplier";

export const SUPPLIER_STATUSES: SupplierStatus[] = [
  "Ativo",
  "Preferencial",
  "Em avaliação",
  "Inativo",
];

export const STATUS_CONFIG: Record<
  SupplierStatus,
  { label: string; bg: string; text: string; border: string; dot: string }
> = {
  Ativo: {
    label: "Ativo",
    bg: "bg-emerald-50",
    text: "text-emerald-800",
    border: "border-emerald-200",
    dot: "bg-emerald-600",
  },
  Preferencial: {
    label: "Preferencial",
    bg: "bg-amber-50",
    text: "text-amber-900",
    border: "border-amber-300",
    dot: "bg-amber-600",
  },
  "Em avaliação": {
    label: "Em avaliação",
    bg: "bg-blue-50",
    text: "text-blue-900",
    border: "border-blue-200",
    dot: "bg-blue-600",
  },
  Inativo: {
    label: "Inativo",
    bg: "bg-slate-100",
    text: "text-slate-700",
    border: "border-slate-200",
    dot: "bg-slate-400",
  },
};
