import { Link } from "@tanstack/react-router";
import { ChevronRight, type LucideIcon } from "lucide-react";
import { Avatar } from "@/components/AppShell";
import { getPlan } from "@/lib/gym-data";
import { STATUS_LABEL, lastWorkoutText, type StudentRow, type StudentStatus } from "@/lib/trainer";
import { cn } from "@/lib/utils";

const STATUS_STYLE: Record<StudentStatus, string> = {
  ativo: "bg-success/15 text-success",
  vencendo: "bg-amber-500/15 text-amber-400",
  vencido: "bg-destructive/15 text-destructive",
  cancelado: "bg-muted text-muted-foreground",
};

export function StatusBadge({ status }: { status: StudentStatus }) {
  return (
    <span className={cn("inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider", STATUS_STYLE[status])}>
      {STATUS_LABEL[status]}
    </span>
  );
}

export function StatBox({ icon: Icon, label, value, tone }: { icon: LucideIcon; label: string; value: string; tone?: "alert" }) {
  return (
    <div className="rounded-3xl border border-border bg-card p-4">
      <Icon className={cn("h-5 w-5", tone === "alert" ? "text-amber-400" : "text-primary")} />
      <p className="mt-2 font-display text-4xl leading-none tracking-wide">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

/** Cartão de aluno que leva para a ficha dele. `hint` troca a linha de "último treino". */
export function StudentCard({ row, hint }: { row: StudentRow; hint?: string }) {
  return (
    <Link
      to="/professor/alunos/$alunoId"
      params={{ alunoId: row.user.email }}
      className="flex items-center gap-3 rounded-3xl border border-border bg-card p-3 pr-4 transition active:scale-[0.99] hover:border-primary/50"
    >
      <Avatar name={row.user.name} className="h-12 w-12 text-lg" />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate font-semibold">{row.user.name}</p>
          <StatusBadge status={row.status} />
        </div>
        <p className="truncate text-xs text-muted-foreground">{getPlan(row.user.plan).name}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{hint ?? lastWorkoutText(row.daysSince)}</p>
      </div>
      <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
    </Link>
  );
}
