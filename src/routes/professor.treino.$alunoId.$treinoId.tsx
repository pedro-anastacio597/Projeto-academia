import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowDown, ArrowUp, ChevronDown, ChevronUp, Minus, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { getWorkout } from "@/lib/gym-data";
import { actions, useAppState, type CustomExercise, type User } from "@/lib/store";
import { CATALOG, catalogExercise, toCustom } from "@/lib/workout";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/professor/treino/$alunoId/$treinoId")({
  head: () => ({
    meta: [
      { title: "Alterar exercícios — FORJA Academia" },
      { name: "description", content: "Troque, adicione e ajuste os exercícios do treino de um aluno." },
    ],
  }),
  component: EditWorkout,
});

const field = "w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary";

function EditWorkout() {
  const { alunoId, treinoId } = Route.useParams();
  const base = getWorkout(treinoId);
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <AppShell title={base?.name ?? "Treino"} back>
      {() => <Editor alunoId={alunoId} treinoId={treinoId} openId={openId} setOpenId={setOpenId} />}
    </AppShell>
  );
}

function Editor({ alunoId, treinoId, openId, setOpenId }: { alunoId: string; treinoId: string; openId: string | null; setOpenId: (id: string | null) => void }) {
  // Lê o aluno direto do estado para refletir cada alteração na hora.
  const student = useStudent(alunoId);
  const base = getWorkout(treinoId);
  if (!student || !base) {
    return <p className="m-5 rounded-3xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">Treino ou aluno não encontrado.</p>;
  }

  const custom = student.customWorkouts?.[treinoId];
  const list: CustomExercise[] = custom ?? base.exercises.map(toCustom);
  const used = new Set(list.map((c) => c.exId));
  const available = CATALOG.filter((e) => !used.has(e.id));

  const save = (next: CustomExercise[]) =>
    actions.updateStudent(student.email, { customWorkouts: { ...(student.customWorkouts ?? {}), [treinoId]: next } });
  const patch = (i: number, p: Partial<CustomExercise>) => save(list.map((c, k) => (k === i ? { ...c, ...p } : c)));
  const resetAll = () => {
    const rest = { ...(student.customWorkouts ?? {}) };
    delete rest[treinoId];
    actions.updateStudent(student.email, { customWorkouts: Object.keys(rest).length ? rest : undefined });
    setOpenId(null);
    toast.success("Treino restaurado", { description: "O aluno voltou ao treino padrão da academia." });
  };
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= list.length) return;
    const next = [...list];
    [next[i], next[j]] = [next[j]!, next[i]!];
    save(next);
  };
  const setSets = (i: number, n: number) => {
    const c = list[i]!;
    const sets = Math.min(8, Math.max(1, n));
    const weights = c.weights.length ? Array.from({ length: sets }, (_, k) => c.weights[k] ?? c.weights[c.weights.length - 1] ?? 0) : [];
    patch(i, { sets, weights });
  };

  return (
    <div className="space-y-4 px-5 pb-10 pt-6">
      <div className="rounded-3xl border border-border bg-card bg-card-glow p-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">Treino de {student.name.split(" ")[0]}</p>
        <p className="font-display text-3xl tracking-wide">{base.name}</p>
        <p className="mt-1 text-xs text-muted-foreground">As alterações valem só para este aluno e aparecem na hora para ele.</p>
        {custom && (
          <button onClick={resetAll} className="mt-3 rounded-full bg-surface px-3 py-1.5 text-xs font-semibold">
            Restaurar treino padrão
          </button>
        )}
      </div>

      <div className="space-y-3">
        {list.map((c, i) => {
          const ce = catalogExercise(c.exId);
          if (!ce) return null;
          const open = openId === c.exId;
          const swaps = CATALOG.filter((e) => e.id === c.exId || !used.has(e.id));
          return (
            <div key={c.exId} className={cn("overflow-hidden rounded-3xl border bg-card", open ? "border-primary/60" : "border-border")}>
              <button onClick={() => setOpenId(open ? null : c.exId)} className="flex w-full items-center gap-3 p-3 pr-4 text-left">
                <img src={ce.image} alt={ce.name} loading="lazy" width={816} height={816} className="h-14 w-14 shrink-0 rounded-2xl object-cover" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-semibold">{ce.name}</span>
                  <span className="block text-xs text-muted-foreground">
                    {c.sets} × {c.reps} · {c.weights.length ? `${c.weights.join("/")} kg` : "Peso corporal"}
                  </span>
                </span>
                {open ? <ChevronUp className="h-5 w-5 text-muted-foreground" /> : <ChevronDown className="h-5 w-5 text-muted-foreground" />}
              </button>

              {open && (
                <div className="space-y-4 border-t border-border p-4">
                  <div className="grid grid-cols-2 gap-3">
                    <label className="block">
                      <span className="mb-1 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">Séries</span>
                      <span className="flex items-center gap-2">
                        <button onClick={() => setSets(i, c.sets - 1)} aria-label="Menos uma série" className="grid h-10 w-10 place-items-center rounded-xl bg-surface"><Minus className="h-4 w-4" /></button>
                        <b className="w-8 text-center font-display text-2xl">{c.sets}</b>
                        <button onClick={() => setSets(i, c.sets + 1)} aria-label="Mais uma série" className="grid h-10 w-10 place-items-center rounded-xl bg-surface"><Plus className="h-4 w-4" /></button>
                      </span>
                    </label>
                    <label className="block">
                      <span className="mb-1 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">Descanso (s)</span>
                      <input className={field} type="number" min={0} inputMode="numeric" value={c.restSec || ""} placeholder="0" onChange={(e) => patch(i, { restSec: Math.max(0, Number(e.target.value) || 0) })} />
                    </label>
                  </div>

                  <label className="block">
                    <span className="mb-1 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">Repetições</span>
                    <input className={field} value={c.reps} placeholder="12/10/8 ou 40s" onChange={(e) => patch(i, { reps: e.target.value })} />
                  </label>

                  <div>
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Carga por série (kg)</span>
                      <button
                        onClick={() => patch(i, { weights: c.weights.length ? [] : Array(c.sets).fill(0) })}
                        className="rounded-full bg-surface px-3 py-1 text-xs font-semibold"
                      >
                        {c.weights.length ? "Sem carga" : "Usar carga"}
                      </button>
                    </div>
                    {c.weights.length ? (
                      <div className="grid grid-cols-4 gap-2">
                        {c.weights.map((w, k) => (
                          <label key={k} className="block text-center text-[10px] text-muted-foreground">
                            {k + 1}ª
                            <input
                              className={field + " mt-0.5 text-center"}
                              type="number"
                              min={0}
                              inputMode="decimal"
                              value={w || ""}
                              placeholder="0"
                              onChange={(e) => patch(i, { weights: c.weights.map((x, n) => (n === k ? Math.max(0, Number(e.target.value) || 0) : x)) })}
                            />
                          </label>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground">Peso corporal ou exercício por tempo.</p>
                    )}
                  </div>

                  <label className="block">
                    <span className="mb-1 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">Trocar exercício</span>
                    <select
                      className={field}
                      value={c.exId}
                      onChange={(e) => {
                        const next = catalogExercise(e.target.value);
                        if (!next || next.id === c.exId) return;
                        save(list.map((x, k) => (k === i ? toCustom(next) : x)));
                        setOpenId(next.id);
                        toast.success("Exercício trocado", { description: `${ce.name} → ${next.name}` });
                      }}
                    >
                      {swaps.map((e) => (
                        <option key={e.id} value={e.id}>
                          {e.name} ({e.muscle})
                        </option>
                      ))}
                    </select>
                  </label>

                  <div className="grid grid-cols-3 gap-2">
                    <button onClick={() => move(i, -1)} disabled={i === 0} className="flex h-10 items-center justify-center gap-1 rounded-xl bg-surface text-sm font-semibold disabled:opacity-40"><ArrowUp className="h-4 w-4" /> Subir</button>
                    <button onClick={() => move(i, 1)} disabled={i === list.length - 1} className="flex h-10 items-center justify-center gap-1 rounded-xl bg-surface text-sm font-semibold disabled:opacity-40"><ArrowDown className="h-4 w-4" /> Descer</button>
                    <button
                      onClick={() => {
                        save(list.filter((_, k) => k !== i));
                        setOpenId(null);
                        toast("Exercício removido", { description: ce.name });
                      }}
                      disabled={list.length <= 1}
                      className="flex h-10 items-center justify-center gap-1 rounded-xl text-sm font-semibold text-destructive hover:bg-destructive/10 disabled:opacity-40"
                    >
                      <Trash2 className="h-4 w-4" /> Remover
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="rounded-3xl border border-dashed border-border p-4">
        <span className="mb-1 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">Adicionar exercício</span>
        <select
          className={field}
          value=""
          disabled={available.length === 0}
          onChange={(e) => {
            const ex = catalogExercise(e.target.value);
            if (!ex) return;
            save([...list, toCustom(ex)]);
            setOpenId(ex.id);
            toast.success("Exercício adicionado", { description: ex.name });
          }}
        >
          <option value="">{available.length ? "Escolha um exercício…" : "Todos os exercícios já estão no treino"}</option>
          {available.map((e) => (
            <option key={e.id} value={e.id}>
              {e.name} ({e.muscle})
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

function useStudent(email: string): User | undefined {
  const s = useAppState();
  return s.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
}
