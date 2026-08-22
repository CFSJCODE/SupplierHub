import { Supplier } from "@/types/supplier";

export function exportSuppliersToJSON(suppliers: Supplier[]): void {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(suppliers, null, 2));
  const downloadAnchor = document.createElement("a");
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `fornecedores_supplierhub_${new Date().toISOString().split("T")[0]}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

export function exportSuppliersToCSV(suppliers: Supplier[]): void {
  const headers = [
    "ID",
    "Nome",
    "Razao Social",
    "Nome Fantasia",
    "Categoria",
    "Status",
    "Avaliacao",
    "Favorito",
    "Website",
    "Email",
    "Telefone",
    "WhatsApp",
    "Pais",
    "Estado",
    "Cidade",
    "Endereco",
    "Descricao",
    "Vantagens",
    "Limitacoes",
    "Experiencia de Compra",
    "Observacoes",
    "Criado Em",
    "Atualizado Em"
  ];

  const escapeCSV = (field?: string | number | boolean | null) => {
    if (field === null || field === undefined) return '""';
    const stringField = String(field);
    return `"${stringField.replace(/"/g, '""')}"`;
  };

  const rows = suppliers.map((s) => [
    escapeCSV(s.id),
    escapeCSV(s.name),
    escapeCSV(s.legal_name),
    escapeCSV(s.trade_name),
    escapeCSV(s.category),
    escapeCSV(s.status),
    escapeCSV(s.rating),
    escapeCSV(s.favorite ? "Sim" : "Não"),
    escapeCSV(s.website),
    escapeCSV(s.email),
    escapeCSV(s.phone),
    escapeCSV(s.whatsapp),
    escapeCSV(s.country),
    escapeCSV(s.state),
    escapeCSV(s.city),
    escapeCSV(s.address),
    escapeCSV(s.description),
    escapeCSV(s.advantages),
    escapeCSV(s.limitations),
    escapeCSV(s.purchase_experience),
    escapeCSV(s.notes),
    escapeCSV(s.created_at),
    escapeCSV(s.updated_at),
  ]);

  const csvContent = "\uFEFF" + [headers.join(";"), ...rows.map((r) => r.join(";"))].join("\r\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `fornecedores_supplierhub_${new Date().toISOString().split("T")[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  link.remove();
}
