import { SupplierStatus } from "@/types/supplier";

export const SUPPLIER_STATUSES: SupplierStatus[] = [
  'Ativo',
  'Preferencial',
  'Em avaliação',
  'Inativo'
];

export const STATUS_CONFIG: Record<
  SupplierStatus,
  { label: string; bg: string; text: string; border: string; dot: string }
> = {
  Ativo: {
    label: 'Ativo',
    bg: 'bg-emerald-50',
    text: 'text-emerald-800',
    border: 'border-emerald-200',
    dot: 'bg-emerald-600',
  },
  Preferencial: {
    label: 'Preferencial',
    bg: 'bg-copper-100',
    text: 'text-copper-800',
    border: 'border-copper-300',
    dot: 'bg-copper-700',
  },
  'Em avaliação': {
    label: 'Em avaliação',
    bg: 'bg-amber-50',
    text: 'text-amber-800',
    border: 'border-amber-200',
    dot: 'bg-amber-500',
  },
  Inativo: {
    label: 'Inativo',
    bg: 'bg-stone-100',
    text: 'text-stone-600',
    border: 'border-stone-200',
    dot: 'bg-stone-400',
  },
};
