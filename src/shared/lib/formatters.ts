export const priceFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export function formatPhone(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11);

  if (digits.length === 0) return "";
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) {
    // Fixo: (XX) XXXX-XXXX
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  // Celular: (XX) XXXXX-XXXX
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export function validatePhone(value: string): string {
  const digits = value.replace(/\D/g, "");

  if (!digits) return "Informe seu telefone.";
  if (digits.length < 10) return "Telefone incompleto.";

  // DDD: dois dígitos, sem zero (11 a 99)
  if (!/^[1-9][1-9]$/.test(digits.slice(0, 2))) return "DDD inválido.";

  // Números repetidos (ex.: 11111111111)
  if (/^(\d)\1+$/.test(digits)) return "Telefone inválido.";

  if (digits.length === 11 && digits[2] !== "9") {
    return "Celulares devem começar com 9 após o DDD.";
  }

  if (digits.length === 10 && !/[2-5]/.test(digits[2])) {
    return "Telefone fixo inválido.";
  }

  return "";
}
