export function formatPrice(priceCents: number | null, language: string): string {
  const value = (priceCents ?? 0) / 100;
  if (language.startsWith('pt')) {
    return `R$ ${value.toFixed(2).replace('.', ',')}`;
  }
  return `$${value.toFixed(2)}`;
}