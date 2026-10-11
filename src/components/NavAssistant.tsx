import { useEffect, useRef, useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Bot, Send, X } from "lucide-react";

type Msg =
  | { id: number; from: "bot" | "user"; type: "text"; text: string }
  | { id: number; from: "bot"; type: "action"; label: string; to: string };

const INITIAL: Msg[] = [
  { id: 1, from: "bot", type: "text", text: "Olá! Como posso ajudar na sua jornada financeira hoje?" },
  { id: 2, from: "user", type: "text", text: "Quero ver qual rende mais: Poupança ou Tesouro." },
  { id: 3, from: "bot", type: "text", text: "Excelente! Clique no botão abaixo para ir direto para lá:" },
  { id: 4, from: "bot", type: "action", label: "Ir para Comparador de Renda Fixa", to: "/ferramentas/comparador" },
];

export function NavAssistant() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>(INITIAL);
  const [text, setText] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, open]);

  function send(e: FormEvent) {
    e.preventDefault();
    const t = text.trim();
    if (!t) return;
    setMsgs((m) => [...m, { id: Date.now(), from: "user", type: "text", text: t }]);
    setText("");
  }

  return (
    <>
      <button
        type="button"
        aria-label={open ? "Fechar assistente" : "Abrir assistente EduIA"}
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-20 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-brand text-brand-foreground shadow-2xl transition active:scale-95 sm:bottom-24 sm:right-6"
      >
        {open ? <X className="h-7 w-7" /> : <Bot className="h-7 w-7" />}
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Assistente EduIA"
          className="fixed inset-0 z-50 m-4 flex flex-col overflow-hidden rounded-2xl border bg-card shadow-2xl sm:inset-auto sm:bottom-40 sm:right-6 sm:m-0 sm:h-[32rem] sm:w-full sm:max-w-sm"
        >
          <header className="flex items-center gap-3 border-b bg-brand px-4 py-3 text-brand-foreground">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-card text-brand">
              <Bot className="h-6 w-6" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-extrabold leading-tight">EduIA</p>
              <p className="flex items-center gap-1 text-xs opacity-90">
                <span className="h-2 w-2 rounded-full bg-primary" /> Online
              </p>
            </div>
            <button type="button" aria-label="Fechar" onClick={() => setOpen(false)} className="flex h-10 w-10 items-center justify-center rounded-full">
              <X className="h-6 w-6" />
            </button>
          </header>

          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {msgs.map((m) =>
              m.type === "action" ? (
                <Link
                  key={m.id}
                  to={m.to}
                  onClick={() => setOpen(false)}
                  className="flex max-w-[85%] items-center justify-between gap-2 rounded-2xl border-2 border-brand bg-brand-soft px-4 py-3 font-extrabold text-brand"
                >
                  {m.label} <ArrowRight className="h-5 w-5 shrink-0" />
                </Link>
              ) : (
                <div key={m.id} className={m.from === "user" ? "flex justify-end" : "flex"}>
                  <p
                    className={
                      m.from === "user"
                        ? "max-w-[85%] rounded-2xl rounded-br-sm bg-brand px-4 py-2 text-brand-foreground"
                        : "max-w-[85%] rounded-2xl rounded-bl-sm bg-muted px-4 py-2 text-foreground"
                    }
                  >
                    {m.text}
                  </p>
                </div>
              ),
            )}
            <div ref={endRef} />
          </div>

          <form onSubmit={send} className="flex gap-2 border-t p-3">
            <input
              autoFocus
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Escreva sua mensagem"
              aria-label="Mensagem"
              className="h-12 min-w-0 flex-1 rounded-xl border bg-background px-4 outline-none focus:border-brand"
            />
            <button type="submit" aria-label="Enviar" className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand text-brand-foreground">
              <Send className="h-5 w-5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
