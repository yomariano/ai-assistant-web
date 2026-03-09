const STARTER_PRICES: Record<string, string> = {
  EUR: '€99',
  GBP: '£89',
  USD: '$99',
  AUD: 'A$149',
};

export function getStarterPriceByCurrency(currency: string): string {
  return STARTER_PRICES[currency] || STARTER_PRICES.EUR;
}
