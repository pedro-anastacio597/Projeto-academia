import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { CalendarDays, ChevronRight, KeyRound, Mail, Pencil, Phone, UserRound, Venus, Wallet, X } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { AppShell, Avatar } from "@/components/AppShell";
import { Field, inputClass } from "@/components/AuthLayout";
import { PlanStatus } from "@/components/PlanStatus";
import { Button } from "@/components/ui/button";
import { SEX_LABEL, actions, type Sex, type User } from "@/lib/store";
import { fmtDate, getPlan } from "@/lib/gym-data";
import { formatPhone, onlyDigits } from "@/lib/phone";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/perfil")({
  head: () => ({
    meta: [
      { title: "Meu perfil — FORJA Academia" },
      { name: "description", content: "Veja e altere seus dados pessoais e sua senha." },
      { property: "og:title", content: "Meu perfil — FORJA Academia" },
      { property: "og:description", content: "Veja e altere seus dados pessoais e sua senha." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Profile,
});

const profileSchema = z.object({
  name: z.string().trim().min(3, "Informe seu nome completo").max(80),
  email: z.string().trim().email("Informe um e-mail válido").max(255),
  phone: z.string().refine((v) => [10, 11].includes(onlyDigits(v).length), "Informe um telefone com DDD"),
  sex: z.enum(["feminino", "masculino", "outro"], { message: "Informe o sexo" }),
});

const passwordSchema = z
  .object({
    current: z.string().min(1, "Informe a senha atual"),
    next: z.string().min(6, "A nova senha precisa ter ao menos 6 caracteres").max(64),
    confirm: z.string(),
  })
  .refine((v) => v.next === v.confirm, { message: "As senhas não conferem", path: ["confirm"] });

function Profile() {
  return (
    <AppShell title="Meu perfil" back>
      {(user) => <ProfileContent user={user} />}
    </AppShell>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: typeof Mail; label: string; value: ReactNode }) {
  return (
    <div className="flex items-center gap-4 py-3.5">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent">
        <Icon className="h-5 w-5 text-primary" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{label}</p>
        <p className="truncate text-[15px] font-semibold">{value || "Não informado"}</p>
      </div>
    </div>
  );
}

function ProfileContent({ user }: { user: User }) {
  const trainer = user.role === "professor";
  const plan = getPlan(user.plan);

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", sex: "" as Sex | "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [pwOpen, setPwOpen] = useState(false);
  const [pw, setPw] = useState({ current: "", next: "", confirm: "" });
  const [pwErrors, setPwErrors] = useState<Record<string, string>>({});

  const startEdit = () => {
    setForm({ name: user.name, email: user.email, phone: user.phone ?? "", sex: user.sex ?? "" });
    setErrors({});
    setEditing(true);
  };

  const setField = (k: "name" | "email") => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    const r = profileSchema.safeParse(form);
    if (!r.success) {
      setErrors(Object.fromEntries(r.error.issues.map((i) => [String(i.path[0]), i.message])));
      return;
    }
    const err = actions.updateProfile(r.data);
    if (err) return setErrors({ email: err });
    setEditing(false);
    toast.success("Perfil atualizado", { description: "Seus dados foram salvos." });
  };

  const savePassword = (e: React.FormEvent) => {
    e.preventDefault();
    const r = passwordSchema.safeParse(pw);
    if (!r.success) {
      setPwErrors(Object.fromEntries(r.error.issues.map((i) => [String(i.path[0]), i.message])));
      return;
    }
    const err = actions.changePassword(r.data.current, r.data.next);
    if (err) return setPwErrors({ current: err });
    setPw({ current: "", next: "", confirm: "" });
    setPwErrors({});
    setPwOpen(false);
    toast.success("Senha alterada", { description: "Use a nova senha no próximo acesso." });
  };

  return (
    <div className="space-y-5 px-5 pb-10 pt-6">
      {/* Cabeçalho */}
      <section className="relative overflow-hidden rounded-3xl border border-border bg-card bg-card-glow p-6 text-center">
        <Avatar name={user.name} className="mx-auto h-24 w-24 text-4xl" />
        <p className="mt-4 truncate font-display text-4xl leading-none tracking-wide">{user.name}</p>
        <p className="mt-1 truncate text-sm text-muted-foreground">{user.email}</p>
        <div className="mt-3 flex justify-center">
          {trainer ? (
            <span className="inline-flex rounded-full bg-accent px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">Professor</span>
          ) : (
            <PlanStatus status={user.planStatus} />
          )}
        </div>
      </section>

      {/* Dados pessoais */}
      <section className="rounded-3xl border border-border bg-card p-5">
        <div className="mb-1 flex items-center justify-between">
          <h2 className="font-display text-2xl tracking-wide">Dados pessoais</h2>
          {!editing && (
            <button
              onClick={startEdit}
              className="flex items-center gap-1.5 rounded-full bg-primary px-3.5 py-1.5 text-sm font-bold text-primary-foreground transition hover:brightness-110 active:scale-95"
            >
              <Pencil className="h-4 w-4" /> Editar
            </button>
          )}
        </div>

        {editing ? (
          <form onSubmit={save} className="mt-4 space-y-4" noValidate>
            <Field label="Nome" error={errors.name}>
              <input className={inputClass} autoComplete="name" value={form.name} onChange={setField("name")} />
            </Field>
            <Field label="E-mail" error={errors.email}>
              <input className={inputClass} type="email" autoComplete="email" value={form.email} onChange={setField("email")} />
            </Field>
            <Field label="Telefone" error={errors.phone}>
              <input
                className={inputClass}
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="(84) 99999-9999"
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: formatPhone(e.target.value) }))}
              />
            </Field>
            <div>
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">Sexo</span>
              <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Sexo">
                {(Object.keys(SEX_LABEL) as Sex[]).map((k) => {
                  const active = form.sex === k;
                  return (
                    <button
                      type="button"
                      role="radio"
                      aria-checked={active}
                      key={k}
                      onClick={() => setForm((f) => ({ ...f, sex: k }))}
                      className={cn(
                        "h-11 rounded-2xl border text-sm font-semibold transition",
                        active ? "border-primary bg-accent" : "border-border bg-background/60 text-muted-foreground",
                      )}
                    >
                      {SEX_LABEL[k]}
                    </button>
                  );
                })}
              </div>
              {errors.sex && <span className="mt-1 block text-xs font-medium text-destructive">{errors.sex}</span>}
            </div>
            <div className="grid grid-cols-2 gap-3 pt-1">
              <Button type="button" variant="surface" className="h-12 w-full font-semibold" onClick={() => setEditing(false)}>
                <X /> Cancelar
              </Button>
              <Button type="submit" variant="hero" className="h-12 w-full text-lg">
                Salvar
              </Button>
            </div>
          </form>
        ) : (
          <div className="divide-y divide-border">
            <InfoRow icon={UserRound} label="Nome" value={user.name} />
            <InfoRow icon={Mail} label="E-mail" value={user.email} />
            <InfoRow icon={Phone} label="Telefone" value={user.phone} />
            <InfoRow icon={Venus} label="Sexo" value={user.sex ? SEX_LABEL[user.sex] : undefined} />
          </div>
        )}
      </section>

      {/* Plano (somente aluno) */}
      {!trainer && (
        <section className="rounded-3xl border border-border bg-card p-5">
          <h2 className="mb-1 font-display text-2xl tracking-wide">Meu plano</h2>
          <div className="divide-y divide-border">
            <InfoRow icon={Wallet} label="Plano" value={plan.name} />
            <InfoRow icon={CalendarDays} label="Início" value={fmtDate(user.planStart)} />
            <InfoRow icon={CalendarDays} label="Válido até" value={fmtDate(user.planEnd)} />
          </div>
          <Link
            to="/plano"
            className="mt-2 flex items-center justify-between rounded-2xl bg-surface px-4 py-3 text-sm font-semibold transition hover:bg-surface/80"
          >
            Gerenciar plano
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </Link>
        </section>
      )}

      {/* Senha */}
      <section className="rounded-3xl border border-border bg-card p-5">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl tracking-wide">Segurança</h2>
          {!pwOpen && (
            <button
              onClick={() => setPwOpen(true)}
              className="flex items-center gap-1.5 rounded-full bg-surface px-3.5 py-1.5 text-sm font-semibold transition hover:bg-surface/80"
            >
              <KeyRound className="h-4 w-4 text-primary" /> Alterar senha
            </button>
          )}
        </div>
        {pwOpen ? (
          <form onSubmit={savePassword} className="mt-4 space-y-4" noValidate>
            <Field label="Senha atual" error={pwErrors.current}>
              <input
                className={inputClass}
                type="password"
                autoComplete="current-password"
                value={pw.current}
                onChange={(e) => setPw((p) => ({ ...p, current: e.target.value }))}
              />
            </Field>
            <Field label="Nova senha" error={pwErrors.next}>
              <input
                className={inputClass}
                type="password"
                autoComplete="new-password"
                placeholder="Mínimo 6 caracteres"
                value={pw.next}
                onChange={(e) => setPw((p) => ({ ...p, next: e.target.value }))}
              />
            </Field>
            <Field label="Confirmar nova senha" error={pwErrors.confirm}>
              <input
                className={inputClass}
                type="password"
                autoComplete="new-password"
                value={pw.confirm}
                onChange={(e) => setPw((p) => ({ ...p, confirm: e.target.value }))}
              />
            </Field>
            <div className="grid grid-cols-2 gap-3 pt-1">
              <Button
                type="button"
                variant="surface"
                className="h-12 w-full font-semibold"
                onClick={() => {
                  setPwOpen(false);
                  setPw({ current: "", next: "", confirm: "" });
                  setPwErrors({});
                }}
              >
                <X /> Cancelar
              </Button>
              <Button type="submit" variant="hero" className="h-12 w-full text-lg">
                Salvar
              </Button>
            </div>
          </form>
        ) : (
          <p className="mt-2 text-sm text-muted-foreground">Sua senha está protegida. Altere-a sempre que precisar.</p>
        )}
      </section>
    </div>
  );
}
