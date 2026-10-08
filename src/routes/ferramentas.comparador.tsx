import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Field, SimLayout, useSimulatorReward } from "@/components/SimLayout";
import { Termo } from "@/components/RichText";
import { brl } from "@/lib/game";
import { annualReturnLabel, calculateComparison, COMPARISON_ITEMS } from "@/lib/comparison";

export const Route = createFileRoute("/ferramentas/comparador")({
  head: () => ({
    meta: [
      { title: "Comparador de investimentos: Educoin" },
      { name: "description", content: "Compare renda fixa, ETF BOVA11, Ibovespa e S&P 500 via IVVB11 em cenários educativos em reais." },
      { property: "og:title", content: "Comparador de investimentos: Educoin" },
      { property: "og:description", content: "Simule renda fixa e bolsa com taxas hipotéticas e impostos estimados." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Comparador,
});

function Comparador() {
  const [valor, setValor] = useState(10000);
  const [meses, setMeses] = useState(24);
  const [selic, setSelic] = useState(10.5);
  const [etf, setEtf] = useState(10);
  const [ibovespa, setIbovespa] = useState(10);
  const [sp500, setSp500] = useState(10);
  useSimulatorReward("comparador", [valor, meses, selic, etf, ibovespa, sp500]);
  const data = useMemo(() => calculateComparison({ valor, meses, selic, etf, ibovespa, sp500 }), [valor, meses, selic, etf, ibovespa, sp500]);
  const finais = data.at(-1);
  if (!finais) return null;

  return (
    <SimLayout id="comparador" title="Comparador de investimentos" intro="Renda fixa e bolsa lado a lado, com cenários hipotéticos em reais. A bolsa pode subir ou cair.">
      <Field label="Valor investido" value={valor} display={brl(valor)} min={500} max={200000} step={500} onChange={setValor} />
      <Field label="Prazo" value={meses} display={`${meses} meses`} min={1} max={120} step={1} onChange={setMeses} />
      <Field label="Selic ao ano" value={selic} display={`${selic}%`} min={2} max={15} step={0.25} onChange={setSelic} />
      <p className="text-sm text-muted-foreground">
        O CDB usa o <Termo term="CDI" /> e pode ser sacado conforme a <Termo term="liquidez" />.
      </p>
      <section className="space-y-3">
        <h2 className="text-lg font-extrabold">Cenários da bolsa</h2>
        <p className="text-sm text-muted-foreground">Taxas ilustrativas, não são cotações nem previsões. ETF é um fundo negociado na bolsa. Ibovespa é uma referência, não um investimento que você compra diretamente.</p>
        <Field label="ETF BOVA11 ao ano" value={etf} display={annualReturnLabel(etf)} min={-50} max={50} step={0.5} onChange={setEtf} />
        <Field label="Ibovespa ao ano" value={ibovespa} display={annualReturnLabel(ibovespa)} min={-50} max={50} step={0.5} onChange={setIbovespa} />
        <Field label="S&P 500 via IVVB11 ao ano" value={sp500} display={annualReturnLabel(sp500)} min={-50} max={50} step={0.5} onChange={setSp500} />
        <p className="text-sm text-muted-foreground">IVVB11 é um ETF na B3 que acompanha o S&P 500. A taxa do cenário em reais considera, em conjunto, a bolsa americana e a variação do dólar.</p>
      </section>
      <div className="space-y-2">
        {COMPARISON_ITEMS.map(({ key, color, detail }) => (
          <div key={key} data-result={key} className="flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-card p-4 shadow-card">
            <div className="min-w-0 flex-1 basis-48">
              <span className="flex items-center gap-2 font-bold"><span className="h-4 w-4 shrink-0 rounded-full" style={{ background: color }} />{key}</span>
              <p className="mt-1 text-xs text-muted-foreground">{detail}</p>
            </div>
            <span className="text-xl font-black">{brl(finais[key])}</span>
          </div>
        ))}
      </div>
      <div className="h-80 rounded-2xl bg-card p-2 shadow-card">
        <ResponsiveContainer>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="mes" tickFormatter={(v) => `${v}m`} />
            <YAxis domain={["dataMin", "dataMax"]} tickFormatter={(v) => `${Math.round(v / 1000)}mil`} width={48} />
            <Tooltip formatter={(v: number) => brl(v)} labelFormatter={(l) => `Mês ${l}`} />
            <Legend />
            {COMPARISON_ITEMS.map(({ key, color }) => <Line key={key} type="monotone" dataKey={key} stroke={color} strokeWidth={3} dot={false} />)}
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p className="text-xs text-muted-foreground">Simulação educativa, sem dados em tempo real. Renda fixa com IR regressivo aproximado por meses; poupança isenta e TR estimada. ETFs com 15% de IR sobre ganhos em venda comum, sem isenção por valor vendido. Ibovespa é uma referência bruta. Não inclui custos de negociação, taxas dos ETFs nem inflação. Retornos constantes são apenas cenários, não garantias. Não é recomendação de investimento.</p>
    </SimLayout>
  );
}
