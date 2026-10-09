import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Field, SimLayout, useSimulatorReward } from "@/components/SimLayout";
import { Termo } from "@/components/RichText";
import { brl } from "@/lib/game";

export const Route = createFileRoute("/ferramentas/comparador")({
  head: () => ({
    meta: [
      { title: "Comparador de renda fixa: Educoin" },
      { name: "description", content: "Compare Poupança, Tesouro Selic e CDB 100% do CDI, já descontando o Imposto de Renda." },
      { property: "og:title", content: "Comparador de renda fixa: Educoin" },
      { property: "og:description", content: "Poupança x Tesouro Selic x CDB 100% CDI." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Comparador,
});

const irAliquota = (meses: number) => (meses <= 6 ? 0.225 : meses <= 12 ? 0.2 : meses <= 24 ? 0.175 : 0.15);

function Comparador() {
  const [valor, setValor] = useState(10000);
  const [meses, setMeses] = useState(24);
  const [selic, setSelic] = useState(10.5);
  useSimulatorReward("comparador", [valor, meses, selic]);

  const { data, finais } = useMemo(() => {
    const cdi = selic - 0.1;
    const poupAno = selic > 8.5 ? (Math.pow(1.005, 12) - 1) * 100 + 0.8 : selic * 0.7 + 0.8;
    const m = (a: number) => Math.pow(1 + a / 100, 1 / 12) - 1;
    const rp = m(poupAno), rs = m(selic - 0.2), rc = m(cdi);
    const rows = [];
    for (let k = 0; k <= meses; k++) {
      const ir = irAliquota(k);
      const liq = (r: number) => { const b = valor * Math.pow(1 + r, k); return Math.round(b - (b - valor) * ir); };
      rows.push({ mes: k, Poupança: Math.round(valor * Math.pow(1 + rp, k)), "Tesouro Selic": liq(rs), "CDB 100% CDI": liq(rc) });
    }
    return { data: rows, finais: rows[rows.length - 1]! };
  }, [valor, meses, selic]);

  const items = [
    { k: "Poupança", c: "var(--chart-3)" },
    { k: "Tesouro Selic", c: "var(--chart-2)" },
    { k: "CDB 100% CDI", c: "var(--chart-1)" },
  ] as const;

  return (
    <SimLayout id="comparador" title="Comparador de renda fixa" intro="Valores líquidos, já descontando Imposto de Renda (tabela regressiva). Poupança é isenta.">
      <Field label="Valor investido" value={valor} display={brl(valor)} min={500} max={200000} step={500} onChange={setValor} />
      <Field label="Prazo" value={meses} display={`${meses} meses`} min={1} max={120} step={1} onChange={setMeses} />
      <Field label="Selic ao ano" value={selic} display={`${selic}%`} min={2} max={15} step={0.25} onChange={setSelic} />
      <p className="text-sm text-muted-foreground">
        O CDB usa o <Termo term="CDI" /> e pode ser sacado conforme a <Termo term="liquidez" />.
      </p>
      <div className="space-y-2">
        {items.map(({ k, c }) => (
          <div key={k} className="flex items-center justify-between rounded-2xl bg-card p-4 shadow-card">
            <span className="flex items-center gap-2 font-bold"><span className="h-4 w-4 rounded-full" style={{ background: c }} />{k}</span>
            <span className="text-xl font-black">{brl(finais[k])}</span>
          </div>
        ))}
      </div>
      <div className="h-64 rounded-2xl bg-card p-2 shadow-card">
        <ResponsiveContainer>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="mes" tickFormatter={(v) => `${v}m`} />
            <YAxis domain={["dataMin", "dataMax"]} tickFormatter={(v) => `${Math.round(v / 1000)}mil`} width={48} />
            <Tooltip formatter={(v: number) => brl(v)} labelFormatter={(l) => `Mês ${l}`} />
            <Legend />
            {items.map(({ k, c }) => <Line key={k} type="monotone" dataKey={k} stroke={c} strokeWidth={3} dot={false} />)}
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p className="text-xs text-muted-foreground">Simulação educativa com taxas aproximadas. Não é recomendação de investimento.</p>
    </SimLayout>
  );
}
