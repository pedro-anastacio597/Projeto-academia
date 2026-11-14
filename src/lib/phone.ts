/** Só os dígitos de um texto. */
export const onlyDigits = (v: string) => v.replace(/\D/g, "");

/** Formata como telefone brasileiro: (84) 99999-9999 ou (84) 9999-9999. */
export function formatPhone(v: string): string {
  const d = onlyDigits(v).slice(0, 11);
  if (d.length === 0) return "";
  if (d.length <= 2) return `(${d}`;
  const ddd = d.slice(0, 2);
  const rest = d.slice(2);
  if (rest.length <= 4) return `(${ddd}) ${rest}`;
  const cut = d.length === 11 ? 5 : 4;
  return `(${ddd}) ${rest.slice(0, cut)}${rest.length > cut ? "-" + rest.slice(cut) : ""}`;
}
