import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { X, Lock } from "lucide-react";
import confetti from "canvas-confetti";
import { toast } from "sonner";
import { LESSONS, LEVELS } from "@/data/lessons";
import { RichText } from "@/components/RichText";
import { game, isUnlocked, useGame } from "@/lib/game";

export const Route = createFileRoute("/aula/$id")({
  loader: ({ params }) => {
    const lesson = LESSONS.find((l) => l.id === params.id);
    if (!lesson) throw notFound();
    return { lesson };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Aula não encontrada — EduFin" }, { name: "robots", content: "noindex" }] };
    const t = `${loaderData.lesson.title} — EduFin`;
    const d = (loaderData.lesson.paragraphs[0] ?? "").replace(/\[\[|\]\]/g, "").slice(0, 155);
    return { meta: [{ title: t }, { name: "description", content: d }, { property: "og:title", content: t }, { property: "og:description", content: d }] };
  },
  component: Dojo,
});

function fireConfetti() {
  const colors = ["#22c55e", "#16a34a", "#4ade80", "#86efac", "#15803d"];
  const end = Date.now() + 900;
  (function frame() {
    confetti({ particleCount: 8, angle: 60, spread: 70, origin: { x: 0, y: 0.7 }, colors });
    confetti({ particleCount: 8, angle: 120, spread: 70, origin: { x: 1, y: 0.7 }, colors });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
  confetti({ particleCount: 160, spread: 120, origin: { y: 0.5 }, colors, scalar: 1.2 });
}

function Dojo() {
  const { lesson } = Route.useLoaderData();
  const s = useGame();
  const navigate = useNavigate();
  const [step, setStep] = useState<"read" | "quiz">("read");
  const [picked, setPicked] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const level = LEVELS.find((l) => l.id === lesson.level)!;
  const idx = LESSONS.findIndex((l) => l.id === lesson.id);
  const nextL = LESSONS[idx + 1];

  useEffect(() => {
    setStep("read");
    setPicked(null);
    setChecked(false);
  }, [lesson.id]);

  if (!isUnlocked(s, lesson.id)) {
    return (
      <div className="mx-auto flex min-h-screen max-w-[480px] flex-col items-center justify-center gap-4 p-6 text-center">
        <Lock className="h-14 w-14 text-muted-foreground" />
        <h1 className="text-2xl font-black">Aula bloqueada</h1>
        <p className="text-muted-foreground">Conclua a aula anterior para liberar esta.</p>
        <Link to="/trilhas" className="flex h-14 w-full items-center justify-center rounded-2xl bg-primary text-lg font-black text-primary-foreground">Voltar à trilha</Link>
      </div>
    );
  }

  const correct = checked && picked === lesson.correct;

  function goQuiz() {
    const g = game.markRead(lesson.id);
    if (g) toast.success(`+${g} XP pela leitura`);
    setStep("quiz");
  }

  function check() {
    if (picked === null) return;
    setChecked(true);
    if (picked === lesson.correct) {
      fireConfetti();
      const g = game.completeQuiz(lesson.id);
      if (g) toast.success(`+${g} XP! Resposta certa 🎉`);
    }
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-[480px] flex-col px-4 pb-8 pt-4">
      <div className="flex items-center gap-3">
        <Link to="/trilhas" aria-label="Fechar" className="flex h-11 w-11 items-center justify-center rounded-full bg-muted"><X /></Link>
        <div className="h-4 flex-1 overflow-hidden rounded-full bg-muted">
          <div className="h-full rounded-full bg-primary transition-all" style={{ width: step === "read" ? "40%" : checked ? "100%" : "70%" }} />
        </div>
      </div>

      <p className="mt-6 text-sm font-bold text-brand">{level.emoji} Nível {level.id} · {level.name}</p>
      <h1 className="mt-1 text-3xl font-black leading-tight">{lesson.title}</h1>

      {step === "read" ? (
        <>
          <div className="mt-5 flex-1 space-y-4 text-lg leading-relaxed">
            {lesson.paragraphs.map((p, i) => (
              <p key={i}><RichText text={p} /></p>
            ))}
          </div>
          <button onClick={goQuiz} className="mt-8 h-16 w-full rounded-2xl bg-primary text-xl font-black text-primary-foreground shadow-pop active:translate-y-1 active:shadow-none">
            Entendi! Ir para o quiz
          </button>
        </>
      ) : (
        <>
          <p className="mt-5 text-xl font-extrabold">{lesson.question}</p>
          <div className="mt-4 flex-1 space-y-3">
            {lesson.options.map((o, i) => {
              const state = !checked ? (picked === i ? "pick" : "idle") : i === lesson.correct ? "right" : picked === i ? "wrong" : "idle";
              const cls = {
                idle: "border-border bg-card",
                pick: "border-brand bg-brand-soft",
                right: "border-primary bg-secondary",
                wrong: "border-destructive bg-destructive/10",
              }[state];
              return (
                <button key={i} disabled={checked} onClick={() => setPicked(i)} className={`min-h-16 w-full rounded-2xl border-2 border-b-4 p-4 text-left text-lg font-bold transition ${cls}`}>
                  {o}
                </button>
              );
            })}
          </div>

          {checked && (
            <div className={`mt-5 rounded-2xl p-4 ${correct ? "bg-secondary text-secondary-foreground" : "bg-destructive/10 text-destructive"}`}>
              <p className="text-lg font-black">{correct ? "Mandou bem! 🎉" : "Quase lá!"}</p>
              <p className="mt-1 text-foreground">{lesson.explanation}</p>
            </div>
          )}

          {!checked ? (
            <button onClick={check} disabled={picked === null} className="mt-5 h-16 w-full rounded-2xl bg-primary text-xl font-black text-primary-foreground shadow-pop disabled:opacity-40 disabled:shadow-none">
              Verificar
            </button>
          ) : correct ? (
            <button
              onClick={() => (nextL ? navigate({ to: "/aula/$id", params: { id: nextL.id } }) : navigate({ to: "/app" }))}
              className="mt-5 h-16 w-full rounded-2xl bg-primary text-xl font-black text-primary-foreground shadow-pop"
            >
              {nextL ? "Próxima aula" : "Concluir trilha"}
            </button>
          ) : (
            <button onClick={() => { setChecked(false); setPicked(null); }} className="mt-5 h-16 w-full rounded-2xl bg-brand text-xl font-black text-brand-foreground">
              Tentar de novo
            </button>
          )}
        </>
      )}
    </div>
  );
}
