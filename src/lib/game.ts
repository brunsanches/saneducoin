import { useSyncExternalStore } from "react";
import { LESSONS, LEVELS } from "@/data/lessons";

export const XP = { read: 10, quiz: 50, simulator: 100 } as const;

export type GameState = {
  xp: number;
  read: string[];
  completed: string[];
  simulators: string[];
  streak: number;
  bestStreak: number;
  lastVisit: string | null;
};

const KEY = "edufin-game-v1";
const DEFAULT: GameState = { xp: 0, read: [], completed: [], simulators: [], streak: 0, bestStreak: 0, lastVisit: null };

let state: GameState = DEFAULT;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) state = { ...DEFAULT, ...JSON.parse(raw) };
  } catch {
    /* ignore */
  }
}

function set(next: GameState) {
  state = next;
  localStorage.setItem(KEY, JSON.stringify(state));
  listeners.forEach((l) => l());
}

function today(offset = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toLocaleDateString("sv-SE");
}

export const game = {
  touchStreak() {
    load();
    const t = today();
    if (state.lastVisit === t) return;
    const streak = state.lastVisit === today(-1) ? state.streak + 1 : 1;
    set({ ...state, streak, bestStreak: Math.max(streak, state.bestStreak), lastVisit: t });
  },
  markRead(id: string) {
    load();
    if (state.read.includes(id)) return 0;
    set({ ...state, read: [...state.read, id], xp: state.xp + XP.read });
    return XP.read;
  },
  completeQuiz(id: string) {
    load();
    if (state.completed.includes(id)) return 0;
    set({ ...state, completed: [...state.completed, id], xp: state.xp + XP.quiz });
    return XP.quiz;
  },
  rewardSimulator(id: string) {
    load();
    if (state.simulators.includes(id)) return 0;
    set({ ...state, simulators: [...state.simulators, id], xp: state.xp + XP.simulator });
    return XP.simulator;
  },
  reset() {
    set({ ...DEFAULT });
  },
};

function subscribe(cb: () => void) {
  load();
  listeners.add(cb);
  if (loaded) cb();
  return () => listeners.delete(cb);
}

export function useGame() {
  return useSyncExternalStore(subscribe, () => state, () => DEFAULT);
}

export function isUnlocked(s: GameState, lessonId: string) {
  const i = LESSONS.findIndex((l) => l.id === lessonId);
  return i <= 0 || s.completed.includes(LESSONS[i - 1]!.id);
}

export function nextLesson(s: GameState) {
  return LESSONS.find((l) => !s.completed.includes(l.id)) ?? null;
}

export function currentLevel(s: GameState) {
  const n = nextLesson(s);
  return LEVELS.find((l) => l.id === (n ? n.level : 5))!;
}

export function levelProgress(s: GameState) {
  const lvl = currentLevel(s);
  const ls = LESSONS.filter((l) => l.level === lvl.id);
  const done = ls.filter((l) => s.completed.includes(l.id)).length;
  return { done, total: ls.length, pct: Math.round((done / ls.length) * 100) };
}

export type Badge = { id: string; name: string; desc: string; emoji: string; earned: (s: GameState) => boolean };

export const BADGES: Badge[] = [
  { id: "primeira", name: "Primeiro Passo", desc: "Concluiu a primeira aula", emoji: "👣", earned: (s) => s.completed.length >= 1 },
  { id: "mao-de-vaca", name: "Mão de Vaca Nível 1", desc: "Aprendeu a montar o orçamento 50/30/20", emoji: "🐄", earned: (s) => s.completed.includes("orcamento") },
  { id: "livre", name: "Nome Limpo", desc: "Completou o Nível 1: Sobrevivência", emoji: "🧼", earned: (s) => lvlDone(s, 1) },
  { id: "cofrinho", name: "Cofrinho Blindado", desc: "Aprendeu sobre reserva de emergência", emoji: "🛡️", earned: (s) => s.completed.includes("reserva") },
  { id: "nubank", name: "Sócio do Nubank", desc: "Estudou seu primeiro CDB", emoji: "💜", earned: (s) => s.completed.includes("cdb") },
  { id: "imoveis", name: "Senhor dos Imóveis", desc: "Estudou seu primeiro FII", emoji: "🏢", earned: (s) => s.completed.includes("fiis") },
  { id: "ofensiva", name: "Em Chamas", desc: "3 dias seguidos de ofensiva", emoji: "🔥", earned: (s) => s.bestStreak >= 3 },
  { id: "simulador", name: "Simulador Nato", desc: "Usou os 3 simuladores", emoji: "🧮", earned: (s) => s.simulators.length >= 3 },
  { id: "mil", name: "Milionário de XP", desc: "Juntou 1.000 XP", emoji: "💰", earned: (s) => s.xp >= 1000 },
  { id: "mestre", name: "Mestre do Capital", desc: "Completou toda a trilha", emoji: "👑", earned: (s) => s.completed.length === LESSONS.length },
];

function lvlDone(s: GameState, lvl: number) {
  return LESSONS.filter((l) => l.level === lvl).every((l) => s.completed.includes(l.id));
}

export const brl = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
