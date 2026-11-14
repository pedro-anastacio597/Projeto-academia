import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ChevronRight, PersonStanding } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { WORKOUTS, WORKOUT_TYPES, WEEK_NAMES } from "@/lib/gym-data";
import { scheduleOf } from "@/lib/store";
import { workoutFor } from "@/lib/workout";

export const Route = createFileRoute("/treinos/")({
  head: () => ({
    meta: [
      { title: "Treinos — FORJA Academia" },
      { name: "description", content: "Seus treinos organizados por tipo: inferiores, superiores e core." },
      { property: "og:title", content: "Treinos — FORJA Academia" },
      { property: "og:description", content: "Seus treinos organizados por tipo: inferiores, superiores e core." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Workouts,
});

function Workouts() {
  const [today, setToday] = useState<number | null>(null);
  useEffect(() => setToday(new Date().getDay()), []);

  return (
    <AppShell title="Treinos">
      {(user) => {
        const schedule = scheduleOf(user);
        const currentId = today === null ? null : (schedule[today] ?? null);
        return (
        <div className="px-5 pb-10 pt-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">Ficha atual</p>
          <h2 className="font-display text-4xl tracking-wide">Hipertrofia · Fase 2</h2>
          <p className="text-sm text-muted-foreground">Selecione seu treino</p>

          {WORKOUT_TYPES.map((t) => {
            const list = WORKOUTS.filter((w) => w.type === t.id);
            if (!list.length) return null;
            return (
              <section key={t.id} className="mt-7">
                <div className="mb-3 flex items-baseline justify-between">
                  <h3 className="font-display text-2xl tracking-wide">{t.label}</h3>
                  <span className="text-xs text-muted-foreground">{t.description}</span>
                </div>
                <div className="space-y-3">
                  {list.map((w) => {
                    const count = (workoutFor(user, w.id) ?? w).exercises.length;
                    const days = schedule.map((id, i) => (id === w.id ? WEEK_NAMES[i].slice(0, 3) : null)).filter(Boolean);
                    return (
                      <Link
                        key={w.id}
                        to="/treinos/$treinoId"
                        params={{ treinoId: w.id }}
                        className="relative flex items-center gap-4 rounded-3xl border border-border bg-card p-3 pr-4 transition active:scale-[0.99] hover:border-primary/50"
                      >
                        {currentId === w.id && (
                          <span className="absolute -top-2 right-4 rounded-full bg-primary px-3 py-0.5 text-xs font-bold uppercase tracking-wider">Atual</span>
                        )}
                        <img src={w.cover} alt={w.name} loading="lazy" width={816} height={816} className="h-20 w-20 shrink-0 rounded-2xl object-cover" />
                        <div className="min-w-0 flex-1">
                          <p className="font-display text-2xl leading-none tracking-wide">{w.name}</p>
                          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
                            {w.muscles.map((m) => (
                              <span key={m} className="flex items-center gap-1 text-sm text-muted-foreground">
                                <PersonStanding className="h-4 w-4 text-primary" />
                                {m}
                              </span>
                            ))}
                          </div>
                          <p className="mt-1.5 text-xs text-muted-foreground">
                            {count} exercícios · {days.join(", ")}
                          </p>
                        </div>
                        <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
                      </Link>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
        );
      }}
    </AppShell>
  );
}
