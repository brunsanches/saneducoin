import { createFileRoute, Link } from "@tanstack/react-router";
import { Play, CheckCircle2, Circle } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Progress } from "@/components/ui/progress";
import { BADGES, currentLevel, levelProgress, nextLesson, useGame } from "@/lib/game";
import { LEVELS } from "@/data/lessons";

export const Route = createFileRoute("/app")({
  head: () => ({
    meta: [
      { title: "Início — EduFin" },
      { name: "description", content: "Sua próxima missão, XP, nível e ofensiva de estudos financeiros." },
      { property: "og:title", content: "Início — EduFin" },
      { property: "og:description", content: "Continue sua jornada financeira gamificada." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const s = useGame();
  const next = nextLesson(s);
  const lvl = currentLevel(s);
  const prog = levelProgress(s);
  const earned = BADGES.filter((b) => b.earned(s));

  const missions = [
    { label: "Estude 1 aula hoje", done: s.read.length > 0 },
    { label: "Acerte um quiz", done: s.completed.length > 0 },
    { label: "Use um simulador", done: s.simulators.length > 0 },
  ];

  return (
    <AppShell>
      <section className="rounded-3xl bg-card p-5 shadow-card">
        <div className="flex items-center justify-between">
          <p className="font-extrabold">{lvl.emoji} Nível {lvl.id} – {lvl.name}</p>
          <p className="text-sm font-bold text-muted-foreground">{prog.done}/{prog.total}</p>
        </div>
        <Progress value={prog.pct} className="mt-3 h-4 bg-muted [&>div]:bg-primary" />
        <p className="mt-2 text-sm text-muted-foreground">
          {lvl.id < 5 ? `Faltam ${prog.total - prog.done} aulas para o Nível ${lvl.id + 1} – ${LEVELS[lvl.id].name}` : "Último nível da jornada!"}
        </p>
      </section>

      <section className="bg-hero mt-4 rounded-3xl p-6 text-brand-foreground">
        <p className="text-sm font-bold uppercase tracking-wide opacity-80">Próxima missão</p>
        {next ? (
          <>
            <h2 className="mt-1 text-2xl font-black leading-tight">{next.title}</h2>
            <p className="mt-1 opacity-90">+10 XP pela leitura · +50 XP pelo quiz</p>
            <Link
              to="/aula/$id"
              params={{ id: next.id }}
              className="mt-5 flex h-16 items-center justify-center gap-2 rounded-2xl bg-primary text-xl font-black text-primary-foreground shadow-pop active:translate-y-1 active:shadow-none"
            >
              <Play className="h-6 w-6 fill-current" /> Começar aula
            </Link>
          </>
        ) : (
          <h2 className="mt-1 text-2xl font-black">Você completou toda a trilha! 👑</h2>
        )}
      </section>

      <section className="mt-6">
        <h3 className="text-lg font-black">Missões diárias</h3>
        <ul className="mt-3 space-y-2">
          {missions.map((m) => (
            <li key={m.label} className="flex items-center gap-3 rounded-2xl bg-card p-4 shadow-card">
              {m.done ? <CheckCircle2 className="h-7 w-7 text-primary" /> : <Circle className="h-7 w-7 text-locked" />}
              <span className={`font-bold ${m.done ? "text-muted-foreground line-through" : ""}`}>{m.label}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-black">Conquistas</h3>
          <Link to="/perfil" className="font-bold text-brand">Ver todas</Link>
        </div>
        {earned.length ? (
          <div className="mt-3 flex gap-3 overflow-x-auto pb-2">
            {earned.map((b) => (
              <div key={b.id} className="flex w-28 shrink-0 flex-col items-center rounded-2xl bg-card p-3 text-center shadow-card">
                <span className="text-4xl">{b.emoji}</span>
                <span className="mt-1 text-xs font-bold">{b.name}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-2 text-muted-foreground">Conclua sua primeira aula para ganhar a primeira conquista.</p>
        )}
      </section>
    </AppShell>
  );
}
