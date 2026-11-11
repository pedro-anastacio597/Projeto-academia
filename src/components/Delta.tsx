import { TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

/** Change vs. previous value; `lowerIsBetter` colors decreases green. */
export function Delta({ value, unit, lowerIsBetter = true }: { value: number; unit: string; lowerIsBetter?: boolean }) {
  if (!value || Math.abs(value) < 0.05) return null;
  const good = lowerIsBetter ? value < 0 : value > 0;
  const Icon = value < 0 ? TrendingDown : TrendingUp;
  return (
    <span className={cn("inline-flex items-center gap-0.5 text-xs font-semibold", good ? "text-success" : "text-destructive")}>
      <Icon className="h-3.5 w-3.5" />
      {value > 0 ? "+" : ""}
      {value.toFixed(1)}
      {unit}
    </span>
  );
}
