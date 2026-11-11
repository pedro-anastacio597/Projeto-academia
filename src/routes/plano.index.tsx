import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeftRight, Check, ChevronRight, Dumbbell, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { BottomSheet } from "@/components/overlays";
import { PlanStatus, daysUntil } from "@/components/PlanStatus";
import { Button } from "@/components/ui/button";
import { PLANS, brl, fmtDate, getPlan, planTotal, type PlanId } from "@/lib/gym-data";
import { actions, addMonths, toYmd } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/plano/")({
  head: () => ({
    meta: [
      { title: "Meu plano — FORJA Academia" },
      { name: "description", content: "Veja seu plano, vencimento, valor e modalidades incluídas." },
      { property: "og:title", content: "Meu plano — FORJA Academia" },
      { property: "og:description", content: "Veja seu plano, vencimento, valor e modalidades incluídas." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PlanPage,
});

function PlanPage() {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selected, setSelected] = useState<PlanId | null>(null);

  const closeSheet = () => {
    setSheetOpen(false);
    setSelected(null);
  };

  return (
    <AppShell title="Plano">
      {(user) => {
        const plan = getPlan(user.plan);
        const left = daysUntil(user.planEnd);
        const totalDays = Math.max(1, daysUntil(user.planEnd, new Date(user.planStart + "T12:00:00")));
        const pct = Math.min(100, Math.max(0, ((totalDays - left) / totalDays) * 100));
        return (
          <div className="px-5 pb-10 pt-6">
            <Link to="/plano/detalhes" className="block overflow-hidden rounded-3xl border border-border bg-card bg-card-glow p-5 shadow-card transition active:scale-[0.99] hover:border-primary/50">
              <div className="flex items-center justify-between">
                <PlanStatus status={user.planStatus} />
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </div>
<<<<<<< HEAD
              <p className="mt-3 font-display text-2xl leading-none tracking-wide">{plan.name}</p>
              <div className="mt-3 space-y-1.5 text-xs">
=======
              <p className="mt-3 font-display text-4xl leading-none tracking-wide">{plan.name}</p>
              <div className="mt-4 space-y-2 text-sm">
>>>>>>> 9e0916ba01f5f41dd129bef358dff57b51ae646d
                <Row label="Vencimento" value={fmtDate(user.planEnd)} />
                <Row label="Valor mensal" value={brl(plan.monthly)} />
              </div>
              {user.planStatus === "ativo" && (
                <div className="mt-4">
                  <div className="h-2 overflow-hidden rounded-full bg-surface">
                    <div className="h-full rounded-full bg-gradient-primary" style={{ width: `${pct}%` }} />
                  </div>
<<<<<<< HEAD
                  <p className="mt-1.5 text-[11px] text-muted-foreground">
=======
                  <p className="mt-1.5 text-xs text-muted-foreground">
>>>>>>> 9e0916ba01f5f41dd129bef358dff57b51ae646d
                    {left >= 0 ? `Faltam ${left} dias para o vencimento` : "Plano vencido"}
                  </p>
                </div>
              )}
              <div className="mt-5 border-t border-border pt-4">
<<<<<<< HEAD
                <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Modalidades</p>
                <div className="mt-2 flex items-center gap-3 rounded-2xl bg-surface p-3">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-primary"><Dumbbell className="h-5 w-5" /></span>
                  <div>
                    <p className="text-sm font-semibold">Musculação</p>
                    <p className="text-[11px] text-muted-foreground">Dias e horários livres</p>
=======
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Modalidades</p>
                <div className="mt-2 flex items-center gap-3 rounded-2xl bg-surface p-3">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-primary"><Dumbbell className="h-5 w-5" /></span>
                  <div>
                    <p className="font-semibold">Musculação</p>
                    <p className="text-xs text-muted-foreground">Dias e horários livres</p>
>>>>>>> 9e0916ba01f5f41dd129bef358dff57b51ae646d
                  </div>
                </div>
              </div>
            </Link>

            <Button variant="glass" size="xl" className="mt-4" onClick={() => setSheetOpen(true)}>
              <ArrowLeftRight /> Alterar plano
            </Button>

            <BottomSheet open={sheetOpen} onClose={closeSheet}>
              <div className="px-5 pb-6">
                <h3 className="font-display text-3xl tracking-wide">Alterar plano</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Escolha o novo plano. A contagem começa hoje e o novo vencimento é calculado pela duração escolhida.
                </p>
                <div className="mt-4 grid gap-2" role="radiogroup">
                  {PLANS.map((p) => {
                    const isCurrent = p.id === user.plan;
                    const active = selected === p.id;
                    return (
                      <button
                        type="button"
                        role="radio"
                        aria-checked={active}
                        disabled={isCurrent}
                        key={p.id}
                        onClick={() => setSelected(p.id)}
                        className={cn(
                          "flex items-center gap-3 rounded-2xl border p-3 text-left transition disabled:opacity-60",
                          active ? "border-primary bg-accent" : "border-border bg-background/60",
                        )}
                      >
                        <span className={cn("grid h-5 w-5 shrink-0 place-items-center rounded-full border-2", active ? "border-primary bg-primary" : "border-muted-foreground/50")}>
                          {active && <Check className="h-3 w-3" />}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block font-semibold">
                            {p.name}
                            {isCurrent && <span className="ml-2 rounded-full bg-primary/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">Atual</span>}
                          </span>
                          <span className="block text-xs text-muted-foreground">
                            {p.months} {p.months > 1 ? "meses" : "mês"}
                            {p.discount > 0 && ` · ${p.discount}% off`}
                          </span>
                        </span>
                        <span className="text-right">
                          <span className="block font-display text-xl tracking-wide">{brl(p.monthly)}</span>
                          <span className="block text-[10px] text-muted-foreground">/mês</span>
                        </span>
                      </button>
                    );
                  })}
                </div>

                {selected && (
                  <div className="mt-4 rounded-2xl bg-surface p-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total do novo plano</span>
                      <span className="font-semibold">{brl(planTotal(getPlan(selected)))}</span>
                    </div>
                    <div className="mt-1.5 flex justify-between">
                      <span className="text-muted-foreground">Novo vencimento</span>
                      <span className="font-semibold">{fmtDate(addMonths(toYmd(new Date()), getPlan(selected).months))}</span>
                    </div>
                  </div>
                )}

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <button onClick={closeSheet} className="h-12 rounded-2xl bg-surface font-semibold">
                    Voltar
                  </button>
                  <button
                    disabled={!selected}
                    onClick={() => {
                      if (!selected) return;
                      const next = getPlan(selected);
                      const today = toYmd(new Date());
                      actions.updateUser({
                        plan: next.id,
                        planStart: today,
                        planEnd: addMonths(today, next.months),
                        planStatus: "ativo",
                      });
                      toast.success("Plano alterado!", { description: `Agora você está no ${next.name}.` });
                      closeSheet();
                    }}
                    className="h-12 rounded-2xl bg-primary font-semibold text-primary-foreground disabled:opacity-50"
                  >
                    Confirmar
                  </button>
                </div>
              </div>
            </BottomSheet>

            {left >= 0 && left <= 10 && user.planStatus === "ativo" && (
              <div className="mt-4 flex items-center gap-3 rounded-2xl border border-primary/50 bg-accent/60 p-4 text-sm">
                <Sparkles className="h-5 w-5 shrink-0 text-primary" />
                Seu plano vence em breve. Renove agora e não perca nenhum treino.
              </div>
            )}
          </div>
        );
      }}
    </AppShell>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}
