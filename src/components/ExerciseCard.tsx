import { CheckCircle2, Dumbbell, Layers, Play, PersonStanding, Repeat } from "lucide-react";
import type { Exercise } from "@/lib/gym-data";
import { cn } from "@/lib/utils";

export function weightsLabel(e: Exercise) {
  return e.weights.length ? `${e.weights.join("/")} (kg)` : "Peso corporal";
}

export function ExerciseCard({
  exercise,
  interactive,
  completed,
  badge,
  onOpen,
  onPlay,
  flat,
}: {
  exercise: Exercise;
  interactive: boolean;
  completed: boolean;
  badge?: string;
  onOpen: () => void;
  onPlay: () => void;
  flat?: boolean;
}) {
  return (
    <div
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
      onClick={interactive ? onOpen : undefined}
      onKeyDown={(e) => interactive && (e.key === "Enter" || e.key === " ") && onOpen()}
      aria-label={interactive ? `Abrir ${exercise.name}` : undefined}
      className={cn(
        "relative flex items-center gap-4 p-3 pr-4 transition",
        !flat && "rounded-3xl border border-border bg-card",
        interactive && "cursor-pointer active:scale-[0.99] hover:border-primary/50",
        completed && "opacity-60",
      )}
    >
      {badge && (
        <span className="absolute left-1.5 top-1.5 z-10 grid h-6 w-6 place-items-center rounded-full border-2 border-primary bg-background text-xs font-bold text-primary">
          {badge}
        </span>
      )}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onPlay();
        }}
        aria-label={`Ver vídeo de ${exercise.name}`}
        className="group relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl"
      >
        <img src={exercise.image} alt={exercise.name} loading="lazy" width={816} height={816} className="h-full w-full object-cover transition group-hover:scale-105" />
        <span className="absolute bottom-1.5 right-1.5 grid h-6 w-6 place-items-center rounded-full bg-overlay">
          <Play className="h-3 w-3 fill-current" />
        </span>
      </button>
      <div className="min-w-0 flex-1">
        <p className={cn("font-semibold leading-snug", completed && "line-through")}>{exercise.name}</p>
        <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
          <span className="flex items-center gap-1"><PersonStanding className="h-4 w-4 text-primary" />{exercise.muscle}</span>
          <span className="flex items-center gap-1"><Layers className="h-4 w-4 text-primary" />{exercise.sets}</span>
          <span className="flex items-center gap-1"><Repeat className="h-4 w-4 text-primary" />{exercise.reps}</span>
        </div>
        <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
          <Dumbbell className="h-4 w-4 text-primary" />
          {weightsLabel(exercise)}
        </p>
      </div>
      {completed && <CheckCircle2 className="h-6 w-6 shrink-0 text-success" />}
    </div>
  );
}
