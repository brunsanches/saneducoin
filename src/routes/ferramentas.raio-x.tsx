import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { ExpenseTracker } from "@/components/ExpenseTracker";

export const Route = createFileRoute("/ferramentas/raio-x")({
  head: () => ({ meta: [
    { title: "Raio X Financeiro: Educoin" },
    { name: "description", content: "Organize seus gastos em reais, acompanhe o limite mensal e descubra suas categorias de despesas." },
    { property: "og:title", content: "Raio X Financeiro: Educoin" },
    { property: "og:description", content: "Acompanhe seu orçamento e aceite um desafio para economizar com o Educoin." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: ExpensePage,
});

function ExpensePage() {
  return <AppShell><Link to="/ferramentas" className="mb-4 inline-flex items-center gap-1 font-bold text-muted-foreground"><ArrowLeft className="h-5 w-5" />Ferramentas</Link><h1 className="text-2xl font-black">Raio X Financeiro</h1><p className="mb-5 mt-1 text-sm text-muted-foreground">Dados de exemplo • Outubro</p><ExpenseTracker /></AppShell>;
}