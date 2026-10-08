import { createFileRoute } from "@tanstack/react-router";
import { Flame, Zap, BookOpen } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { BADGES, currentLevel, game, useGame } from "@/lib/game";
import { LESSONS } from "@/data/lessons";

export const Route = createFileRoute("/perfil")({
  head: () => ({
    meta: [
      { title: "Seu perfil: Educoin" },
      { name: "description", content: "Seu nível, XP, ofensiva e todas as conquistas da jornada financeira." },
      { property: "og:title", content: "Seu perfil: Educoin" },
      { property: "og:description", content: "Veja suas conquistas na Educoin." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Perfil,
});

function Perfil() {
  const s = useGame();
  const lvl = currentLevel(s);
  const stats = [
    { icon: Zap, v: s.xp, l: "XP total", c: "text-primary-deep" },
    { icon: Flame, v: s.bestStreak, l: "Maior ofensiva", c: "text-streak" },
    { icon: BookOpen, v: `${s.completed.length}/${LESSONS.length}`, l: "Aulas", c: "text-brand" },
  ];
  return (
    <AppShell header={false}>
      <div className="bg-hero -mx-4 -mt-4 rounded-b-[2rem] px-6 pb-8 pt-10 text-center text-brand-foreground">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-card text-5xl">{lvl.emoji}</div>
        <p className="mt-3 text-2xl font-black">Investidor(a) em formação</p>
        <p className="opacity-90">Nível {lvl.id}: {lvl.name}</p>
      </div>
      <div className="mt-5 grid grid-cols-3 gap-3">
        {stats.map(({ icon: Icon, v, l, c }) => (
          <div key={l} className="rounded-2xl bg-card p-3 text-center shadow-card">
            <Icon className={`mx-auto h-6 w-6 ${c}`} />
            <p className="mt-1 text-xl font-black">{v}</p>
            <p className="text-xs font-bold text-muted-foreground">{l}</p>
          </div>
        ))}
      </div>
      <h2 className="mt-6 text-lg font-black">Conquistas</h2>
      <div className="mt-3 grid grid-cols-2 gap-3">
        {BADGES.map((b) => {
          const ok = b.earned(s);
          return (
            <div key={b.id} className={`rounded-2xl p-4 text-center ${ok ? "bg-card shadow-card" : "bg-muted"}`}>
              <span className={`text-4xl ${ok ? "" : "opacity-30 grayscale"}`}>{b.emoji}</span>
              <p className={`mt-1 font-extrabold ${ok ? "" : "text-muted-foreground"}`}>{b.name}</p>
              <p className="text-xs text-muted-foreground">{b.desc}</p>
            </div>
          );
        })}
      </div>
      <button
        onClick={() => confirm("Apagar todo o seu progresso?") && game.reset()}
        className="mt-8 h-14 w-full rounded-2xl border-2 font-bold text-destructive"
      >
        Zerar progresso
      </button>
    </AppShell>
  );
}
