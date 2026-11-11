import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { inputClass } from "@/components/AuthLayout";
import { StudentCard } from "@/components/trainer";
import { useAppState } from "@/lib/store";
import { buildRows, type StudentRow } from "@/lib/trainer";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/professor/alunos/")({
  head: () => ({
    meta: [
      { title: "Alunos — FORJA Academia" },
      { name: "description", content: "Lista de alunos com busca e filtros por situação do plano." },
    ],
  }),
  component: StudentsPage,
});

type FilterId = "todos" | "ativo" | "vencendo" | "vencido" | "cancelado" | "semtreino";

const FILTERS: { id: FilterId; label: string; match: (r: StudentRow) => boolean }[] = [
  { id: "todos", label: "Todos", match: () => true },
  { id: "ativo", label: "Ativos", match: (r) => r.status === "ativo" },
  { id: "vencendo", label: "Vencendo", match: (r) => r.status === "vencendo" },
  { id: "vencido", label: "Vencidos", match: (r) => r.status === "vencido" },
  { id: "cancelado", label: "Cancelados", match: (r) => r.status === "cancelado" },
  { id: "semtreino", label: "Sem treinar", match: (r) => r.inactive },
];

function StudentsPage() {
  const s = useAppState();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterId>("todos");

  return (
    <AppShell title="Alunos">
      {() => {
        const rows = buildRows(s).sort((a, b) => a.user.name.localeCompare(b.user.name, "pt-BR"));
        const q = query.trim().toLowerCase();
        const current = FILTERS.find((f) => f.id === filter)!;
        const shown = rows.filter((r) => current.match(r) && (!q || r.user.name.toLowerCase().includes(q) || r.user.email.toLowerCase().includes(q)));

        return (
          <div className="px-5 pb-10 pt-6">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <input
                className={inputClass + " pl-12"}
                type="search"
                placeholder="Buscar por nome ou e-mail"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>

            <div className="no-scrollbar -mx-5 mt-4 flex gap-2 overflow-x-auto px-5">
              {FILTERS.map((f) => {
                const active = f.id === filter;
                return (
                  <button
                    key={f.id}
                    onClick={() => setFilter(f.id)}
                    className={cn(
                      "shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition",
                      active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-surface text-muted-foreground",
                    )}
                  >
                    {f.label} <span className="opacity-70">{rows.filter(f.match).length}</span>
                  </button>
                );
              })}
            </div>

            <p className="mb-3 mt-5 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              {shown.length} {shown.length === 1 ? "aluno" : "alunos"}
            </p>
            {shown.length === 0 ? (
              <p className="rounded-3xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">Nenhum aluno encontrado.</p>
            ) : (
              <div className="space-y-3">
                {shown.map((r) => (
                  <StudentCard key={r.user.email} row={r} />
                ))}
              </div>
            )}
          </div>
        );
      }}
    </AppShell>
  );
}
