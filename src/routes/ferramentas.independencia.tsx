import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Area, AreaChart, CartesianGrid, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Field, Result, SimLayout, useSimulatorReward } from "@/components/SimLayout";
import { Progress } from "@/components/ui/progress";
import { brl } from "@/lib/game";

export const Route = createFileRoute("/ferramentas/independencia")({
  head: () => ({
    meta: [
      { title: "Calculadora de independência financeira — EduFin" },
      { name: "description", content: "Descubra quanto patrimônio você precisa para viver de renda e em quanto tempo chega lá." },
      { property: "og:title", content: "Calculadora de independência financeira — EduFin" },
      { property: "og:description", content: "Quanto falta para viver de renda?" },
    ],
  }),
  component: Independencia,
});

function Independencia() {
  const [renda, setRenda] = useState(5000);
  const [atual, setAtual] = useState(20000);
  const [aporte, setAporte] = useState(1000);
  const [juroReal, setJuroReal] = useState(5);
  useSimulatorReward("independencia", [renda, atual, aporte, juroReal]);

  const { meta, anos, data } = useMemo(() => {
    const meta = (renda * 12) / (juroReal / 100);
    const i = Math.pow(1 + juroReal / 100, 1 / 12) - 1;
    let p = atual, m = 0;
    const rows = [{ ano: 0, patrimonio: Math.round(p) }];
    while (p < meta && m < 12 * 60) {
      p = p * (1 + i) + aporte;
      m++;
      if (m % 12 === 0) rows.push({ ano: m / 12, patrimonio: Math.round(p) });
    }
    if (m % 12) rows.push({ ano: Math.ceil(m / 12), patrimonio: Math.round(p) });
    return { meta, anos: p >= meta ? m / 12 : null, data: rows };
  }, [renda, atual, aporte, juroReal]);

  const pct = Math.min(100, (atual / meta) * 100);

  return (
    <SimLayout id="independencia" title="Independência financeira" intro="Juro real = rendimento acima da inflação (IPCA). Assim os valores ficam em reais de hoje.">
      <Field label="Renda mensal desejada" value={renda} display={brl(renda)} min={1000} max={30000} step={500} onChange={setRenda} />
      <Field label="Patrimônio atual" value={atual} display={brl(atual)} min={0} max={1000000} step={5000} onChange={setAtual} />
      <Field label="Aporte mensal" value={aporte} display={brl(aporte)} min={0} max={20000} step={100} onChange={setAporte} />
      <Field label="Juro real ao ano" value={juroReal} display={`${juroReal}% + IPCA`} min={2} max={10} step={0.5} onChange={setJuroReal} />
      <div className="grid grid-cols-2 gap-3">
        <Result label="Patrimônio necessário" value={brl(meta)} tone="brand" />
        <Result label="Tempo até lá" value={anos === null ? "60+ anos" : `${anos.toFixed(1).replace(".", ",")} anos`} />
      </div>
      <div className="rounded-2xl bg-card p-4 shadow-card">
        <div className="flex justify-between font-bold"><span>Você já tem</span><span>{pct.toFixed(1).replace(".", ",")}%</span></div>
        <Progress value={pct} className="mt-2 h-4 bg-muted [&>div]:bg-primary" />
        <p className="mt-2 text-sm text-muted-foreground">Faltam {brl(Math.max(0, meta - atual))}</p>
      </div>
      <div className="h-64 rounded-2xl bg-card p-2 shadow-card">
        <ResponsiveContainer>
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="ano" tickFormatter={(v) => `${v}a`} />
            <YAxis tickFormatter={(v) => (v >= 1e6 ? `${(v / 1e6).toFixed(1)}mi` : `${Math.round(v / 1000)}mil`)} width={48} />
            <Tooltip formatter={(v: number) => brl(v)} labelFormatter={(l) => `Ano ${l}`} />
            <ReferenceLine y={meta} stroke="var(--brand)" strokeDasharray="6 4" label={{ value: "Meta", fill: "var(--brand)", position: "insideTopLeft" }} />
            <Area type="monotone" dataKey="patrimonio" name="Patrimônio" stroke="var(--primary-deep)" fill="var(--primary)" fillOpacity={0.35} strokeWidth={3} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </SimLayout>
  );
}
