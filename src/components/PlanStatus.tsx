import { cn } from "@/lib/utils";

export function PlanStatus({ status }: { status: "ativo" | "cancelado" }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider",
        status === "ativo" ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive",
      )}
    >
      {status === "ativo" ? "Ativo" : "Cancelado"}
    </span>
  );
}

/** Whole days from today until the given YYYY-MM-DD (negative if past). */
export function daysUntil(ymd: string, now = new Date()) {
  const end = new Date(ymd + "T00:00:00Z").getTime();
  const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((end - today) / 86400000);
}
