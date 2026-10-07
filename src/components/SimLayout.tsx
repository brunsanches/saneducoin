import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useEffect, useRef, type ReactNode } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { Slider } from "@/components/ui/slider";
import { game } from "@/lib/game";

export function SimLayout({ id, title, intro, children }: { id: string; title: string; intro: string; children: ReactNode }) {
  return (
    <AppShell>
      <Link to="/ferramentas" className="mb-3 inline-flex items-center gap-1 font-bold text-muted-foreground">
        <ArrowLeft className="h-5 w-5" /> Ferramentas
      </Link>
      <h1 className="text-2xl font-extrabold">{title}</h1>
      <p className="mt-1 text-muted-foreground">{intro}</p>
      <div className="mt-5 space-y-5" data-sim={id}>{children}</div>
    </AppShell>
  );
}

/** Concede XP na primeira interação com o simulador. */
export function useSimulatorReward(id: string, deps: unknown[]) {
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const gained = game.rewardSimulator(id);
    if (gained) toast.success(`+${gained} XP por usar o simulador!`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

export function Field({
  label, value, display, min, max, step, onChange,
}: { label: string; value: number; display: string; min: number; max: number; step: number; onChange: (v: number) => void }) {
  return (
    <div className="rounded-2xl bg-card p-4 shadow-card">
      <div className="mb-3 flex items-baseline justify-between">
        <span className="font-bold text-muted-foreground">{label}</span>
        <span className="text-lg font-extrabold">{display}</span>
      </div>
      <Slider value={[value]} min={min} max={max} step={step} onValueChange={(v) => onChange(v[0])} className="py-2" />
    </div>
  );
}

export function Result({ label, value, tone = "primary" }: { label: string; value: string; tone?: "primary" | "brand" }) {
  return (
    <div className={`rounded-2xl p-4 ${tone === "primary" ? "bg-gradient-primary text-primary-foreground" : "bg-brand text-brand-foreground"}`}>
      <p className="text-sm font-bold opacity-90">{label}</p>
      <p className="text-3xl font-black">{value}</p>
    </div>
  );
}
