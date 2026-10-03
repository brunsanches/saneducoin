import { createFileRoute, Link } from "@tanstack/react-router";
import { Lock, Star } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { LESSONS, LEVELS } from "@/data/lessons";
import { isUnlocked, nextLesson, useGame } from "@/lib/game";

export const Route = createFileRoute("/trilhas")({
  head: () => ({
    meta: [
      { title: "Trilha de aprendizado — EduFin" },
      { name: "description", content: "O mapa da sua jornada financeira: 5 níveis, da sobrevivência ao mestre do capital." },
      { property: "og:title", content: "Trilha de aprendizado — EduFin" },
      { property: "og:description", content: "Avance pelos 5 níveis da jornada financeira." },
    ],
  }),
  component: Trilhas,
});

const OFFSETS = [0, 70, 100, 70, 0, -70, -100, -70];

function Trilhas() {
  const s = useGame();
  const current = nextLesson(s);
  let idx = 0;
  return (
    <AppShell>
      <h1 className="text-2xl font-black">Sua trilha</h1>
      {LEVELS.map((lvl) => {
        const lessons = LESSONS.filter((l) => l.level === lvl.id);
        return (
          <section key={lvl.id} className="mt-6">
            <div className={`rounded-3xl p-4 ${lvl.id % 2 ? "bg-gradient-primary text-primary-foreground" : "bg-brand text-brand-foreground"}`}>
              <p className="text-sm font-bold opacity-90">Nível {lvl.id}</p>
              <p className="text-xl font-black">{lvl.emoji} {lvl.name}</p>
              <p className="text-sm opacity-90">{lvl.subtitle}</p>
            </div>
            <div className="flex flex-col items-center gap-6 py-8">
              {lessons.map((l) => {
                const off = OFFSETS[idx++ % OFFSETS.length];
                const done = s.completed.includes(l.id);
                const open = isUnlocked(s, l.id);
                const isCurrent = current?.id === l.id;
                const node = (
                  <div
                    className={`relative flex h-20 w-20 items-center justify-center rounded-full border-b-[6px] text-3xl transition active:translate-y-1 ${
                      done ? "border-gold bg-gold/90" : open ? "border-primary-deep bg-primary" : "border-locked bg-locked/60"
                    }`}
                  >
                    {done ? <Star className="h-9 w-9 fill-card text-card" /> : open ? <span>{lvl.emoji}</span> : <Lock className="h-8 w-8 text-muted-foreground" />}
                    {isCurrent && (
                      <span className="absolute -top-9 whitespace-nowrap rounded-xl bg-card px-3 py-1 text-sm font-black text-primary-deep shadow-card">
                        COMEÇAR
                      </span>
                    )}
                  </div>
                );
                return (
                  <div key={l.id} className="flex flex-col items-center" style={{ transform: `translateX(${off}px)` }}>
                    {open ? (
                      <Link to="/aula/$id" params={{ id: l.id }} aria-label={l.title}>{node}</Link>
                    ) : (
                      <div aria-label={`${l.title} (bloqueada)`}>{node}</div>
                    )}
                    <p className={`mt-2 max-w-[150px] text-center text-sm font-bold ${open ? "" : "text-muted-foreground"}`}>{l.title}</p>
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}
    </AppShell>
  );
}
