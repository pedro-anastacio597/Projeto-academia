import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { z } from "zod";
import { AuthLayout, Field, inputClass } from "@/components/AuthLayout";
import { Button } from "@/components/ui/button";
<<<<<<< HEAD
import { actions, currentUser, getSnapshot, homePath } from "@/lib/store";
=======
import { actions } from "@/lib/store";
>>>>>>> 9e0916ba01f5f41dd129bef358dff57b51ae646d

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Entrar — FORJA Academia" },
      { name: "description", content: "Entre com seu e-mail e senha para acessar seus treinos." },
      { property: "og:title", content: "Entrar — FORJA Academia" },
      { property: "og:description", content: "Entre com seu e-mail e senha para acessar seus treinos." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Login,
});

const schema = z.object({
  email: z.string().trim().email("Informe um e-mail válido"),
  password: z.string().min(1, "Informe sua senha"),
});

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const r = schema.safeParse({ email, password });
    if (!r.success) {
      setErrors(Object.fromEntries(r.error.issues.map((i) => [String(i.path[0]), i.message])));
      return;
    }
    const err = actions.login(email, password);
    if (err) return setErrors({ form: err });
<<<<<<< HEAD
    navigate({ to: homePath(currentUser(getSnapshot())) });
=======
    navigate({ to: "/inicio" });
>>>>>>> 9e0916ba01f5f41dd129bef358dff57b51ae646d
  };

  return (
    <AuthLayout title="Bem-vindo de volta" subtitle="Entre para continuar seus treinos.">
      <form onSubmit={submit} className="space-y-4" noValidate>
        <Field label="E-mail" error={errors.email}>
          <input className={inputClass} type="email" autoComplete="email" placeholder="voce@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
        </Field>
        <Field label="Senha" error={errors.password}>
          <div className="relative">
            <input className={inputClass + " pr-12"} type={show ? "text" : "password"} autoComplete="current-password" placeholder="••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button type="button" onClick={() => setShow((v) => !v)} aria-label={show ? "Ocultar senha" : "Mostrar senha"} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </Field>
        {errors.form && <p className="rounded-xl bg-destructive/15 px-3 py-2 text-sm font-medium text-destructive">{errors.form}</p>}
        <Button type="submit" variant="hero" size="xl">Entrar</Button>
        <button
          type="button"
          onClick={() => {
            setEmail("maria@forja.com");
            setPassword("123456");
          }}
          className="w-full rounded-xl border border-dashed border-border py-2.5 text-xs text-muted-foreground"
        >
<<<<<<< HEAD
          Usar conta de aluno (maria@forja.com · 123456)
        </button>
        <button
          type="button"
          onClick={() => {
            setEmail("prof@forja.com");
            setPassword("123456");
          }}
          className="w-full rounded-xl border border-dashed border-primary/50 py-2.5 text-xs text-muted-foreground"
        >
          Usar conta de professor (prof@forja.com · 123456)
=======
          Usar conta de demonstração (maria@forja.com · 123456)
>>>>>>> 9e0916ba01f5f41dd129bef358dff57b51ae646d
        </button>
      </form>
      <p className="mt-5 text-center text-sm text-muted-foreground">
        Ainda não tem conta?{" "}
        <Link to="/cadastro" className="font-semibold text-primary">Cadastre-se</Link>
      </p>
    </AuthLayout>
  );
}
