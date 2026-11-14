import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ContractTab, DataTab, EvaluationTab, TrainingTab } from "@/components/student-tabs";
import { useAppState } from "@/lib/store";
import { buildRows } from "@/lib/trainer";
import { cn } from "@/lib/utils";

/** Abas da ficha do aluno, na ordem de exibição. */
const TABS = [
  { id: "dados", label: "Dados" },
  { id: "treinos", label: "Treinos" },
  { id: "avaliacao", label: "Avaliação" },
  { id: "contrato", label: "Contrato" },
] as const;
type TabId = (typeof TABS)[number]["id"];

export const Route = createFileRoute("/professor/alunos/$alunoId")({
  validateSearch: (s: Record<string, unknown>): { aba?: TabId } => ({
    aba: TABS.some((t) => t.id === s.aba) ? (s.aba as TabId) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Ficha do aluno — FORJA Academia" },
      { name: "description", content: "Dados, treinos, avaliação física e contrato do aluno." },
    ],
  }),
  component: StudentDetail,
});

function StudentDetail() {
  const { alunoId } = Route.useParams();
  const { aba = "dados" } = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const s = useAppState();

  return (
    <AppShell title="Aluno" back>
      {() => {
        const row = buildRows(s).find((r) => r.user.email.toLowerCase() === alunoId.toLowerCase());
        if (!row) {
          return <p className="m-5 rounded-3xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">Aluno não encontrado.</p>;
        }
        return (
          <div className="px-5 pb-10 pt-4">
            <div role="tablist" aria-label="Seções da ficha do aluno" className="sticky top-0 z-10 -mx-5 mb-4 grid grid-cols-4 gap-1 bg-background/95 px-5 pb-3 pt-1 backdrop-blur">
              {TABS.map((t) => {
                const active = t.id === aba;
                return (
                  <button
                    key={t.id}
                    role="tab"
                    aria-selected={active}
                    onClick={() => navigate({ search: { aba: t.id }, replace: true })}
                    className={cn(
                      "h-10 rounded-full border text-[13px] font-semibold transition",
                      active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-surface text-muted-foreground",
                    )}
                  >
                    {t.label}
                  </button>
                );
              })}
            </div>

            {aba === "dados" && <DataTab row={row} />}
            {aba === "treinos" && <TrainingTab row={row} />}
            {aba === "avaliacao" && <EvaluationTab user={row.user} />}
            {aba === "contrato" && <ContractTab row={row} />}
          </div>
        );
      }}
    </AppShell>
  );
}
