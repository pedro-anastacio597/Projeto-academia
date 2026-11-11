import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, Dumbbell } from "lucide-react";
import bg from "@/assets/gym-login-bg.jpg";
import { cn } from "@/lib/utils";

export function Brand({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-primary shadow-glow">
        <Dumbbell className="h-5 w-5" />
      </span>
      <span className="font-display text-4xl tracking-[0.2em]">FORJA</span>
    </div>
  );
}

export function AuthLayout({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <div className="relative h-full overflow-hidden">
      <img src={bg} alt="" width={768} height={1344} className="absolute inset-0 h-full w-full scale-110 object-cover blur-[2px]" />
      <div className="absolute inset-0 bg-gradient-hero" />
      <div className="relative flex h-full flex-col overflow-y-auto px-6 pb-8 pt-6 no-scrollbar">
        <div className="flex items-center justify-between">
          <Link to="/" aria-label="Voltar" className="grid h-11 w-11 place-items-center rounded-full bg-overlay backdrop-blur">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <Brand className="scale-75 origin-right" />
        </div>
        <div className="mt-auto pt-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h1 className="font-display text-5xl tracking-wide">{title}</h1>
          <p className="mt-1 text-muted-foreground">{subtitle}</p>
          <div className="mt-6 rounded-3xl border border-border bg-card/85 p-5 backdrop-blur-xl">{children}</div>
        </div>
      </div>
    </div>
  );
}

export function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">{label}</span>
      {children}
      {error && <span className="mt-1 block text-xs font-medium text-destructive">{error}</span>}
    </label>
  );
}

export const inputClass =
  "h-12 w-full rounded-xl border border-input bg-background/70 px-4 text-[15px] text-foreground placeholder:text-muted-foreground/70 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30";
