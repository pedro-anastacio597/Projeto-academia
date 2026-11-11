import { useSyncExternalStore } from "react";
<<<<<<< HEAD
import { WEEK_SCHEDULE, type PlanId } from "./gym-data";
=======
import type { PlanId } from "./gym-data";
>>>>>>> 9e0916ba01f5f41dd129bef358dff57b51ae646d

/**
 * Prototype-only local store (persists in the browser via localStorage).
 * No real authentication or backend: swap for Lovable Cloud to go live.
 */

<<<<<<< HEAD
export type Role = "aluno" | "professor";

/** Exercício de um treino personalizado pelo professor (o resto vem do catálogo, pelo exId). */
export type CustomExercise = {
  exId: string;
  sets: number;
  reps: string;
  /** Carga por série em kg; vazio = peso corporal. */
  weights: number[];
  restSec: number;
};

export type User = {
  /** Ausente = aluno (contas antigas salvas no navegador). */
  role?: Role;
  /** Treino de cada dia da semana (índice 0 = domingo; null = descanso). Ausente = agenda padrão. */
  schedule?: (string | null)[];
  /** Treinos que o professor personalizou para este aluno (id do treino -> exercícios). */
  customWorkouts?: Record<string, CustomExercise[]>;
=======
export type User = {
>>>>>>> 9e0916ba01f5f41dd129bef358dff57b51ae646d
  name: string;
  email: string;
  password: string;
  plan: PlanId;
  planStart: string; // YYYY-MM-DD
  planEnd: string; // YYYY-MM-DD
  planStatus: "ativo" | "cancelado";
};

export type HistoryEntry = {
  id: string;
<<<<<<< HEAD
  /** E-mail do aluno que fez o treino (ausente em registros antigos). */
  email?: string;
=======
>>>>>>> 9e0916ba01f5f41dd129bef358dff57b51ae646d
  workoutId: string;
  date: string; // ISO datetime
  durationSec: number;
  done: number;
  total: number;
  volumeKg: number;
};

export type AppState = {
  ready: boolean;
  users: User[];
  currentEmail: string | null;
  history: HistoryEntry[];
  likes: string[];
};

const KEY = "forja-app-v1";

export const toYmd = (d: Date) => d.toISOString().slice(0, 10);
export function addMonths(ymd: string, months: number) {
  const d = new Date(ymd + "T00:00:00Z");
  d.setUTCMonth(d.getUTCMonth() + months);
  return toYmd(d);
}

function seed(): AppState {
  const now = new Date();
  const start = new Date(now);
  start.setDate(start.getDate() - 20);
  const startYmd = toYmd(start);
  const daysAgo = (n: number, h = 7) => {
    const d = new Date(now);
    d.setDate(d.getDate() - n);
    d.setHours(h, 15, 0, 0);
    return d.toISOString();
  };
<<<<<<< HEAD
  const ymd = (offset: number) => {
    const d = new Date(now);
    d.setDate(d.getDate() + offset);
    return toYmd(d);
  };
  const person = (name: string, email: string, plan: PlanId, startOffset: number, endYmd: string, planStatus: User["planStatus"] = "ativo"): User => ({
    name,
    email,
    password: "123456",
    plan,
    planStart: ymd(startOffset),
    planEnd: endYmd,
    planStatus,
  });
  // [dias atrás, treino, minutos, volume em kg]
  const sessions = (email: string, rows: [number, string, number, number][]): HistoryEntry[] =>
    rows.map(([d, w, min, vol], i) => ({
      id: `seed-${email}-${i}`,
      email,
      workoutId: w,
      date: daysAgo(d),
      durationSec: min * 60,
      done: 4,
      total: 4,
      volumeKg: vol,
    }));

  return {
    ready: true,
    users: [
      { ...person("Maria Nogueira", "maria@forja.com", "trimestral", -20, addMonths(startYmd, 3)) },
      { ...person("Tibério Costa", "prof@forja.com", "anual", -200, ymd(165)), role: "professor" },
      person("Lucas Andrade", "lucas@forja.com", "mensal", -25, ymd(5)),
      person("Ana Beatriz", "ana@forja.com", "anual", -120, ymd(245)),
      person("Bruno Teixeira", "bruno@forja.com", "mensal", -40, ymd(-10)),
      person("Carla Mendes", "carla@forja.com", "trimestral", -50, ymd(40), "cancelado"),
      person("Diego Lima", "diego@forja.com", "trimestral", -30, ymd(60)),
    ],
    currentEmail: null,
    history: [
      ...sessions("maria@forja.com", [
        [1, "b", 52, 4180],
        [2, "a", 61, 9620],
        [5, "e", 38, 0],
        [6, "d", 47, 2860],
      ]),
      ...sessions("lucas@forja.com", [[1, "a", 55, 8200], [3, "b", 48, 3900], [4, "c", 50, 5100]]),
      ...sessions("ana@forja.com", [[0, "d", 58, 3100], [1, "a", 64, 10400], [2, "b", 50, 4300], [4, "c", 45, 4800], [5, "a", 60, 9900], [7, "e", 35, 0], [9, "b", 52, 4500]]),
      ...sessions("bruno@forja.com", [[14, "a", 50, 7600], [16, "b", 44, 3600]]),
      ...sessions("carla@forja.com", [[21, "e", 40, 0]]),
      ...sessions("diego@forja.com", [[12, "a", 57, 8800], [14, "d", 49, 2900], [19, "b", 46, 3700]]),
=======
  return {
    ready: true,
    users: [
      {
        name: "Maria Nogueira",
        email: "maria@forja.com",
        password: "123456",
        plan: "trimestral",
        planStart: startYmd,
        planEnd: addMonths(startYmd, 3),
        planStatus: "ativo",
      },
    ],
    currentEmail: null,
    history: [
      { id: "h1", workoutId: "b", date: daysAgo(1), durationSec: 52 * 60, done: 3, total: 3, volumeKg: 4180 },
      { id: "h2", workoutId: "a", date: daysAgo(2), durationSec: 61 * 60, done: 4, total: 4, volumeKg: 9620 },
      { id: "h3", workoutId: "e", date: daysAgo(5), durationSec: 38 * 60, done: 3, total: 3, volumeKg: 0 },
      { id: "h4", workoutId: "d", date: daysAgo(6), durationSec: 47 * 60, done: 4, total: 4, volumeKg: 2860 },
>>>>>>> 9e0916ba01f5f41dd129bef358dff57b51ae646d
    ],
    likes: [],
  };
}

const SERVER_STATE: AppState = { ready: false, users: [], currentEmail: null, history: [], likes: [] };

let state: AppState | null = null;
const listeners = new Set<() => void>();

<<<<<<< HEAD
/**
 * Contas salvas por versões antigas do protótipo: adiciona a conta do professor e os alunos de
 * demonstração que ainda não existem e associa treinos antigos (sem e-mail) à conta de demonstração.
 */
function migrate(s: AppState): AppState {
  const base = seed();
  const have = new Set(s.users.map((u) => u.email.toLowerCase()));
  const added = base.users.filter((u) => !have.has(u.email.toLowerCase()));
  const addedEmails = new Set(added.map((u) => u.email));
  const history = s.history.map((h) => (h.email ? h : { ...h, email: "maria@forja.com" }));
  const extra = base.history.filter((h) => h.email && addedEmails.has(h.email));
  return { ...s, users: [...s.users, ...added], history: [...history, ...extra] };
}

=======
>>>>>>> 9e0916ba01f5f41dd129bef358dff57b51ae646d
function load(): AppState {
  if (state) return state;
  try {
    const raw = window.localStorage.getItem(KEY);
<<<<<<< HEAD
    state = raw ? migrate({ ...seed(), ...JSON.parse(raw), ready: true }) : seed();
=======
    state = raw ? { ...seed(), ...JSON.parse(raw), ready: true } : seed();
>>>>>>> 9e0916ba01f5f41dd129bef358dff57b51ae646d
  } catch {
    state = seed();
  }
  return state!;
}

function update(fn: (s: AppState) => AppState) {
  state = { ...fn(load()), ready: true };
  try {
    const { ready: _r, ...persist } = state;
    window.localStorage.setItem(KEY, JSON.stringify(persist));
  } catch {
    /* ignore quota errors in prototype */
  }
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

export function useAppState() {
  return useSyncExternalStore(subscribe, load, () => SERVER_STATE);
}

export function currentUser(s: AppState) {
  return s.users.find((u) => u.email === s.currentEmail) ?? null;
}

<<<<<<< HEAD
/** Estado atual sem hook (útil logo depois de uma ação, ex.: após o login). */
export const getSnapshot = () => load();

export const isTrainer = (u: User | null) => u?.role === "professor";

/** Tela inicial de cada perfil. */
export const homePath = (u: User | null): "/professor" | "/inicio" => (isTrainer(u) ? "/professor" : "/inicio");

/** Agenda semanal do aluno: a definida pelo professor ou a padrão da academia. */
export const scheduleOf = (u: User): (string | null)[] => u.schedule ?? WEEK_SCHEDULE;

/** Treinos concluídos por um aluno específico. */
export const historyOf = (s: AppState, email: string) => s.history.filter((h) => h.email === email);

=======
>>>>>>> 9e0916ba01f5f41dd129bef358dff57b51ae646d
export function useCurrentUser() {
  return currentUser(useAppState());
}

export const actions = {
  login(email: string, password: string): string | null {
    const s = load();
    const u = s.users.find((x) => x.email.toLowerCase() === email.trim().toLowerCase());
    if (!u || u.password !== password) return "E-mail ou senha incorretos.";
    update((st) => ({ ...st, currentEmail: u.email }));
    return null;
  },
  register(data: { name: string; email: string; password: string; plan: PlanId; months: number }): string | null {
    const s = load();
    const email = data.email.trim().toLowerCase();
    if (s.users.some((u) => u.email.toLowerCase() === email)) return "Este e-mail já está cadastrado.";
    const today = toYmd(new Date());
    const user: User = {
      name: data.name.trim(),
      email,
      password: data.password,
      plan: data.plan,
      planStart: today,
      planEnd: addMonths(today, data.months),
      planStatus: "ativo",
    };
    update((st) => ({ ...st, users: [...st.users, user], currentEmail: email }));
    return null;
  },
  logout() {
    update((st) => ({ ...st, currentEmail: null }));
  },
  addHistory(entry: Omit<HistoryEntry, "id">) {
<<<<<<< HEAD
    update((st) => ({
      ...st,
      history: [{ ...entry, id: crypto.randomUUID(), email: st.currentEmail ?? entry.email }, ...st.history],
    }));
=======
    update((st) => ({ ...st, history: [{ ...entry, id: crypto.randomUUID() }, ...st.history] }));
>>>>>>> 9e0916ba01f5f41dd129bef358dff57b51ae646d
  },
  toggleLike(postId: string) {
    update((st) => ({
      ...st,
      likes: st.likes.includes(postId) ? st.likes.filter((x) => x !== postId) : [...st.likes, postId],
    }));
  },
<<<<<<< HEAD
  /** Usado pelo professor para alterar dados de um aluno (ex.: a agenda de treinos). */
  updateStudent(email: string, patch: Partial<User>) {
    update((st) => ({
      ...st,
      users: st.users.map((u) => (u.email === email ? { ...u, ...patch } : u)),
    }));
  },
=======
>>>>>>> 9e0916ba01f5f41dd129bef358dff57b51ae646d
  updateUser(patch: Partial<User>) {
    update((st) => ({
      ...st,
      users: st.users.map((u) => (u.email === st.currentEmail ? { ...u, ...patch } : u)),
    }));
  },
};

/** Start of the current week (Sunday 00:00, local time). */
export function weekStart(d = new Date()) {
  const s = new Date(d);
  s.setHours(0, 0, 0, 0);
  s.setDate(s.getDate() - s.getDay());
  return s;
}

/** Day indexes (0-6) of the current week with at least one finished workout. */
export function trainedDaysThisWeek(history: HistoryEntry[], now = new Date()) {
  const start = weekStart(now).getTime();
  const end = start + 7 * 86400000;
  const days = new Set<number>();
  for (const h of history) {
    const t = new Date(h.date).getTime();
    if (t >= start && t < end) days.add(new Date(h.date).getDay());
  }
  return days;
}

/** Consecutive days (ending today or yesterday) with a finished workout. */
export function streak(history: HistoryEntry[], now = new Date()) {
  const days = new Set(history.map((h) => new Date(h.date).toDateString()));
  const d = new Date(now);
  if (!days.has(d.toDateString())) d.setDate(d.getDate() - 1);
  let n = 0;
  while (days.has(d.toDateString())) {
    n++;
    d.setDate(d.getDate() - 1);
  }
  return n;
}

export const initials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]!.toUpperCase())
    .join("");
