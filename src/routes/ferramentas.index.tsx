import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight, CheckCircle2 } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { useGame } from "@/lib/game";

export const Route = createFileRoute("/ferramentas/")({
  head: () => ({
    meta: [
      { title: "Arsenal de ferramentas: Educoin" },
      { name: "description", content: "Simuladores de juros compostos, renda fixa e independência financeira em reais." },
      { property: "og:title", content: "Arsenal de ferramentas: Educoin" },
      { property: "og:description", content: "Simule o crescimento do seu dinheiro." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Ferramentas,
});

const TOOLS = [
  { id: "juros", to: "/ferramentas/juros", emoji: "📈", t: "Juros compostos", d: "Veja seu dinheiro crescer com aportes mensais." },
  { id: "comparador", to: "/ferramentas/comparador", emoji: "⚖️", t: "Comparador de renda fixa", d: "Poupança x Tesouro Selic x CDB 100% CDI." },
  { id: "independencia", to: "/ferramentas/independencia", emoji: "🏝️", t: "Independência financeira", d: "Quanto falta para viver de renda." },
] as const;

function Ferramentas() {
  const s = useGame();
  return (
    <AppShell>
      <h1 className="text-2xl font-black">Arsenal de ferramentas</h1>
      <p className="mt-1 text-muted-foreground">Ganhe +100 XP na primeira vez que usar cada simulador.</p>
      <div className="mt-5 space-y-3">
        {TOOLS.map((t) => (
          <Link key={t.id} to={t.to} className="flex items-center gap-4 rounded-3xl bg-card p-5 shadow-card active:scale-[0.98]">
            <span className="text-4xl">{t.emoji}</span>
            <div className="flex-1">
              <p className="flex items-center gap-1 text-lg font-extrabold">
                {t.t} {s.simulators.includes(t.id) && <CheckCircle2 className="h-5 w-5 text-primary" />}
              </p>
              <p className="text-muted-foreground">{t.d}</p>
            </div>
            <ChevronRight className="text-muted-foreground" />
          </Link>
        ))}
      </div>
    </AppShell>
  );
}
