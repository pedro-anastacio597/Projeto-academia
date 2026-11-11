import { daysUntil } from "@/components/PlanStatus";
import { historyOf, weekStart, type AppState, type HistoryEntry, type User } from "./store";

/** Dias sem treinar a partir dos quais o aluno aparece como "sem treinar". */
export const INACTIVE_DAYS = 7;
/** Faltando esse número de dias (ou menos) o plano é considerado "vencendo". */
export const EXPIRING_DAYS = 10;

export type StudentStatus = "ativo" | "vencendo" | "vencido" | "cancelado";

export const STATUS_LABEL: Record<StudentStatus, string> = {
  ativo: "Ativo",
  vencendo: "Vencendo",
  vencido: "Vencido",
  cancelado: "Cancelado",
};

export function studentStatus(u: User, now = new Date()): StudentStatus {
  if (u.planStatus === "cancelado") return "cancelado";
  const left = daysUntil(u.planEnd, now);
  if (left < 0) return "vencido";
  if (left <= EXPIRING_DAYS) return "vencendo";
  return "ativo";
}

export type StudentRow = {
  user: User;
  status: StudentStatus;
  /** Dias até o vencimento (negativo se já venceu). */
  daysLeft: number;
  /** Treinos do aluno, do mais recente para o mais antigo. */
  history: HistoryEntry[];
  last: HistoryEntry | null;
  /** Dias desde o último treino (null = nunca treinou). */
  daysSince: number | null;
  /** Treinos concluídos nesta semana. */
  week: number;
  /** Treinos concluídos nos últimos 30 dias. */
  month: number;
  /** Plano em dia, mas sem treinar há INACTIVE_DAYS dias ou mais. */
  inactive: boolean;
};

function daysBetween(iso: string, now: Date) {
  const a = new Date(iso);
  a.setHours(0, 0, 0, 0);
  const b = new Date(now);
  b.setHours(0, 0, 0, 0);
  return Math.round((b.getTime() - a.getTime()) / 86400000);
}

/** Um resumo por aluno (o professor não entra na lista). */
export function buildRows(s: AppState, now = new Date()): StudentRow[] {
  const ws = weekStart(now).getTime();
  return s.users
    .filter((u) => u.role !== "professor")
    .map((user) => {
      const history = historyOf(s, user.email).sort((a, b) => b.date.localeCompare(a.date));
      const last = history[0] ?? null;
      const daysSince = last ? Math.max(0, daysBetween(last.date, now)) : null;
      const status = studentStatus(user, now);
      return {
        user,
        status,
        daysLeft: daysUntil(user.planEnd, now),
        history,
        last,
        daysSince,
        week: history.filter((h) => {
          const t = new Date(h.date).getTime();
          return t >= ws && t < ws + 7 * 86400000;
        }).length,
        month: history.filter((h) => daysBetween(h.date, now) <= 30).length,
        inactive: (status === "ativo" || status === "vencendo") && (daysSince === null || daysSince >= INACTIVE_DAYS),
      };
    });
}

export function lastWorkoutText(daysSince: number | null) {
  if (daysSince === null) return "Ainda não treinou";
  if (daysSince === 0) return "Treinou hoje";
  if (daysSince === 1) return "Treinou ontem";
  return `Último treino há ${daysSince} dias`;
}

export function dueText(daysLeft: number) {
  if (daysLeft < 0) return `Venceu há ${Math.abs(daysLeft)} ${Math.abs(daysLeft) === 1 ? "dia" : "dias"}`;
  if (daysLeft === 0) return "Vence hoje";
  return `Vence em ${daysLeft} ${daysLeft === 1 ? "dia" : "dias"}`;
}
