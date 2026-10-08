import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Field, Result, SimLayout, useSimulatorReward } from "@/components/SimLayout";
import { brl } from "@/lib/game";

export const Route = createFileRoute("/ferramentas/juros")({
  head: () => ({
    meta: [
      { title: "Simulador de juros compostos — EduFin" },
      { name: "description", content: "Calcule quanto seu dinheiro rende com aporte inicial, aportes mensais, taxa e tempo." },
      { property: "og:title", content: "Simulador de juros compostos — EduFin" },
      { property: "og:description", content: "Veja o efeito bola de neve dos juros compostos em reais." },
    ],
  }),
  component: Juros,
});

const compact = (v: number) => (v >= 1e6 ? `${(v / 1e6).toFixed(1)}mi` : `${Math.round(v / 1000)}mil`);

function Juros() {
  const [inicial, setInicial] = useState(1000);
  const [mensal, setMensal] = useState(300);
  const [anos, setAnos] = useState(15);
  const [taxa, setTaxa] = useState(10);
  useSimulatorReward("juros", [inicial, mensal, anos, taxa]);

  const data = useMemo(() => {
    const i = Math.pow(1 + taxa / 100, 1 / 12) - 1;
    let total = inicial;
    let investido = inicial;
    const rows = [{ ano: 0, total, investido }];
    for (let m = 1; m <= anos * 12; m++) {
      total = total * (1 + i) + mensal;
      investido += mensal;
      if (m % 12 === 0) rows.push({ ano: m / 12, total: Math.round(total), investido });
    }
    return rows;
  }, [inicial, mensal, anos, taxa]);
  const last = data[data.length - 1]!;

  return (
    <SimLayout id="juros" title="Juros compostos" intro="Os juros rendem sobre os juros. Mexa nos controles e veja a bola de neve.">
      <Field label="Aporte inicial" value={inicial} display={brl(inicial)} min={0} max={50000} step={500} onChange={setInicial} />
      <Field label="Aporte mensal" value={mensal} display={brl(mensal)} min={0} max={5000} step={50} onChange={setMensal} />
      <Field label="Tempo" value={anos} display={`${anos} anos`} min={1} max={40} step={1} onChange={setAnos} />
      <Field label="Taxa ao ano" value={taxa} display={`${taxa}%`} min={1} max={20} step={0.5} onChange={setTaxa} />
      <div className="grid grid-cols-2 gap-3">
        <Result label="Total acumulado" value={brl(last.total)} />
        <Result label="Só de juros" value={brl(last.total - last.investido)} tone="brand" />
      </div>
      <div className="h-64 rounded-2xl bg-card p-2 shadow-card">
        <ResponsiveContainer>
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="ano" tickFormatter={(v) => `${v}a`} />
            <YAxis tickFormatter={compact} width={48} />
            <Tooltip formatter={(v: number) => brl(v)} labelFormatter={(l) => `Ano ${l}`} />
            <Area type="monotone" dataKey="total" name="Total" stroke="var(--primary-deep)" fill="var(--primary)" fillOpacity={0.35} strokeWidth={3} />
            <Area type="monotone" dataKey="investido" name="Investido" stroke="var(--brand)" fill="var(--brand)" fillOpacity={0.15} strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </SimLayout>
  );
}
