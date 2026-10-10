import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { CommunityChallenges } from "@/components/CommunityChallenges";

afterEach(cleanup);
describe("Community and challenges", () => {
  it("publishes a post and toggles its like", () => {
    render(<CommunityChallenges />);
    expect(screen.getByRole("button", { name: "Publicar" })).toBeDisabled();
    fireEvent.change(screen.getByLabelText("O que você quer aprender ou compartilhar hoje?"), { target: { value: "Minha primeira economia!" } });
    fireEvent.click(screen.getByRole("button", { name: "Publicar" }));
    expect(screen.getByText("Minha primeira economia!")).toBeInTheDocument();
    const like = screen.getByRole("button", { name: "Curtir publicação de Você" });
    fireEvent.click(like);
    expect(like).toHaveAttribute("aria-pressed", "true");
    expect(like).toHaveTextContent("1");
    fireEvent.click(like);
    expect(like).toHaveTextContent("0");
    expect(screen.getByLabelText("O que você quer aprender ou compartilhar hoje?")).toHaveValue("");
  });
  it("adds a comment and preserves posts across tabs", () => {
    render(<CommunityChallenges />);
    fireEvent.click(screen.getByRole("button", { name: "Comentar publicação de Mariana Costa" }));
    fireEvent.change(screen.getByLabelText("Seu comentário"), { target: { value: "Parabéns pela economia!" } });
    fireEvent.click(screen.getByRole("button", { name: "Enviar comentário" }));
    expect(screen.getByText("Parabéns pela economia!")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("tab", { name: "Meus Desafios" }));
    expect(screen.getAllByRole("progressbar").map(bar => bar.getAttribute("aria-valuenow"))).toEqual(["75", "55", "35"]);
    const first = screen.getAllByRole("listitem")[0];
    expect(first).toBeDefined();
    if (first) expect(within(first).getByText("Mariana")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("tab", { name: "Fórum Global" }));
    expect(screen.getByText("Parabéns pela economia!")).toBeInTheDocument();
  });
  it("validates and creates a challenge with named friends", () => {
    render(<CommunityChallenges />);
    fireEvent.click(screen.getByRole("tab", { name: "Meus Desafios" }));
    fireEvent.click(screen.getByRole("button", { name: "Criar Desafio com Amigos" }));
    fireEvent.click(screen.getByRole("button", { name: "Criar desafio" }));
    expect(screen.getByRole("alert")).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Nome do desafio"), { target: { value: "Reserva de emergência" } });
    fireEvent.change(screen.getByLabelText("Meta por pessoa (R$)"), { target: { value: "3000,50" } });
    fireEvent.change(screen.getByLabelText("Amigos (nomes separados por vírgula)"), { target: { value: "Ana, Bruno" } });
    fireEvent.click(screen.getByRole("button", { name: "Criar desafio" }));
    expect(screen.getByText("Reserva de emergência")).toBeInTheDocument();
    expect(screen.getByText("Ana")).toBeInTheDocument();
    expect(screen.getByText("Bruno")).toBeInTheDocument();
    expect(screen.getByText(/3.000,50/)).toBeInTheDocument();
    expect(screen.getAllByRole("progressbar").slice(0, 3).map(bar => bar.getAttribute("aria-valuenow"))).toEqual(["0", "0", "0"]);
  });
});