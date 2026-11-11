import { createFileRoute } from "@tanstack/react-router";
import { CalendarCheck, Clock, Dumbbell, Flame } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { getWorkout } from "@/lib/gym-data";
<<<<<<< HEAD
import { historyOf, streak, useAppState } from "@/lib/store";
=======
import { streak, useAppState } from "@/lib/store";
>>>>>>> 9e0916ba01f5f41dd129bef358dff57b51ae646d
import { formatClock } from "@/lib/workout";

export const Route = createFileRoute("/historico")({
  head: () => ({
    meta: [
      { title: "Histórico de treinos — FORJA Academia" },
      { name: "description", content: "Todos os treinos que você concluiu, com duração e volume." },
      { property: "og:title", content: "Histórico de treinos — FORJA Academia" },
      { property: "og:description", content: "Todos os treinos que você concluiu, com duração e volume." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: HistoryPage,
});

function HistoryPage() {
  const s = useAppState();
  return (
    <AppShell title="Histórico">
<<<<<<< HEAD
      {(user) => {
        const history = historyOf(s, user.email);
        const totalMin = Math.round(history.reduce((a, h) => a + h.durationSec, 0) / 60);
        return (
          <div className="px-5 pb-10 pt-6">
            <div className="grid grid-cols-3 gap-2">
              <Stat icon={CalendarCheck} label="Treinos" value={String(history.length)} />
              <Stat icon={Flame} label="Sequência" value={`${streak(history)}d`} />
              <Stat icon={Clock} label="Minutos" value={String(totalMin)} />
            </div>
            <h2 className="mb-3 mt-7 font-display text-2xl tracking-wide">Treinos concluídos</h2>
            {history.length === 0 ? (
              <p className="rounded-3xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">Nenhum treino concluído ainda.</p>
            ) : (
              <div className="space-y-3">
                {history.map((h) => {
=======
      {() => {
        const totalMin = Math.round(s.history.reduce((a, h) => a + h.durationSec, 0) / 60);
        return (
          <div className="px-5 pb-10 pt-6">
            <div className="grid grid-cols-3 gap-2">
              <Stat icon={CalendarCheck} label="Treinos" value={String(s.history.length)} />
              <Stat icon={Flame} label="Sequência" value={`${streak(s.history)}d`} />
              <Stat icon={Clock} label="Minutos" value={String(totalMin)} />
            </div>
            <h2 className="mb-3 mt-7 font-display text-2xl tracking-wide">Treinos concluídos</h2>
            {s.history.length === 0 ? (
              <p className="rounded-3xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">Nenhum treino concluído ainda.</p>
            ) : (
              <div className="space-y-3">
                {s.history.map((h) => {
>>>>>>> 9e0916ba01f5f41dd129bef358dff57b51ae646d
                  const w = getWorkout(h.workoutId);
                  const d = new Date(h.date);
                  return (
                    <div key={h.id} className="flex items-center gap-4 rounded-3xl border border-border bg-card p-3 pr-4">
                      {w && <img src={w.cover} alt={w.name} loading="lazy" width={816} height={816} className="h-16 w-16 shrink-0 rounded-2xl object-cover" />}
                      <div className="min-w-0 flex-1">
                        <p className="font-display text-2xl leading-none tracking-wide">{w?.name ?? "Treino"}</p>
                        <p className="mt-1 text-xs capitalize text-muted-foreground">
                          {d.toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "2-digit" })}
                        </p>
                        <div className="mt-1.5 flex gap-3 text-xs text-muted-foreground">
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

function Stat({ icon: Icon, label, value }: { icon: typeof Clock; label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-border bg-card p-3 text-center">
      <Icon className="mx-auto h-5 w-5 text-primary" />
      <p className="mt-1 font-display text-3xl leading-none tracking-wide">{value}</p>
      <p className="mt-1 text-[11px] uppercase tracking-wider text-muted-foreground">{label}</p>
    </div>
  );
}
