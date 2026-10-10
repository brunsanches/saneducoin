import { Link } from "@tanstack/react-router";
import { Home, Map, Calculator, User, Flame, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, type ReactNode } from "react";
import { game, useGame, currentLevel } from "@/lib/game";

const NAV = [
  { to: "/app", label: "Home", icon: Home },
  { to: "/trilhas", label: "Trilhas", icon: Map },
  { to: "/ferramentas", label: "Ferramentas", icon: Calculator },
  { to: "/perfil", label: "Perfil", icon: User },
] as const;

export function AppShell({ children, header = true }: { children: ReactNode; header?: boolean }) {
  useEffect(() => game.touchStreak(), []);
  return (
    <div className="mx-auto flex min-h-screen max-w-[480px] flex-col bg-background">
      {header && <TopBar />}
      <main className="flex-1 px-4 pb-28 pt-4">{children}</main>
      <nav className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-[480px] border-t bg-card/95 backdrop-blur">
        <ul className="grid grid-cols-4">
          {NAV.map(({ to, label, icon: Icon }) => (
            <li key={to}>
              <Link
                to={to}
                className="flex h-16 flex-col items-center justify-center gap-1 text-xs font-bold text-muted-foreground"
                activeProps={{ className: "text-primary-deep" }}
              >
                <Icon className="h-6 w-6" />
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

export function TopBar() {
  const s = useGame();
  const lvl = currentLevel(s);
  return (
    <header className="sticky top-0 z-30 flex items-center gap-3 border-b bg-card/95 px-4 py-3 backdrop-blur">
      <Link to="/perfil" className="flex h-11 w-11 items-center justify-center rounded-full bg-brand text-xl text-brand-foreground">
        {lvl.emoji}
      </Link>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-bold text-muted-foreground">Nível {lvl.id}</p>
        <p className="truncate font-extrabold leading-tight">{lvl.name}</p>
      </div>
      <Button asChild variant="ghost" size="icon" className="h-10 w-10 shrink-0 text-brand">
        <Link to="/comunidade" aria-label="Comunidade e Desafios" title="Comunidade e Desafios"><Users className="size-5" /></Link>
      </Button>
      <div className="flex items-center gap-1 rounded-full bg-secondary px-2 py-1.5 font-extrabold text-secondary-foreground">
        ⚡ {s.xp}
      </div>
      <div className="flex items-center gap-1 rounded-full bg-muted px-2 py-1.5 font-extrabold text-streak">
        <Flame className="h-5 w-5 fill-current" /> {s.streak}
      </div>
    </header>
  );
}
