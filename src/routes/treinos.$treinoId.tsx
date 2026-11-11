import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Check, CheckCircle2, Clock, Flag, Lightbulb, Play, SkipForward, Timer, Trophy, Weight } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { ExerciseCard, weightsLabel } from "@/components/ExerciseCard";
import { BottomSheet, ConfirmModal, Modal, VideoModal } from "@/components/overlays";
import { Button } from "@/components/ui/button";
import { getWorkout, type Exercise } from "@/lib/gym-data";
<<<<<<< HEAD
import { actions, useCurrentUser } from "@/lib/store";
import { formatClock, groupExercises, repsForSet, volumeKg, workoutFor } from "@/lib/workout";
=======
import { actions } from "@/lib/store";
import { formatClock, groupExercises, repsForSet, volumeKg } from "@/lib/workout";
>>>>>>> 9e0916ba01f5f41dd129bef358dff57b51ae646d
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/treinos/$treinoId")({
  loader: ({ params }) => {
    const w = getWorkout(params.treinoId);
    if (!w) throw notFound();
    return { name: w.name, muscles: w.muscles };
  },
  head: ({ loaderData }) => {
    const title = loaderData ? `${loaderData.name} — FORJA Academia` : "Treino — FORJA Academia";
    const desc = loaderData ? `Exercícios do ${loaderData.name}: ${loaderData.muscles.join(", ")}.` : "Exercícios do treino.";
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary" },
      ],
    };
  },
  component: WorkoutPage,
});

function useNow(active: boolean) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [active]);
  return now;
}

function WorkoutPage() {
  const { treinoId } = Route.useParams();
<<<<<<< HEAD
  const me = useCurrentUser();
  const workout = useMemo(() => workoutFor(me, treinoId)!, [me, treinoId]);
=======
  const workout = getWorkout(treinoId)!;
>>>>>>> 9e0916ba01f5f41dd129bef358dff57b51ae646d
  const navigate = useNavigate();

  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [setsDone, setSetsDone] = useState<Record<string, boolean[]>>({});
  const [completed, setCompleted] = useState<string[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);
  const [video, setVideo] = useState<Exercise | null>(null);
  const [restUntil, setRestUntil] = useState<number | null>(null);
  const [confirmFinish, setConfirmFinish] = useState(false);
  const [summary, setSummary] = useState<{ duration: number; done: number; volume: number } | null>(null);

  const started = startedAt !== null;
  const now = useNow(started || restUntil !== null);
  const elapsed = started ? (now - startedAt) / 1000 : 0;
  const restLeft = restUntil ? Math.ceil((restUntil - now) / 1000) : 0;

  useEffect(() => {
    if (restUntil && restLeft <= 0) {
      setRestUntil(null);
      toast.success("Descanso finalizado!", { description: "Bora para a próxima série 💪" });
      if (typeof navigator !== "undefined" && "vibrate" in navigator) navigator.vibrate?.(300);
    }
  }, [restLeft, restUntil]);

  const blocks = useMemo(() => groupExercises(workout.exercises), [workout]);
  const open = workout.exercises.find((e) => e.id === openId) ?? null;
  const total = workout.exercises.length;
  const progress = completed.length / total;

  const toggleSet = (e: Exercise, i: number) => {
    const arr = [...(setsDone[e.id] ?? Array(e.sets).fill(false))];
    arr[i] = !arr[i];
    setSetsDone({ ...setsDone, [e.id]: arr });
    if (arr[i] && e.restSec > 0 && i < e.sets - 1) setRestUntil(Date.now() + e.restSec * 1000);
  };

  const completeExercise = (e: Exercise) => {
    if (completed.includes(e.id)) {
      setCompleted((c) => c.filter((x) => x !== e.id));
      return;
    }
    setSetsDone((p) => ({ ...p, [e.id]: Array(e.sets).fill(true) }));
    setCompleted((c) => [...c, e.id]);
    setOpenId(null);
    setRestUntil(null);
    toast.success(`${e.name} concluído`, { description: `${completed.length + 1} de ${total} exercícios` });
  };

  const finish = () => {
    const duration = Math.round(elapsed);
    const volume = volumeKg(workout.exercises, setsDone);
    actions.addHistory({ workoutId: workout.id, date: new Date().toISOString(), durationSec: duration, done: completed.length, total, volumeKg: volume });
    setSummary({ duration, done: completed.length, volume });
    setStartedAt(null);
    setRestUntil(null);
  };

  return (
    <AppShell
      title={workout.name}
      back
      right={
        started ? (
          <span className="flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 font-display text-lg tracking-wider">
            <Clock className="h-4 w-4" /> {formatClock(elapsed)}
          </span>
        ) : undefined
      }
      footer={
        started ? (
          <Button variant="hero" size="xl" onClick={() => (completed.length < total ? setConfirmFinish(true) : finish())}>
            <Flag /> Finalizar treino ({completed.length}/{total})
          </Button>
        ) : (
          <Button variant="hero" size="xl" onClick={() => setStartedAt(Date.now())}>
            <Play className="fill-current" /> Iniciar {workout.name}
          </Button>
        )
      }
    >
      {() => (
        <div className="px-5 pb-8 pt-5">
          <div className="flex flex-wrap gap-2">
            {workout.muscles.map((m) => (
              <span key={m} className="rounded-full bg-accent px-3 py-1 text-xs font-semibold">{m}</span>
            ))}
            <span className="rounded-full bg-surface px-3 py-1 text-xs font-semibold text-muted-foreground">{total} exercícios</span>
          </div>

          {started ? (
            <div className="mt-4 rounded-2xl border border-border bg-card p-4">
              <div className="flex justify-between text-sm">
                <span className="font-semibold">Progresso</span>
                <span className="text-muted-foreground">{Math.round(progress * 100)}%</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-surface">
                <div className="h-full rounded-full bg-gradient-primary transition-all duration-500" style={{ width: `${progress * 100}%` }} />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">Toque em um exercício para ver séries, pesos e concluir.</p>
            </div>
          ) : (
            <p className="mt-4 rounded-2xl border border-dashed border-border px-4 py-3 text-sm text-muted-foreground">
              Visualização do treino. Toque em <b className="text-foreground">Iniciar</b> para registrar suas séries. Toque na foto para ver o vídeo.
            </p>
          )}

          <div className="mt-5 space-y-3">
            {blocks.map((b, bi) =>
              b.bisetId ? (
                <div key={bi} className="overflow-hidden rounded-3xl border border-primary/60 bg-card">
                  <div className="bg-primary py-1 text-center text-xs font-bold uppercase tracking-[0.25em]">Bi-set</div>
                  <div className="divide-y divide-border">
                    {b.items.map((e, i) => (
                      <ExerciseCard key={e.id} flat badge={String.fromCharCode(65 + i)} exercise={e} interactive={started} completed={completed.includes(e.id)} onOpen={() => setOpenId(e.id)} onPlay={() => setVideo(e)} />
                    ))}
                  </div>
                </div>
              ) : (
                <ExerciseCard key={bi} exercise={b.items[0]} interactive={started} completed={completed.includes(b.items[0].id)} onOpen={() => setOpenId(b.items[0].id)} onPlay={() => setVideo(b.items[0])} />
              ),
            )}
          </div>

          {restUntil && restLeft > 0 && (
            <div className="fixed inset-x-5 bottom-24 z-30 flex items-center gap-3 rounded-2xl border border-primary bg-card p-3 shadow-glow animate-in slide-in-from-bottom-4">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-primary"><Timer className="h-5 w-5" /></span>
              <div className="flex-1">
                <p className="text-xs uppercase tracking-widest text-muted-foreground">Descanso</p>
                <p className="font-display text-3xl leading-none tracking-wider">{formatClock(restLeft)}</p>
              </div>
              <button onClick={() => setRestUntil(null)} className="flex items-center gap-1 rounded-xl bg-surface px-3 py-2 text-sm font-semibold">
                <SkipForward className="h-4 w-4" /> Pular
              </button>
            </div>
          )}

          <BottomSheet open={!!open} onClose={() => setOpenId(null)}>
            {open && (
              <ExerciseDetail
                exercise={open}
                done={setsDone[open.id] ?? Array(open.sets).fill(false)}
                completed={completed.includes(open.id)}
                restLeft={restUntil ? restLeft : 0}
                onToggleSet={(i) => toggleSet(open, i)}
                onComplete={() => completeExercise(open)}
                onPlay={() => setVideo(open)}
              />
            )}
          </BottomSheet>

          <VideoModal open={!!video} onClose={() => setVideo(null)} src={video?.video ?? ""} title={video?.name ?? ""} />

          <ConfirmModal
            open={confirmFinish}
            onClose={() => setConfirmFinish(false)}
            onConfirm={finish}
            title="Finalizar treino?"
            description={`Você concluiu ${completed.length} de ${total} exercícios. Deseja finalizar mesmo assim?`}
            confirmLabel="Finalizar"
          />

          <Modal open={!!summary} onClose={() => navigate({ to: "/inicio" })} showClose={false}>
            {summary && (
              <div className="bg-card-glow p-6 text-center">
                <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-gradient-primary shadow-glow"><Trophy className="h-8 w-8" /></span>
                <h3 className="mt-4 font-display text-4xl tracking-wide">Treino concluído!</h3>
                <p className="text-sm text-muted-foreground">Mandou bem. Mais um dia forjado.</p>
                <div className="mt-5 grid grid-cols-3 gap-2">
                  <Stat label="Duração" value={formatClock(summary.duration)} />
                  <Stat label="Exercícios" value={`${summary.done}/${total}`} />
                  <Stat label="Volume" value={`${summary.volume.toLocaleString("pt-BR")}kg`} />
                </div>
                <div className="mt-6 grid gap-2">
                  <Button variant="hero" size="xl" onClick={() => navigate({ to: "/inicio" })}>Voltar ao início</Button>
                  <Link to="/historico" className="py-2 text-sm font-semibold text-primary">Ver histórico</Link>
                </div>
              </div>
            )}
          </Modal>
        </div>
      )}
    </AppShell>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-surface px-2 py-3">
      <p className="font-display text-2xl leading-none tracking-wide">{value}</p>
      <p className="mt-1 text-[11px] uppercase tracking-wider text-muted-foreground">{label}</p>
    </div>
  );
}

function ExerciseDetail({
  exercise: e,
  done,
  completed,
  restLeft,
  onToggleSet,
  onComplete,
  onPlay,
}: {
  exercise: Exercise;
  done: boolean[];
  completed: boolean;
  restLeft: number;
  onToggleSet: (i: number) => void;
  onComplete: () => void;
  onPlay: () => void;
}) {
  return (
    <div className="px-5 pb-6">
      <button onClick={onPlay} className="relative block h-44 w-full overflow-hidden rounded-3xl" aria-label="Ver vídeo">
        <img src={e.image} alt={e.name} width={816} height={816} className="h-full w-full object-cover" />
        <span className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
        <span className="absolute left-1/2 top-1/2 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-primary shadow-glow">
          <Play className="h-6 w-6 fill-current" />
        </span>
        <span className="absolute bottom-3 left-4 text-xs font-semibold uppercase tracking-widest">Ver demonstração</span>
      </button>
      <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-primary">{e.muscle}</p>
      <h3 className="font-display text-3xl leading-tight tracking-wide">{e.name}</h3>

      <div className="mt-4 grid grid-cols-3 gap-2">
        <Stat label="Séries" value={String(e.sets)} />
        <Stat label="Repetições" value={e.reps} />
        <Stat label="Descanso" value={e.restSec ? `${e.restSec}s` : "—"} />
      </div>

      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between">
          <p className="font-semibold">Séries</p>
          <p className="flex items-center gap-1 text-xs text-muted-foreground"><Weight className="h-3.5 w-3.5" /> {weightsLabel(e)}</p>
        </div>
        <div className="space-y-2">
          {Array.from({ length: e.sets }).map((_, i) => {
            const isDone = !!done[i];
            const reps = repsForSet(e.reps, i);
            return (
              <button
                key={i}
                onClick={() => onToggleSet(i)}
                disabled={completed}
                className={cn(
                  "flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left transition",
                  isDone ? "border-success/50 bg-success/10" : "border-border bg-surface",
                )}
              >
                <span className="font-display text-xl tracking-wider text-muted-foreground">{i + 1}ª</span>
                <span className="flex-1 text-sm">
                  <b className="text-base">{reps || e.reps}</b> {reps ? "reps" : ""}
                  {e.weights[i] !== undefined && (
                    <>
                      {" · "}
                      <b className="text-base">{e.weights[i]}</b> kg
                    </>
                  )}
                </span>
                <span className={cn("grid h-7 w-7 place-items-center rounded-full border-2", isDone ? "border-success bg-success text-success-foreground" : "border-muted-foreground/40")}>
                  {isDone && <Check className="h-4 w-4" strokeWidth={3} />}
                </span>
              </button>
            );
          })}
        </div>
        {restLeft > 0 && (
          <p className="mt-2 flex items-center gap-1.5 text-sm font-semibold text-primary">
            <Timer className="h-4 w-4" /> Descansando: {formatClock(restLeft)}
          </p>
        )}
      </div>

      {e.tips.length > 0 && (
        <div className="mt-5 rounded-2xl bg-accent/60 p-4">
          <p className="flex items-center gap-2 text-sm font-semibold"><Lightbulb className="h-4 w-4 text-primary" /> Dicas do professor</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
            {e.tips.map((t) => <li key={t}>{t}</li>)}
          </ul>
        </div>
      )}

      <Button variant={completed ? "surface" : "hero"} size="xl" className="mt-5" onClick={onComplete}>
        <CheckCircle2 /> {completed ? "Desfazer conclusão" : "Concluir exercício"}
      </Button>
    </div>
  );
}
