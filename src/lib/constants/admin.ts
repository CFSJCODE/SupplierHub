export const SYSTEM_ADMIN_EMAILS = [
  "claudiofranciscojunior2006@gmail.com",
];

export function isSystemAdmin(email?: string | null): boolean {
  if (!email) return false;
  return SYSTEM_ADMIN_EMAILS.includes(email.toLowerCase().trim());
}

export function getUserRoleBadge(email?: string | null): {
  role: "admin" | "user";
  label: string;
  badgeLabel: string;
} {
  if (isSystemAdmin(email)) {
    return {
      role: "admin",
      label: "Administrador do Sistema",
      badgeLabel: "Admin Master",
    };
  }
  return {
    role: "user",
    label: "Usuário",
    badgeLabel: "Conta Ativa",
  };
}
