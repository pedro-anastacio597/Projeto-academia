import { useSyncExternalStore } from "react";
import type { PlanId } from "./gym-data";

/**
 * Prototype-only local store (persists in the browser via localStorage).
 * No real authentication or backend: swap for Lovable Cloud to go live.
 */

export type User = {
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
    ],
    likes: [],
  };
}

const SERVER_STATE: AppState = { ready: false, users: [], currentEmail: null, history: [], likes: [] };

let state: AppState | null = null;
const listeners = new Set<() => void>();

function load(): AppState {
  if (state) return state;
  try {
    const raw = window.localStorage.getItem(KEY);
    state = raw ? { ...seed(), ...JSON.parse(raw), ready: true } : seed();
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
    update((st) => ({ ...st, history: [{ ...entry, id: crypto.randomUUID() }, ...st.history] }));
  },
  toggleLike(postId: string) {
    update((st) => ({
      ...st,
      likes: st.likes.includes(postId) ? st.likes.filter((x) => x !== postId) : [...st.likes, postId],
    }));
  },
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
