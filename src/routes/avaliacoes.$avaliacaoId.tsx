import { createFileRoute, notFound } from "@tanstack/react-router";
import { Activity, HeartPulse, Ruler, Scale, Stethoscope, Target, User } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Delta } from "@/components/Delta";
import { EVALUATIONS, bmi, fmtDate } from "@/lib/gym-data";

export const Route = createFileRoute("/avaliacoes/$avaliacaoId")({
  loader: ({ params }) => {
    const e = EVALUATIONS.find((x) => x.id === params.avaliacaoId);
    if (!e) throw notFound();
    return { date: e.date };
  },
  head: ({ loaderData }) => {
    const title = loaderData ? `Avaliação de ${fmtDate(loaderData.date)} — FORJA` : "Avaliação física — FORJA";
    return {
      meta: [
        { title },
        { name: "description", content: "Detalhes da avaliação física: composição corporal, medidas e observações." },
        { property: "og:title", content: title },
        { property: "og:description", content: "Detalhes da avaliação física: composição corporal, medidas e observações." },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary" },
      ],
    };
  },
  component: EvaluationDetail,
});

function bmiLabel(v: number) {
  if (v < 18.5) return "Abaixo do peso";
  if (v < 25) return "Peso normal";
  if (v < 30) return "Sobrepeso";
  return "Obesidade";
}

function EvaluationDetail() {
  const { avaliacaoId } = Route.useParams();
  const idx = EVALUATIONS.findIndex((x) => x.id === avaliacaoId);
  const e = EVALUATIONS[idx];
  const prev = EVALUATIONS[idx + 1];
  const b = bmi(e);
  const fatMass = (e.weight * e.bodyFat) / 100;

  return (
    <AppShell title="Avaliação" back>
      {() => (
        <div className="space-y-5 px-5 pb-10 pt-5">
          <div className="rounded-3xl border border-border bg-card-glow bg-card p-5">
            <p className="font-display text-4xl tracking-wide">{fmtDate(e.date)}</p>
            <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground"><User className="h-4 w-4" /> Prof. {e.professor}</p>
            <p className="mt-3 flex items-start gap-2 text-sm"><Target className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> {e.goal}</p>
          </div>

          <section>
            <h2 className="mb-3 font-display text-2xl tracking-wide">Composição corporal</h2>
            <div className="grid grid-cols-2 gap-3">
              <Big icon={Scale} label="Peso" value={`${e.weight.toFixed(1)} kg`} delta={prev && <Delta value={e.weight - prev.weight} unit="kg" />} />
              <Big icon={Activity} label="Gordura corporal" value={`${e.bodyFat.toFixed(1)}%`} delta={prev && <Delta value={e.bodyFat - prev.bodyFat} unit="%" />} />
              <Big icon={Activity} label="Massa magra" value={`${e.leanMass.toFixed(1)} kg`} delta={prev && <Delta value={e.leanMass - prev.leanMass} unit="kg" lowerIsBetter={false} />} />
              <Big icon={Activity} label="Massa gorda" value={`${fatMass.toFixed(1)} kg`} delta={prev && <Delta value={fatMass - (prev.weight * prev.bodyFat) / 100} unit="kg" />} />
            </div>
            <div className="mt-3 rounded-3xl border border-border bg-card p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">IMC</span>
                <span className="font-display text-2xl tracking-wide">{b.toFixed(1)} <span className="text-sm text-muted-foreground font-sans">· {bmiLabel(b)}</span></span>
              </div>
              <div className="relative mt-3 h-2 rounded-full bg-gradient-to-r from-success via-chart-3 to-destructive">
                <span className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-background bg-foreground" style={{ left: `${Math.min(100, Math.max(0, ((b - 15) / 20) * 100))}%` }} />
              </div>
            </div>
          </section>

          <section className="grid grid-cols-2 gap-3">
            <Big icon={HeartPulse} label="FC repouso" value={`${e.restingHr} bpm`} delta={prev && <Delta value={e.restingHr - prev.restingHr} unit="" />} />
            <Big icon={Stethoscope} label="Gordura visceral" value={`Nível ${e.visceralFat}`} delta={prev && <Delta value={e.visceralFat - prev.visceralFat} unit="" />} />
          </section>

          <section>
            <h2 className="mb-3 flex items-center gap-2 font-display text-2xl tracking-wide"><Ruler className="h-5 w-5 text-primary" /> Medidas (cm)</h2>
            <div className="divide-y divide-border overflow-hidden rounded-3xl border border-border bg-card">
              {e.measures.map((m) => {
                const pm = prev?.measures.find((x) => x.label === m.label);
                const lowerIsBetter = ["Cintura", "Abdômen"].includes(m.label);
                return (
                  <div key={m.label} className="flex items-center justify-between px-4 py-3">
                    <span className="text-sm">{m.label}</span>
                    <span className="flex items-center gap-3">
                      {pm && <Delta value={m.value - pm.value} unit="" lowerIsBetter={lowerIsBetter} />}
                      <span className="font-semibold">{m.value.toFixed(1)}</span>
                    </span>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="rounded-3xl border border-primary/40 bg-accent/50 p-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">Observações do professor</p>
            <p className="mt-2 text-sm leading-relaxed">{e.notes}</p>
          </section>
        </div>
      )}
    </AppShell>
  );
}

function Big({ icon: Icon, label, value, delta }: { icon: typeof Scale; label: string; value: string; delta?: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-border bg-card p-4">
      <Icon className="h-5 w-5 text-primary" />
      <p className="mt-2 text-xs text-muted-foreground">{label}</p>
      <p className="font-display text-2xl leading-tight tracking-wide">{value}</p>
      <div className="h-4">{delta}</div>
    </div>
  );
}
