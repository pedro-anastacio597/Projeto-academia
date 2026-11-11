import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Bell, Flame, Heart, Moon, Play, Quote, Timer } from "lucide-react";
import { AppShell, HeaderIcon } from "@/components/AppShell";
import { WeekStrip } from "@/components/WeekStrip";
import { Button } from "@/components/ui/button";
import { POSTS, WEEK_NAMES, WEEK_SCHEDULE, getWorkout } from "@/lib/gym-data";
import { actions, streak, trainedDaysThisWeek, useAppState } from "@/lib/store";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/inicio")({
  head: () => ({
    meta: [
      { title: "Início — FORJA Academia" },
      { name: "description", content: "Sua semana de treinos, o treino de hoje e recados da equipe." },
      { property: "og:title", content: "Início — FORJA Academia" },
      { property: "og:description", content: "Sua semana de treinos, o treino de hoje e recados da equipe." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Home,
});

function useToday() {
  const [d, setD] = useState<number | null>(null);
  useEffect(() => setD(new Date().getDay()), []);
  return d;
}

function Home() {
  const s = useAppState();
  const today = useToday();

  return (
    <AppShell
      title="Início"
      right={
        <HeaderIcon label="Notificações" onClick={() => toast("Nenhuma notificação nova", { description: "Avisos da academia aparecem aqui." })}>
          <Bell className="h-5 w-5" />
          <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-primary" />
        </HeaderIcon>
      }
    >
      {(user) => {
        const trained = trainedDaysThisWeek(s.history);
        const st = streak(s.history);
        const workoutId = today === null ? null : WEEK_SCHEDULE[today];
        const workout = workoutId ? getWorkout(workoutId) : undefined;
        const doneToday = today !== null && trained.has(today);
        return (
          <div className="space-y-6 px-5 pb-10 pt-6">
            <section>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Olá,</p>
                  <p className="font-display text-4xl leading-none tracking-wide">{user.name.split(" ")[0]} 👊</p>
                </div>
                <div className="flex items-center gap-1.5 rounded-full bg-accent px-3 py-1.5 text-sm font-semibold">
                  <Flame className="h-4 w-4 text-primary" />
                  {st} {st === 1 ? "dia" : "dias"} seguidos
                </div>
              </div>
              <div className="mt-5 rounded-3xl border border-border bg-card p-4">
                <div className="mb-3 flex items-center justify-between text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  <span>Sua semana</span>
                  <span className="text-foreground">{trained.size}/6 treinos</span>
                </div>
                <WeekStrip today={today ?? -1} trained={trained} />
              </div>
            </section>

            <section>
              <h2 className="mb-3 font-display text-2xl tracking-wide">
                Treino de hoje {today !== null && <span className="text-muted-foreground">· {WEEK_NAMES[today]}</span>}
              </h2>
              {workout ? (
                <div className="relative overflow-hidden rounded-3xl border border-border bg-card shadow-card">
                  <img src={workout.cover} alt={workout.name} loading="lazy" width={816} height={816} className="h-40 w-full object-cover" />
                  <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-t from-card to-transparent" />
                  <span className="absolute right-4 top-4 rounded-full bg-primary px-3 py-1 text-xs font-bold uppercase tracking-wider">
                    {doneToday ? "Concluído" : "Atual"}
                  </span>
                  <div className="relative -mt-10 p-5 pt-0">
                    <p className="font-display text-4xl tracking-wide">{workout.name}</p>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {workout.muscles.map((m) => (
                        <span key={m} className="rounded-full bg-surface px-2.5 py-1 text-xs font-semibold">{m}</span>
                      ))}
                    </div>
                    <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{workout.exercises.length} exercícios</span>
                      <span className="flex items-center gap-1"><Timer className="h-4 w-4" /> ~{workout.exercises.length * 12} min</span>
                    </div>
                    <Button asChild variant="hero" size="xl" className="mt-4">
                      <Link to="/treinos/$treinoId" params={{ treinoId: workout.id }}>
                        <Play className="fill-current" /> Iniciar
                      </Link>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-4 rounded-3xl border border-border bg-card p-5">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-accent"><Moon className="h-6 w-6 text-primary" /></span>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold">Dia de descanso</p>
                    <p className="text-sm text-muted-foreground">Recuperar também é treinar.</p>
                  </div>
                  <Link to="/treinos" className="text-sm font-semibold text-primary">Ver treinos</Link>
                </div>
              )}
            </section>

            <section>
              <h2 className="mb-3 font-display text-2xl tracking-wide">Motivação</h2>
              <div className="space-y-4">
                {POSTS.map((p, i) => {
                  const liked = s.likes.includes(p.id);
                  return (
                    <article key={p.id} className={cn("overflow-hidden rounded-3xl border border-border bg-card", i === 0 && "bg-card-glow")}>
                      <header className="flex items-center gap-3 px-5 pt-5">
                        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary font-display text-lg tracking-wider">{p.initials}</span>
                        <div className="min-w-0">
                          <p className="truncate font-semibold">{p.author}</p>
                          <p className="text-xs text-muted-foreground">{p.role} · {p.date}</p>
                        </div>
                      </header>
                      <div className="px-5 py-4">
                        <Quote className="h-6 w-6 text-primary" />
                        <p className="mt-2 font-display text-[1.7rem] leading-tight tracking-wide">{p.quote}</p>
                        {p.body && <p className="mt-3 text-sm text-muted-foreground">{p.body}</p>}
                      </div>
                      <footer className="flex items-center border-t border-border px-5 py-3 text-sm">
                        <button onClick={() => actions.toggleLike(p.id)} className={cn("flex items-center gap-2 font-semibold", liked ? "text-primary" : "text-muted-foreground")} aria-pressed={liked}>
                          <Heart className={cn("h-5 w-5", liked && "fill-current")} />
                          {p.likes + (liked ? 1 : 0)}
                        </button>
                      </footer>
                    </article>
                  );
                })}
              </div>
            </section>
          </div>
        );
      }}
    </AppShell>
  );
}
