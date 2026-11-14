import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { CalendarCheck, ChevronDown, ChevronRight, Clock, Dumbbell, FileText, Flame, Plus, TriangleAlert, X } from "lucide-react";
import { toast } from "sonner";
import { Avatar } from "@/components/AppShell";
import { StatBox, StatusBadge } from "@/components/trainer";
import { WeekStrip } from "@/components/WeekStrip";
import { MEASURE_LABELS, WEEK_NAMES, WORKOUTS, bmi, brl, fmtDate, getPlan, getWorkout, planTotal, type Evaluation } from "@/lib/gym-data";
import { SEX_LABEL, actions, currentUser, evaluationsOf, scheduleOf, streak, trainedDaysThisWeek, useAppState, type User } from "@/lib/store";
import { dueText, lastWorkoutText, type StudentRow } from "@/lib/trainer";
import { formatClock, workoutFor } from "@/lib/workout";
import { cn } from "@/lib/utils";

const card = "rounded-3xl border border-border bg-card p-5";
const input = "w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary";
const lbl = "mb-1 block text-xs font-semibold uppercase tracking-widest text-muted-foreground";

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-semibold">{value}</span>
    </div>
  );
}

/* ───────────────────────────── Aba 1: Dados ───────────────────────────── */

export function DataTab({ row }: { row: StudentRow }) {
  const { user } = row;
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 rounded-3xl border border-border bg-card bg-card-glow p-5">
        <Avatar name={user.name} className="h-16 w-16 text-2xl" />
        <div className="min-w-0">
          <p className="truncate text-lg font-bold">{user.name}</p>
          <p className="truncate text-xs text-muted-foreground">{user.email}</p>
        </div>
      </div>

      <div className={card}>
        <p className="font-display text-2xl tracking-wide">Dados pessoais</p>
        <div className="mt-3 space-y-2.5 text-sm">
          <Row label="Nome completo" value={user.name} />
          <Row label="E-mail" value={user.email} />
          <Row label="Telefone" value={user.phone || "- -"} />
          <Row label="Sexo" value={user.sex ? SEX_LABEL[user.sex] : "- -"} />
          <Row label="Cliente desde" value={fmtDate(user.planStart)} />
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────────── Aba 2: Treinos ───────────────────────────── */

export function TrainingTab({ row }: { row: StudentRow }) {
  const { user, history } = row;
  return (
    <div className="space-y-4">
      {row.inactive && (
        <p className="rounded-2xl border border-amber-500/40 bg-amber-500/10 p-4 text-sm text-amber-300">
          {row.daysSince === null ? "Este aluno ainda não registrou nenhum treino." : `Este aluno está há ${row.daysSince} dias sem treinar.`}
        </p>
      )}

      <div className="grid grid-cols-3 gap-2">
        <StatBox icon={CalendarCheck} label="Esta semana" value={String(row.week)} />
        <StatBox icon={Dumbbell} label="Últimos 30 dias" value={String(row.month)} />
        <StatBox icon={Flame} label="Sequência" value={`${streak(history)}d`} />
      </div>

      <div className={card}>
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

      <div className={card}>
        <div className="flex items-start justify-between gap-3">
          <p className="font-display text-2xl tracking-wide">Agenda semanal</p>
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
}

/* ───────────────────────────── Aba 3: Avaliação física ───────────────────────────── */

const num = (v: string) => parseFloat(v.replace(",", "."));
const today = () => new Date().toISOString().slice(0, 10);

type Form = Record<string, string>;
const emptyForm = (): Form => ({ date: today(), weight: "", height: "", bodyFat: "", restingHr: "", goal: "", issues: "", notes: "", ...Object.fromEntries(MEASURE_LABELS.map((m) => [`m_${m}`, ""])) });

export function EvaluationTab({ user }: { user: User }) {
  const s = useAppState();
  const list = evaluationsOf(s, user.email);
  const professor = currentUser(s)?.name ?? "Professor";
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState<Form>(emptyForm);
  const [error, setError] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const close = () => {
    setAdding(false);
    setError(null);
    setForm(emptyForm());
  };

  const save = () => {
    const weight = num(form.weight);
    let height = num(form.height);
    const bodyFat = num(form.bodyFat);
    const restingHr = num(form.restingHr);
    if (!form.date) return setError("Informe a data da avaliação.");
    if (!(weight >= 20 && weight <= 300)) return setError("Informe o peso em kg (ex.: 64,2).");
    if (height > 3) height = height / 100; // aceita 165 como 1,65 m
    if (!(height >= 1 && height <= 2.5)) return setError("Informe a altura em metros (ex.: 1,65).");
    if (!(bodyFat >= 2 && bodyFat <= 70)) return setError("Informe a gordura corporal em % (ex.: 22,4).");
    if (!(restingHr >= 30 && restingHr <= 220)) return setError("Informe a FC de repouso em bpm (ex.: 64).");

    const measures = MEASURE_LABELS.flatMap((label) => {
      const raw = form[`m_${label}`];
      if (!raw.trim()) return [];
      const value = num(raw);
      return value > 0 ? [{ label, value }] : [];
    });
    const ev: Evaluation = {
      id: `av-${Date.now().toString(36)}`,
      date: form.date,
      professor,
      weight,
      height,
      bodyFat,
      leanMass: Math.round(weight * (1 - bodyFat / 100) * 10) / 10,
      restingHr,
      issues: form.issues.split("\n").map((x) => x.trim()).filter(Boolean),
      measures,
      notes: form.notes.trim(),
      goal: form.goal.trim(),
    };
    actions.addEvaluation(user.email, ev);
    toast.success("Avaliação adicionada", { description: `${user.name.split(" ")[0]} já vê essa avaliação no app.` });
    close();
  };

  return (
    <div className="space-y-4">
      {!adding ? (
        <button
          onClick={() => setAdding(true)}
          className="flex h-14 w-full items-center justify-center gap-2 rounded-3xl border border-dashed border-primary/60 bg-primary/10 font-semibold text-primary transition active:scale-[0.99] hover:bg-primary/15"
        >
          <Plus className="h-5 w-5" /> Adicionar avaliação física
        </button>
      ) : (
        <div className={cn(card, "space-y-4")}>
          <div className="flex items-center justify-between">
            <p className="font-display text-2xl tracking-wide">Nova avaliação</p>
            <button onClick={close} aria-label="Fechar" className="grid h-9 w-9 place-items-center rounded-full bg-surface">
              <X className="h-4 w-4" />
            </button>
          </div>

          <label className="block">
            <span className={lbl}>Data</span>
            <input className={input} type="date" value={form.date} onChange={(e) => set("date", e.target.value)} />
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className={lbl}>Peso (kg)</span>
              <input className={input} inputMode="decimal" value={form.weight} onChange={(e) => set("weight", e.target.value)} placeholder="64,2" />
            </label>
            <label className="block">
              <span className={lbl}>Altura (m)</span>
              <input className={input} inputMode="decimal" value={form.height} onChange={(e) => set("height", e.target.value)} placeholder="1,65" />
            </label>
            <label className="block">
              <span className={lbl}>Gordura (%)</span>
              <input className={input} inputMode="decimal" value={form.bodyFat} onChange={(e) => set("bodyFat", e.target.value)} placeholder="22,4" />
            </label>
            <label className="block">
              <span className={lbl}>FC repouso (bpm)</span>
              <input className={input} inputMode="numeric" value={form.restingHr} onChange={(e) => set("restingHr", e.target.value)} placeholder="64" />
            </label>
          </div>

          <label className="block">
            <span className={lbl}>Problemas físicos</span>
            <textarea className={cn(input, "min-h-20")} value={form.issues} onChange={(e) => set("issues", e.target.value)} placeholder={"Um por linha. Ex.:\nDor lombar leve ao agachar"} />
          </label>

          <div>
            <span className={lbl}>Medidas (cm) · opcional</span>
            <div className="grid grid-cols-2 gap-3">
              {MEASURE_LABELS.map((m) => (
                <label key={m} className="block">
                  <span className="mb-1 block text-xs text-muted-foreground">{m}</span>
                  <input className={input} inputMode="decimal" value={form[`m_${m}`]} onChange={(e) => set(`m_${m}`, e.target.value)} placeholder="- -" />
                </label>
              ))}
            </div>
          </div>

          <label className="block">
            <span className={lbl}>Objetivo</span>
            <input className={input} value={form.goal} onChange={(e) => set("goal", e.target.value)} placeholder="Ex.: Hipertrofia de glúteos" />
          </label>
          <label className="block">
            <span className={lbl}>Observações do professor</span>
            <textarea className={cn(input, "min-h-20")} value={form.notes} onChange={(e) => set("notes", e.target.value)} />
          </label>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="grid grid-cols-2 gap-2">
            <button onClick={close} className="h-12 rounded-2xl bg-surface font-semibold">Cancelar</button>
            <button onClick={save} className="h-12 rounded-2xl bg-primary font-bold text-primary-foreground">Salvar avaliação</button>
          </div>
        </div>
      )}

      <h3 className="pt-1 font-display text-2xl tracking-wide">Histórico de avaliações</h3>
      {list.length === 0 ? (
        <p className="rounded-3xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">Nenhuma avaliação registrada para este aluno.</p>
      ) : (
        <div className="space-y-3">
          {list.map((e, i) => {
            const open = openId === e.id;
            return (
              <div key={e.id} className={cn("rounded-3xl border border-border bg-card", i === 0 && "bg-card-glow")}>
                <button onClick={() => setOpenId(open ? null : e.id)} className="flex w-full items-start justify-between gap-3 p-5 text-left">
                  <div>
                    {i === 0 && <span className="mb-2 inline-block rounded-full bg-primary px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider">Mais recente</span>}
                    <p className="font-display text-3xl leading-none tracking-wide">{fmtDate(e.date)}</p>
                    <p className="mt-1 text-sm text-muted-foreground">Prof. {e.professor}</p>
                  </div>
                  <ChevronDown className={cn("mt-1 h-5 w-5 text-muted-foreground transition", open && "rotate-180")} />
                </button>
                <div className="grid grid-cols-4 gap-2 px-5 pb-5">
                  {[
                    ["Peso", `${e.weight.toFixed(1)}kg`],
                    ["Gordura", `${e.bodyFat.toFixed(1)}%`],
                    ["IMC", bmi(e).toFixed(1)],
                    ["FC", `${e.restingHr}`],
                  ].map(([l, v]) => (
                    <div key={l} className="rounded-2xl bg-surface p-2.5">
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{l}</p>
                      <p className="font-display text-xl leading-tight tracking-wide">{v}</p>
                    </div>
                  ))}
                </div>
                {open && (
                  <div className="space-y-4 border-t border-border p-5 text-sm">
                    {e.goal && <p><span className="text-muted-foreground">Objetivo: </span>{e.goal}</p>}
                    <div>
                      <p className="flex items-center gap-2 text-xs text-muted-foreground"><TriangleAlert className="h-4 w-4 text-primary" /> Problemas físicos</p>
                      {e.issues.length ? (
                        <ul className="mt-1.5 space-y-1">
                          {e.issues.map((x) => (
                            <li key={x} className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />{x}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="mt-1 text-muted-foreground">Nenhum informado.</p>
                      )}
                    </div>
                    <div>
                      <p className="mb-1 text-xs text-muted-foreground">Medidas (cm)</p>
                      <div className="grid grid-cols-2 gap-x-6 gap-y-1">
                        {MEASURE_LABELS.map((l) => {
                          const m = e.measures.find((x) => x.label === l);
                          return (
                            <div key={l} className="flex justify-between">
                              <span className="text-muted-foreground">{l}</span>
                              <span className="font-semibold">{m ? m.value.toFixed(1) : "- -"}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    {e.notes && <p className="rounded-2xl border border-primary/40 bg-accent/50 p-3 leading-relaxed">{e.notes}</p>}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ───────────────────────────── Aba 4: Contrato ───────────────────────────── */

const contractNumber = (u: User) => {
  const n = [...u.email].reduce((a, c) => (a * 31 + c.charCodeAt(0)) % 10000, 7);
  return `FJ-${u.planStart.slice(0, 4)}-${String(n).padStart(4, "0")}`;
};

export function ContractTab({ row }: { row: StudentRow }) {
  const { user } = row;
  const plan = getPlan(user.plan);
  return (
    <div className="space-y-4">
      <div className="rounded-3xl border border-border bg-card bg-card-glow p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-surface text-primary"><FileText className="h-6 w-6" /></span>
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">Contrato de matrícula</p>
              <p className="font-display text-2xl leading-tight tracking-wide">Nº {contractNumber(user)}</p>
            </div>
          </div>
          <StatusBadge status={row.status} />
        </div>
      </div>

      <div className={card}>
        <p className="font-display text-2xl tracking-wide">Titular</p>
        <div className="mt-3 space-y-2.5 text-sm">
          <Row label="Nome" value={user.name} />
          <Row label="E-mail" value={user.email} />
        </div>
      </div>

      <div className={card}>
        <p className="font-display text-2xl tracking-wide">Plano contratado</p>
        <div className="mt-3 space-y-2.5 text-sm">
          <Row label="Plano" value={plan.name} />
          <Row label="Modalidade" value="Musculação" />
          <Row label="Duração" value={`${plan.months} ${plan.months > 1 ? "meses" : "mês"}`} />
          <Row label="Início" value={fmtDate(user.planStart)} />
          <Row label="Vencimento" value={fmtDate(user.planEnd)} />
          <Row label="Situação" value={user.planStatus === "cancelado" ? "Cancelado pelo aluno" : dueText(row.daysLeft)} />
        </div>
      </div>

      <div className={card}>
        <p className="font-display text-2xl tracking-wide">Financeiro</p>
        <div className="mt-3 space-y-2.5 text-sm">
          <Row label="Valor mensal" value={brl(plan.monthly)} />
          {plan.discount > 0 && <Row label="Desconto do plano" value={`${plan.discount}%`} />}
          <Row label="Total do contrato" value={brl(planTotal(plan))} />
        </div>
      </div>

      <div className={card}>
        <p className="font-display text-2xl tracking-wide">Benefícios incluídos</p>
        <ul className="mt-3 space-y-1.5 text-sm">
          {plan.perks.map((p) => (
            <li key={p} className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />{p}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
