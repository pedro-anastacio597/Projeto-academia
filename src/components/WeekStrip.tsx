import { Check } from "lucide-react";
import { WEEK_LABELS, WEEK_NAMES } from "@/lib/gym-data";
import { cn } from "@/lib/utils";

/** Days of the week as circles: today in solid red, finished workouts with a check. */
export function WeekStrip({ today, trained }: { today: number; trained: Set<number> }) {
  return (
    <div className="flex justify-between">
      {WEEK_LABELS.map((l, i) => {
        const isToday = i === today;
        const done = trained.has(i);
        return (
          <div key={i} className="flex flex-col items-center gap-1.5" title={WEEK_NAMES[i]}>
            <span
              className={cn(
                "relative grid h-10 w-10 place-items-center rounded-full border text-sm font-bold transition",
                isToday
                  ? "animate-pulse-ring border-primary bg-primary text-primary-foreground"
                  : done
                    ? "border-primary/60 bg-accent text-foreground"
                    : "border-border bg-surface text-muted-foreground",
              )}
            >
              {l}
              {done && (
                <span className="absolute -right-0.5 -top-0.5 grid h-4 w-4 place-items-center rounded-full bg-success text-success-foreground">
                  <Check className="h-2.5 w-2.5" strokeWidth={4} />
                </span>
              )}
            </span>
          </div>
        );
      })}
    </div>
  );
}
