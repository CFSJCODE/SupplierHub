export function formatPhoneNumber(phone?: string | null): string {
  if (!phone) return "";
  const cleaned = phone.replace(/\D/g, "");
  
  // Mobile BR: 11 digits
  if (cleaned.length === 11) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
  }
  // Landline BR: 10 digits
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
  }
  return phone;
}

export function formatWhatsAppUrl(whatsapp?: string | null): string | null {
  if (!whatsapp) return null;
  const cleaned = whatsapp.replace(/\D/g, "");
  if (!cleaned) return null;
  
  // If it doesn't include country code (e.g. 10 or 11 digits), assume BR (+55)
  const fullNumber = cleaned.length <= 11 ? `55${cleaned}` : cleaned;
  return `https://wa.me/${fullNumber}`;
}

export function formatDate(dateString?: string | null): string {
  if (!dateString) return "-";
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  } catch {
    return dateString;
  }
}

export function formatDateTime(dateString?: string | null): string {
  if (!dateString) return "-";
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  } catch {
    return dateString;
  }
}

export function cleanUrl(url?: string | null): string {
  if (!url) return "";
  return url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
}
