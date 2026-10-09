import { useState, type FormEvent } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Bike, Check, Clapperboard, Plus, RotateCcw, Sparkles, Utensils, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const CATEGORIES = [
  { name: "Alimentação", icon: Utensils, color: "var(--chart-1)", dot: "bg-chart-1" },
  { name: "Transporte", icon: Bike, color: "var(--chart-2)", dot: "bg-chart-2" },
  { name: "Lazer", icon: Clapperboard, color: "var(--chart-3)", dot: "bg-chart-3" },
  { name: "Outros", icon: Wallet, color: "var(--chart-4)", dot: "bg-chart-4" },
] as const;
type Category = typeof CATEGORIES[number]["name"];
type Expense = { id: number; value: number; category: Category; description: string };
const INITIAL_EXPENSES: Expense[] = [
  { id: 1, value: 350, category: "Alimentação", description: "Mercado" },
  { id: 2, value: 200, category: "Alimentação", description: "Delivery" },
  { id: 3, value: 180, category: "Transporte", description: "Ônibus e aplicativos" },
  { id: 4, value: 120, category: "Lazer", description: "Cinema e passeios" },
];
const brl = (value: number) => value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export function ExpenseTracker() {
  const [expenses, setExpenses] = useState(INITIAL_EXPENSES);
  const [limit, setLimit] = useState("1500");
  const [value, setValue] = useState("");
  const [category, setCategory] = useState<Category>("Alimentação");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [accepted, setAccepted] = useState(false);
  const total = expenses.reduce((sum, expense) => sum + expense.value, 0);
  const budget = Number(limit.replace(",", "."));
  const validBudget = Number.isFinite(budget) && budget > 0;
  const percentage = validBudget ? total / budget * 100 : 0;
  const tone = percentage > 100 ? "bg-budget-exceeded" : percentage >= 80 ? "bg-budget-warning" : "bg-budget-safe";
  const chartData = CATEGORIES.map((item) => ({ ...item, value: expenses.filter((expense) => expense.category === item.name).reduce((sum, expense) => sum + expense.value, 0) }));

  function addExpense(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const amount = Number(value.trim().replace(",", "."));
    if (!Number.isFinite(amount) || amount <= 0 || amount > 100000000) {
      setError("Informe um valor maior que zero e até R$ 100.000.000.");
      return;
    }
    if (!description.trim()) {
      setError("Escreva uma descrição para o gasto.");
      return;
    }
    const rounded = Math.round(amount * 100) / 100;
    if (rounded <= 0) {
      setError("O valor mínimo é R$ 0,01.");
      return;
    }
    setExpenses((previous) => [...previous, { id: Date.now(), value: rounded, category, description: description.trim() }]);
    setValue("");
    setDescription("");
    setError("");
    setNotice(`Gasto de ${brl(rounded)} adicionado.`);
  }

  return (
    <div className="mx-auto max-w-md space-y-6">
      <section aria-label="Resumo do mês" className="rounded-xl bg-card p-5 shadow-sm">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
          <h2 className="min-w-0 font-bold text-muted-foreground">Gasto Total do Mês</h2>
          <Wallet className="h-6 w-6 shrink-0 text-primary-deep" />
        </div>
        <p data-testid="expense-total" className="mt-2 break-words text-3xl font-black">{brl(total)}</p>
        <div className="mt-4 h-3 overflow-hidden rounded-full bg-muted" role="progressbar" aria-label="Limite mensal utilizado" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.min(100, Math.round(percentage))} aria-valuetext={validBudget ? `${Math.round(percentage)}% do limite utilizado` : "Defina um limite mensal"}>
          <svg className="h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 1" aria-hidden="true"><rect width={Math.min(100, percentage)} height="1" className={`${tone} fill-current ${percentage > 100 ? "text-budget-exceeded" : percentage >= 80 ? "text-budget-warning" : "text-budget-safe"}`} /></svg>
        </div>
        <p className="mt-2 text-sm font-bold text-muted-foreground" aria-live="polite">{validBudget ? percentage > 100 ? `${brl(total - budget)} acima do limite` : `${brl(budget - total)} disponíveis • ${Math.round(percentage)}% utilizado` : "Informe um limite maior que zero."}</p>
        <label htmlFor="monthly-limit" className="mt-4 block text-sm font-bold">Limite do mês (R$)</label>
        <Input id="monthly-limit" inputMode="decimal" value={limit} onChange={(event) => setLimit(event.target.value)} className="mt-1 h-12 text-base" />
      </section>

      <section aria-labelledby="category-title">
        <h2 id="category-title" className="text-xl font-extrabold">Para onde vai seu dinheiro?</h2>
        <div className="relative mt-3 h-56" aria-label="Gráfico de gastos por categoria">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart><Pie data={chartData.filter((item) => item.value > 0)} dataKey="value" nameKey="name" innerRadius={72} outerRadius={100} paddingAngle={4} stroke="var(--background)" isAnimationActive={false}>{chartData.filter((item) => item.value > 0).map((item) => <Cell key={item.name} fill={item.color} />)}</Pie><Tooltip formatter={(amount) => brl(Number(amount))} /></PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center"><span className="text-2xl font-black">{expenses.length}</span><span className="text-sm text-muted-foreground">gastos no mês</span></div>
        </div>
        <ul className="mt-2 space-y-3">{chartData.map(({ name, value: amount, icon: Icon, dot }) => <li key={name} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2"><div className="flex min-w-0 items-center gap-2"><span className={`h-2.5 w-2.5 shrink-0 rounded-full ${dot}`} /><Icon className="h-4 w-4 shrink-0 text-muted-foreground" /><span className="truncate font-bold">{name}</span></div><span className="text-sm font-bold">{brl(amount)} <span className="text-muted-foreground">({Math.round(amount / total * 100)}%)</span></span></li>)}</ul>
      </section>

      <form onSubmit={addExpense} className="space-y-4 rounded-xl bg-card p-5 shadow-sm" noValidate>
        <h2 className="flex items-center gap-2 text-xl font-extrabold"><Plus className="h-5 w-5 text-primary-deep" />Adicionar Novo Gasto</h2>
        <div><label htmlFor="expense-value" className="font-bold">Valor (R$)</label><Input id="expense-value" inputMode="decimal" placeholder="0,00" value={value} onChange={(event) => setValue(event.target.value)} className="mt-1 h-12 text-base" aria-describedby={error ? "expense-error" : undefined} /></div>
        <fieldset><legend className="mb-2 font-bold">Categoria</legend><div className="grid grid-cols-2 gap-2">{CATEGORIES.map(({ name, icon: Icon }) => <Button key={name} type="button" variant={category === name ? "secondary" : "outline"} aria-pressed={category === name} onClick={() => setCategory(name)} className="h-12 px-2 text-sm font-bold"><Icon />{name}</Button>)}</div></fieldset>
        <div><label htmlFor="expense-description" className="font-bold">Descrição</label><Input id="expense-description" placeholder="Ex.: almoço de hoje" maxLength={100} value={description} onChange={(event) => setDescription(event.target.value)} className="mt-1 h-12 text-base" /></div>
        {error && <p id="expense-error" role="alert" className="text-sm font-bold text-destructive">{error}</p>}
        <Button type="submit" className="h-14 w-full text-base font-extrabold"><Plus />Adicionar gasto</Button>
        <p role="status" className="text-sm font-bold text-primary-deep">{notice}</p>
      </form>

      <section className="border-l-4 border-brand bg-brand-soft p-5">
        <h2 className="flex items-center gap-2 text-lg font-extrabold text-accent-foreground"><Sparkles className="h-5 w-5 shrink-0" />Insights Inteligentes</h2>
        <p className="mt-3 leading-relaxed">💡 Dica: Você gasta R$ 50 de delivery toda sexta. Se reduzir para 1 vez a cada 15 dias, você economiza R$ 1.200 no ano. Quer ver quanto isso rende investido?</p>
        <Button variant="outline" className="mt-4 h-14 w-full font-extrabold" onClick={() => setAccepted(true)} disabled={accepted}>{accepted ? <Check /> : <Sparkles />}{accepted ? "Desafio aceito" : "Aceitar Desafio"}</Button>
        {accepted && <p role="status" className="mt-3 text-sm font-bold text-accent-foreground">Seu desafio: pedir delivery apenas uma vez a cada 15 dias.</p>}
      </section>
      <section aria-label="Gastos registrados"><h2 className="text-xl font-extrabold">Gastos do mês</h2><ul className="mt-3 divide-y">{[...expenses].reverse().map((expense) => <li key={expense.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 py-3"><div className="min-w-0"><p className="break-words font-bold">{expense.description}</p><p className="text-sm text-muted-foreground">{expense.category}</p></div><span className="font-extrabold">{brl(expense.value)}</span></li>)}</ul></section>
    </div>
  );
}