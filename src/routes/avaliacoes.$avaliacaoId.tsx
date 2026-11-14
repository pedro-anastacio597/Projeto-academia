import { createFileRoute } from "@tanstack/react-router";
import { Activity, Gauge, HeartPulse, Ruler, Scale, Target, TriangleAlert, User } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Delta } from "@/components/Delta";
import { MEASURE_LABELS, bmi, fmtDate } from "@/lib/gym-data";
import { evaluationsOf, useAppState } from "@/lib/store";

export const Route = createFileRoute("/avaliacoes/$avaliacaoId")({
  head: () => ({
    meta: [
      { title: "Avaliação física — FORJA" },
      { name: "description", content: "Detalhes da avaliação física: composição corporal, medidas e observações." },
    ],
  }),
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
  const s = useAppState();

  return (
    <AppShell title="Avaliação" back>
      {(user) => {
        const list = evaluationsOf(s, user.email);
        const idx = list.findIndex((x) => x.id === avaliacaoId);
        const e = list[idx];
        if (!e) {
          return <p className="m-5 rounded-3xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">Avaliação não encontrada.</p>;
        }
        const prev = list[idx + 1];
        const b = bmi(e);
        return (
        <div className="space-y-5 px-5 pb-10 pt-5">
          <div className="rounded-3xl border border-border bg-card-glow bg-card p-5">
            <p className="font-display text-4xl tracking-wide">{fmtDate(e.date)}</p>
            <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground"><User className="h-4 w-4" /> Prof. {e.professor}</p>
            {e.goal && <p className="mt-3 flex items-start gap-2 text-sm"><Target className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> {e.goal}</p>}
          </div>

          <section>
            <h2 className="mb-3 font-display text-2xl tracking-wide">Composição corporal</h2>
            <div className="grid grid-cols-2 gap-3">
              <Big icon={Scale} label="Peso" value={`${e.weight.toFixed(1)} kg`} delta={prev && <Delta value={e.weight - prev.weight} unit="kg" />} />
              <Big icon={Activity} label="Gordura corporal" value={`${e.bodyFat.toFixed(1)}%`} delta={prev && <Delta value={e.bodyFat - prev.bodyFat} unit="%" />} />
              <Big icon={Gauge} label="IMC" value={b.toFixed(1)} note={bmiLabel(b)} delta={prev && <Delta value={b - bmi(prev)} unit="" />} />
              <Big icon={HeartPulse} label="FC repouso" value={`${e.restingHr} bpm`} delta={prev && <Delta value={e.restingHr - prev.restingHr} unit="" />} />
            </div>
            <div className="mt-3 rounded-3xl border border-border bg-card p-4">
              <p className="flex items-center gap-2 text-xs text-muted-foreground"><TriangleAlert className="h-5 w-5 text-primary" /> Problemas físicos</p>
              {e.issues.length ? (
                <ul className="mt-2 space-y-1.5 text-sm">
                  {e.issues.map((i) => (
                    <li key={i} className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />{i}</li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-sm text-muted-foreground">Nenhum problema físico informado.</p>
              )}
            </div>
          </section>

          <section>
            <h2 className="mb-3 flex items-center gap-2 font-display text-2xl tracking-wide"><Ruler className="h-5 w-5 text-primary" /> Medidas (cm)</h2>
            <div className="divide-y divide-border overflow-hidden rounded-3xl border border-border bg-card">
              {MEASURE_LABELS.map((label) => {
                const m = e.measures.find((x) => x.label === label);
                const pm = prev?.measures.find((x) => x.label === label);
                const lowerIsBetter = ["Cintura", "Abdômen"].includes(label);
                return (
                  <div key={label} className="flex items-center justify-between px-4 py-3">
                    <span className="text-sm">{label}</span>
                    <span className="flex items-center gap-3">
                      {m && pm && <Delta value={m.value - pm.value} unit="" lowerIsBetter={lowerIsBetter} />}
                      <span className="font-semibold">{m ? m.value.toFixed(1) : "- -"}</span>
                    </span>
                  </div>
                );
              })}
            </div>
          </section>

          {e.notes && (
            <section className="rounded-3xl border border-primary/40 bg-accent/50 p-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-primary">Observações do professor</p>
              <p className="mt-2 text-sm leading-relaxed">{e.notes}</p>
            </section>
          )}
        </div>
        );
      }}
    </AppShell>
  );
}

function Big({ icon: Icon, label, value, note, delta }: { icon: typeof Scale; label: string; value: string; note?: string; delta?: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-border bg-card p-4">
      <Icon className="h-5 w-5 text-primary" />
      <p className="mt-2 text-xs text-muted-foreground">{label}</p>
      <p className="font-display text-2xl leading-tight tracking-wide">{value}</p>
      {note && <p className="text-xs text-muted-foreground">{note}</p>}
      <div className="h-4">{delta}</div>
    </div>
  );
}
