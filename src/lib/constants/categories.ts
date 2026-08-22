export interface CategoryDefinition {
  id: string;
  name: string;
  description: string;
  badgeColor?: string;
}

export const SUPPLIER_CATEGORIES: string[] = [
  "Componentes eletrônicos",
  "Microcontroladores",
  "Sistemas embarcados",
  "Sensores",
  "Robótica",
  "Automação",
  "Impressão 3D",
  "Materiais mecânicos",
  "Usinagem",
  "Ferramentas",
  "Parafusos e fixadores",
  "Cabos e conectores",
  "Fontes e baterias",
  "Equipamentos de laboratório",
  "Distribuidores",
  "Fabricantes",
  "Marketplaces",
  "Serviços",
  "Outros",
] as const;

export const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  "Componentes eletrônicos": { bg: "bg-emerald-50", text: "text-emerald-800", border: "border-emerald-200" },
  Microcontroladores: { bg: "bg-teal-50", text: "text-teal-800", border: "border-teal-200" },
  "Sistemas embarcados": { bg: "bg-cyan-50", text: "text-cyan-800", border: "border-cyan-200" },
  Sensores: { bg: "bg-sky-50", text: "text-sky-800", border: "border-sky-200" },
  Robótica: { bg: "bg-amber-50", text: "text-amber-900", border: "border-amber-200" },
  Automação: { bg: "bg-orange-50", text: "text-orange-900", border: "border-orange-200" },
  "Impressão 3D": { bg: "bg-purple-50", text: "text-purple-800", border: "border-purple-200" },
  "Materiais mecânicos": { bg: "bg-slate-100", text: "text-slate-800", border: "border-slate-300" },
  Usinagem: { bg: "bg-zinc-100", text: "text-zinc-800", border: "border-zinc-300" },
  Ferramentas: { bg: "bg-yellow-50", text: "text-yellow-900", border: "border-yellow-200" },
  "Parafusos e fixadores": { bg: "bg-stone-100", text: "text-stone-800", border: "border-stone-300" },
  "Cabos e conectores": { bg: "bg-blue-50", text: "text-blue-800", border: "border-blue-200" },
  "Fontes e baterias": { bg: "bg-lime-50", text: "text-lime-900", border: "border-lime-200" },
  "Equipamentos de laboratório": { bg: "bg-indigo-50", text: "text-indigo-800", border: "border-indigo-200" },
  Distribuidores: { bg: "bg-emerald-100/60", text: "text-emerald-900", border: "border-emerald-300" },
  Fabricantes: { bg: "bg-slate-800 text-white", text: "text-slate-100", border: "border-slate-900" },
  Marketplaces: { bg: "bg-amber-100/70", text: "text-amber-900", border: "border-amber-300" },
  Serviços: { bg: "bg-rose-50", text: "text-rose-800", border: "border-rose-200" },
  Outros: { bg: "bg-slate-100", text: "text-slate-700", border: "border-slate-200" },
};
