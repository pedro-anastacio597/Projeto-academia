import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAppState, currentUser, homePath } from "@/lib/store";
import { Button } from "@/components/ui/button";
import bg from "@/assets/gym-login-bg.jpg";
import { Brand } from "@/components/AuthLayout";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FORJA Academia — Entre ou crie sua conta" },
      { name: "description", content: "Acesse seus treinos, avaliações físicas e plano na FORJA Academia." },
      { property: "og:title", content: "FORJA Academia — Entre ou crie sua conta" },
      { property: "og:description", content: "Acesse seus treinos, avaliações físicas e plano na FORJA Academia." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Welcome,
});

function Welcome() {
  const s = useAppState();
  const navigate = useNavigate();
  const user = s.ready ? currentUser(s) : null;
  useEffect(() => {
    if (user) navigate({ to: homePath(user) });
  }, [user, navigate]);
  return (
    <div className="relative h-full overflow-hidden">
      <img src={bg} alt="Interior de academia" width={768} height={1344} className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-hero" />
      <div className="relative flex h-full flex-col justify-between px-7 pb-10 pt-12">
        <Brand />
        <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">App do aluno</p>
          <h1 className="mt-2 font-display text-6xl leading-[0.9] tracking-wide">
            Forje sua
            <br />
            melhor versão
          </h1>
          <p className="mt-4 max-w-[18rem] text-muted-foreground">
            Seus treinos, avaliações e plano na palma da mão.
          </p>
          <div className="mt-8 grid gap-3">
            <Button asChild variant="hero" size="xl">
              <Link to="/login">Entrar</Link>
            </Button>
            <Button asChild variant="glass" size="xl">
              <Link to="/cadastro">Criar conta</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
