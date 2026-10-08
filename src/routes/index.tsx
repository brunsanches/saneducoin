import { createFileRoute, Link } from "@tanstack/react-router";
import { Flame, Zap, Trophy, Calculator, ShieldCheck } from "lucide-react";
import { LEVELS } from "@/data/lessons";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Educoin: Aprenda a investir jogando" },
      { name: "description", content: "Saia das dívidas e chegue aos investimentos com aulas de 2 minutos, XP, ofensiva e simuladores. 100% brasileiro e grátis." },
      { property: "og:title", content: "Educoin: Aprenda a investir jogando" },
      { property: "og:description", content: "Das dívidas ao Tesouro Direto, FIIs e cripto em aulas curtas e gamificadas." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

function Cta({ children = "Começar grátis" }: { children?: string }) {
  return (
    <Link to="/app" className="flex h-16 w-full items-center justify-center rounded-2xl bg-primary text-xl font-black text-primary-foreground shadow-pop transition active:translate-y-1 active:shadow-none">
      {children}
    </Link>
  );
}

function Landing() {
  return (
    <div className="mx-auto max-w-[480px]">
      <section className="bg-hero rounded-b-[2.5rem] px-6 pb-10 pt-8 text-brand-foreground">
        <p className="text-lg font-black">Educoin</p>
        <h1 className="mt-8 text-4xl font-black leading-tight">Do vermelho ao investidor, jogando.</h1>
        <p className="mt-4 text-lg opacity-90">
          Aulas de 2 minutos, quizzes e simuladores para você sair das dívidas e fazer o seu dinheiro trabalhar: em reais, com exemplos do Nubank, Caixa, B3 e Tesouro Nacional.
        </p>
        <div className="mt-8"><Cta /></div>
        <p className="mt-3 text-center text-sm opacity-80">Sem cadastro. Comece em 5 segundos.</p>
      </section>

      <section className="px-6 py-10">
        <h2 className="text-2xl font-black">Como funciona</h2>
        <div className="mt-5 grid gap-3">
          {[
            { icon: Zap, t: "Ganhe XP", d: "+10 por aula, +50 por quiz certo, +100 por simulador.", c: "text-primary-deep" },
            { icon: Flame, t: "Mantenha a ofensiva", d: "Volte todo dia e veja o foguinho crescer.", c: "text-streak" },
            { icon: Trophy, t: "Desbloqueie conquistas", d: "\"Mão de Vaca\", \"Sócio do Nubank\", \"Senhor dos Imóveis\"…", c: "text-gold" },
            { icon: Calculator, t: "Simule o futuro", d: "Juros compostos, renda fixa e independência financeira.", c: "text-brand" },
          ].map(({ icon: Icon, t, d, c }) => (
            <div key={t} className="flex gap-4 rounded-3xl bg-card p-4 shadow-card">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-muted"><Icon className={`h-7 w-7 ${c}`} /></div>
              <div><p className="text-lg font-extrabold">{t}</p><p className="text-muted-foreground">{d}</p></div>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 pb-10">
        <h2 className="text-2xl font-black">A jornada completa</h2>
        <p className="mt-1 text-muted-foreground">5 níveis, do zero ao avançado.</p>
        <ol className="mt-5 space-y-3">
          {LEVELS.map((l) => (
            <li key={l.id} className="flex items-center gap-4 rounded-3xl border-2 bg-card p-4">
              <span className="text-3xl">{l.emoji}</span>
              <div>
                <p className="text-sm font-bold text-muted-foreground">Nível {l.id}</p>
                <p className="text-lg font-extrabold">{l.name}</p>
                <p className="text-sm text-muted-foreground">{l.subtitle}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="px-6 pb-10">
        <h2 className="text-2xl font-black">Quem já está jogando</h2>
        <div className="mt-5 space-y-3">
          {[
            { n: "Juliana, 27, Recife", q: "Quitei o rotativo do cartão em 4 meses e hoje tenho minha reserva no Tesouro Selic." },
            { n: "Carlos, 34, BH", q: "Finalmente entendi o que é CDI. A ofensiva me fez estudar todo dia." },
          ].map((t) => (
            <figure key={t.n} className="rounded-3xl bg-brand-soft p-5">
              <blockquote className="text-lg font-semibold">“{t.q}”</blockquote>
              <figcaption className="mt-2 text-sm font-bold text-brand">{t.n}</figcaption>
            </figure>
          ))}
        </div>
        <p className="mt-2 text-xs text-muted-foreground">Depoimentos ilustrativos.</p>
      </section>

      <section className="px-6 pb-14">
        <div className="rounded-3xl bg-secondary p-6 text-center">
          <ShieldCheck className="mx-auto h-10 w-10 text-primary-deep" />
          <p className="mt-2 text-xl font-black">Educação, não recomendação.</p>
          <p className="mt-1 text-muted-foreground">Conteúdo independente, sem vender produto de banco.</p>
          <div className="mt-6"><Cta>Quero começar agora</Cta></div>
        </div>
      </section>
    </div>
  );
}
