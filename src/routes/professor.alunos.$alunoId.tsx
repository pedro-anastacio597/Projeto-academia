import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarCheck, ChevronRight, Clock, Dumbbell, Flame } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AppShell } from "@/components/AppShell";
import { StatBox, StatusBadge } from "@/components/trainer";
import { WeekStrip } from "@/components/WeekStrip";
import { WEEK_NAMES, WORKOUTS, brl, fmtDate, getPlan, getWorkout } from "@/lib/gym-data";
import { actions, scheduleOf, streak, trainedDaysThisWeek, useAppState } from "@/lib/store";
import { buildRows, dueText, lastWorkoutText } from "@/lib/trainer";
import { formatClock, workoutFor } from "@/lib/workout";

export const Route = createFileRoute("/professor/alunos/$alunoId")({
  head: () => ({
    meta: [
      { title: "Ficha do aluno — FORJA Academia" },
      { name: "description", content: "Plano, frequência e histórico de treinos do aluno." },
    ],
  }),
  component: StudentDetail,
});

function StudentDetail() {
  const { alunoId } = Route.useParams();
  const s = useAppState();

  return (
    <AppShell title="Aluno" back>
      {() => {
        const row = buildRows(s).find((r) => r.user.email.toLowerCase() === alunoId.toLowerCase());
        if (!row) {
          return <p className="m-5 rounded-3xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">Aluno não encontrado.</p>;
        }
        const { user, history } = row;
        const plan = getPlan(user.plan);

        return (
          <div className="space-y-4 px-5 pb-10 pt-6">
            <div className="flex items-center gap-4 rounded-3xl border border-border bg-card bg-card-glow p-5">
              <Avatar name={user.name} className="h-16 w-16 text-2xl" />
              <div className="min-w-0">
                <p className="truncate text-lg font-bold">{user.name}</p>
                <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                <div className="mt-1.5">
                  <StatusBadge status={row.status} />
                </div>
              </div>
            </div>

            {row.inactive && (
              <p className="rounded-2xl border border-amber-500/40 bg-amber-500/10 p-4 text-sm text-amber-300">
                {row.daysSince === null ? "Este aluno ainda não registrou nenhum treino." : `Este aluno está há ${row.daysSince} dias sem treinar.`}
              </p>
            )}

            <div className="rounded-3xl border border-border bg-card p-5">
              <p className="font-display text-2xl tracking-wide">Plano</p>
              <div className="mt-3 space-y-2.5 text-sm">
                <Row label="Plano" value={plan.name} />
                <Row label="Início" value={fmtDate(user.planStart)} />
                <Row label="Vencimento" value={fmtDate(user.planEnd)} />
                <Row label="Situação" value={user.planStatus === "cancelado" ? "Cancelado pelo aluno" : dueText(row.daysLeft)} />
                <Row label="Valor mensal" value={brl(plan.monthly)} />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <StatBox icon={CalendarCheck} label="Esta semana" value={String(row.week)} />
              <StatBox icon={Dumbbell} label="Últimos 30 dias" value={String(row.month)} />
              <StatBox icon={Flame} label="Sequência" value={`${streak(history)}d`} />
            </div>

            <div className="rounded-3xl border border-border bg-card p-5">
              <p className="font-display text-2xl tracking-wide">Frequência da semana</p>
              <div className="mt-4">
                <WeekStrip today={new Date().getDay()} trained={trainedDaysThisWeek(history)} />
              </div>
              <p className="mt-4 text-xs text-muted-foreground">{lastWorkoutText(row.daysSince)}</p>
            </div>

            <div>
              <h3 className="font-display text-2xl tracking-wide">Treinos do aluno</h3>
              <p className="mb-3 text-xs text-muted-foreground">Toque em um treino para alterar os exercícios dele.</p>
              <div className="space-y-3">
                {WORKOUTS.map((w) => {
                  const mine = workoutFor(user, w.id) ?? w;
                  const custom = !!user.customWorkouts?.[w.id];
                  return (
                    <Link
                      key={w.id}
                      to="/professor/treino/$alunoId/$treinoId"
                      params={{ alunoId: user.email, treinoId: w.id }}
                      className="relative flex items-center gap-4 rounded-3xl border border-border bg-card p-3 pr-4 transition active:scale-[0.99] hover:border-primary/50"
                    >
                      {custom && (
                        <span className="absolute -top-2 right-4 rounded-full bg-primary px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider">Personalizado</span>
                      )}
                      <img src={w.cover} alt={w.name} loading="lazy" width={816} height={816} className="h-16 w-16 shrink-0 rounded-2xl object-cover" />
                      <div className="min-w-0 flex-1">
                        <p className="font-display text-2xl leading-none tracking-wide">{w.name}</p>
                        <p className="mt-1 truncate text-xs text-muted-foreground">{w.muscles.join(", ")}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">{mine.exercises.length} exercícios</p>
                      </div>
                      <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="rounded-3xl border border-border bg-card p-5">
              <div className="flex items-start justify-between gap-3">
                <p className="font-display text-2xl tracking-wide">Alterar treino</p>
                {user.schedule && (
                  <button
                    onClick={() => {
                      actions.updateStudent(user.email, { schedule: undefined });
                      toast.success("Agenda restaurada", { description: "O aluno voltou ao treino padrão da academia." });
                    }}
                    className="shrink-0 rounded-full bg-surface px-3 py-1 text-xs font-semibold"
                  >
                    Restaurar padrão
                  </button>
                )}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Escolha o treino de cada dia. O aluno vê a mudança em Início e em Treinos.
                {user.schedule ? " Agenda personalizada." : " Agenda padrão da academia."}
              </p>
              <div className="mt-4 space-y-2">
                {scheduleOf(user).map((id, day) => (
                  <label key={day} className="flex items-center justify-between gap-3 rounded-2xl bg-surface px-3 py-2">
                    <span className="text-sm font-semibold">{WEEK_NAMES[day]}</span>
                    <select
                      value={id ?? ""}
                      onChange={(e) => {
                        const next = [...scheduleOf(user)];
                        next[day] = e.target.value || null;
                        actions.updateStudent(user.email, { schedule: next });
                        const w = e.target.value ? getWorkout(e.target.value) : undefined;
                        toast.success("Treino alterado", { description: `${WEEK_NAMES[day]}: ${w ? w.name : "Descanso"}` });
                      }}
                      className="max-w-[60%] rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                    >
                      <option value="">Descanso</option>
                      {WORKOUTS.map((w) => (
                        <option key={w.id} value={w.id}>
                          {w.name}
                        </option>
                      ))}
                    </select>
                  </label>
                ))}
              </div>
            </div>

            <h3 className="pt-2 font-display text-2xl tracking-wide">Últimos treinos</h3>
            {history.length === 0 ? (
              <p className="rounded-3xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">Nenhum treino concluído ainda.</p>
            ) : (
              <div className="space-y-3">
                {history.slice(0, 8).map((h) => {
                  const w = getWorkout(h.workoutId);
                  return (
                    <div key={h.id} className="flex items-center gap-4 rounded-3xl border border-border bg-card p-3 pr-4">
                      {w && <img src={w.cover} alt={w.name} loading="lazy" width={816} height={816} className="h-14 w-14 shrink-0 rounded-2xl object-cover" />}
                      <div className="min-w-0 flex-1">
                        <p className="font-display text-xl leading-none tracking-wide">{w?.name ?? "Treino"}</p>
                        <p className="mt-1 text-xs capitalize text-muted-foreground">
                          {new Date(h.date).toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "2-digit" })}
                        </p>
                        <div className="mt-1 flex gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5 text-primary" />{formatClock(h.durationSec)}</span>
                          <span className="flex items-center gap-1"><Dumbbell className="h-3.5 w-3.5 text-primary" />{h.done}/{h.total}</span>
                          {h.volumeKg > 0 && <span>{h.volumeKg.toLocaleString("pt-BR")} kg</span>}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      }}
    </AppShell>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-semibold">{value}</span>
    </div>
  );
}
