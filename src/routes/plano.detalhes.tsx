import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Dumbbell, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { ConfirmModal } from "@/components/overlays";
import { PlanStatus } from "@/components/PlanStatus";
import { Button } from "@/components/ui/button";
import { brl, fmtDate, getPlan, planTotal } from "@/lib/gym-data";
import { actions, addMonths, toYmd } from "@/lib/store";

export const Route = createFileRoute("/plano/detalhes")({
  head: () => ({
    meta: [
      { title: "Detalhes do plano — FORJA Academia" },
      { name: "description", content: "Datas, valores, benefícios e opções de renovar ou cancelar seu plano." },
      { property: "og:title", content: "Detalhes do plano — FORJA Academia" },
      { property: "og:description", content: "Datas, valores, benefícios e opções de renovar ou cancelar seu plano." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PlanDetails,
});

function PlanDetails() {
  const [confirm, setConfirm] = useState<"renew" | "cancel" | null>(null);

  return (
    <AppShell title="Detalhes do plano" back>
      {(user) => {
        const plan = getPlan(user.plan);
        const full = plan.monthly * plan.months;
        const original = (plan.monthly / (1 - plan.discount / 100)) * plan.months;
        const discount = original - full;
        const active = user.planStatus === "ativo";
        const renewFrom = active && user.planEnd > toYmd(new Date()) ? user.planEnd : toYmd(new Date());
        const newEnd = addMonths(renewFrom, plan.months);

        return (
          <div className="flex min-h-full flex-col px-5 pb-6 pt-5">
            <div className="rounded-3xl border border-border bg-card p-5">
              <PlanStatus status={user.planStatus} />
              <p className="mt-3 font-display text-4xl leading-none tracking-wide">{plan.name}</p>
              <div className="mt-4 space-y-2.5 text-sm">
                <Row label="Data de início" value={fmtDate(user.planStart)} />
                <Row label="Vencimento" value={fmtDate(user.planEnd)} />
                <Row label="Duração do plano" value={`${plan.months} ${plan.months > 1 ? "meses" : "mês"}`} />
                <Row label="Valor mensal" value={brl(plan.monthly)} />
                <Row label="Desconto" value={plan.discount ? `- ${brl(discount)} (${plan.discount}%)` : "—"} />
              </div>
              <div className="mt-4 flex items-end justify-between border-t border-border pt-4">
                <span className="text-sm text-muted-foreground">Valor total</span>
                <span className="font-display text-3xl tracking-wide text-primary">{brl(planTotal(plan))}</span>
              </div>
            </div>

            <div className="mt-4 rounded-3xl border border-border bg-card p-5">
              <p className="font-display text-2xl tracking-wide">Modalidades</p>
              <div className="mt-3 flex items-center gap-3 rounded-2xl bg-surface p-3">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-primary"><Dumbbell className="h-5 w-5" /></span>
                <div>
                  <p className="font-semibold">Musculação</p>
                  <p className="text-xs text-muted-foreground">Dias e horários livres</p>
                </div>
              </div>
              <p className="mt-4 font-display text-2xl tracking-wide">Benefícios</p>
              <ul className="mt-2 space-y-2">
                {plan.perks.map((p) => (
                  <li key={p} className="flex items-center gap-2 text-sm">
                    <span className="grid h-5 w-5 place-items-center rounded-full bg-primary/20 text-primary"><Check className="h-3 w-3" strokeWidth={3} /></span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-auto grid gap-2 pt-6">
              <Button variant="hero" size="xl" onClick={() => setConfirm("renew")}>
                <RefreshCw /> Renovar plano
              </Button>
              {active && (
                <Button variant="dangerGhost" size="xl" onClick={() => setConfirm("cancel")}>
                  Cancelar plano
                </Button>
              )}
            </div>

            <ConfirmModal
              open={confirm === "renew"}
              onClose={() => setConfirm(null)}
              title="Renovar plano?"
              description={`${plan.name} por mais ${plan.months} ${plan.months > 1 ? "meses" : "mês"} (${brl(planTotal(plan))}). Novo vencimento: ${fmtDate(newEnd)}.`}
              confirmLabel="Renovar"
              onConfirm={() => {
                actions.updateUser({ planEnd: newEnd, planStatus: "ativo", planStart: active ? user.planStart : toYmd(new Date()) });
                toast.success("Plano renovado!", { description: `Válido até ${fmtDate(newEnd)}` });
              }}
            />
            <ConfirmModal
              open={confirm === "cancel"}
              onClose={() => setConfirm(null)}
              title="Cancelar plano?"
              description={`Você continuará com acesso até ${fmtDate(user.planEnd)}. Depois disso, seus treinos ficam bloqueados.`}
              confirmLabel="Cancelar plano"
              danger
              onConfirm={() => {
                actions.updateUser({ planStatus: "cancelado" });
                toast("Plano cancelado", { description: "Sentiremos sua falta. Você pode renovar quando quiser." });
              }}
            />
          </div>
        );
      }}
    </AppShell>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-semibold">{value}</span>
    </div>
  );
}
