import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarClock, Dumbbell, UserX, Users } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { StatBox, StudentCard } from "@/components/trainer";
import { Button } from "@/components/ui/button";
import { WEEK_LABELS } from "@/lib/gym-data";
import { useAppState } from "@/lib/store";
import { buildRows, dueText } from "@/lib/trainer";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/professor/")({
  head: () => ({
    meta: [
      { title: "Painel do professor — FORJA Academia" },
      { name: "description", content: "Visão geral dos alunos: frequência, vencimentos e quem está sem treinar." },
    ],
  }),
  component: TrainerHome,
});

function TrainerHome() {
  const s = useAppState();
  return (
    <AppShell title="Painel">
      {(user) => {
        const rows = buildRows(s);
        const activeCount = rows.filter((r) => r.status === "ativo" || r.status === "vencendo").length;
        const weekTotal = rows.reduce((n, r) => n + r.week, 0);
        const expiring = rows.filter((r) => r.status === "vencendo" || r.status === "vencido").sort((a, b) => a.daysLeft - b.daysLeft);
        const inactive = rows.filter((r) => r.inactive).sort((a, b) => (b.daysSince ?? 999) - (a.daysSince ?? 999));

        // Treinos concluídos em cada dia da semana atual, somando todos os alunos.
        const perDay = [0, 0, 0, 0, 0, 0, 0];
        const now = new Date();
        const start = new Date(now);
        start.setHours(0, 0, 0, 0);
        start.setDate(start.getDate() - start.getDay());
        for (const r of rows) {
          for (const h of r.history) {
            const d = new Date(h.date);
            const diff = Math.floor((d.getTime() - start.getTime()) / 86400000);
            if (diff >= 0 && diff < 7) perDay[d.getDay()] = (perDay[d.getDay()] ?? 0) + 1;
          }
        }
        const max = Math.max(1, ...perDay);

        return (
          <div className="px-5 pb-10 pt-6">
            <p className="text-sm text-muted-foreground">Olá, {user.name.split(" ")[0]}</p>
            <h2 className="font-display text-3xl tracking-wide">Resumo da academia</h2>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <StatBox icon={Users} label="Alunos ativos" value={String(activeCount)} />
              <StatBox icon={Dumbbell} label="Treinos nesta semana" value={String(weekTotal)} />
              <StatBox icon={CalendarClock} label="Planos vencendo ou vencidos" value={String(expiring.length)} tone={expiring.length ? "alert" : undefined} />
              <StatBox icon={UserX} label="Sem treinar há 7+ dias" value={String(inactive.length)} tone={inactive.length ? "alert" : undefined} />
            </div>

            <div className="mt-4 rounded-3xl border border-border bg-card p-4">
              <p className="font-display text-xl tracking-wide">Treinos por dia da semana</p>
              <div className="mt-3 flex h-24 items-end justify-between gap-2">
                {perDay.map((n, i) => (
                  <div key={i} className="flex h-full flex-1 flex-col items-center justify-end gap-1">
                    <span className="text-[10px] text-muted-foreground">{n}</span>
                    <div
                      className={cn("w-full rounded-t-lg", i === now.getDay() ? "bg-primary" : "bg-primary/40")}
                      style={{ height: `${Math.max(6, (n / max) * 70)}%` }}
                    />
                    <span className="text-xs font-semibold">{WEEK_LABELS[i]}</span>
                  </div>
                ))}
              </div>
            </div>

            <h3 className="mb-3 mt-7 font-display text-2xl tracking-wide">Vencimentos</h3>
            {expiring.length === 0 ? (
              <Empty>Nenhum plano perto de vencer.</Empty>
            ) : (
              <div className="space-y-3">
                {expiring.slice(0, 5).map((r) => (
                  <StudentCard key={r.user.email} row={r} hint={dueText(r.daysLeft)} />
                ))}
              </div>
            )}

            <h3 className="mb-3 mt-7 font-display text-2xl tracking-wide">Sem treinar</h3>
            {inactive.length === 0 ? (
              <Empty>Todos os alunos ativos treinaram nos últimos dias.</Empty>
            ) : (
              <div className="space-y-3">
                {inactive.slice(0, 5).map((r) => (
                  <StudentCard key={r.user.email} row={r} />
                ))}
              </div>
            )}

            <Button asChild variant="hero" size="xl" className="mt-8">
              <Link to="/professor/alunos">Ver todos os alunos</Link>
            </Button>
          </div>
        );
      }}
    </AppShell>
  );
}

function Empty({ children }: { children: string }) {
  return <p className="rounded-3xl border border-dashed border-border p-5 text-center text-sm text-muted-foreground">{children}</p>;
}
