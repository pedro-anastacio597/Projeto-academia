import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight, Info } from "lucide-react";
import { Delta } from "@/components/Delta";
import { AppShell } from "@/components/AppShell";
import { EVALUATIONS, bmi, fmtDate } from "@/lib/gym-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/avaliacoes/")({
  head: () => ({
    meta: [
      { title: "Avaliação física — FORJA Academia" },
      { name: "description", content: "Histórico das suas avaliações físicas feitas pelos professores." },
      { property: "og:title", content: "Avaliação física — FORJA Academia" },
      { property: "og:description", content: "Histórico das suas avaliações físicas feitas pelos professores." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Evaluations,
});

function Evaluations() {
  return (
    <AppShell title="Avaliação física">
      {() => (
        <div className="space-y-4 px-5 pb-10 pt-6">
          <p className="flex items-start gap-2 rounded-2xl bg-accent/60 p-3 text-xs text-muted-foreground">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            As avaliações são registradas pelos professores da academia após cada consulta.
          </p>
          {EVALUATIONS.map((e, i) => {
            const prev = EVALUATIONS[i + 1];
            return (
              <Link
                key={e.id}
                to="/avaliacoes/$avaliacaoId"
                params={{ avaliacaoId: e.id }}
                className={cn("block rounded-3xl border border-border bg-card p-5 transition hover:border-primary/50 active:scale-[0.99]", i === 0 && "bg-card-glow")}
              >
                <div className="flex items-start justify-between">
                  <div>
                    {i === 0 && <span className="mb-2 inline-block rounded-full bg-primary px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider">Mais recente</span>}
                    <p className="font-display text-3xl leading-none tracking-wide">{fmtDate(e.date)}</p>
                    <p className="mt-1 text-sm text-muted-foreground">Prof. {e.professor}</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2">
                  <Metric label="Peso" value={`${e.weight.toFixed(1)}kg`} delta={prev && <Delta value={e.weight - prev.weight} unit="kg" />} />
                  <Metric label="Gordura" value={`${e.bodyFat.toFixed(1)}%`} delta={prev && <Delta value={e.bodyFat - prev.bodyFat} unit="%" />} />
                  <Metric label="IMC" value={bmi(e).toFixed(1)} delta={prev && <Delta value={bmi(e) - bmi(prev)} unit="" />} />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </AppShell>
  );
}

function Metric({ label, value, delta }: { label: string; value: string; delta?: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-surface p-3">
      <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="font-display text-2xl leading-tight tracking-wide">{value}</p>
      <div className="h-4">{delta}</div>
    </div>
  );
}
