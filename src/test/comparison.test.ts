import { describe, expect, it } from "vitest";
import { annualReturnLabel, calculateComparison, COMPARISON_ITEMS } from "@/lib/comparison";
import { LESSONS, LEVELS, GLOSSARY } from "@/data/lessons";
import { BADGES } from "@/lib/game";

const inputs = { valor: 10000, meses: 12, selic: 10.5, etf: 10, ibovespa: 10, sp500: 10 };

describe("Investment comparison", () => {
  it("starts every series at the same principal", () => {
    const first = calculateComparison(inputs)[0];
    for (const { key } of COMPARISON_ITEMS) expect(first?.[key]).toBe(10000);
  });
  it("separates gross index returns from taxable ETF gains", () => {
    const last = calculateComparison(inputs).at(-1);
    expect(last?.Ibovespa).toBe(11000);
    expect(last?.["ETF BOVA11"]).toBe(10850);
    expect(last?.["S&P 500 (IVVB11)"]).toBe(10850);
  });
  it("does not charge tax on losses and updates each scenario independently", () => {
    const last = calculateComparison({ ...inputs, etf: -20, sp500: 0 }).at(-1);
    expect(last?.["ETF BOVA11"]).toBe(8000);
    expect(last?.["S&P 500 (IVVB11)"]).toBe(10000);
    expect(last?.Ibovespa).toBe(11000);
    expect(annualReturnLabel(-20)).toBe("Queda de 20%");
  });
  it("has no hyphens or dashes in educational text", () => {
    const text = [
      ...LEVELS.flatMap(l => [l.name, l.subtitle]),
      ...LESSONS.flatMap(l => [l.title, ...l.paragraphs, l.question, ...l.options, l.explanation]),
      ...Object.values(GLOSSARY), ...BADGES.flatMap(b => [b.name, b.desc]),
    ].join(" ");
    expect(text).not.toMatch(/[-–—]/);
  });
});