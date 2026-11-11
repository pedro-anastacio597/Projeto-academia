import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Check } from "lucide-react";
import { z } from "zod";
import { AuthLayout, Field, inputClass } from "@/components/AuthLayout";
import { Button } from "@/components/ui/button";
import { actions } from "@/lib/store";
import { PLANS, brl, type PlanId } from "@/lib/gym-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/cadastro")({
  head: () => ({
    meta: [
      { title: "Criar conta — FORJA Academia" },
      { name: "description", content: "Cadastre-se com nome, e-mail, senha e escolha seu plano." },
      { property: "og:title", content: "Criar conta — FORJA Academia" },
      { property: "og:description", content: "Cadastre-se com nome, e-mail, senha e escolha seu plano." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Signup,
});

const schema = z.object({
  name: z.string().trim().min(3, "Informe seu nome completo").max(80),
  email: z.string().trim().email("Informe um e-mail válido").max(255),
  password: z.string().min(6, "A senha precisa ter ao menos 6 caracteres").max(64),
  plan: z.enum(["mensal", "trimestral", "anual"], { message: "Escolha um plano" }),
});

function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", plan: "" as PlanId | "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const r = schema.safeParse(form);
    if (!r.success) {
      setErrors(Object.fromEntries(r.error.issues.map((i) => [String(i.path[0]), i.message])));
      return;
    }
    const plan = PLANS.find((p) => p.id === r.data.plan)!;
    const err = actions.register({ ...r.data, months: plan.months });
    if (err) return setErrors({ email: err });
    navigate({ to: "/inicio" });
  };

  return (
    <AuthLayout title="Crie sua conta" subtitle="Leva menos de um minuto.">
      <form onSubmit={submit} className="space-y-4" noValidate>
        <Field label="Nome" error={errors.name}>
          <input className={inputClass} autoComplete="name" placeholder="Seu nome completo" value={form.name} onChange={set("name")} />
        </Field>
        <Field label="E-mail" error={errors.email}>
          <input className={inputClass} type="email" autoComplete="email" placeholder="voce@email.com" value={form.email} onChange={set("email")} />
        </Field>
        <Field label="Senha" error={errors.password}>
          <input className={inputClass} type="password" autoComplete="new-password" placeholder="Mínimo 6 caracteres" value={form.password} onChange={set("password")} />
        </Field>
        <div>
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">Plano</span>
          <div className="grid gap-2" role="radiogroup">
            {PLANS.map((p) => {
              const active = form.plan === p.id;
              return (
                <button
                  type="button"
                  role="radio"
                  aria-checked={active}
                  key={p.id}
                  onClick={() => setForm((f) => ({ ...f, plan: p.id }))}
                  className={cn(
                    "flex items-center gap-3 rounded-2xl border p-3 text-left transition",
                    active ? "border-primary bg-accent" : "border-border bg-background/60",
                  )}
                >
                  <span className={cn("grid h-5 w-5 shrink-0 place-items-center rounded-full border-2", active ? "border-primary bg-primary" : "border-muted-foreground/50")}>
                    {active && <Check className="h-3 w-3" />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold">{p.name}</span>
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
          {errors.plan && <span className="mt-1 block text-xs font-medium text-destructive">{errors.plan}</span>}
        </div>
        <Button type="submit" variant="hero" size="xl">Cadastrar</Button>
      </form>
      <p className="mt-5 text-center text-sm text-muted-foreground">
        Já tem conta?{" "}
        <Link to="/login" className="font-semibold text-primary">Entrar</Link>
      </p>
    </AuthLayout>
  );
}
