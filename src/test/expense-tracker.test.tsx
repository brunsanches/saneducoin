import { fireEvent, render, screen, cleanup } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ExpenseTracker } from "@/components/ExpenseTracker";

vi.mock("recharts", () => ({ ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>, PieChart: () => <div />, Pie: () => null, Cell: () => null, Tooltip: () => null }));
afterEach(cleanup);
describe("Expense tracker", () => {
  it("updates the total, budget and category after adding a gasto", () => {
    render(<ExpenseTracker />);
    expect(screen.getByTestId("expense-total").textContent).toContain("850,00");
    fireEvent.change(screen.getByLabelText("Valor (R$)"), { target: { value: "50,50" } });
    fireEvent.click(screen.getByRole("button", { name: "Lazer" }));
    fireEvent.change(screen.getByLabelText("Descrição"), { target: { value: "Cinema" } });
    fireEvent.click(screen.getByRole("button", { name: "Adicionar gasto" }));
    expect(screen.getByTestId("expense-total").textContent).toContain("900,50");
    expect(screen.getByText("Cinema")).toBeTruthy();
    expect(screen.getByRole("progressbar").getAttribute("aria-valuenow")).toBe("60");
    fireEvent.change(screen.getByLabelText("Limite do mês (R$)"), { target: { value: "800" } });
    expect(screen.getByText(/acima do limite/)).toBeTruthy();
  });
  it("rejects invalid values and accepts the challenge", () => {
    render(<ExpenseTracker />);
    fireEvent.click(screen.getByRole("button", { name: "Adicionar gasto" }));
    expect(screen.getByRole("alert")).toBeTruthy();
    expect(screen.getByTestId("expense-total").textContent).toContain("850,00");
    fireEvent.click(screen.getByRole("button", { name: "Aceitar Desafio" }));
    expect(screen.getByRole("button", { name: "Desafio aceito" }).hasAttribute("disabled")).toBe(true);
  });
  it("resets the month total after confirming", () => {
    render(<ExpenseTracker />);
    fireEvent.click(screen.getByRole("button", { name: "Zerar gasto do mês" }));
    expect(screen.getByText("Isso apaga todos os gastos do mês.")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Cancelar" }));
    expect(screen.getByTestId("expense-total").textContent).toContain("850,00");
    fireEvent.click(screen.getByRole("button", { name: "Zerar gasto do mês" }));
    fireEvent.click(screen.getByRole("button", { name: "Zerar tudo" }));
    expect(screen.getByTestId("expense-total").textContent).toContain("0,00");
    expect(screen.getByRole("progressbar").getAttribute("aria-valuenow")).toBe("0");
    expect(screen.getByText("Nenhum gasto registrado. Use o formulário acima para começar de novo.")).toBeTruthy();
    expect(screen.getByText("Mês zerado. O gasto total voltou para R$ 0,00.")).toBeTruthy();
  });
});