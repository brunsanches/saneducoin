export const COMPARISON_ITEMS = [
  { key: "Poupança", color: "var(--chart-3)", detail: "Isenta de Imposto de Renda" },
  { key: "Tesouro Selic", color: "var(--chart-2)", detail: "Após Imposto de Renda estimado" },
  { key: "CDB 100% CDI", color: "var(--chart-1)", detail: "Após Imposto de Renda estimado" },
  { key: "ETF BOVA11", color: "var(--chart-4)", detail: "Segue o Ibovespa, após IR estimado de 15% sobre o ganho" },
  { key: "Ibovespa", color: "var(--chart-5)", detail: "Índice de referência, sem desconto de imposto" },
  { key: "S&P 500 (IVVB11)", color: "var(--chart-6)", detail: "ETF na B3, após IR estimado de 15% sobre o ganho" },
] as const;

export type ComparisonRow = { mes: number } & Record<(typeof COMPARISON_ITEMS)[number]["key"], number>;
export type ComparisonInputs = { valor: number; meses: number; selic: number; etf: number; ibovespa: number; sp500: number };

const incomeTax = (months: number) => months <= 6 ? 0.225 : months <= 12 ? 0.2 : months <= 24 ? 0.175 : 0.15;

export function calculateComparison({ valor, meses, selic, etf, ibovespa, sp500 }: ComparisonInputs): ComparisonRow[] {
  const savingsAnnual = selic > 8.5 ? (Math.pow(1.005, 12) - 1) * 100 + 0.8 : selic * 0.7 + 0.8;
  const balance = (annual: number, month: number, tax = 0) => {
    const gross = valor * Math.pow(1 + annual / 100, month / 12);
    return Math.round(gross - Math.max(0, gross - valor) * tax);
  };
  return Array.from({ length: meses + 1 }, (_, mes) => ({
    mes,
    Poupança: balance(savingsAnnual, mes),
    "Tesouro Selic": balance(selic - 0.2, mes, incomeTax(mes)),
    "CDB 100% CDI": balance(selic - 0.1, mes, incomeTax(mes)),
    "ETF BOVA11": balance(etf, mes, 0.15),
    Ibovespa: balance(ibovespa, mes),
    "S&P 500 (IVVB11)": balance(sp500, mes, 0.15),
  }));
}

export function annualReturnLabel(value: number) {
  const percent = Math.abs(value).toLocaleString("pt-BR", { maximumFractionDigits: 2 });
  return value < 0 ? `Queda de ${percent}%` : `${percent}%`;
}